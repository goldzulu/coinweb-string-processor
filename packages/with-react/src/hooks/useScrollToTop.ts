import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function useScrollToTop() {
  const { pathname } = useLocation();
  const visitedRoutes = useRef(new Set<string>()).current;

  useEffect(() => {
    if (!visitedRoutes.has(pathname)) {
      visitedRoutes.add(pathname);
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
  }, [pathname]);

  return null;
}
