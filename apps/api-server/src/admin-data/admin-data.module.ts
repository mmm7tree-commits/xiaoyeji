import { Module } from "@nestjs/common";
import { AdminDataService } from "./admin-data.service";

@Module({
  providers: [AdminDataService],
  exports: [AdminDataService]
})
export class AdminDataModule {}
