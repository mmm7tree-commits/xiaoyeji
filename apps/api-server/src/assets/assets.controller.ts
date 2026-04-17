import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { successResponse } from "../common/interfaces/api-response.interface";
import { AssetsService } from "./assets.service";

@Controller("assets")
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post("work-photos")
  @UseInterceptors(FileInterceptor("file"))
  uploadWorkPhoto(
    @UploadedFile() file: { originalname?: string; mimetype?: string; size?: number; buffer?: Buffer },
    @Body("sourceLocalPath") sourceLocalPath?: string,
    @Body("sourceTempPath") sourceTempPath?: string
  ) {
    return successResponse(
      this.assetsService.saveWorkPhoto(file, {
        sourceLocalPath,
        sourceTempPath
      })
    );
  }
}
