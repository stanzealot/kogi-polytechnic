import { memo } from 'react';
import { Menu, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUIStore } from '@/store/ui.store';
import { SIDEBAR_WIDTH } from './Sidebar';
import { COLORS } from '@/constants/theme.constants';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header = memo(({ title = "Lecturer's Portal", subtitle = 'Manage your courses and student progress' }: HeaderProps) => {
  const { toggleMobileSidebar, setUploadResultOpen } = useUIStore();

  return (
    <header
      className="fixed top-0 right-0 z-20 bg-white border-b border-gray-100 flex items-center justify-between px-5 md:px-7"
      style={{ left: 0, height: 64 }}
    >
      <div className="flex items-center gap-4">
        {/* Mobile hamburger */}
        <button onClick={toggleMobileSidebar} className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <Menu size={20} />
        </button>
        {/* Desktop title — offset by sidebar */}
        <div className="hidden md:block" style={{ marginLeft: SIDEBAR_WIDTH }}>
          <h1 className="text-xl font-bold leading-tight" style={{ color: COLORS.text.title }}>{title}</h1>
          <p className="text-xs mt-0.5" style={{ color: COLORS.text.muted }}>{subtitle}</p>
        </div>
        {/* Mobile title */}
        <div className="md:hidden">
          <h1 className="text-base font-bold" style={{ color: COLORS.text.title }}>{title}</h1>
        </div>
      </div>

      {/* Upload Result — now opens drawer */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setUploadResultOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition-colors"
        style={{ backgroundColor: COLORS.primary }}
      >
        <Upload size={16} />
        <span className="hidden sm:inline">Upload Result</span>
      </motion.button>
    </header>
  );
});
Header.displayName = 'Header';
