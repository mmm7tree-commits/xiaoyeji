export type AdminOrderStatusCode =
  | "pending_payment"
  | "pending_shipment"
  | "closed";

export interface AdminOrderListItem {
  id: string;
  orderNo: string;
  clientId: string;
  workId: string;
  workTitle: string;
  templateName: string;
  templateVersionNo: number | null;
  statusCode: AdminOrderStatusCode;
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
  statusCode: AdminOrderStatusCode;
  statusText: string;
  statusHint: string;
  unitPrice: number;
  quantity: number;
  amount: number;
  remark: string;
  paymentCapabilityReady: boolean;
  createdAt: string;
  updatedAt: string;
  addressSnapshot: {
    id: string;
    name: string;
    phone: string;
    region: string;
    regionParts: string[];
    detail: string;
    isDefault: boolean;
  } | null;
  workSnapshot: {
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
  };
  detailSections: Array<{
    label: string;
    value: string;
  }>;
  assetReadiness: {
    ready: boolean;
    label: string;
    description: string;
  };
  productionReadiness: {
    ready: boolean;
    label: string;
    description: string;
    blockers: string[];
    checks: Array<{
      code: "assets_ready" | "work_snapshot_complete" | "template_version_complete" | "address_complete";
      label: string;
      passed: boolean;
      description: string;
      blocker?: string;
    }>;
  };
  actionAvailability: {
    payAction: {
      visible: boolean;
      enabled: boolean;
      blocked: boolean;
      reason: string;
      requiredChecks: string[];
    };
    pdfAction: {
      visible: boolean;
      enabled: boolean;
      blocked: boolean;
      reason: string;
      requiredChecks: string[];
    };
    fulfillmentAction: {
      visible: boolean;
      enabled: boolean;
      blocked: boolean;
      reason: string;
      requiredChecks: string[];
    };
  };
}

export interface AdminOrderActionResult {
  actionKey: "payAction" | "pdfAction" | "fulfillmentAction";
  accepted: boolean;
  blocked: boolean;
  statusCode: AdminOrderStatusCode;
  statusText: string;
  message: string;
  placeholderTitle: string;
  placeholderDescription: string;
  nextStepHint: string;
  actionAvailability: {
    visible: boolean;
    enabled: boolean;
    blocked: boolean;
    reason: string;
    requiredChecks: string[];
  };
}
