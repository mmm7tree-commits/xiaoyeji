import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as path from "node:path";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true
  });

  const host = process.env.API_SERVER_HOST || "127.0.0.1";
  const port = Number(process.env.API_SERVER_PORT || 3100);
  const prefix = process.env.API_SERVER_PREFIX || "api";
  const storageRoot = path.resolve(
    process.cwd(),
    process.env.STORAGE_LOCAL_ROOT || "./uploads"
  );

  app.setGlobalPrefix(prefix);
  app.useStaticAssets(storageRoot, {
    prefix: "/storage"
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port, host);
  process.stdout.write(`小叶记 API 已启动: http://${host}:${port}/${prefix}/health\n`);
}

bootstrap();
