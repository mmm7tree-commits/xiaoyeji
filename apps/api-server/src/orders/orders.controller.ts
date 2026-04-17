import { Body, Controller, Get, Headers, Param, Post, Query } from "@nestjs/common";
import { CreateOrderPayload } from "./orders.types";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  listOrders(
    @Headers("x-xiaoyeji-client-id") clientId: string,
    @Query("statusCode") statusCode?: string
  ) {
    return this.ordersService.listOrders(clientId, { statusCode });
  }

  @Get(":id")
  getOrderDetail(
    @Headers("x-xiaoyeji-client-id") clientId: string,
    @Param("id") id: string
  ) {
    return this.ordersService.getOrderDetail(clientId, id);
  }

  @Post()
  createOrder(
    @Headers("x-xiaoyeji-client-id") clientId: string,
    @Body() payload: CreateOrderPayload
  ) {
    return this.ordersService.createOrder(clientId, payload);
  }

  @Post(":id/close")
  closeOrder(
    @Headers("x-xiaoyeji-client-id") clientId: string,
    @Param("id") id: string
  ) {
    return this.ordersService.closeOrder(clientId, id);
  }

  @Post(":id/pay-action")
  openPayAction(
    @Headers("x-xiaoyeji-client-id") clientId: string,
    @Param("id") id: string
  ) {
    return this.ordersService.openPayAction(clientId, id);
  }

  @Post(":id/pdf-action")
  openPdfAction(
    @Headers("x-xiaoyeji-client-id") clientId: string,
    @Param("id") id: string
  ) {
    return this.ordersService.openPdfAction(clientId, id);
  }

  @Post(":id/fulfillment-action")
  openFulfillmentAction(
    @Headers("x-xiaoyeji-client-id") clientId: string,
    @Param("id") id: string
  ) {
    return this.ordersService.openFulfillmentAction(clientId, id);
  }
}
