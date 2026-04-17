import { Module } from "@nestjs/common";
import { TemplatesModule } from "../templates/templates.module";
import { WorksController } from "./works.controller";
import { WorksDataService } from "./works-data.service";
import { WorksService } from "./works.service";

@Module({
  imports: [TemplatesModule],
  controllers: [WorksController],
  providers: [WorksDataService, WorksService],
  exports: [WorksService]
})
export class WorksModule {}
