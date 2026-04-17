import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { successResponse } from "../common/interfaces/api-response.interface";
import { OrdersDataService } from "../orders/orders-data.service";
import { OrderStatusCode } from "../orders/orders.types";
import { buildOrderProductionReadiness } from "../orders/order-production-readiness";
import { buildOrderActionAvailability } from "../orders/order-action-availability";
import { buildOrderActionPlaceholder } from "../orders/order-pay-placeholder";
import { AdminOrderDetail, AdminOrderListItem } from "./admin-orders.types";

function formatDate(value: number) {
  return new Date(value).toISOString();
}

function formatCurrency(value: number) {
  return `¥${(value / 100).toFixed(2)}`;
}

@Injectable()
export class AdminOrdersService {
  constructor(private readonly ordersDataService: OrdersDataService) {}

  listOrders(query: { keyword?: string; statusCode?: string }) {
    const keyword = String(query.keyword || "").trim().toLowerCase();
    const safeStatusCode = this.normalizeStatusCode(query.statusCode);
    const items = this.ordersDataService.read().orders
      .filter((order) => {
        if (safeStatusCode && order.statusCode !== safeStatusCode) {
          return false;
        }
        if (!keyword) {
          return true;
        }
        return [
          order.orderNo,
          order.workTitle,
          order.templateName,
          order.clientId,
          order.addressSnapshot?.name || "",
          order.addressSnapshot?.phone || ""
        ].some((field) => String(field).toLowerCase().includes(keyword));
      })
      .sort((left, right) => right.updatedAt - left.updatedAt)
      .map<AdminOrderListItem>((order) => ({
        id: order.id,
        orderNo: order.orderNo,
        clientId: order.clientId,
        workId: order.workId,
        workTitle: order.workTitle,
        templateName: order.templateName,
        templateVersionNo: order.templateVersionNo,
        statusCode: order.statusCode,
        statusText: order.statusText,
        statusHint: order.statusHint,
        unitPrice: order.unitPrice,
        quantity: order.quantity,
        amount: order.amount,
        consigneeName: order.addressSnapshot?.name || "未填写",
        consigneePhone: order.addressSnapshot?.phone || "未填写",
        assetReady: !!order.workSnapshot?.assetReady,
        createdAt: formatDate(order.createdAt),
        updatedAt: formatDate(order.updatedAt)
      }));

    return successResponse(items);
  }

  getOrderDetail(orderId: string) {
    const order = this.ordersDataService.read().orders.find((item) => item.id === orderId);
    if (!order) {
      throw new NotFoundException({
        code: "ADMIN_ORDER_NOT_FOUND",
        message: "订单不存在"
      });
    }

    const assetReady = !!order.workSnapshot?.assetReady;
    const productionReadiness = buildOrderProductionReadiness(order);
    const actionAvailability = buildOrderActionAvailability({
      statusCode: order.statusCode,
      productionReadiness
    });
    const detail: AdminOrderDetail = {
      id: order.id,
      orderNo: order.orderNo,
      clientId: order.clientId,
      workId: order.workId,
      workTitle: order.workTitle,
      templateId: order.templateId,
      templateName: order.templateName,
      templateVersionId: order.templateVersionId,
      templateVersionNo: order.templateVersionNo,
      statusCode: order.statusCode,
      statusText: order.statusText,
      statusHint: order.statusHint,
      unitPrice: order.unitPrice,
      quantity: order.quantity,
      amount: order.amount,
      remark: order.remark,
      paymentCapabilityReady: order.paymentCapabilityReady,
      createdAt: formatDate(order.createdAt),
      updatedAt: formatDate(order.updatedAt),
      addressSnapshot: order.addressSnapshot,
      workSnapshot: order.workSnapshot,
      detailSections: [
        {
          label: "订单金额",
          value: `${formatCurrency(order.unitPrice)} × ${order.quantity} 本 = ${formatCurrency(order.amount)}`
        },
        {
          label: "模板版本",
          value: order.templateVersionNo ? `V${order.templateVersionNo}` : "暂未记录版本号"
        },
        {
          label: "作品摘要",
          value: `${order.workSnapshot.generatedPageCount} 页预览 · ${order.workSnapshot.photoCount} 张照片`
        },
        {
          label: "设备标识",
          value: order.clientId
        }
      ],
      assetReadiness: {
        ready: assetReady,
        label: assetReady ? "已具备履约条件" : "暂未具备履约条件",
        description: assetReady
          ? "作品图片已经具备服务端资源引用，后续可以继续衔接履约和 PDF。"
          : "作品图片还不完整或缺少服务端资源引用，当前不建议进入履约流程。"
      },
      productionReadiness,
      actionAvailability
    };

    return successResponse(detail);
  }

  openPayAction(orderId: string) {
    return successResponse(this.openActionPlaceholder(orderId, "payAction"));
  }

  openPdfAction(orderId: string) {
    return successResponse(this.openActionPlaceholder(orderId, "pdfAction"));
  }

  openFulfillmentAction(orderId: string) {
    return successResponse(this.openActionPlaceholder(orderId, "fulfillmentAction"));
  }

  private openActionPlaceholder(
    orderId: string,
    actionKey: "payAction" | "pdfAction" | "fulfillmentAction"
  ) {
    const order = this.ordersDataService.read().orders.find((item) => item.id === orderId);
    if (!order) {
      throw new NotFoundException({
        code: "ADMIN_ORDER_NOT_FOUND",
        message: "订单不存在"
      });
    }
    const productionReadiness = buildOrderProductionReadiness(order);
    const actionAvailability = buildOrderActionAvailability({
      statusCode: order.statusCode,
      productionReadiness
    });
    return buildOrderActionPlaceholder({
      actionKey,
      statusCode: order.statusCode,
      statusText: order.statusText,
      actionAvailability: actionAvailability[actionKey]
    });
  }

  private normalizeStatusCode(statusCode?: string) {
    if (!statusCode || statusCode === "all") {
      return null;
    }
    const validStatuses: OrderStatusCode[] = [
      "pending_payment",
      "pending_shipment",
      "closed"
    ];
    if (validStatuses.indexOf(statusCode as OrderStatusCode) === -1) {
      throw new BadRequestException({
        code: "ADMIN_ORDER_STATUS_INVALID",
        message: "订单状态不存在"
      });
    }
    return statusCode as OrderStatusCode;
  }
}
