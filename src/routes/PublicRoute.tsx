import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/constants/routes.constants';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps public pages (home, login).
 * If user is already authenticated, redirect to dashboard.
 */
const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.LECTURER.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
