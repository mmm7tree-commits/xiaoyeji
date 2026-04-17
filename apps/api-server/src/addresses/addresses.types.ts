export interface AddressRecord {
  id: string;
  clientId: string;
  name: string;
  phone: string;
  region: string;
  regionParts: string[];
  detail: string;
  isDefault: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface AddressPayload {
  name: string;
  phone: string;
  region: string;
  regionParts: string[];
  detail: string;
  isDefault?: boolean;
}

export interface AddressesSnapshot {
  addresses: AddressRecord[];
}
