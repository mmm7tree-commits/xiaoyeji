import {
  OrderActionKey,
  OrderActionAvailabilityItem,
  OrderActionPlaceholderResult,
  OrderStatusCode
} from "./orders.types";

function buildAcceptedContent(actionKey: OrderActionKey) {
  if (actionKey === "payAction") {
    return {
      message: "这笔订单已经进入支付占位流程，但当前不会真的发起扣款。",
      placeholderTitle: "支付能力开发中",
      placeholderDescription: "当前已经通过支付前置判断，后续会在这里接正式支付能力和支付回调。",
      nextStepHint: "在真实支付接入前，订单会继续停留在待支付状态。"
    };
  }

  if (actionKey === "pdfAction") {
    return {
      message: "这笔订单已经进入 PDF 动作占位流程，但当前不会真的生成 PDF 文件。",
      placeholderTitle: "PDF 能力开发中",
      placeholderDescription: "当前已经通过 PDF 前置判断，后续会在这里接真实 PDF 生成和下载能力。",
      nextStepHint: "在真实 PDF 接入前，订单状态不会发生变化。"
    };
  }

  return {
    message: "这笔订单已经进入履约动作占位流程，但当前不会真的触发发货或物流操作。",
    placeholderTitle: "履约能力开发中",
    placeholderDescription: "当前已经通过履约前置判断，后续会在这里接发货、物流和履约动作。",
    nextStepHint: "在真实履约接入前，订单状态不会发生变化。"
  };
}

function buildBlockedContent(actionKey: OrderActionKey) {
  const actionLabel = actionKey === "payAction"
    ? "支付"
    : actionKey === "pdfAction"
      ? "PDF"
      : "履约";

  return {
    placeholderTitle: `当前还不能进入${actionLabel}`,
    placeholderDescription: "请先根据当前提示补齐前置条件，再从这里继续进入动作位。",
    nextStepHint: "当前不会触发真实动作，也不会改变订单状态。"
  };
}

export function buildOrderActionPlaceholder(params: {
  actionKey: OrderActionKey;
  statusCode: OrderStatusCode;
  statusText: string;
  actionAvailability: OrderActionAvailabilityItem;
}): OrderActionPlaceholderResult {
  const { actionKey, statusCode, statusText, actionAvailability } = params;
  const accepted = !actionAvailability.blocked && actionAvailability.enabled;
  const acceptedContent = buildAcceptedContent(actionKey);
  const blockedContent = buildBlockedContent(actionKey);

  return {
    actionKey,
    accepted,
    blocked: actionAvailability.blocked,
    statusCode,
    statusText,
    message: accepted
      ? acceptedContent.message
      : actionAvailability.reason,
    placeholderTitle: accepted
      ? acceptedContent.placeholderTitle
      : blockedContent.placeholderTitle,
    placeholderDescription: accepted
      ? acceptedContent.placeholderDescription
      : blockedContent.placeholderDescription,
    nextStepHint: accepted
      ? acceptedContent.nextStepHint
      : blockedContent.nextStepHint,
    actionAvailability
  };
}
