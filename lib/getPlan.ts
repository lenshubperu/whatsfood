import { PLAN_CONFIG } from "./planConfig";

export function getPlanConfig(plan: string) {
  const key = plan?.toLowerCase() as keyof typeof PLAN_CONFIG;
  return PLAN_CONFIG[key] || PLAN_CONFIG.free;
}