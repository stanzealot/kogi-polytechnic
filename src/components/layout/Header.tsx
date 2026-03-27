import { memo, type ReactNode } from 'react';
import { Menu, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useUIStore } from '@/store/ui.store';
import { COLORS } from '@/constants/theme.constants';
import { ROUTES } from '@/constants/routes.constants';

export const HEADER_HEIGHT = 72;

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const Header = memo((
  {
    title = "Lecturer's Portal",
    subtitle = 'Manage your courses and student progress',
    actions,
  }: HeaderProps,
) => {
  const { toggleMobileSidebar, setUploadResultOpen } = useUIStore();
  const location = useLocation();
  const isDashboardPage = location.pathname === ROUTES.LECTURER.DASHBOARD;

  const defaultDashboardAction = isDashboardPage ? (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => setUploadResultOpen(true)}
      className="flex items-center gap-2 px-4 py-2.5 rounded-[4px] text-white text-sm font-semibold transition-colors"
      style={{ backgroundColor: COLORS.primary }}
    >
      <Upload size={16} />
      <span className="hidden sm:inline">Upload Result</span>
    </motion.button>
  ) : null;

  return (
    <header
      className="dashboard-header fixed top-0 right-0 z-20 bg-white border-b border-gray-100"
      style={{ left: 0, height: HEADER_HEIGHT }}
    >
      <div className="h-full w-full max-w-[1100px] mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0">
          {/* Mobile hamburger */}
          <button onClick={toggleMobileSidebar} className="md:hidden p-2 rounded-[4px] text-gray-500 hover:bg-gray-100 transition-colors">
            <Menu size={20} />
          </button>
          {/* Desktop title */}
          <div className="hidden md:block min-w-0">
            <h1 className="text-2xl font-bold leading-tight truncate" style={{ color: COLORS.text.title }}>{title}</h1>
            <p className="text-sm mt-0.5 truncate" style={{ color: COLORS.text.muted }}>{subtitle}</p>
          </div>
          {/* Mobile title */}
          <div className="md:hidden min-w-0">
            <h1 className="text-lg font-bold truncate" style={{ color: COLORS.text.title }}>{title}</h1>
          </div>
        </div>
        <div className="flex items-center justify-end shrink-0">
          {/* Right-side actions: per-page actions or default dashboard button */}
          {actions ?? defaultDashboardAction}
        </div>
      </div>
    </header>
  );
});
Header.displayName = 'Header';
