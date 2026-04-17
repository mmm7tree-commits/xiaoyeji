import "vue-router";
import type { UserRole } from "../types/auth";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    roles?: UserRole[];
    kicker?: string;
    title?: string;
    description?: string;
  }
}
