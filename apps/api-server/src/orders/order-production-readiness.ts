import {
  FrozenOrderAddressSnapshot,
  FrozenOrderWorkSnapshot,
  OrderProductionReadiness,
  OrderProductionReadinessCheck,
  OrderRecord
} from "./orders.types";

function hasText(value?: string | null) {
  return !!String(value || "").trim();
}

function buildCheck(
  code: OrderProductionReadinessCheck["code"],
  label: string,
  passed: boolean,
  description: string,
  blocker?: string
): OrderProductionReadinessCheck {
  return {
    code,
    label,
    passed,
    description,
    blocker: passed ? undefined : blocker
  };
}

function isAddressComplete(addressSnapshot: FrozenOrderAddressSnapshot | null) {
  return !!(
    addressSnapshot
    && hasText(addressSnapshot.name)
    && hasText(addressSnapshot.phone)
    && hasText(addressSnapshot.region)
    && hasText(addressSnapshot.detail)
  );
}

function isWorkSnapshotComplete(workSnapshot: FrozenOrderWorkSnapshot | null) {
  return !!(
    workSnapshot
    && hasText(workSnapshot.id)
    && hasText(workSnapshot.title)
    && hasText(workSnapshot.templateId)
    && hasText(workSnapshot.templateName)
    && workSnapshot.generatedPageCount > 0
    && workSnapshot.photoCount > 0
  );
}

function isTemplateVersionComplete(workSnapshot: FrozenOrderWorkSnapshot | null) {
  return !!(
    workSnapshot
    && (hasText(workSnapshot.templateVersionId) || !!workSnapshot.templateVersionNo)
  );
}

function isAssetReady(workSnapshot: FrozenOrderWorkSnapshot | null) {
  return !!(workSnapshot && workSnapshot.assetReady);
}

export function buildOrderProductionReadiness(
  order: Pick<OrderRecord, "addressSnapshot" | "workSnapshot">
): OrderProductionReadiness {
  const checks = [
    buildCheck(
      "assets_ready",
      "图片资产齐全",
      isAssetReady(order.workSnapshot),
      "作品图片已经具备服务端资源引用，可继续用于后续生产和履约。",
      "作品图片还没有全部完成服务端持久化，当前不能继续用于 PDF 或履约。"
    ),
    buildCheck(
      "work_snapshot_complete",
      "作品快照完整",
      isWorkSnapshotComplete(order.workSnapshot),
      "作品标题、模板、页数和照片数都已经冻结，可稳定回看历史作品。",
      "作品快照缺少标题、模板或页数信息，当前不适合继续进入生产流程。"
    ),
    buildCheck(
      "template_version_complete",
      "模板版本完整",
      isTemplateVersionComplete(order.workSnapshot),
      "订单已经冻结模板版本号，后续新版模板不会影响历史订单。",
      "模板版本号还不完整，当前无法保证后续 PDF 和履约使用的是哪一版模板。"
    ),
    buildCheck(
      "address_complete",
      "地址快照完整",
      isAddressComplete(order.addressSnapshot),
      "收货地址快照已经齐全，后续履约时可以直接使用。",
      "收货地址快照不完整，当前无法继续进入后续履约流程。"
    )
  ];

  const blockers = checks.filter((item) => !item.passed).map((item) => item.blocker as string);
  const ready = blockers.length === 0;

  return {
    ready,
    label: ready ? "已具备后续生产条件" : "暂不具备后续生产条件",
    description: ready
      ? "订单所需的图片资产、作品快照、模板版本和地址快照都已经准备好，后续可以继续接支付、PDF 和履约动作。"
      : "当前还有关键信息缺失，建议先补齐后再继续接支付、PDF 或履约能力。",
    blockers,
    checks
  };
}
