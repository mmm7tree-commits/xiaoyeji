import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthUserProfile, PermissionCode } from "./auth.types";
import { REQUIRED_PERMISSIONS_KEY } from "./permissions.decorator";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions =
      this.reflector.getAllAndOverride<PermissionCode[]>(
        REQUIRED_PERMISSIONS_KEY,
        [context.getHandler(), context.getClass()]
      ) || [];

    if (!requiredPermissions.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user?: AuthUserProfile;
    }>();

    const currentUser = request.user;

    if (!currentUser) {
      throw new ForbiddenException({
        code: "AUTH_PERMISSION_DENIED",
        message: "当前账号没有访问权限"
      });
    }

    const missingPermission = requiredPermissions.find(
      (permission) => !currentUser.permissions.includes(permission)
    );

    if (missingPermission) {
      throw new ForbiddenException({
        code: "AUTH_PERMISSION_DENIED",
        message: "当前账号没有访问权限"
      });
    }

    return true;
  }
}
