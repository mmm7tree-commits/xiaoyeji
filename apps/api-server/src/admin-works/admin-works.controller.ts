import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PermissionsGuard } from "../auth/permissions.guard";
import { RequirePermissions } from "../auth/permissions.decorator";
import { AdminWorksService } from "./admin-works.service";

@Controller("admin/works")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminWorksController {
  constructor(private readonly adminWorksService: AdminWorksService) {}

  @Get()
  @RequirePermissions("works:read")
  listWorks(
    @Query("keyword") keyword?: string,
    @Query("status") status?: string,
    @Query("templateId") templateId?: string
  ) {
    return this.adminWorksService.listWorks({
      keyword,
      status,
      templateId
    });
  }

  @Get(":id")
  @RequirePermissions("works:read")
  getWorkDetail(@Param("id") id: string) {
    return this.adminWorksService.getWorkDetail(id);
  }
}
