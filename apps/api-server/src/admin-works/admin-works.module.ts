import { Module } from "@nestjs/common";
import { AdminDataModule } from "../admin-data/admin-data.module";
import { AuthModule } from "../auth/auth.module";
import { AdminWorksController } from "./admin-works.controller";
import { AdminWorksService } from "./admin-works.service";

@Module({
  imports: [AdminDataModule, AuthModule],
  controllers: [AdminWorksController],
  providers: [AdminWorksService]
})
export class AdminWorksModule {}
