import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { successResponse } from "../common/interfaces/api-response.interface";
import { AdminDataService } from "../admin-data/admin-data.service";
import { AdminWorkRecord } from "../admin-data/admin-data.types";
import { AdminWorkDetail, AdminWorkListItem } from "./admin-works.types";

function workStatusText(status: AdminWorkRecord["status"]) {
  if (status === "draft") {
    return "继续补充";
  }
  if (status === "ready") {
    return "待下单";
  }
  return "已下单";
}

@Injectable()
export class AdminWorksService {
  constructor(private readonly adminDataService: AdminDataService) {}

  listWorks(query: { keyword?: string; status?: string; templateId?: string }) {
    const safeStatus = this.normalizeStatus(query.status);
    const keyword = String(query.keyword || "").trim().toLowerCase();
    const templateId = String(query.templateId || "").trim();
    const snapshot = this.adminDataService.read();

    const items = snapshot.works
      .filter((work) => {
        if (safeStatus && work.status !== safeStatus) {
          return false;
        }

        if (templateId && templateId !== "all" && work.templateId !== templateId) {
          return false;
        }

        if (!keyword) {
          return true;
        }

        return [
          work.title,
          work.templateName,
          work.parentName,
          work.kindergartenInfo,
          work.childName
        ].some((field) => field.toLowerCase().includes(keyword));
      })
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .map<AdminWorkListItem>((work) => ({
        id: work.id,
        title: work.title,
        templateId: work.templateId,
        templateName: work.templateName,
        status: work.status,
        statusText: workStatusText(work.status),
        parentName: work.parentName,
        kindergartenInfo: work.kindergartenInfo,
        photoCount: work.photoCount,
        pageCount: work.pageCount,
        previewPageCount: work.previewPageCount,
        coverImage: work.coverImage,
        previewSummary: work.previewSummary,
        updatedAt: work.updatedAt
      }));

    return successResponse(items);
  }

  getWorkDetail(workId: string) {
    const snapshot = this.adminDataService.read();
    const work = snapshot.works.find((item) => item.id === workId);

    if (!work) {
      throw new NotFoundException({
        code: "ADMIN_WORK_NOT_FOUND",
        message: "作品不存在"
      });
    }

    const detail: AdminWorkDetail = {
      ...work,
      statusText: workStatusText(work.status),
      detailSections: [
        {
          label: "所属模板",
          value: `${work.templateName} · ${work.pageCount} 页`
        },
        {
          label: "作品状态",
          value: workStatusText(work.status)
        },
        {
          label: "用户信息",
          value: `${work.parentName} · ${work.kindergartenInfo}`
        },
        {
          label: "封面信息",
          value: `${work.coverTitle} / ${work.coverPhrase}`
        }
      ],
      previewEntrance: {
        title: "作品预览入口",
        description: "当前只开放后台回看入口，便于运营确认作品结构和模板适配情况。",
        frames: work.previewFrames
      }
    };

    return successResponse(detail);
  }

  private normalizeStatus(status?: string) {
    if (!status || status === "all") {
      return null;
    }

    if (!["draft", "ready", "ordered"].includes(status)) {
      throw new BadRequestException({
        code: "ADMIN_WORK_STATUS_INVALID",
        message: "作品状态不存在"
      });
    }

    return status as AdminWorkRecord["status"];
  }
}
