"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "server-data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const UPLOAD_DIR = path.join(ROOT, "uploads");
const PORT = Number(process.env.PORT || 8877);
const HOST = process.env.HOST || "127.0.0.1";
const MAX_BODY_SIZE = 50 * 1024 * 1024;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

const DEMO_USER_ID = "demo-parent";

const TEMPLATE_SEED = [
  {
    id: "little-garden",
    title: "小花园毕业册",
    category: "graduation",
    price: 129,
    pages: 24,
    photoRange: "8-40张",
    badgeLabel: "花园毕业册",
    note: "适合毕业礼、老师寄语和孩子单人笑脸都想多放一点的纪念册。",
    featuredDesc: "封面偏花园留白，内页会穿插老师寄语页、笑脸页和草地大图页。",
    status: "online",
    updatedAt: Date.now(),
    coverImage: "/assets/h5-template-covers/little-garden-cover.jpg"
  },
  {
    id: "cloud-growth",
    title: "云朵成长册",
    category: "growth",
    price: 119,
    pages: 20,
    photoRange: "6-28张",
    badgeLabel: "成长绘本册",
    note: "更像一本幼儿园绘本，适合春游、手工课、节日活动和日常成长记录。",
    featuredDesc: "画面更安静，章节像小故事一样往后翻，适合做温柔的成长册。",
    status: "online",
    updatedAt: Date.now(),
    coverImage: "/assets/h5-template-covers/cloud-growth-cover.jpg"
  },
  {
    id: "sticker-play",
    title: "贴贴游戏册",
    category: "class",
    price: 139,
    pages: 24,
    photoRange: "12-48张",
    badgeLabel: "贴贴活动册",
    note: "拼贴和贴贴感更强，适合运动会、生日会、园游会和热闹抓拍特别多的班级册。",
    featuredDesc: "照片越多越好看，适合把游戏、互动和开心表情排成热闹的一本。",
    status: "online",
    updatedAt: Date.now(),
    coverImage: "/assets/h5-template-covers/sticker-play-cover.jpg"
  },
  {
    id: "sunny-memory",
    title: "小太阳毕业册",
    category: "graduation",
    price: 129,
    pages: 20,
    photoRange: "8-32张",
    badgeLabel: "毕业礼纪念册",
    note: "仪式感更强，适合毕业典礼、节目表演、上台领奖和大合影更多的毕业册。",
    featuredDesc: "整本更像毕业礼舞台相册，会把大场面和代表性照片放得更突出。",
    status: "online",
    updatedAt: Date.now(),
    coverImage: "/assets/h5-template-covers/sunny-memory-cover.jpg"
  },
  {
    id: "storybook-trip",
    title: "春游故事册",
    category: "growth",
    price: 126,
    pages: 28,
    photoRange: "10-36张",
    badgeLabel: "春游故事册",
    note: "更适合春游、秋游和园外活动，会把路线感、故事感和前后顺序放得更明显。",
    featuredDesc: "整本像一趟小旅行，适合从出发、玩耍到回园完整留下一次活动。",
    status: "online",
    updatedAt: Date.now(),
    coverImage: "/assets/h5-template-covers/storybook-trip-cover.jpg"
  },
  {
    id: "class-yearbook",
    title: "班级欢乐册",
    category: "class",
    price: 132,
    pages: 28,
    photoRange: "16-60张",
    badgeLabel: "班级欢乐册",
    note: "更像班级小年鉴，适合想让更多孩子都出现在册子里、笑脸尽量放全的班级册。",
    featuredDesc: "笑脸墙和多图页会更多，适合班级统一做一本热热闹闹的合集。",
    status: "online",
    updatedAt: Date.now(),
    coverImage: "/assets/h5-template-covers/class-yearbook-cover.jpg"
  }
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function nextId(prefix) {
  return prefix + "-" + Date.now() + "-" + crypto.randomBytes(4).toString("hex");
}

function getDefaultDb() {
  const now = Date.now();
  const workOneId = nextId("work");
  const workTwoId = nextId("work");
  const orderOneId = nextId("order");
  const orderTwoId = nextId("order");
  const addressId = nextId("addr");

  return {
    session: {
      currentUserId: DEMO_USER_ID
    },
    metrics: {
      visitCount: 86,
      registrationCount: 28,
      shareCount: 12
    },
    users: [
      {
        id: DEMO_USER_ID,
        nickname: "王妈妈",
        phone: "13812345678",
        role: "parent"
      }
    ],
    addresses: [
      {
        id: addressId,
        userId: DEMO_USER_ID,
        receiver: "王妈妈",
        phone: "13812345678",
        region: "上海市 浦东新区",
        detail: "晨曦路 18 号 2 单元 301 室",
        isDefault: true,
        updatedAt: now
      }
    ],
    templates: TEMPLATE_SEED.slice(),
    works: [
      {
        id: workOneId,
        userId: DEMO_USER_ID,
        title: "小一班毕业啦",
        templateId: "little-garden",
        templateName: "小花园毕业册",
        photoCount: 18,
        previewSummary: "24页预览 · 老师寄语多一点",
        updateTime: now - 3 * 24 * 60 * 60 * 1000,
        status: "generated",
        coverImage: "/assets/h5-template-covers/little-garden-cover.jpg",
        photos: [
          { id: nextId("photo"), url: "/assets/h5-template-covers/little-garden-cover.jpg", name: "花园封面.jpg", orientation: "竖图" },
          { id: nextId("photo"), url: "/assets/h5-template-previews/little-garden-preview-1.jpg", name: "草地大图.jpg", orientation: "横图" }
        ],
        selectedPages: 24,
        layoutPreference: "balanced",
        coverTitle: "小一班毕业啦",
        coverClass: "向日葵幼儿园 · 小一班",
        coverSubtitle: "把最后一个夏天的笑脸留在这里",
        chapterText: "一起长大的日子\n老师寄语\n把笑脸都留住"
      },
      {
        id: workTwoId,
        userId: DEMO_USER_ID,
        title: "春游故事册",
        templateId: "storybook-trip",
        templateName: "春游故事册",
        photoCount: 26,
        previewSummary: "28页预览 · 按春游顺序往后翻",
        updateTime: now - 24 * 60 * 60 * 1000,
        status: "ordered",
        coverImage: "/assets/h5-template-covers/storybook-trip-cover.jpg",
        photos: [
          { id: nextId("photo"), url: "/assets/h5-template-covers/storybook-trip-cover.jpg", name: "出发集合.jpg", orientation: "竖图" }
        ],
        selectedPages: 28,
        layoutPreference: "rich",
        coverTitle: "春游故事册",
        coverClass: "向日葵幼儿园 · 中一班",
        coverSubtitle: "把一路上的笑声和小发现都记下来",
        chapterText: "一起出发去玩吧\n沿路的小发现\n回园时也舍不得结束"
      }
    ],
    orders: [
      {
        id: orderOneId,
        userId: DEMO_USER_ID,
        workId: workTwoId,
        albumTitle: "春游故事册",
        templateId: "storybook-trip",
        templateName: "春游故事册",
        quantity: 2,
        pages: 28,
        amount: 252,
        status: "awaiting_ship",
        addressId: addressId,
        addressText: "王妈妈 13812345678 上海市 浦东新区 晨曦路 18 号 2 单元 301 室",
        logisticsNo: "",
        logisticsCompany: "",
        createdAt: now - 20 * 60 * 60 * 1000,
        paidAt: now - 19 * 60 * 60 * 1000,
        shippedAt: 0,
        shareToken: "",
        note: "双本留念"
      },
      {
        id: orderTwoId,
        userId: DEMO_USER_ID,
        workId: workOneId,
        albumTitle: "小一班毕业啦",
        templateId: "little-garden",
        templateName: "小花园毕业册",
        quantity: 1,
        pages: 24,
        amount: 129,
        status: "shipped",
        addressId: addressId,
        addressText: "王妈妈 13812345678 上海市 浦东新区 晨曦路 18 号 2 单元 301 室",
        logisticsNo: "SF20260408001",
        logisticsCompany: "顺丰",
        createdAt: now - 5 * 24 * 60 * 60 * 1000,
        paidAt: now - 4 * 24 * 60 * 60 * 1000,
        shippedAt: now - 2 * 24 * 60 * 60 * 1000,
        shareToken: "",
        note: ""
      }
    ],
    shares: []
  };
}

function ensureDb() {
  ensureDir(DATA_DIR);
  ensureDir(UPLOAD_DIR);
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(getDefaultDb(), null, 2), "utf8");
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, message) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8"
  });
  res.end(message);
}

function sendFile(res, filePath, extraHeaders = {}) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  res.writeHead(200, Object.assign({
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  }, extraHeaders));
  fs.createReadStream(filePath).pipe(res);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_SIZE) {
        reject(new Error("请求体过大"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (!chunks.length) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        reject(new Error("请求体不是合法 JSON"));
      }
    });
    req.on("error", reject);
  });
}

function getCurrentUser(db) {
  return db.users.find((item) => item.id === db.session.currentUserId) || null;
}

function formatDateTime(timestamp) {
  if (!timestamp) {
    return "";
  }
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return month + "月" + day + "日 " + hour + ":" + minute;
}

function getTemplateMap(db) {
  return new Map(db.templates.map((item) => [item.id, item]));
}

function getStatusLabel(status) {
  if (status === "pending_payment") {
    return "待支付";
  }
  if (status === "awaiting_ship") {
    return "待发货";
  }
  if (status === "shipped") {
    return "已发货";
  }
  return "处理中";
}

function buildLogisticsText(order) {
  if (order.status === "pending_payment") {
    return "待支付后开始制作";
  }
  if (order.status === "awaiting_ship") {
    return "已支付，预计 48 小时内安排印制";
  }
  return (order.logisticsCompany || "物流") + " " + (order.logisticsNo || "待补充单号");
}

function normalizeAddress(address) {
  return [
    address.receiver,
    address.phone,
    address.region,
    address.detail
  ].filter(Boolean).join(" ");
}

function enrichOrder(order, db) {
  return Object.assign({}, order, {
    statusLabel: getStatusLabel(order.status),
    meta: order.templateName + " · ¥" + order.amount + " · " + order.pages + "页 · " + order.quantity + " 本",
    timeText: "下单于 " + formatDateTime(order.createdAt),
    logisticsText: buildLogisticsText(order)
  });
}

function buildSummary(db) {
  const now = Date.now();
  const dayAgo = now - 24 * 60 * 60 * 1000;
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

  function countByTime(items, key, startTime) {
    return items.filter((item) => item[key] >= startTime).length;
  }

  return {
    day: {
      registrations: db.metrics.registrationCount,
      visits: db.metrics.visitCount,
      works: countByTime(db.works, "updateTime", dayAgo),
      orders: countByTime(db.orders, "createdAt", dayAgo),
      paidOrders: db.orders.filter((item) => item.status !== "pending_payment" && item.createdAt >= dayAgo).length,
      shares: countByTime(db.shares, "createdAt", dayAgo)
    },
    week: {
      registrations: db.metrics.registrationCount + 16,
      visits: db.metrics.visitCount + 142,
      works: countByTime(db.works, "updateTime", weekAgo),
      orders: countByTime(db.orders, "createdAt", weekAgo),
      paidOrders: db.orders.filter((item) => item.status !== "pending_payment" && item.createdAt >= weekAgo).length,
      shares: countByTime(db.shares, "createdAt", weekAgo)
    },
    month: {
      registrations: db.metrics.registrationCount + 54,
      visits: db.metrics.visitCount + 530,
      works: countByTime(db.works, "updateTime", monthAgo),
      orders: countByTime(db.orders, "createdAt", monthAgo),
      paidOrders: db.orders.filter((item) => item.status !== "pending_payment" && item.createdAt >= monthAgo).length,
      shares: countByTime(db.shares, "createdAt", monthAgo)
    }
  };
}

function buildBootstrap(db, reqUrl) {
  const currentUser = getCurrentUser(db);
  const templates = db.templates
    .filter((item) => item.status !== "archived")
    .sort((a, b) => a.title.localeCompare(b.title, "zh-Hans-CN"));
  const userAddresses = currentUser ? db.addresses.filter((item) => item.userId === currentUser.id) : [];
  const userWorks = currentUser ? db.works
    .filter((item) => item.userId === currentUser.id)
    .sort((a, b) => b.updateTime - a.updateTime) : [];
  const userOrders = currentUser ? db.orders
    .filter((item) => item.userId === currentUser.id)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((item) => enrichOrder(item, db)) : [];

  return {
    currentUser,
    templates,
    addresses: userAddresses,
    works: userWorks,
    orders: userOrders,
    shareBaseUrl: reqUrl.origin + "/share/"
  };
}

function getRequestPath(requestUrl) {
  return decodeURIComponent(requestUrl.pathname);
}

function guessExtFromMime(mime) {
  if (!mime) {
    return ".jpg";
  }
  if (mime.indexOf("png") >= 0) {
    return ".png";
  }
  if (mime.indexOf("webp") >= 0) {
    return ".webp";
  }
  if (mime.indexOf("gif") >= 0) {
    return ".gif";
  }
  return ".jpg";
}

function saveUpload(dataUrl, originalName) {
  const matched = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!matched) {
    throw new Error("图片数据格式不正确");
  }
  const mime = matched[1];
  const buffer = Buffer.from(matched[2], "base64");
  const ext = path.extname(originalName || "") || guessExtFromMime(mime);
  const fileName = nextId("upload") + ext.toLowerCase();
  const filePath = path.join(UPLOAD_DIR, fileName);
  fs.writeFileSync(filePath, buffer);
  return "/uploads/" + fileName;
}

function sanitizeTemplatePayload(input, existing) {
  const base = existing || {};
  return {
    id: base.id || String(input.id || "").trim() || nextId("tpl"),
    title: String(input.title || base.title || "").trim(),
    category: String(input.category || base.category || "growth").trim(),
    price: Number(input.price != null ? input.price : base.price || 0),
    pages: Number(input.pages != null ? input.pages : base.pages || 24),
    photoRange: String(input.photoRange || base.photoRange || "").trim(),
    badgeLabel: String(input.badgeLabel || base.badgeLabel || "").trim(),
    note: String(input.note || base.note || "").trim(),
    featuredDesc: String(input.featuredDesc || base.featuredDesc || "").trim(),
    status: String(input.status || base.status || "online").trim(),
    updatedAt: Date.now(),
    coverImage: String(input.coverImage || base.coverImage || "").trim()
  };
}

function sanitizeAddressPayload(input, userId, existing) {
  return {
    id: existing ? existing.id : nextId("addr"),
    userId: userId,
    receiver: String(input.receiver || "").trim(),
    phone: String(input.phone || "").trim(),
    region: String(input.region || "").trim(),
    detail: String(input.detail || "").trim(),
    isDefault: Boolean(input.isDefault),
    updatedAt: Date.now()
  };
}

function sanitizeWorkPayload(input, userId, existing) {
  const photos = Array.isArray(input.photos) ? input.photos.map((item) => ({
    id: item.id || nextId("photo"),
    url: String(item.url || "").trim(),
    name: String(item.name || "").trim(),
    orientation: String(item.orientation || "").trim()
  })) : (existing ? existing.photos : []);

  return {
    id: existing ? existing.id : String(input.id || nextId("work")).trim(),
    userId: userId,
    title: String(input.title || input.coverTitle || existing && existing.title || "").trim(),
    templateId: String(input.templateId || existing && existing.templateId || "").trim(),
    templateName: String(input.templateName || existing && existing.templateName || "").trim(),
    photoCount: photos.length,
    previewSummary: String(input.previewSummary || existing && existing.previewSummary || "").trim(),
    updateTime: Date.now(),
    status: String(input.status || existing && existing.status || "draft").trim(),
    coverImage: String(input.coverImage || existing && existing.coverImage || (photos[0] && photos[0].url) || "").trim(),
    photos: photos,
    selectedPages: Number(input.selectedPages != null ? input.selectedPages : existing && existing.selectedPages || 24),
    generatedPages: Number(input.generatedPages != null ? input.generatedPages : existing && existing.generatedPages || input.selectedPages || 24),
    layoutPreference: String(input.layoutPreference || existing && existing.layoutPreference || "balanced").trim(),
    coverTitle: String(input.coverTitle || existing && existing.coverTitle || "").trim(),
    coverClass: String(input.coverClass || existing && existing.coverClass || "").trim(),
    coverSubtitle: String(input.coverSubtitle || existing && existing.coverSubtitle || "").trim(),
    chapterText: String(input.chapterText || existing && existing.chapterText || "").trim()
  };
}

function writeHtmlPage(res, html, fileName) {
  sendFileBuffer(res, Buffer.from(html, "utf8"), "text/html; charset=utf-8", fileName ? {
    "Content-Disposition": "attachment; filename=\"" + fileName + "\""
  } : {});
}

function sendFileBuffer(res, buffer, contentType, extraHeaders = {}) {
  res.writeHead(200, Object.assign({
    "Content-Type": contentType,
    "Content-Length": buffer.length,
    "Cache-Control": "no-store"
  }, extraHeaders));
  res.end(buffer);
}

function buildPrintHtml(order, work) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <title>${order.albumTitle} 打印页</title>
  <style>
    body{font-family:"PingFang SC","Hiragino Sans GB",sans-serif;margin:32px;color:#2d3929}
    h1{margin:0 0 12px;font-size:28px}
    .meta,.block{margin-top:16px;padding:16px;border:1px solid #d9e9d2;border-radius:14px;background:#fbfef8}
    .label{font-size:12px;color:#6a7a65;margin-bottom:6px}
    .row{display:flex;gap:16px;flex-wrap:wrap}
    .item{flex:1 1 220px}
    .thumbs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:12px}
    img{width:100%;height:180px;object-fit:cover;border-radius:12px;border:1px solid #dfe9d9}
  </style>
</head>
<body>
  <h1>${order.albumTitle}</h1>
  <div class="meta">
    <div class="row">
      <div class="item"><div class="label">订单号</div><div>${order.id}</div></div>
      <div class="item"><div class="label">模板</div><div>${order.templateName}</div></div>
      <div class="item"><div class="label">规格</div><div>${order.pages}页 · ${order.quantity} 本</div></div>
      <div class="item"><div class="label">金额</div><div>¥${order.amount}</div></div>
      <div class="item"><div class="label">收货信息</div><div>${order.addressText}</div></div>
      <div class="item"><div class="label">下单时间</div><div>${formatDateTime(order.createdAt)}</div></div>
    </div>
  </div>
  <div class="block">
    <div class="label">印制说明</div>
    <div>标题：${work.coverTitle || work.title || order.albumTitle}</div>
    <div>封面副标题：${work.coverSubtitle || "无"}</div>
    <div>班级信息：${work.coverClass || "无"}</div>
    <div>章节内容：</div>
    <pre>${(work.chapterText || "").replace(/</g, "&lt;")}</pre>
  </div>
  <div class="block">
    <div class="label">预览图片</div>
    <div class="thumbs">
      ${(work.photos || []).slice(0, 6).map((photo) => `<img src="${photo.url}" alt="" />`).join("")}
    </div>
  </div>
</body>
</html>`;
}

function buildBatchPrintHtml(orders, db) {
  function getBodyInner(html) {
    const parts = html.split("<body>");
    if (parts.length < 2) {
      return html;
    }
    return parts[1].split("</body>")[0];
  }

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <title>小页记批量打印页</title>
  <style>
    body{font-family:"PingFang SC","Hiragino Sans GB",sans-serif;margin:24px;color:#2d3929}
    .page{page-break-after:always;margin-bottom:32px}
    .page:last-child{page-break-after:auto}
  </style>
</head>
<body>
${orders.map((order) => {
  const work = db.works.find((item) => item.id === order.workId) || {};
  return `<section class="page">${getBodyInner(buildPrintHtml(order, work))}</section>`;
}).join("")}
</body>
</html>`;
}

function getShareHtml(share, work) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${work.title} · 小页记分享</title>
  <style>
    body{margin:0;font-family:"PingFang SC","Hiragino Sans GB",sans-serif;background:linear-gradient(180deg,#f6fcf2,#fff7ed);color:#30402b}
    .shell{max-width:420px;margin:0 auto;padding:18px}
    .card{background:#fffdf8;border:1px solid rgba(110,154,97,.16);border-radius:22px;padding:18px;box-shadow:0 16px 36px rgba(106,151,95,.12)}
    .tag{display:inline-flex;padding:8px 12px;border-radius:999px;background:#edf8e8;color:#5bb55d;font-weight:700;font-size:13px}
    h1{font-size:28px;line-height:1.24;margin:14px 0 10px}
    p{color:#73806f;line-height:1.7;font-size:15px}
    .cover{margin-top:14px;border-radius:18px;overflow:hidden}
    .cover img{display:block;width:100%;height:260px;object-fit:cover}
    .foot{margin-top:16px;display:flex;gap:10px;align-items:center}
    .pill{display:inline-flex;padding:8px 12px;border-radius:999px;background:#fff0e4;color:#e67a48;font-weight:700;font-size:13px}
  </style>
</head>
<body>
  <div class="shell">
    <div class="card">
      <span class="tag">小页记分享</span>
      <h1>${work.title}</h1>
      <p>${share.message}</p>
      <div class="cover"><img src="${work.coverImage}" alt="" /></div>
      <div class="foot">
        <span class="pill">${work.previewSummary}</span>
        <span class="pill">${work.photoCount} 张照片</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function handleApi(req, res, requestUrl) {
  const pathname = getRequestPath(requestUrl);
  if (req.method === "OPTIONS") {
    sendJson(res, 200, { ok: true });
    return;
  }

  try {
    const db = readDb();
    const currentUser = getCurrentUser(db);

    if (req.method === "GET" && pathname === "/api/bootstrap") {
      db.metrics.visitCount += 1;
      writeDb(db);
      sendJson(res, 200, { ok: true, data: buildBootstrap(db, requestUrl) });
      return;
    }

    if (req.method === "POST" && pathname === "/api/login") {
      db.session.currentUserId = DEMO_USER_ID;
      db.metrics.registrationCount += 1;
      writeDb(db);
      sendJson(res, 200, { ok: true, data: { currentUser: getCurrentUser(db) } });
      return;
    }

    if (req.method === "POST" && pathname === "/api/logout") {
      db.session.currentUserId = "";
      writeDb(db);
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === "POST" && pathname === "/api/uploads") {
      parseBody(req).then((body) => {
        const url = saveUpload(body.dataUrl, body.name);
        sendJson(res, 200, {
          ok: true,
          data: {
            id: nextId("photo"),
            url: url,
            name: String(body.name || "").trim()
          }
        });
      }).catch((error) => {
        sendJson(res, 400, { ok: false, message: error.message });
      });
      return;
    }

    if (req.method === "GET" && pathname === "/api/addresses") {
      const addresses = currentUser ? db.addresses.filter((item) => item.userId === currentUser.id) : [];
      sendJson(res, 200, { ok: true, data: addresses });
      return;
    }

    if (req.method === "POST" && pathname === "/api/addresses") {
      parseBody(req).then((body) => {
        if (!currentUser) {
          sendJson(res, 401, { ok: false, message: "请先登录" });
          return;
        }

        const existing = body.id ? db.addresses.find((item) => item.id === body.id && item.userId === currentUser.id) : null;
        const nextAddress = sanitizeAddressPayload(body, currentUser.id, existing);
        if (nextAddress.isDefault) {
          db.addresses.forEach((item) => {
            if (item.userId === currentUser.id) {
              item.isDefault = false;
            }
          });
        }
        if (!db.addresses.some((item) => item.userId === currentUser.id)) {
          nextAddress.isDefault = true;
        }
        if (existing) {
          const index = db.addresses.findIndex((item) => item.id === existing.id);
          db.addresses.splice(index, 1, nextAddress);
        } else {
          db.addresses.unshift(nextAddress);
        }
        writeDb(db);
        sendJson(res, 200, { ok: true, data: nextAddress });
      }).catch((error) => sendJson(res, 400, { ok: false, message: error.message }));
      return;
    }

    if (req.method === "DELETE" && pathname.startsWith("/api/addresses/")) {
      if (!currentUser) {
        sendJson(res, 401, { ok: false, message: "请先登录" });
        return;
      }
      const id = pathname.split("/").pop();
      const nextAddresses = db.addresses.filter((item) => !(item.id === id && item.userId === currentUser.id));
      db.addresses = nextAddresses;
      const userAddresses = db.addresses.filter((item) => item.userId === currentUser.id);
      if (userAddresses.length && !userAddresses.some((item) => item.isDefault)) {
        userAddresses[0].isDefault = true;
      }
      writeDb(db);
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === "GET" && pathname === "/api/works") {
      const works = currentUser ? db.works.filter((item) => item.userId === currentUser.id).sort((a, b) => b.updateTime - a.updateTime) : [];
      sendJson(res, 200, { ok: true, data: works });
      return;
    }

    if (req.method === "POST" && pathname === "/api/works") {
      parseBody(req).then((body) => {
        if (!currentUser) {
          sendJson(res, 401, { ok: false, message: "请先登录" });
          return;
        }
        const existing = body.id ? db.works.find((item) => item.id === body.id && item.userId === currentUser.id) : null;
        const nextWork = sanitizeWorkPayload(body, currentUser.id, existing);
        if (existing) {
          const index = db.works.findIndex((item) => item.id === existing.id);
          db.works.splice(index, 1, nextWork);
        } else {
          db.works.unshift(nextWork);
        }
        writeDb(db);
        sendJson(res, 200, { ok: true, data: nextWork });
      }).catch((error) => sendJson(res, 400, { ok: false, message: error.message }));
      return;
    }

    if (req.method === "DELETE" && pathname.startsWith("/api/works/")) {
      if (!currentUser) {
        sendJson(res, 401, { ok: false, message: "请先登录" });
        return;
      }
      const id = pathname.split("/").pop();
      db.works = db.works.filter((item) => !(item.id === id && item.userId === currentUser.id));
      db.orders = db.orders.filter((item) => !(item.workId === id && item.userId === currentUser.id));
      writeDb(db);
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === "GET" && pathname === "/api/orders") {
      const orders = currentUser ? db.orders
        .filter((item) => item.userId === currentUser.id)
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((item) => enrichOrder(item, db)) : [];
      sendJson(res, 200, { ok: true, data: orders });
      return;
    }

    if (req.method === "GET" && pathname.startsWith("/api/orders/")) {
      if (!currentUser) {
        sendJson(res, 401, { ok: false, message: "请先登录" });
        return;
      }
      const id = pathname.split("/").pop();
      const order = db.orders.find((item) => item.id === id && item.userId === currentUser.id);
      if (!order) {
        sendJson(res, 404, { ok: false, message: "订单不存在" });
        return;
      }
      sendJson(res, 200, { ok: true, data: enrichOrder(order, db) });
      return;
    }

    if (req.method === "POST" && pathname === "/api/orders") {
      parseBody(req).then((body) => {
        if (!currentUser) {
          sendJson(res, 401, { ok: false, message: "请先登录" });
          return;
        }
        const work = db.works.find((item) => item.id === body.workId && item.userId === currentUser.id);
        if (!work) {
          sendJson(res, 404, { ok: false, message: "作品不存在" });
          return;
        }
        const templateMap = getTemplateMap(db);
        const template = templateMap.get(work.templateId);
        const address = db.addresses.find((item) => item.id === body.addressId && item.userId === currentUser.id);
        if (!address) {
          sendJson(res, 400, { ok: false, message: "请先选择收货地址" });
          return;
        }
        const quantity = Math.max(1, Math.min(9, Number(body.quantity || 1)));
        const order = {
          id: nextId("order"),
          userId: currentUser.id,
          workId: work.id,
          albumTitle: work.title,
          templateId: work.templateId,
          templateName: template ? template.title : work.templateName,
          quantity: quantity,
          pages: work.generatedPages || work.selectedPages,
          amount: (template ? template.price : 0) * quantity,
          status: "pending_payment",
          addressId: address.id,
          addressText: normalizeAddress(address),
          logisticsNo: "",
          logisticsCompany: "",
          createdAt: Date.now(),
          paidAt: 0,
          shippedAt: 0,
          shareToken: "",
          note: String(body.note || "").trim()
        };
        db.orders.unshift(order);
        const workIndex = db.works.findIndex((item) => item.id === work.id);
        if (workIndex >= 0) {
          db.works[workIndex].status = "ordered";
          db.works[workIndex].updateTime = Date.now();
        }
        writeDb(db);
        sendJson(res, 200, { ok: true, data: enrichOrder(order, db) });
      }).catch((error) => sendJson(res, 400, { ok: false, message: error.message }));
      return;
    }

    if (req.method === "POST" && pathname.endsWith("/pay") && pathname.startsWith("/api/orders/")) {
      parseBody(req).then(() => {
        if (!currentUser) {
          sendJson(res, 401, { ok: false, message: "请先登录" });
          return;
        }
        const orderId = pathname.split("/")[3];
        const orderIndex = db.orders.findIndex((item) => item.id === orderId && item.userId === currentUser.id);
        if (orderIndex < 0) {
          sendJson(res, 404, { ok: false, message: "订单不存在" });
          return;
        }
        db.orders[orderIndex].status = "awaiting_ship";
        db.orders[orderIndex].paidAt = Date.now();
        writeDb(db);
        sendJson(res, 200, { ok: true, data: enrichOrder(db.orders[orderIndex], db) });
      }).catch((error) => sendJson(res, 400, { ok: false, message: error.message }));
      return;
    }

    if (req.method === "POST" && pathname === "/api/shares") {
      parseBody(req).then((body) => {
        if (!currentUser) {
          sendJson(res, 401, { ok: false, message: "请先登录" });
          return;
        }
        const work = db.works.find((item) => item.id === body.workId && item.userId === currentUser.id);
        if (!work) {
          sendJson(res, 404, { ok: false, message: "作品不存在" });
          return;
        }
        const token = crypto.randomBytes(6).toString("hex");
        const share = {
          id: nextId("share"),
          token: token,
          workId: work.id,
          userId: currentUser.id,
          createdAt: Date.now(),
          message: String(body.message || "我正在用小页记做一本幼儿园成长纪念册，帮我看看这套效果怎么样。").trim()
        };
        db.shares.unshift(share);
        db.metrics.shareCount += 1;
        writeDb(db);
        sendJson(res, 200, {
          ok: true,
          data: {
            id: share.id,
            token: token,
            message: share.message,
            shareUrl: requestUrl.origin + "/share/" + token
          }
        });
      }).catch((error) => sendJson(res, 400, { ok: false, message: error.message }));
      return;
    }

    if (req.method === "GET" && pathname === "/api/admin/summary") {
      sendJson(res, 200, {
        ok: true,
        data: {
          periods: buildSummary(db),
          totals: {
            templates: db.templates.length,
            works: db.works.length,
            orders: db.orders.length,
            shares: db.shares.length
          }
        }
      });
      return;
    }

    if (req.method === "GET" && pathname === "/api/admin/templates") {
      sendJson(res, 200, { ok: true, data: db.templates.slice().sort((a, b) => b.updatedAt - a.updatedAt) });
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/templates") {
      parseBody(req).then((body) => {
        const existing = body.id ? db.templates.find((item) => item.id === body.id) : null;
        const nextTemplate = sanitizeTemplatePayload(body, existing);
        if (existing) {
          const index = db.templates.findIndex((item) => item.id === existing.id);
          db.templates.splice(index, 1, nextTemplate);
        } else {
          db.templates.unshift(nextTemplate);
        }
        writeDb(db);
        sendJson(res, 200, { ok: true, data: nextTemplate });
      }).catch((error) => sendJson(res, 400, { ok: false, message: error.message }));
      return;
    }

    if (req.method === "GET" && pathname === "/api/admin/works") {
      sendJson(res, 200, { ok: true, data: db.works.slice().sort((a, b) => b.updateTime - a.updateTime) });
      return;
    }

    if (req.method === "GET" && pathname === "/api/admin/orders") {
      sendJson(res, 200, { ok: true, data: db.orders.slice().sort((a, b) => b.createdAt - a.createdAt).map((item) => enrichOrder(item, db)) });
      return;
    }

    if (req.method === "POST" && pathname.endsWith("/status") && pathname.startsWith("/api/admin/orders/")) {
      parseBody(req).then((body) => {
        const orderId = pathname.split("/")[4];
        const orderIndex = db.orders.findIndex((item) => item.id === orderId);
        if (orderIndex < 0) {
          sendJson(res, 404, { ok: false, message: "订单不存在" });
          return;
        }
        db.orders[orderIndex].status = String(body.status || db.orders[orderIndex].status);
        db.orders[orderIndex].logisticsCompany = String(body.logisticsCompany || db.orders[orderIndex].logisticsCompany || "").trim();
        db.orders[orderIndex].logisticsNo = String(body.logisticsNo || db.orders[orderIndex].logisticsNo || "").trim();
        if (db.orders[orderIndex].status === "shipped" && !db.orders[orderIndex].shippedAt) {
          db.orders[orderIndex].shippedAt = Date.now();
        }
        writeDb(db);
        sendJson(res, 200, { ok: true, data: enrichOrder(db.orders[orderIndex], db) });
      }).catch((error) => sendJson(res, 400, { ok: false, message: error.message }));
      return;
    }

    if (req.method === "GET" && pathname === "/api/admin/orders/batch-print") {
      const ids = String(requestUrl.searchParams.get("ids") || "").split(",").filter(Boolean);
      const orders = db.orders.filter((item) => ids.includes(item.id));
      if (!orders.length) {
        sendJson(res, 404, { ok: false, message: "没有找到可打印的订单" });
        return;
      }
      writeHtmlPage(res, buildBatchPrintHtml(orders, db), "xiaoyeji-batch-print.html");
      return;
    }

    if (req.method === "GET" && pathname.startsWith("/api/admin/orders/") && pathname.endsWith("/print")) {
      const orderId = pathname.split("/")[4];
      const order = db.orders.find((item) => item.id === orderId);
      if (!order) {
        sendJson(res, 404, { ok: false, message: "订单不存在" });
        return;
      }
      const work = db.works.find((item) => item.id === order.workId) || {};
      writeHtmlPage(res, buildPrintHtml(order, work), order.albumTitle + "-print.html");
      return;
    }

    sendJson(res, 404, { ok: false, message: "接口不存在" });
  } catch (error) {
    sendJson(res, 500, { ok: false, message: error.message });
  }
}

function serveShare(req, res, requestUrl) {
  const db = readDb();
  const token = getRequestPath(requestUrl).split("/").pop();
  const share = db.shares.find((item) => item.token === token);
  if (!share) {
    sendText(res, 404, "分享内容不存在");
    return;
  }
  const work = db.works.find((item) => item.id === share.workId);
  if (!work) {
    sendText(res, 404, "分享作品不存在");
    return;
  }
  sendFileBuffer(res, Buffer.from(getShareHtml(share, work), "utf8"), "text/html; charset=utf-8");
}

function serveStatic(requestUrl, res) {
  let pathname = getRequestPath(requestUrl);
  if (pathname === "/") {
    pathname = "/h5/index.html";
  } else if (pathname === "/h5" || pathname === "/h5/") {
    pathname = "/h5/index.html";
  } else if (pathname === "/admin" || pathname === "/admin/") {
    pathname = "/admin/index.html";
  }

  const targetPath = path.normalize(path.join(ROOT, pathname));
  if (!targetPath.startsWith(ROOT)) {
    sendText(res, 403, "Forbidden");
    return;
  }
  if (!fs.existsSync(targetPath) || fs.statSync(targetPath).isDirectory()) {
    sendText(res, 404, "Not Found");
    return;
  }
  sendFile(res, targetPath);
}

ensureDb();

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, "http://" + req.headers.host);
  const pathname = getRequestPath(requestUrl);

  if (pathname.startsWith("/api/")) {
    handleApi(req, res, requestUrl);
    return;
  }

  if (pathname.startsWith("/share/")) {
    serveShare(req, res, requestUrl);
    return;
  }

  serveStatic(requestUrl, res);
});

server.listen(PORT, HOST, () => {
  console.log("小页记本地服务已启动: http://" + HOST + ":" + PORT);
});
