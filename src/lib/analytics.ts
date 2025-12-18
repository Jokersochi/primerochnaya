// Analytics utility functions

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

// Google Analytics 4
export const trackEvent = (event: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    });
  }
};

// Yandex Metrika
export const trackYMEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).ym) {
    (window as any).ym(98765432, 'reachGoal', eventName, params);
  }
};

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined') {
    if ((window as any).gtag) {
      (window as any).gtag('config', 'G-XXXXXXXXXX', {
        page_path: url,
      });
    }
    if ((window as any).ym) {
      (window as any).ym(98765432, 'hit', url);
    }
  }
};

// Track try-on events
export const trackTryOn = (garmentType: string) => {
  trackEvent({
    category: 'Try-On',
    action: 'garment_tried',
    label: garmentType,
  });
  trackYMEvent('try_on', { garment_type: garmentType });
};

// Track conversions
export const trackConversion = (planId: string, value: number) => {
  trackEvent({
    category: 'Conversion',
    action: 'subscription_purchased',
    label: planId,
    value,
  });
  trackYMEvent('purchase', { plan_id: planId, value });
};

// Track errors
export const trackError = (errorType: string, errorMessage: string) => {
  trackEvent({
    category: 'Error',
    action: errorType,
    label: errorMessage,
  });
};

// Track user engagement
export const trackEngagement = (action: string, duration?: number) => {
  trackEvent({
    category: 'Engagement',
    action,
    value: duration,
  });
};