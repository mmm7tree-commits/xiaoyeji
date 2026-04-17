import { Module } from "@nestjs/common";
import { AdminDataModule } from "../admin-data/admin-data.module";
import { AuthModule } from "../auth/auth.module";
import { AdminTemplatesController } from "./admin-templates.controller";
import { AdminTemplatesService } from "./admin-templates.service";

@Module({
  imports: [AdminDataModule, AuthModule],
  controllers: [AdminTemplatesController],
  providers: [AdminTemplatesService],
  exports: [AdminTemplatesService]
})
export class AdminTemplatesModule {}
