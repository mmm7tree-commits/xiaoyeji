import { Body, Controller, Delete, Get, Headers, Param, Post, Query } from "@nestjs/common";
import { WorksService } from "./works.service";
import { CreateWorkPayload } from "./works.types";

@Controller("works")
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  @Get()
  listWorks(
    @Headers("x-xiaoyeji-client-id") clientId: string,
    @Query("statusCode") statusCode?: string
  ) {
    return this.worksService.listWorks(clientId, { statusCode });
  }

  @Get(":id")
  getWorkDetail(
    @Headers("x-xiaoyeji-client-id") clientId: string,
    @Param("id") id?: string
  ) {
    return this.worksService.getWorkDetail(clientId, id || "");
  }

  @Post()
  createWork(
    @Headers("x-xiaoyeji-client-id") clientId: string,
    @Body() payload: CreateWorkPayload
  ) {
    return this.worksService.createWork(clientId, payload);
  }

  @Delete(":id")
  deleteWork(
    @Headers("x-xiaoyeji-client-id") clientId: string,
    @Param("id") id?: string
  ) {
    return this.worksService.deleteWork(clientId, id || "");
  }
}
