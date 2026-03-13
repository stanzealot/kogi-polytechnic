import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageWrapperProps {
  children: React.ReactNode;
}

/** Scrolls to top on route change and wraps page content */
const PageWrapper = ({ children }: PageWrapperProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return <>{children}</>;
};

export default PageWrapper;
