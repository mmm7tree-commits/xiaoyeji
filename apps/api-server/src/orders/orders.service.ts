import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { AddressesService } from "../addresses/addresses.service";
import { successResponse } from "../common/interfaces/api-response.interface";
import { WorksService } from "../works/works.service";
import {
  AddressSnapshotSource,
  CreateOrderPayload,
  FrozenOrderAddressSnapshot,
  FrozenOrderWorkSnapshot,
  OrderActionKey,
  OrderDetail,
  OrderListItem,
  OrderRecord,
  OrderStatusCode,
  WorkSnapshotSource
} from "./orders.types";
import { OrdersDataService } from "./orders-data.service";
import { buildOrderProductionReadiness } from "./order-production-readiness";
import { buildOrderActionAvailability } from "./order-action-availability";
import { buildOrderActionPlaceholder } from "./order-pay-placeholder";

const ORDER_STATUS = {
  pendingPayment: {
    code: "pending_payment" as OrderStatusCode,
    label: "待支付",
    hint: "支付能力将在后续里程碑接入，当前先保留订单记录和待支付状态。"
  },
  pendingShipment: {
    code: "pending_shipment" as OrderStatusCode,
    label: "待发货",
    hint: "这个状态先作为支付完成后的预留状态，当前还没有接入真实支付。"
  },
  closed: {
    code: "closed" as OrderStatusCode,
    label: "已关闭",
    hint: "当前先作为取消或超时关闭的占位状态。"
  }
};

function buildId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${random}`;
}

function buildOrderNo() {
  return `XYJ${Date.now()}`;
}

@Injectable()
export class OrdersService {
  constructor(
    private readonly worksService: WorksService,
    private readonly addressesService: AddressesService,
    private readonly ordersDataService: OrdersDataService
  ) {}

  listOrders(clientId: string, query: { statusCode?: string }) {
    const safeClientId = this.requireClientId(clientId);
    const safeStatusCode = this.normalizeStatusCode(query.statusCode);
    const items = this.ordersDataService.read().orders
      .filter((order) => order.clientId === safeClientId)
      .filter((order) => safeStatusCode === "all" || order.statusCode === safeStatusCode)
      .sort((left, right) => right.updatedAt - left.updatedAt)
      .map<OrderListItem>((order) => ({
        id: order.id,
        orderNo: order.orderNo,
        workId: order.workId,
        workTitle: order.workTitle,
        templateId: order.templateId,
        templateName: order.templateName,
        templateVersionNo: order.templateVersionNo,
        statusCode: order.statusCode,
        statusText: order.statusText,
        statusHint: order.statusHint,
        unitPrice: order.unitPrice,
        quantity: order.quantity,
        amount: order.amount,
        workSnapshot: order.workSnapshot,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }));

    return successResponse(items);
  }

  getOrderDetail(clientId: string, orderId: string) {
    return successResponse(this.buildOrderDetail(this.findOrder(clientId, orderId)));
  }

  createOrder(clientId: string, payload: CreateOrderPayload) {
    const safeClientId = this.requireClientId(clientId);
    const safePayload = this.normalizeCreatePayload(payload);
    const work = this.worksService.getWorkRecord(safeClientId, safePayload.workId);
    const address = this.addressesService.getAddressRecord(safeClientId, safePayload.addressId);

    if (!this.canCreateOrder(work)) {
      throw new BadRequestException({
        code: "ORDER_WORK_NOT_READY",
        message: "当前作品还没有准备好下单"
      });
    }

    const addressSnapshot = this.buildAddressSnapshot(address);
    const workSnapshot = this.buildWorkSnapshot(work);
    const now = Date.now();
    const status = ORDER_STATUS.pendingPayment;
    const order: OrderRecord = {
      id: buildId("order"),
      clientId: safeClientId,
      orderNo: buildOrderNo(),
      workId: work.id,
      workTitle: work.title,
      templateId: work.templateId,
      templateName: work.templateName,
      templateVersionId: work.templateVersionId,
      templateVersionNo: work.templateVersionNo,
      statusCode: status.code,
      statusText: status.label,
      statusHint: status.hint,
      unitPrice: work.price,
      quantity: safePayload.quantity,
      amount: work.price * safePayload.quantity,
      addressId: address.id,
      addressSnapshot,
      workSnapshot,
      remark: safePayload.remark,
      paymentCapabilityReady: false,
      createdAt: now,
      updatedAt: now
    };

    this.ordersDataService.update((snapshot) => {
      snapshot.orders = [order].concat(snapshot.orders);
    });

    return successResponse(this.buildOrderDetail(order));
  }

  closeOrder(clientId: string, orderId: string) {
    const safeClientId = this.requireClientId(clientId);
    const current = this.findOrder(safeClientId, orderId);
    if (current.statusCode !== ORDER_STATUS.pendingPayment.code) {
      throw new BadRequestException({
        code: "ORDER_CLOSE_INVALID",
        message: "当前订单状态不能关闭"
      });
    }

    const nextStatus = ORDER_STATUS.closed;
    const updated = this.ordersDataService.update((snapshot) => {
      snapshot.orders = snapshot.orders.map((order) => {
        if (order.clientId !== safeClientId || order.id !== orderId) {
          return order;
        }
        return {
          ...order,
          statusCode: nextStatus.code,
          statusText: nextStatus.label,
          statusHint: nextStatus.hint,
          updatedAt: Date.now()
        };
      });
      return snapshot.orders.find((order) => order.clientId === safeClientId && order.id === orderId) as OrderRecord;
    });

    return successResponse(this.buildOrderDetail(updated));
  }

  openPayAction(clientId: string, orderId: string) {
    return successResponse(this.openActionPlaceholder(clientId, orderId, "payAction"));
  }

  openPdfAction(clientId: string, orderId: string) {
    return successResponse(this.openActionPlaceholder(clientId, orderId, "pdfAction"));
  }

  openFulfillmentAction(clientId: string, orderId: string) {
    return successResponse(this.openActionPlaceholder(clientId, orderId, "fulfillmentAction"));
  }

  private requireClientId(clientId?: string) {
    const safeClientId = String(clientId || "").trim();
    if (!safeClientId) {
      throw new BadRequestException({
        code: "CLIENT_ID_REQUIRED",
        message: "缺少当前设备标识，请重新打开小程序后再试"
      });
    }
    return safeClientId;
  }

  private normalizeStatusCode(statusCode?: string) {
    if (!statusCode || statusCode === "all") {
      return "all";
    }
    const validStatuses = [ORDER_STATUS.pendingPayment.code, ORDER_STATUS.pendingShipment.code, ORDER_STATUS.closed.code];
    if (validStatuses.indexOf(statusCode as OrderStatusCode) === -1) {
      throw new BadRequestException({
        code: "ORDER_STATUS_INVALID",
        message: "订单状态不存在"
      });
    }
    return statusCode as OrderStatusCode;
  }

  private normalizeCreatePayload(payload: CreateOrderPayload) {
    if (!payload || typeof payload !== "object") {
      throw new BadRequestException({
        code: "ORDER_PAYLOAD_INVALID",
        message: "订单参数缺失"
      });
    }
    const workId = String(payload.workId || "").trim();
    const addressId = String(payload.addressId || "").trim();
    const quantity = Number(payload.quantity || 0);
    const remark = String(payload.remark || "").trim();

    if (!workId) {
      throw new BadRequestException({
        code: "ORDER_WORK_REQUIRED",
        message: "缺少作品信息，请重新进入确认订单页"
      });
    }
    if (!addressId) {
      throw new BadRequestException({
        code: "ORDER_ADDRESS_REQUIRED",
        message: "请先选择默认收货地址"
      });
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new BadRequestException({
        code: "ORDER_QUANTITY_INVALID",
        message: "购买数量必须在 1 到 99 本之间"
      });
    }

    return {
      workId,
      addressId,
      quantity,
      remark
    };
  }

  private findOrder(clientId: string, orderId: string) {
    const safeClientId = this.requireClientId(clientId);
    const order = this.ordersDataService.read().orders.find((item) => {
      return item.clientId === safeClientId && item.id === orderId;
    });
    if (!order) {
      throw new NotFoundException({
        code: "ORDER_NOT_FOUND",
        message: "订单不存在"
      });
    }
    return order;
  }

  private buildAddressSnapshot(address: AddressSnapshotSource): FrozenOrderAddressSnapshot {
    return {
      id: address.id,
      name: address.name,
      phone: address.phone,
      region: address.region,
      regionParts: Array.isArray(address.regionParts) ? address.regionParts : [],
      detail: address.detail,
      isDefault: !!address.isDefault
    };
  }

  private buildWorkSnapshot(work: WorkSnapshotSource): FrozenOrderWorkSnapshot {
    return {
      id: work.id,
      title: work.title,
      templateId: work.templateId,
      templateName: work.templateName,
      templateSourceMode: work.templateSourceMode,
      templateVersionId: work.templateVersionId,
      templateVersionNo: work.templateVersionNo,
      generatedPageCount: work.pageCount,
      targetPageCount: work.targetPageCount,
      photoCount: work.photoCount,
      unitPrice: work.price,
      coverTitle: work.coverTitle,
      babyInfo: work.babyInfo,
      coverPhrase: work.coverPhrase,
      coverImage: work.coverImage,
      coverPhoto: work.photos[0]?.path || work.coverImage,
      statusCode: work.statusCode,
      statusText: work.statusText,
      assetReady: this.areWorkAssetsReady(work)
    };
  }

  private areWorkAssetsReady(work: WorkSnapshotSource) {
    if (!Array.isArray(work.photos) || !work.photos.length) {
      return false;
    }
    return work.photos.every((photo) => {
      return !!(
        photo
        && photo.asset
        && photo.asset.publicUrl
        && photo.previewUrl
        && photo.fulfillmentUrl
      );
    });
  }

  private canCreateOrder(work: WorkSnapshotSource) {
    return work.statusCode === "ready"
      && work.photoCount >= 1
      && this.areWorkAssetsReady(work);
  }

  private openActionPlaceholder(clientId: string, orderId: string, actionKey: OrderActionKey) {
    const detail = this.buildOrderDetail(this.findOrder(clientId, orderId));
    return buildOrderActionPlaceholder({
      actionKey,
      statusCode: detail.statusCode,
      statusText: detail.statusText,
      actionAvailability: detail.actionAvailability[actionKey]
    });
  }

  private buildOrderDetail(order: OrderRecord): OrderDetail {
    const productionReadiness = buildOrderProductionReadiness(order);
    return {
      ...order,
      productionReadiness,
      actionAvailability: buildOrderActionAvailability({
        statusCode: order.statusCode,
        productionReadiness
      })
    };
  }
}
