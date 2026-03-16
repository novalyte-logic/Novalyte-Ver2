import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnalyticsEngine } from '@/src/lib/analytics/events';

export function RouteAnalytics() {
  const location = useLocation();

  useEffect(() => {
    AnalyticsEngine.track('page_view', {
      path: location.pathname,
      search: location.search,
      hash: location.hash,
      title: document.title,
    });
  }, [location.hash, location.pathname, location.search]);

  return null;
}
