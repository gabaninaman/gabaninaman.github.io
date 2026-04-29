// Analytics component for tracking user interactions and web vitals
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Analytics({ gaId }) {
  const router = useRouter();

  useEffect(() => {
    if (!gaId) return;

    // Track page views on route change
    const handleRouteChange = (url) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', gaId, {
          page_path: url,
        });
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, gaId]);

  if (!gaId) return null;

  return (
    <>
      {/* Google Analytics */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

// Web Vitals tracking function
export function reportWebVitals(metric) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }
}

// Custom event tracking utility
export function trackEvent(action, category, label, value) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Track button clicks
export function trackButtonClick(buttonName, location) {
  trackEvent('button_click', 'engagement', `${buttonName} - ${location}`);
}

// Track external links
export function trackExternalLink(url, linkText) {
  trackEvent('external_link', 'navigation', `${linkText} - ${url}`);
}

// Track form submissions
export function trackFormSubmission(formName, success = true) {
  trackEvent('form_submission', 'engagement', formName, success ? 1 : 0);
}

// Track project views
export function trackProjectView(projectName) {
  trackEvent('project_view', 'content', projectName);
}

// Track downloads
export function trackDownload(fileName) {
  trackEvent('download', 'engagement', fileName);
}
