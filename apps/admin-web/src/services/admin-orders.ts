import { request } from "./http";
import type {
  AdminOrderActionResult,
  AdminOrderDetail,
  AdminOrderListItem
} from "../types/order-admin";

export function fetchAdminOrders(
  token: string,
  query: {
    keyword?: string;
    statusCode?: string;
  }
) {
  const params = new URLSearchParams();

  if (query.keyword?.trim()) {
    params.set("keyword", query.keyword.trim());
  }

  if (query.statusCode && query.statusCode !== "all") {
    params.set("statusCode", query.statusCode);
  }

  const suffix = params.size ? `?${params.toString()}` : "";

  return request<AdminOrderListItem[]>(`/admin/orders${suffix}`, {
    method: "GET",
    token
  });
}

export function fetchAdminOrderDetail(token: string, orderId: string) {
  return request<AdminOrderDetail>(`/admin/orders/${orderId}`, {
    method: "GET",
    token
  });
}

export function triggerAdminPayAction(token: string, orderId: string) {
  return request<AdminOrderActionResult>(`/admin/orders/${orderId}/pay-action`, {
    method: "POST",
    token
  });
}

export function triggerAdminPdfAction(token: string, orderId: string) {
  return request<AdminOrderActionResult>(`/admin/orders/${orderId}/pdf-action`, {
    method: "POST",
    token
  });
}

export function triggerAdminFulfillmentAction(token: string, orderId: string) {
  return request<AdminOrderActionResult>(`/admin/orders/${orderId}/fulfillment-action`, {
    method: "POST",
    token
  });
}
