import {
  OrderActionAvailability,
  OrderActionAvailabilityItem,
  OrderProductionReadiness,
  OrderStatusCode
} from "./orders.types";

function buildAction(
  visible: boolean,
  enabled: boolean,
  reason: string,
  requiredChecks: string[]
): OrderActionAvailabilityItem {
  return {
    visible,
    enabled,
    blocked: visible ? !enabled : true,
    reason,
    requiredChecks
  };
}

export function buildOrderActionAvailability(params: {
  statusCode: OrderStatusCode;
  productionReadiness: OrderProductionReadiness;
}): OrderActionAvailability {
  const { statusCode, productionReadiness } = params;

  const payAction = statusCode === "pending_payment"
    ? buildAction(
      true,
      true,
      "当前只保留支付入口位，后续会接正式支付能力。",
      ["status_pending_payment"]
    )
    : statusCode === "closed"
      ? buildAction(
        true,
        false,
        "订单已关闭，当前不能继续支付。",
        ["status_pending_payment"]
      )
      : buildAction(
        true,
        false,
        "订单已经进入待发货占位状态，当前不需要重复支付。",
        ["status_pending_payment"]
      );

  const pdfAction = statusCode === "closed"
    ? buildAction(
      true,
      false,
      "订单已关闭，当前不能继续生成 PDF。",
      ["production_ready", "status_not_closed"]
    )
    : productionReadiness.ready
      ? buildAction(
        true,
        true,
        "当前只保留 PDF 入口位，后续会接真实 PDF 生成。",
        ["production_ready", "status_not_closed"]
      )
      : buildAction(
        true,
        false,
        "当前还有前置条件缺失，请先补齐图片、模板版本、作品快照或地址快照。",
        ["production_ready", "status_not_closed"]
      );

  const fulfillmentAction = statusCode === "closed"
    ? buildAction(
      true,
      false,
      "订单已关闭，当前不能继续进入履约。",
      ["production_ready", "status_not_closed"]
    )
    : productionReadiness.ready
      ? buildAction(
        true,
        true,
        "当前只保留履约入口位，后续会接发货、物流与后台履约动作。",
        ["production_ready", "status_not_closed"]
      )
      : buildAction(
        true,
        false,
        "当前还有关键信息缺失，先补齐后再继续进入履约。",
        ["production_ready", "status_not_closed"]
      );

  return {
    payAction,
    pdfAction,
    fulfillmentAction
  };
}
