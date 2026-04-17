import { Controller, Get, Param, Query } from "@nestjs/common";
import { TemplatesService } from "./templates.service";

@Controller("templates")
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get("featured")
  getFeaturedTemplate() {
    return this.templatesService.getFeaturedTemplate();
  }

  @Get("categories")
  getTemplateCategories() {
    return this.templatesService.getTemplateCategories();
  }

  @Get()
  getTemplateList(@Query("categoryCode") categoryCode?: string) {
    return this.templatesService.getTemplateList(categoryCode);
  }

  @Get(":id")
  getTemplateDetail(@Param("id") id: string) {
    return this.templatesService.getTemplateDetail(id);
  }
}
