import { memo } from 'react';
import { motion } from 'framer-motion';
import { Edit3, ExternalLink, Trash2, Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import type { User } from '@/types';
import { COLORS } from '@/constants/theme.constants';
import { ROUTES } from '@/constants/routes.constants';
import { cn } from '@/utils';

// ─── Animation helpers ─────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

// ─── Mock data — replace with API calls in future stages ───────
const MOCK_COURSES = [
  {
    courseCode: 'ACC111',
    courseTitle: 'Principles of Accounting 1',
    unit: 3,
    session: '2025/2026',
    level: 'ND1',
    semester: 'First' as const,
  },
];

// ─── Dashboard Page ────────────────────────────────────────────
const DashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1100px] mx-auto">
      {/* ── Profile + Bio Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:items-stretch">
        <ProfileCard user={user} />
        <BioCard user={user} />
      </div>

      {/* ── Course Allocation Table ── */}
      <CourseAllocationTable
        courses={MOCK_COURSES}
        onViewAll={() => navigate(ROUTES.LECTURER.COURSE_ALLOCATION)}
      />
    </div>
  );
};

// ─── Profile Card ──────────────────────────────────────────────
const ProfileCard = memo(({ user }: { user: User | null }) => {
  return (
    <motion.div
      {...fadeUp(0)}
      className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col pt-5 items-start"
    >
      {/* Cover image area – sized to ~390x370 and responsive */}
      <div className="w-full max-w-[390px] h-[260px] sm:h-[320px] lg:h-[370px] bg-gradient-to-br from-[#1a2a3a] to-[#2d4a6b] overflow-hidden rounded-md ml-5">
        <img
          src="/images/julius.png"
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      {/* Name + title */}
      <div className="flex-shrink-0 px-5 pb-5 pt-4">
        <h2 className="text-lg font-bold" style={{ color: COLORS.text.title }}>
          {user?.name ?? 'Julius Adebo'}
        </h2>
        <p className="text-sm mt-0.5" style={{ color: COLORS.text.muted }}>
          {user?.title ?? 'Senior Lecturer'}
        </p>
      </div>
    </motion.div>
  );
});
ProfileCard.displayName = 'ProfileCard';

// ─── Bio Card ─────────────────────────────────────────────────
const BioCard = memo(({ user }: { user: User | null }) => {
  const bioFields = [
    { label: 'Current Session', value: '2025/2026' },
    { label: 'Current Semester', value: 'First' },
    {
      label: 'Faculty',
      value: user?.faculty ?? 'School of Management Studies',
    },
    { label: 'Programme', value: user?.programme ?? 'Business Administration' },
    { label: 'Mobile', value: user?.mobile ?? '—' },
    { label: 'Email', value: user?.email ?? '—' },
  ];

  return (
    <motion.div
      {...fadeUp(0.05)}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3
          className="font-bold text-base"
          style={{ color: COLORS.text.title }}
        >
          Bio & Other details
        </h3>
        <button className="flex items-center gap-1.5 text-[#20A8D8] text-sm font-medium hover:underline">
          <Edit3 size={14} />
          Edit Profile
        </button>
      </div>

      {/* Fields */}
      <div
        className="rounded-lg p-4 flex flex-col gap-3"
        style={{ backgroundColor: COLORS.lecturer.bioBg }}
      >
        {bioFields.map(({ label, value }) => (
          <div key={label}>
            <p
              className="text-xs font-medium"
              style={{ color: COLORS.text.muted }}
            >
              {label}
            </p>
            <p
              className="text-sm font-semibold mt-0.5"
              style={{ color: COLORS.text.title }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* E-Learning links */}
      <div className="flex items-center justify-between pt-1">
        <p
          className="text-sm font-semibold"
          style={{ color: COLORS.text.title }}
        >
          E-Learning
        </p>
        <div className="flex items-center gap-2">
          <ELearningIcon
            bg="#FF0000"
            icon={<Youtube size={14} className="text-white" />}
          />
          <ELearningIcon
            bg="#34A853"
            icon={<span className="text-white font-bold text-xs">G</span>}
          />
          <ELearningIcon
            bg="#0078D4"
            icon={<span className="text-white font-bold text-xs">T</span>}
          />
        </div>
      </div>
    </motion.div>
  );
});
BioCard.displayName = 'BioCard';

const ELearningIcon = ({ bg, icon }: { bg: string; icon: React.ReactNode }) => (
  <button
    className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
    style={{ backgroundColor: bg }}
  >
    {icon}
  </button>
);

// ─── Course Allocation Table ───────────────────────────────────
interface Course {
  courseCode: string;
  courseTitle: string;
  unit: number;
  session: string;
  level: string;
  semester: 'First' | 'Second';
}

interface CourseAllocationTableProps {
  courses: Course[];
  onViewAll: () => void;
}

const CourseAllocationTable = memo(
  ({ courses, onViewAll }: CourseAllocationTableProps) => {
    return (
      <motion.div
        {...fadeUp(0.1)}
        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
      >
        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3
            className="font-bold text-base"
            style={{ color: COLORS.text.title }}
          >
            Course Allocation
          </h3>
          <button
            onClick={onViewAll}
            className="flex items-center gap-1.5 text-sm font-semibold hover:underline"
            style={{ color: COLORS.primary }}
          >
            View all Courses
            <ExternalLink size={13} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {[
                  'Course Code',
                  'Course Title',
                  'Unit',
                  'Session',
                  'Level',
                  'Semester',
                  '',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-gray-400 text-sm"
                  >
                    No courses allocated yet
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <CourseRow key={course.courseCode} course={course} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  },
);
CourseAllocationTable.displayName = 'CourseAllocationTable';

const CourseRow = memo(({ course }: { course: Course }) => (
  <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
    <td className="px-5 py-3.5 font-medium text-gray-700 whitespace-nowrap">
      {course.courseCode}
    </td>
    <td
      className="px-5 py-3.5 font-semibold whitespace-nowrap"
      style={{ color: COLORS.text.title }}
    >
      {course.courseTitle}
    </td>
    <td className="px-5 py-3.5 text-gray-500">{course.unit}</td>
    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
      {course.session}
    </td>
    <td className="px-5 py-3.5 text-gray-500">{course.level}</td>
    <td className="px-5 py-3.5">
      <SemesterBadge semester={course.semester} />
    </td>
    <td className="px-5 py-3.5">
      <button className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
        <Trash2 size={15} />
      </button>
    </td>
  </tr>
));
CourseRow.displayName = 'CourseRow';

const SemesterBadge = ({ semester }: { semester: 'First' | 'Second' }) => (
  <span
    className={cn(
      'px-3 py-1 rounded-full text-xs font-semibold',
      semester === 'First'
        ? 'bg-[#20A8D8]/10 text-[#20A8D8]'
        : 'bg-purple-100 text-purple-600',
    )}
  >
    {semester}
  </span>
);

export default DashboardPage;
