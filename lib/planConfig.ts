export const PLAN_CONFIG = {
  free: {
    maxProducts: 10,
    noBranding: false,
    customDomain: false,
    realtimeOrders: false,
    analytics: false,
    prioritySupport: false,
  },
  pro: {
    maxProducts: Infinity,
    noBranding: true,
    customDomain: false,
    realtimeOrders: false,
    analytics: false,
    prioritySupport: true,
  },
  business: {
    maxProducts: Infinity,
    noBranding: true,
    customDomain: true,
    realtimeOrders: true,
    analytics: true,
    prioritySupport: true,
  },
};