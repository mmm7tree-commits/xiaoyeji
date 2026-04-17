import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { successResponse } from "../common/interfaces/api-response.interface";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./current-user.decorator";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthUserProfile, LoginRequestDto } from "./auth.types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() payload: LoginRequestDto) {
    return successResponse(await this.authService.login(payload));
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: AuthUserProfile | undefined) {
    return successResponse(user || null);
  }
}
