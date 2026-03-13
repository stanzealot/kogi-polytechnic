import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/constants/routes.constants';
import SuspenseLoader from '@/components/shared/SuspenseLoader';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps protected pages. Redirects to login if not authenticated.
 * Stores the intended path so user is redirected back after login.
 */
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <SuspenseLoader />;

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
