import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PermissionsGuard } from "../auth/permissions.guard";
import { RequirePermissions } from "../auth/permissions.decorator";
import { AdminTemplatesService } from "./admin-templates.service";
import {
  CreateTemplatePayload,
  GenerateTemplatePayload,
  RegenerateTemplatePayload,
  UpdateTemplatePayload
} from "./admin-templates.types";

@Controller("admin/templates")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminTemplatesController {
  constructor(private readonly adminTemplatesService: AdminTemplatesService) {}

  @Get("categories")
  @RequirePermissions("templates:read")
  getCategories() {
    return this.adminTemplatesService.getCategories();
  }

  @Get()
  @RequirePermissions("templates:read")
  listTemplates(
    @Query("keyword") keyword?: string,
    @Query("categoryCode") categoryCode?: string,
    @Query("status") status?: string
  ) {
    return this.adminTemplatesService.listTemplates({
      keyword,
      categoryCode,
      status
    });
  }

  @Get(":id")
  @RequirePermissions("templates:read")
  getTemplateDetail(@Param("id") id: string) {
    return this.adminTemplatesService.getTemplateDetail(id);
  }

  @Get(":id/preview")
  @RequirePermissions("templates:read")
  getTemplatePreview(@Param("id") id: string, @Query("versionId") versionId?: string) {
    return this.adminTemplatesService.getTemplatePreview(id, versionId);
  }

  @Post()
  @RequirePermissions("templates:manage")
  createTemplate(@Body() payload: CreateTemplatePayload) {
    return this.adminTemplatesService.createTemplate(payload);
  }

  @Put(":id")
  @RequirePermissions("templates:manage")
  updateTemplate(@Param("id") id: string, @Body() payload: UpdateTemplatePayload) {
    return this.adminTemplatesService.updateTemplate(id, payload);
  }

  @Post("generate")
  @RequirePermissions("templates:manage")
  generateTemplate(@Body() payload: GenerateTemplatePayload) {
    return this.adminTemplatesService.generateTemplate(payload);
  }

  @Post(":id/regenerate")
  @RequirePermissions("templates:manage")
  regenerateTemplate(
    @Param("id") id: string,
    @Body() payload: RegenerateTemplatePayload
  ) {
    return this.adminTemplatesService.regenerateTemplate(id, payload);
  }

  @Post(":id/publish")
  @RequirePermissions("templates:manage")
  publishTemplate(@Param("id") id: string) {
    return this.adminTemplatesService.publishTemplate(id);
  }

  @Post(":id/offline")
  @RequirePermissions("templates:manage")
  offlineTemplate(@Param("id") id: string) {
    return this.adminTemplatesService.offlineTemplate(id);
  }

  @Post(":id/feature")
  @RequirePermissions("templates:manage")
  featureTemplate(@Param("id") id: string) {
    return this.adminTemplatesService.featureTemplate(id);
  }

  @Post(":id/unfeature")
  @RequirePermissions("templates:manage")
  unfeatureTemplate(@Param("id") id: string) {
    return this.adminTemplatesService.unfeatureTemplate(id);
  }

  @Delete(":id")
  @RequirePermissions("templates:manage")
  deleteTemplate(@Param("id") id: string) {
    return this.adminTemplatesService.deleteTemplate(id);
  }
}
