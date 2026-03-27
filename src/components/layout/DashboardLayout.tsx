import { memo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import type { FallbackProps } from 'react-error-boundary';

import { Sidebar, MobileSidebar, SIDEBAR_WIDTH } from './Sidebar';
import { Header, HEADER_HEIGHT } from './Header';
import ErrorFallback from '@/components/shared/ErrorFallback';
import { UploadResultDrawer, DownloadTemplateDrawer } from '@/pages/lecturer/upload-result/UploadResultPage';
import { useUIStore } from '@/store/ui.store';
import { ROUTES } from '@/constants/routes.constants';
import { COLORS } from '@/constants/theme.constants';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const ErrorAdapter = (props: FallbackProps) => <ErrorFallback {...props} />;

export const DashboardLayout = memo(() => {
  const location = useLocation();
  const {
    setAllocateCoursesOpen,
    setAllocateOtherSchoolsOpen,
  } = useUIStore();

  let headerTitle = "Lecturer's Portal";
  let headerSubtitle = 'Manage your courses and student progress';
  let headerActions: React.ReactNode | undefined;

  switch (location.pathname) {
    case ROUTES.LECTURER.COURSE_ALLOCATION:
      headerTitle = 'Course Allocation';
      headerSubtitle = 'Manage your courses here';
      headerActions = (
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setAllocateOtherSchoolsOpen(true)}
            className="flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap"
            style={{ color: COLORS.primary }}
          >
            <Plus size={15} />
            <span className="hidden sm:inline">
              Allocate Courses from Other Schools
            </span>
            <span className="sm:hidden">Other Schools</span>
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setAllocateCoursesOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[4px] text-white text-sm font-semibold whitespace-nowrap"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Plus size={15} />
            Allocate Courses
          </motion.button>
        </div>
      );
      break;
    case ROUTES.LECTURER.EXAM_ATTENDANCE:
      headerTitle = 'Exam Attendance Sheet';
      headerSubtitle =
        'View and update student attendance for the selected exam.';
      break;
    case ROUTES.LECTURER.VIEW_RESULTS:
      headerTitle = 'View Uploaded Result';
      headerSubtitle =
        'View uploaded results for the selected course and semester.';
      break;
    case ROUTES.LECTURER.ACADEMIC_CALENDAR:
      headerTitle = 'Academic Calendar';
      headerSubtitle =
        'View important academic dates, events, and schedules.';
      break;
    case ROUTES.LECTURER.SETTINGS:
      headerTitle = 'Settings';
      headerSubtitle =
        'Manage your account settings and preferences';
      break;
    default:
      break;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <MobileSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <style>{`
          @media (min-width: 768px) {
            .main-content-area { margin-left: ${SIDEBAR_WIDTH}px; }
            .dashboard-header { left: ${SIDEBAR_WIDTH}px !important; }
          }
        `}</style>
        <div className="main-content-area flex flex-col min-h-screen">
          <Header
            title={headerTitle}
            subtitle={headerSubtitle}
            actions={headerActions}
          />
          <main
            className="flex-1 px-4 md:px-6 lg:px-8 py-6"
            style={{ paddingTop: HEADER_HEIGHT + 32 }}
          >
            <ErrorBoundary FallbackComponent={ErrorAdapter}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full max-w-[1100px] mx-auto"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </ErrorBoundary>
          </main>
        </div>
      </div>

      {/* ── Global drawers ── */}
      <UploadResultDrawer />
      <DownloadTemplateDrawer />
    </div>
  );
});
DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;
