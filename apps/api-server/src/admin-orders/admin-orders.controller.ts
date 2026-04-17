import { Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PermissionsGuard } from "../auth/permissions.guard";
import { RequirePermissions } from "../auth/permissions.decorator";
import { AdminOrdersService } from "./admin-orders.service";

@Controller("admin/orders")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @Get()
  @RequirePermissions("orders:read")
  listOrders(
    @Query("keyword") keyword?: string,
    @Query("statusCode") statusCode?: string
  ) {
    return this.adminOrdersService.listOrders({
      keyword,
      statusCode
    });
  }

  @Get(":id")
  @RequirePermissions("orders:read")
  getOrderDetail(@Param("id") id: string) {
    return this.adminOrdersService.getOrderDetail(id);
  }

  @Post(":id/pay-action")
  @RequirePermissions("orders:manage")
  openPayAction(@Param("id") id: string) {
    return this.adminOrdersService.openPayAction(id);
  }

  @Post(":id/pdf-action")
  @RequirePermissions("orders:manage")
  openPdfAction(@Param("id") id: string) {
    return this.adminOrdersService.openPdfAction(id);
  }

  @Post(":id/fulfillment-action")
  @RequirePermissions("orders:manage")
  openFulfillmentAction(@Param("id") id: string) {
    return this.adminOrdersService.openFulfillmentAction(id);
  }
}
