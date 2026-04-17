import { Module } from "@nestjs/common";
import { AddressesModule } from "../addresses/addresses.module";
import { WorksModule } from "../works/works.module";
import { OrdersController } from "./orders.controller";
import { OrdersDataService } from "./orders-data.service";
import { OrdersService } from "./orders.service";

@Module({
  imports: [WorksModule, AddressesModule],
  controllers: [OrdersController],
  providers: [OrdersDataService, OrdersService],
  exports: [OrdersDataService, OrdersService]
})
export class OrdersModule {}
