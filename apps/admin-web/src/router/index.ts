import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AdminLayout from "../layouts/AdminLayout.vue";
import DashboardView from "../views/DashboardView.vue";
import ForbiddenView from "../views/ForbiddenView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import OrderManagementView from "../views/OrderManagementView.vue";
import TemplateManagementView from "../views/TemplateManagementView.vue";
import WorkManagementView from "../views/WorkManagementView.vue";
import SystemAccountsView from "../views/SystemAccountsView.vue";
import UnauthorizedView from "../views/UnauthorizedView.vue";
import { useAuthStore } from "../stores/auth";
import { pinia } from "../stores/pinia";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: AdminLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: "",
        redirect: "/dashboard"
      },
      {
        path: "dashboard",
        name: "dashboard",
        component: DashboardView,
        meta: {
          requiresAuth: true,
          kicker: "经营看板",
          title: "数据概览",
          description: "先看模板和作品的当前状态，再继续往模板工作台和作品管理里深入。"
        }
      },
      {
        path: "templates",
        name: "templates",
        component: TemplateManagementView,
        meta: {
          requiresAuth: true,
          roles: ["SUPER_ADMIN", "ADMIN"],
          kicker: "内容侧",
          title: "模板管理",
          description:
            "支持模板列表、分类筛选、搜索、新增、编辑、生成、重生成、预览、上架、推荐和删除校验。"
        }
      },
      {
        path: "works",
        name: "works",
        component: WorkManagementView,
        meta: {
          requiresAuth: true,
          kicker: "用户侧",
          title: "作品管理",
          description:
            "当前先做作品列表、详情和预览入口，用来回看模板适配效果，不提前做复杂联动。"
        }
      },
      {
        path: "orders",
        name: "orders",
        component: OrderManagementView,
        meta: {
          requiresAuth: true,
          kicker: "交易侧",
          title: "订单管理",
          description:
            "当前先做后台订单列表、订单详情和状态对齐，支付、物流、PDF 和退款还不会提前并进来。"
        }
      },
      {
        path: "system-accounts",
        name: "system-accounts",
        component: SystemAccountsView,
        meta: {
          requiresAuth: true,
          roles: ["SUPER_ADMIN"],
          kicker: "系统侧",
          title: "账号管理",
          description: "当前还是登录与权限的演示入口，真正的账号管理会在后续里程碑继续补。"
        }
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: LoginView
  },
  {
    path: "/401",
    name: "unauthorized",
    component: UnauthorizedView
  },
  {
    path: "/403",
    name: "forbidden",
    component: ForbiddenView
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore(pinia);
  authStore.hydrate();

  if (to.name === "login") {
    if (!authStore.token) {
      return true;
    }

    try {
      await authStore.ensureSession();
      return "/dashboard";
    } catch {
      return true;
    }
  }

  if (!to.meta.requiresAuth) {
    return true;
  }

  if (!authStore.token) {
    return {
      name: "unauthorized",
      query: { redirect: to.fullPath }
    };
  }

  try {
    const user = await authStore.ensureSession();

    if (!user) {
      return {
        name: "unauthorized",
        query: { redirect: to.fullPath }
      };
    }

    if (to.meta.roles?.length && !to.meta.roles.includes(user.role)) {
      return { name: "forbidden" };
    }

    return true;
  } catch {
    return {
      name: "unauthorized",
      query: { redirect: to.fullPath }
    };
  }
});

export default router;
