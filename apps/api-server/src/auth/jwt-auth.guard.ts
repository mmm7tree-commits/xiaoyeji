import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers?: Record<string, string | string[] | undefined>;
      user?: unknown;
    }>();

    const authorizationHeader = request.headers?.authorization;
    const authValue = Array.isArray(authorizationHeader)
      ? authorizationHeader[0]
      : authorizationHeader;

    if (!authValue || !authValue.startsWith("Bearer ")) {
      throw new UnauthorizedException({
        code: "AUTH_TOKEN_MISSING",
        message: "未登录或登录已过期"
      });
    }

    const token = authValue.slice("Bearer ".length).trim();
    const payload = await this.authService.verifyToken(token);
    request.user = await this.authService.getCurrentUser(payload.sub);
    return true;
  }
}
