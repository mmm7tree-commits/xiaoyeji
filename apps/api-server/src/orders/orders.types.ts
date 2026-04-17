import { AddressRecord } from "../addresses/addresses.types";
import { WorkRecord } from "../works/works.types";

export type OrderStatusCode = "pending_payment" | "pending_shipment" | "closed";

export interface CreateOrderPayload {
  workId: string;
  addressId: string;
  quantity: number;
  remark?: string;
}

export interface FrozenOrderAddressSnapshot {
  id: string;
  name: string;
  phone: string;
  region: string;
  regionParts: string[];
  detail: string;
  isDefault: boolean;
}

export interface FrozenOrderWorkSnapshot {
  id: string;
  title: string;
  templateId: string;
  templateName: string;
  templateSourceMode: string;
  templateVersionId: string | null;
  templateVersionNo: number | null;
  generatedPageCount: number;
  targetPageCount: number;
  photoCount: number;
  unitPrice: number;
  coverTitle: string;
  babyInfo: string;
  coverPhrase: string;
  coverImage: string;
  coverPhoto: string;
  statusCode: string;
  statusText: string;
  assetReady: boolean;
}

export interface OrderProductionReadinessCheck {
  code:
    | "assets_ready"
    | "work_snapshot_complete"
    | "template_version_complete"
    | "address_complete";
  label: string;
  passed: boolean;
  description: string;
  blocker?: string;
}

export interface OrderProductionReadiness {
  ready: boolean;
  label: string;
  description: string;
  blockers: string[];
  checks: OrderProductionReadinessCheck[];
}

export interface OrderActionAvailabilityItem {
  visible: boolean;
  enabled: boolean;
  blocked: boolean;
  reason: string;
  requiredChecks: string[];
}

export interface OrderActionAvailability {
  payAction: OrderActionAvailabilityItem;
  pdfAction: OrderActionAvailabilityItem;
  fulfillmentAction: OrderActionAvailabilityItem;
}

export type OrderActionKey = "payAction" | "pdfAction" | "fulfillmentAction";

export interface OrderActionPlaceholderResult {
  actionKey: OrderActionKey;
  accepted: boolean;
  blocked: boolean;
  statusCode: OrderStatusCode;
  statusText: string;
  message: string;
  placeholderTitle: string;
  placeholderDescription: string;
  nextStepHint: string;
  actionAvailability: OrderActionAvailabilityItem;
}

export interface OrderRecord {
  id: string;
  clientId: string;
  orderNo: string;
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
  addressId: string;
  addressSnapshot: FrozenOrderAddressSnapshot | null;
  workSnapshot: FrozenOrderWorkSnapshot;
  remark: string;
  paymentCapabilityReady: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface OrderDetail extends OrderRecord {
  productionReadiness: OrderProductionReadiness;
  actionAvailability: OrderActionAvailability;
}

export interface OrdersSnapshot {
  orders: OrderRecord[];
}

export interface OrderListItem {
  id: string;
  orderNo: string;
  workId: string;
  workTitle: string;
  templateId: string;
  templateName: string;
  templateVersionNo: number | null;
  statusCode: OrderStatusCode;
  statusText: string;
  statusHint: string;
  unitPrice: number;
  quantity: number;
  amount: number;
  workSnapshot: FrozenOrderWorkSnapshot;
  createdAt: number;
  updatedAt: number;
}

export type AddressSnapshotSource = Pick<
  AddressRecord,
  "id" | "name" | "phone" | "region" | "regionParts" | "detail" | "isDefault"
>;

export type WorkSnapshotSource = Pick<
  WorkRecord,
  | "id"
  | "title"
  | "templateId"
  | "templateName"
  | "templateSourceMode"
  | "templateVersionId"
  | "templateVersionNo"
  | "pageCount"
  | "targetPageCount"
  | "photoCount"
  | "price"
  | "coverTitle"
  | "babyInfo"
  | "coverPhrase"
  | "coverImage"
  | "statusCode"
  | "statusText"
> & {
  photos: WorkRecord["photos"];
};
