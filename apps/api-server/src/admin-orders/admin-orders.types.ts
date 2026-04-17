import {
  OrderActionAvailability,
  OrderActionPlaceholderResult,
  OrderProductionReadiness,
  OrderRecord,
  OrderStatusCode
} from "../orders/orders.types";

export interface AdminOrderListItem {
  id: string;
  orderNo: string;
  clientId: string;
  workId: string;
  workTitle: string;
  templateName: string;
  templateVersionNo: number | null;
  statusCode: OrderStatusCode;
  statusText: string;
  statusHint: string;
  unitPrice: number;
  quantity: number;
  amount: number;
  consigneeName: string;
  consigneePhone: string;
  assetReady: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderDetail {
  id: string;
  orderNo: string;
  clientId: string;
  workId: string;
  workTitle: string;
  templateId: string;
  templateName: string;
  templateVersionId: string | null;
  templateVersionNo: number | null;
  statusCode: OrderStatusCode;
  statusText: string;
  statusHint: string;
  unitPrice: number;
  quantity: number;
  amount: number;
  remark: string;
  paymentCapabilityReady: boolean;
  createdAt: string;
  updatedAt: string;
  addressSnapshot: OrderRecord["addressSnapshot"];
  workSnapshot: OrderRecord["workSnapshot"];
  detailSections: Array<{
    label: string;
    value: string;
  }>;
  assetReadiness: {
    ready: boolean;
    label: string;
    description: string;
  };
  productionReadiness: OrderProductionReadiness;
  actionAvailability: OrderActionAvailability;
}

export type AdminOrderActionResult = OrderActionPlaceholderResult;
