import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { PermissionsGuard } from "./permissions.guard";
import { UsersService } from "./users.service";

const jwtExpiresIn = (process.env.JWT_EXPIRES_IN || "7d") as never;

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "dev-secret-only",
      signOptions: {
        expiresIn: jwtExpiresIn
      }
    })
  ],
  controllers: [AuthController],
  providers: [
    Reflector,
    AuthService,
    UsersService,
    JwtAuthGuard,
    PermissionsGuard
  ],
  exports: [AuthService, UsersService, JwtAuthGuard, PermissionsGuard]
})
export class AuthModule {}
