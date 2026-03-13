import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { AnimatePresence } from 'framer-motion';
import type { FallbackProps } from 'react-error-boundary';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import SuspenseLoader from '@/components/shared/SuspenseLoader';
import ErrorFallback from '@/components/shared/ErrorFallback';
import { ROUTES } from '@/constants/routes.constants';

// ─── Lazy Pages ─────────────────────────────────────────
const HomePage        = lazy(() => import('@/pages/home/HomePage'));
const LoginPage       = lazy(() => import('@/pages/auth/LoginPage'));
const DashboardLayout = lazy(() => import('@/components/layout/DashboardLayout'));
const DashboardPage   = lazy(() => import('@/pages/lecturer/dashboard/DashboardPage'));
const CourseAllocation  = lazy(() => import('@/pages/lecturer/course-allocation/CourseAllocationPage'));
const ExamAttendance    = lazy(() => import('@/pages/lecturer/exam-attendance/ExamAttendancePage'));
const UploadResult      = lazy(() => import('@/pages/lecturer/upload-result/UploadResultPage'));
const ViewResults       = lazy(() => import('@/pages/lecturer/view-results/ViewResultsPage'));
const AcademicCalendar  = lazy(() => import('@/pages/lecturer/academic-calendar/AcademicCalendarPage'));
const Settings          = lazy(() => import('@/pages/lecturer/settings/SettingsPage'));
const NotFoundPage      = lazy(() => import('@/pages/NotFoundPage'));

const ErrorAdapter = (props: FallbackProps) => <ErrorFallback {...props} />;

const AppRoutes = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorAdapter}>
      <Suspense fallback={<SuspenseLoader />}>
        <AnimatePresence mode="wait">
          <Routes>
            {/* ── Public ── */}
            <Route path={ROUTES.HOME}  element={<PublicRoute><HomePage /></PublicRoute>} />
            <Route path={ROUTES.LOGIN} element={<PublicRoute><LoginPage /></PublicRoute>} />

            {/* ── Protected: Lecturer — nested under shared layout ── */}
            <Route
              path="/lecturer"
              element={<PrivateRoute><DashboardLayout /></PrivateRoute>}
            >
              <Route index element={<Navigate to={ROUTES.LECTURER.DASHBOARD} replace />} />
              <Route path="dashboard"         element={<DashboardPage />} />
              <Route path="course-allocation" element={<CourseAllocation />} />
              <Route path="exam-attendance"   element={<ExamAttendance />} />
              <Route path="upload-result"     element={<UploadResult />} />
              <Route path="view-results"      element={<ViewResults />} />
              <Route path="academic-calendar" element={<AcademicCalendar />} />
              <Route path="settings"          element={<Settings />} />
            </Route>

            {/* ── 404 ── */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
