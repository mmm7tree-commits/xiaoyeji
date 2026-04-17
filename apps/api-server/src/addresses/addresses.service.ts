import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { successResponse } from "../common/interfaces/api-response.interface";
import { AddressesDataService } from "./addresses-data.service";
import { AddressPayload, AddressRecord } from "./addresses.types";

function buildId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${random}`;
}

@Injectable()
export class AddressesService {
  constructor(private readonly addressesDataService: AddressesDataService) {}

  listAddresses(clientId: string) {
    const safeClientId = this.requireClientId(clientId);
    const items = this.addressesDataService.read().addresses
      .filter((address) => address.clientId === safeClientId)
      .sort((left, right) => {
        if (left.isDefault !== right.isDefault) {
          return left.isDefault ? -1 : 1;
        }
        return right.updatedAt - left.updatedAt;
      });
    return successResponse(items);
  }

  getAddressRecord(clientId: string, addressId: string) {
    const safeClientId = this.requireClientId(clientId);
    return this.findAddress(safeClientId, addressId);
  }

  createAddress(clientId: string, payload: AddressPayload) {
    const safeClientId = this.requireClientId(clientId);
    const safePayload = this.normalizePayload(payload);
    const now = Date.now();
    const nextAddress: AddressRecord = {
      id: buildId("addr"),
      clientId: safeClientId,
      name: safePayload.name,
      phone: safePayload.phone,
      region: safePayload.region,
      regionParts: safePayload.regionParts,
      detail: safePayload.detail,
      isDefault: false,
      createdAt: now,
      updatedAt: now
    };

    const saved = this.addressesDataService.update((snapshot) => {
      const clientAddresses = snapshot.addresses.filter((item) => item.clientId === safeClientId);
      const shouldBeDefault = safePayload.isDefault || clientAddresses.length === 0;
      snapshot.addresses = snapshot.addresses
        .map((item) => {
          if (item.clientId !== safeClientId) {
            return item;
          }
          return shouldBeDefault ? { ...item, isDefault: false } : item;
        });
      const record = {
        ...nextAddress,
        isDefault: shouldBeDefault
      };
      snapshot.addresses.unshift(record);
      return record;
    });

    return successResponse(saved);
  }

  updateAddress(clientId: string, addressId: string, payload: AddressPayload) {
    const safeClientId = this.requireClientId(clientId);
    const safePayload = this.normalizePayload(payload);
    const current = this.findAddress(safeClientId, addressId);

    const updated = this.addressesDataService.update((snapshot) => {
      const shouldBeDefault = Boolean(safePayload.isDefault) || current.isDefault;
      snapshot.addresses = snapshot.addresses.map((item) => {
        if (item.clientId !== safeClientId) {
          return item;
        }
        if (shouldBeDefault) {
          item = { ...item, isDefault: item.id === addressId };
        }
        if (item.id !== addressId) {
          return item;
        }
        return {
          ...item,
          name: safePayload.name,
          phone: safePayload.phone,
          region: safePayload.region,
          regionParts: safePayload.regionParts,
          detail: safePayload.detail,
          isDefault: shouldBeDefault,
          updatedAt: Date.now()
        };
      });
      return snapshot.addresses.find((item) => item.clientId === safeClientId && item.id === addressId) as AddressRecord;
    });

    return successResponse(updated);
  }

  setDefaultAddress(clientId: string, addressId: string) {
    const safeClientId = this.requireClientId(clientId);
    this.findAddress(safeClientId, addressId);

    const updated = this.addressesDataService.update((snapshot) => {
      snapshot.addresses = snapshot.addresses.map((item) => {
        if (item.clientId !== safeClientId) {
          return item;
        }
        return {
          ...item,
          isDefault: item.id === addressId,
          updatedAt: item.id === addressId ? Date.now() : item.updatedAt
        };
      });
      return snapshot.addresses.find((item) => item.clientId === safeClientId && item.id === addressId) as AddressRecord;
    });

    return successResponse(updated);
  }

  deleteAddress(clientId: string, addressId: string) {
    const safeClientId = this.requireClientId(clientId);
    const target = this.findAddress(safeClientId, addressId);

    this.addressesDataService.update((snapshot) => {
      const remaining = snapshot.addresses.filter((item) => {
        return !(item.clientId === safeClientId && item.id === addressId);
      });
      const clientRemaining = remaining.filter((item) => item.clientId === safeClientId);

      if (target.isDefault && clientRemaining.length && !clientRemaining.some((item) => item.isDefault)) {
        const firstId = clientRemaining[0].id;
        snapshot.addresses = remaining.map((item) => {
          if (item.clientId !== safeClientId) {
            return item;
          }
          return {
            ...item,
            isDefault: item.id === firstId,
            updatedAt: item.id === firstId ? Date.now() : item.updatedAt
          };
        });
        return;
      }

      snapshot.addresses = remaining;
    });

    return successResponse({
      id: addressId,
      deleted: true
    });
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

  private findAddress(clientId: string, addressId: string) {
    const address = this.addressesDataService.read().addresses.find((item) => {
      return item.clientId === clientId && item.id === addressId;
    });
    if (!address) {
      throw new NotFoundException({
        code: "ADDRESS_NOT_FOUND",
        message: "地址不存在"
      });
    }
    return address;
  }

  private normalizePayload(payload: AddressPayload) {
    if (!payload || typeof payload !== "object") {
      throw new BadRequestException({
        code: "ADDRESS_PAYLOAD_INVALID",
        message: "地址参数缺失"
      });
    }
    const name = String(payload.name || "").trim();
    const phone = String(payload.phone || "").trim();
    const detail = String(payload.detail || "").trim();
    const regionParts = Array.isArray(payload.regionParts)
      ? payload.regionParts.map((item) => String(item || "").trim()).filter(Boolean)
      : [];
    const region = String(payload.region || regionParts.join("")).trim();

    if (!name || !phone || !detail || !region) {
      throw new BadRequestException({
        code: "ADDRESS_REQUIRED_FIELDS",
        message: "请补全地址信息"
      });
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      throw new BadRequestException({
        code: "ADDRESS_PHONE_INVALID",
        message: "请填写正确手机号"
      });
    }

    return {
      name,
      phone,
      region,
      regionParts,
      detail,
      isDefault: Boolean(payload.isDefault)
    };
  }
}
