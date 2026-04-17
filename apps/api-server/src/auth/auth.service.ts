import {
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload, LoginRequestDto } from "./auth.types";
import { UsersService } from "./users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  getTokenExpiresIn() {
    return process.env.JWT_EXPIRES_IN || "7d";
  }

  async login(payload: LoginRequestDto) {
    if (!payload.account?.trim() || !payload.password?.trim()) {
      throw new UnauthorizedException({
        code: "AUTH_INVALID_CREDENTIALS",
        message: "请输入账号和密码"
      });
    }

    const user = this.usersService.findByAccount(payload.account.trim());

    if (!user || user.password !== payload.password) {
      throw new UnauthorizedException({
        code: "AUTH_INVALID_CREDENTIALS",
        message: "账号或密码错误"
      });
    }

    if (user.status !== "ACTIVE") {
      throw new ForbiddenException({
        code: "AUTH_USER_DISABLED",
        message: "当前账号已停用"
      });
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      account: user.account,
      role: user.role
    });

    return {
      accessToken,
      tokenType: "Bearer",
      expiresIn: this.getTokenExpiresIn(),
      user: this.usersService.toProfile(user)
    };
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException({
        code: "AUTH_TOKEN_INVALID",
        message: "登录已过期，请重新登录"
      });
    }
  }

  async getCurrentUser(userId: string) {
    const user = this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException({
        code: "AUTH_USER_NOT_FOUND",
        message: "当前登录用户不存在"
      });
    }

    return this.usersService.toProfile(user);
  }
}
