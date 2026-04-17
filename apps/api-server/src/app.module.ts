import { Module } from "@nestjs/common";
import { AddressesModule } from "./addresses/addresses.module";
import { AssetsModule } from "./assets/assets.module";
import { AdminTemplatesModule } from "./admin-templates/admin-templates.module";
import { AdminOrdersModule } from "./admin-orders/admin-orders.module";
import { AdminWorksModule } from "./admin-works/admin-works.module";
import { AuthModule } from "./auth/auth.module";
import { HealthController } from "./health.controller";
import { OrdersModule } from "./orders/orders.module";
import { TemplatesModule } from "./templates/templates.module";
import { WorksModule } from "./works/works.module";

@Module({
  imports: [
    AuthModule,
    AssetsModule,
    AddressesModule,
    TemplatesModule,
    WorksModule,
    OrdersModule,
    AdminOrdersModule,
    AdminTemplatesModule,
    AdminWorksModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
