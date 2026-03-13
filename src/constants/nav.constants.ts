import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Upload,
  Eye,
  CalendarDays,
  Settings,
} from 'lucide-react';
import { ROUTES } from './routes.constants';
import type { NavItem } from '@/types';

export const LECTURER_NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    path: ROUTES.LECTURER.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: 'Course Allocation',
    path: ROUTES.LECTURER.COURSE_ALLOCATION,
    icon: BookOpen,
  },
  {
    label: 'Exam Attendance Sheet',
    path: ROUTES.LECTURER.EXAM_ATTENDANCE,
    icon: ClipboardList,
  },
  {
    label: 'View Uploaded Result',
    path: ROUTES.LECTURER.VIEW_RESULTS,
    icon: Eye,
  },
  {
    label: 'Academic Calendar',
    path: ROUTES.LECTURER.ACADEMIC_CALENDAR,
    icon: CalendarDays,
  },
  {
    label: 'Settings',
    path: ROUTES.LECTURER.SETTINGS,
    icon: Settings,
  },
];

// Upload Result is a special action button (not a nav link in the sidebar),
// but listed here for reference
export const UPLOAD_RESULT_ITEM: NavItem = {
  label: 'Upload Result',
  path: ROUTES.LECTURER.UPLOAD_RESULT,
  icon: Upload,
};
