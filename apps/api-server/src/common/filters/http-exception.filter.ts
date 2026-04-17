import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { ApiErrorResponse } from "../interfaces/api-response.interface";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<{ url?: string }>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const rawResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : null;

    const message =
      typeof rawResponse === "object" &&
      rawResponse !== null &&
      "message" in rawResponse
        ? Array.isArray((rawResponse as { message: unknown }).message)
          ? ((rawResponse as { message: unknown[] }).message[0] as string)
          : String((rawResponse as { message: unknown }).message)
        : exception instanceof Error
          ? exception.message
          : "服务异常，请稍后重试";

    const code =
      typeof rawResponse === "object" &&
      rawResponse !== null &&
      "code" in rawResponse
        ? String((rawResponse as { code: unknown }).code)
        : HttpStatus[status] || "INTERNAL_SERVER_ERROR";

    const payload: ApiErrorResponse = {
      ok: false,
      code,
      message,
      path: request.url || "",
      timestamp: new Date().toISOString()
    };

    response.status(status).json(payload);
  }
}
