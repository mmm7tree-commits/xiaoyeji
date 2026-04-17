import { SetMetadata } from "@nestjs/common";
import { PermissionCode } from "./auth.types";

export const REQUIRED_PERMISSIONS_KEY = "required_permissions";

export function RequirePermissions(...permissions: PermissionCode[]) {
  return SetMetadata(REQUIRED_PERMISSIONS_KEY, permissions);
}
