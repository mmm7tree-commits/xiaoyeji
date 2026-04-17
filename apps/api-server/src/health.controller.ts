import { Controller, Get } from "@nestjs/common";
import { successResponse } from "./common/interfaces/api-response.interface";

@Controller("health")
export class HealthController {
  @Get()
  getHealth() {
    return successResponse({
      service: "xiaoyeji-api-server",
      env: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString()
    });
  }
}
