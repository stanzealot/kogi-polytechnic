import { memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, LogOut } from 'lucide-react';
import { cn } from '@/utils';
import { COLORS } from '@/constants/theme.constants';
import { LECTURER_NAV_ITEMS } from '@/constants/nav.constants';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { ROUTES } from '@/constants/routes.constants';
import type { NavItem } from '@/types';

// ─── Sidebar Width ─────────────────────────────────────────────
export const SIDEBAR_WIDTH = 260;

// ─── Desktop Sidebar ───────────────────────────────────────────
export const Sidebar = memo(() => {
  return (
    <aside
      className="hidden md:flex flex-col fixed inset-y-0 left-0 z-30 sidebar-scrollable overflow-y-auto"
      style={{ width: SIDEBAR_WIDTH, backgroundColor: COLORS.sidebar.bg }}
    >
      <SidebarContent />
    </aside>
  );
});
Sidebar.displayName = 'Sidebar';

// ─── Mobile Sidebar Drawer ─────────────────────────────────────
export const MobileSidebar = memo(() => {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();

  return (
    <AnimatePresence>
      {mobileSidebarOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: -SIDEBAR_WIDTH }}
            animate={{ x: 0 }}
            exit={{ x: -SIDEBAR_WIDTH }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 flex flex-col md:hidden sidebar-scrollable overflow-y-auto"
            style={{ width: SIDEBAR_WIDTH, backgroundColor: COLORS.sidebar.bg }}
          >
            {/* Close button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>

            <SidebarContent />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
});
MobileSidebar.displayName = 'MobileSidebar';

// ─── Shared Sidebar Content ────────────────────────────────────
const SidebarContent = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { setMobileSidebarOpen } = useUIStore();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME, { replace: true });
  };

  const handleNavClick = () => {
    // Close mobile sidebar on nav click
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Logo / App name ── */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: COLORS.sidebar.border }}>
        <div className="w-8 h-8 rounded-full bg-[#20A8D8] flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img
            src="/images/logo.png"
            alt="KSP"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="text-white font-bold text-xs">UI</span>
        </div>
        <span className="text-white font-semibold text-sm tracking-wide">
          Untitled UI
        </span>
      </div>

      {/* ── Nav Items ── */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {LECTURER_NAV_ITEMS.map((item) => (
          <SidebarNavItem key={item.path} item={item} onClick={handleNavClick} />
        ))}
      </nav>

      {/* ── Bottom Section ── */}
      <div className="px-3 pb-3 flex flex-col gap-2 border-t" style={{ borderColor: COLORS.sidebar.border }}>
        {/* Download Manual card */}
        <div
          className="mx-1 my-3 p-3 rounded-lg"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded bg-red-100 flex-shrink-0">
              <FileText size={14} className="text-red-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 leading-tight">
                Result Processing Manual
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                This provides guidance for submitting and managing results.
              </p>
              <button className="text-[11px] text-[#20A8D8] font-medium mt-1.5 hover:underline">
                Download Manual
              </button>
            </div>
          </div>
        </div>

        {/* User profile row */}
        <div
          className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg border-t pt-3"
          style={{ borderColor: COLORS.sidebar.border }}
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#20A8D8]/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img
              src={user?.avatar ?? ''}
              alt={user?.name ?? ''}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-[#20A8D8] font-semibold text-xs">
              {user?.name?.charAt(0) ?? 'L'}
            </span>
          </div>

          {/* Name + email */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name ?? 'Lecturer'}</p>
            <p className="text-white/50 text-[11px] truncate">{user?.email ?? ''}</p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Single Nav Item ───────────────────────────────────────────
interface SidebarNavItemProps {
  item: NavItem;
  onClick?: () => void;
}

const SidebarNavItem = ({ item, onClick }: SidebarNavItemProps) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
          isActive
            ? 'text-white'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Active background */}
          {isActive && (
            <motion.div
              layoutId="sidebar-active-bg"
              className="absolute inset-0 rounded-lg"
              style={{ backgroundColor: COLORS.sidebar.active }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
          )}

          {/* Icon */}
          <Icon
            size={18}
            className={cn(
              'relative z-10 flex-shrink-0 transition-colors',
              isActive ? 'text-white' : 'text-white/70'
            )}
          />

          {/* Label */}
          <span className="relative z-10">{item.label}</span>

          {/* Active dot indicator (from project 3 pattern) */}
          {isActive && (
            <motion.div
              layoutId="sidebar-active-dot"
              className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/80"
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
};
