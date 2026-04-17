import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthUserProfile } from "./auth.types";

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUserProfile | undefined => {
    const request = ctx.switchToHttp().getRequest<{ user?: AuthUserProfile }>();
    return request.user;
  }
);
