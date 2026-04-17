import {
  AdminTemplateCategoryCode,
  TemplateGenerateInput,
  TemplateGeneratedResult,
  TemplatePageBlueprint,
  TemplatePreviewFrame
} from "../admin-data/admin-data.types";

const categoryContentMap: Record<
  AdminTemplateCategoryCode,
  {
    categoryName: string;
    themeLabel: string;
    badgeText: string;
    summaryPrefix: string;
    descriptionPrefix: string;
    highlights: string[];
    scenes: string[];
    layouts: string[];
    decorations: string[];
    coverPhrases: string[];
    coverTones: string[];
    accentTones: string[];
  }
> = {
  graduation: {
    categoryName: "毕业纪念",
    themeLabel: "毕业纪念",
    badgeText: "老师寄语更多",
    summaryPrefix: "适合把毕业典礼、老师寄语和班级笑脸收在一起。",
    descriptionPrefix: "更适合毕业礼、舞台瞬间和老师送别的话，让整本纪念册先有仪式感，再慢慢翻到孩子们的笑脸。",
    highlights: ["毕业典礼", "老师寄语", "班级合照"],
    scenes: ["毕业礼", "班级合照", "老师合影"],
    layouts: ["cover-hero", "teacher-note", "smile-grid", "ceremony-strip", "class-finale"],
    decorations: ["星星", "花朵", "毕业帽", "叶片"],
    coverPhrases: ["把最后一个夏天的笑脸留在这里", "把老师的话和孩子的笑脸一起收进这本小书里"],
    coverTones: ["#F8E6A0", "#F8DDBA", "#F6E7C4"],
    accentTones: ["#7BC47F", "#F6A26E", "#8CC3F2"]
  },
  growth: {
    categoryName: "成长记录",
    themeLabel: "成长故事",
    badgeText: "像一本成长绘本",
    summaryPrefix: "适合把课堂、活动和慢慢长大的小表情讲成一个成长故事。",
    descriptionPrefix: "更适合记录幼儿园里的日常和活动，一页一页翻过去，像陪孩子重新走一遍长大的路。",
    highlights: ["日常课堂", "活动笑脸", "成长片段"],
    scenes: ["课堂日常", "活动记录", "成长写真"],
    layouts: ["cover-hero", "daily-story", "activity-duo", "meadow-grid", "growth-closing"],
    decorations: ["小花", "云朵", "小草", "小动物"],
    coverPhrases: ["把一点点长大的样子，都放进这本成长小书里", "把平常日子里的笑声，也认真收起来"],
    coverTones: ["#DFF2C4", "#E7F6D7", "#D7F0E1"],
    accentTones: ["#F5B37B", "#8BCED5", "#F3CA6B"]
  },
  classroom: {
    categoryName: "班级活动",
    themeLabel: "班级故事",
    badgeText: "热闹班级合辑",
    summaryPrefix: "适合把全班活动、春游故事和教室里的热闹时刻放在一起。",
    descriptionPrefix: "更适合照片比较多、想让更多孩子都出现在册子里的班级纪念册，翻页节奏会更热闹一些。",
    highlights: ["班级活动", "集体合照", "热闹教室"],
    scenes: ["班级活动", "春游故事", "节日合照"],
    layouts: ["cover-hero", "group-hero", "route-story", "smile-wall", "class-closing"],
    decorations: ["气球", "星星", "花朵", "小鸟"],
    coverPhrases: ["把全班一起长大的热闹日子都收进来", "把这段班级故事，做成一本会反复翻的小书"],
    coverTones: ["#DCEBFF", "#EAF3FF", "#E2F0E5"],
    accentTones: ["#F5A26C", "#7BC47F", "#A78CFF"]
  }
};

const pageTitlesByLayout: Record<string, string[]> = {
  "cover-hero": ["把今天的笑脸放在封面", "一起把回忆翻开"],
  "teacher-note": ["老师把爱写进来", "愿你带着今天的勇气继续长大"],
  "smile-grid": ["把笑脸都留住", "这一页装下好多开心"],
  "ceremony-strip": ["上台时刻也要留下来", "把掌声和拥抱都记下来"],
  "class-finale": ["把这段夏天认真收尾", "这一页留给我们一起的合照"],
  "daily-story": ["把平常日子也放进来", "每天的小事情都很值得"],
  "activity-duo": ["把今天的热闹分两页讲", "把两段好时光并排放在这里"],
  "meadow-grid": ["把一连串小表情排起来", "这一页留给好多可爱瞬间"],
  "growth-closing": ["把一点点长大的样子收起来", "翻到这里，也还是舍不得合上"],
  "group-hero": ["把班级气氛先摆上来", "这一页先给最热闹的集体照"],
  "route-story": ["把出发、玩耍和回程讲成一条线", "一路上的小故事都在这里"],
  "smile-wall": ["把更多孩子的笑脸都放进来", "这一页像一面会笑的班级墙"],
  "class-closing": ["把班级故事留在最后一页", "翻到这里，也还能想起教室里的笑声"]
};

function hashText(value: string) {
  return Array.from(value).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function pickByHash<T>(items: T[], seedText: string, offset = 0) {
  return items[(hashText(seedText) + offset) % items.length];
}

function buildPageBlueprints(input: TemplateGenerateInput, layouts: string[], decorations: string[]) {
  const pages: TemplatePageBlueprint[] = [];

  for (let index = 0; index < input.pageCount; index += 1) {
    const pageNo = index + 1;
    const section =
      pageNo === 1
        ? "cover"
        : pageNo === 2
          ? "opening"
          : pageNo === input.pageCount
            ? "closing"
            : "content";

    const layoutType =
      pageNo === 1
        ? "cover-hero"
        : pageNo === input.pageCount
          ? layouts[layouts.length - 1]
          : layouts[(pageNo - 2) % layouts.length];

    const titles = pageTitlesByLayout[layoutType] || ["把今天的回忆放进来"];
    const title = pickByHash(titles, `${input.themeTitle}-${pageNo}`);
    const decorativeElements = [
      decorations[(pageNo + 0) % decorations.length],
      decorations[(pageNo + 2) % decorations.length]
    ];

    pages.push({
      pageNo,
      section,
      layoutType,
      title,
      caption:
        section === "cover"
          ? pickByHash(
              categoryContentMap[input.categoryCode].coverPhrases,
              input.promptText,
              pageNo
            )
          : `围绕“${input.themeTitle}”继续往后讲，把更适合孩子和班级的回忆放进这一页。`,
      decorativeElements
    });
  }

  return pages;
}

export function buildTemplateGeneratedResult(
  input: TemplateGenerateInput,
  imagePool: string[]
): TemplateGeneratedResult {
  const categoryMeta = categoryContentMap[input.categoryCode];
  const pageBlueprints = buildPageBlueprints(
    input,
    categoryMeta.layouts,
    categoryMeta.decorations
  );
  const previewFrames: TemplatePreviewFrame[] = pageBlueprints
    .slice(0, Math.min(6, pageBlueprints.length))
    .map((page, index) => ({
      pageNo: page.pageNo,
      section: page.section,
      layoutType: page.layoutType,
      title: page.title,
      caption: page.caption,
      image: imagePool[index % imagePool.length]
    }));

  const coverTone = pickByHash(categoryMeta.coverTones, input.themeTitle);
  const accentTone = pickByHash(categoryMeta.accentTones, input.promptText, 1);

  return {
    categoryName: categoryMeta.categoryName,
    themeLabel: categoryMeta.themeLabel,
    badgeText: categoryMeta.badgeText,
    summary: `${categoryMeta.summaryPrefix} 当前主题会围绕“${input.themeTitle}”来组织内容。`,
    description: `${categoryMeta.descriptionPrefix} 本轮生成会重点突出：${input.promptText}。`,
    storyHighlights: categoryMeta.highlights,
    suitableScenes: categoryMeta.scenes,
    coverTone,
    accentTone,
    coverImage: imagePool[0],
    previewImages: imagePool.slice(0, Math.min(4, imagePool.length)),
    photoSuggestionText: `建议准备 ${input.minPhotos}-${input.maxPhotos} 张照片`,
    coverTitle: input.name,
    coverPhrase: pickByHash(categoryMeta.coverPhrases, input.promptText),
    moodLabel: categoryMeta.themeLabel,
    sceneKeywords: categoryMeta.scenes,
    sectionPlan: [
      "封面页先承接主题和主视觉",
      "开场页讲故事起点",
      "中段内容页按主题排版",
      "结尾页做收束和纪念感"
    ],
    pageBlueprints,
    previewFrames
  };
}
