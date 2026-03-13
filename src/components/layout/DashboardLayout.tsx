import { memo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import type { FallbackProps } from 'react-error-boundary';

import { Sidebar, MobileSidebar, SIDEBAR_WIDTH } from './Sidebar';
import { Header } from './Header';
import ErrorFallback from '@/components/shared/ErrorFallback';
import { UploadResultDrawer, DownloadTemplateDrawer } from '@/pages/lecturer/upload-result/UploadResultPage';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const ErrorAdapter = (props: FallbackProps) => <ErrorFallback {...props} />;

export const DashboardLayout = memo(() => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <MobileSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <style>{`
          @media (min-width: 768px) {
            .main-content-area { margin-left: ${SIDEBAR_WIDTH}px; }
          }
        `}</style>
        <div className="main-content-area flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 pt-16 px-4 md:px-6 lg:px-8 py-6">
            <ErrorBoundary FallbackComponent={ErrorAdapter}>
              <AnimatePresence mode="wait">
                <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
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
