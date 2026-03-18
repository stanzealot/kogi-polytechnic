import { useState, useMemo, memo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, ChevronLeft, ChevronRight, Trash2, Search, X, Plus, Minus } from 'lucide-react';
import { cn } from '@/utils';
import { COLORS } from '@/constants/theme.constants';
import RightDrawer from '@/components/ui/RightDrawer';
import { useUIStore } from '@/store/ui.store';
import {
  MOCK_ALLOCATED_COURSES, MOCK_AVAILABLE_COURSES, MOCK_OTHER_SCHOOL_COURSES,
  SESSIONS, SEMESTERS, PAGE_SIZE,
  type AvailableCourse,
} from '@/constants/mock.data';
import type { Course } from '@/types';

// ─── Page ─────────────────────────────────────────────────────
const CourseAllocationPage = () => {
  const [courses, setCourses] = useState<Course[]>(MOCK_ALLOCATED_COURSES);
  const [filterSemester, setFilterSemester] = useState('');
  const [filterSession, setFilterSession] = useState('');
  const [page, setPage] = useState(1);

  // Filter logic
  const filtered = useMemo(() => courses.filter(c => {
    if (filterSemester && c.semester !== filterSemester) return false;
    if (filterSession && c.session !== filterSession) return false;
    return true;
  }), [courses, filterSemester, filterSession]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (code: string) => setCourses(prev => prev.filter(c => c.courseCode !== code));

  const handleSaveAllocation = (selected: AvailableCourse[], session: string, semester: string) => {
    const newCourses: Course[] = selected.map(c => ({
      courseCode: c.courseCode,
      courseTitle: c.courseTitle,
      unit: c.unit,
      session,
      level: c.level,
      semester: semester as 'First' | 'Second',
    }));
    setCourses(prev => {
      const existingCodes = new Set(prev.map(c => c.courseCode));
      return [...prev, ...newCourses.filter(c => !existingCodes.has(c.courseCode))];
    });
    setPage(1);
  };

  const handleSaveOtherSchools = (selected: AvailableCourse[]) => {
    const newCourses: Course[] = selected.map(c => ({
      courseCode: c.courseCode,
      courseTitle: c.courseTitle,
      unit: c.unit,
      session: '2025/2026',
      level: c.level,
      semester: 'First',
    }));
    setCourses(prev => {
      const existingCodes = new Set(prev.map(c => c.courseCode));
      return [...prev, ...newCourses.filter(c => !existingCodes.has(c.courseCode))];
    });
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-5 max-w-[1100px]">
      {/* ── Table card ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-base" style={{ color: COLORS.text.title }}>Course Allocated</h3>
          {/* Desktop filters */}
          <div className="hidden md:flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm text-gray-400">
              <Filter size={14} /> Filter By
            </span>
            <FilterDropdown
              label="All Semester"
              options={SEMESTERS}
              value={filterSemester}
              onChange={v => { setFilterSemester(v); setPage(1); }}
            />
            <FilterDropdown
              label="All Session"
              options={SESSIONS}
              value={filterSession}
              onChange={v => { setFilterSession(v); setPage(1); }}
            />
          </div>
          {/* Mobile filter button */}
          <button className="md:hidden flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-1.5">
            <Filter size={14} /> Apply Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {/* Desktop columns */}
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Course Code</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Course Title</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Unit</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Session</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Level</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Semester</th>
                <th className="hidden md:table-cell px-5 py-3"></th>
                {/* Mobile columns */}
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide md:hidden">Course Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide md:hidden">Course Title</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">
                      No courses allocated yet
                    </td>
                  </tr>
                ) : (
                  paginated.map((course) => (
                    <CourseRow key={course.courseCode} course={course} onDelete={handleDelete} />
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-5 py-4">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>

      {/* ── Drawers ── */}
      <AllocateCoursesDrawer onSave={handleSaveAllocation} />
      <AllocateOtherSchoolsDrawer onSave={handleSaveOtherSchools} />
    </div>
  );
};

// ─── Course row ────────────────────────────────────────────────
const CourseRow = memo(({ course, onDelete }: { course: Course; onDelete: (code: string) => void }) => (
  <motion.tr
    layout
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.2 }}
    className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors"
  >
    {/* Desktop */}
    <td className="px-5 py-3.5 font-medium text-gray-600 whitespace-nowrap hidden md:table-cell">{course.courseCode}</td>
    <td className="px-5 py-3.5 font-semibold whitespace-nowrap hidden md:table-cell" style={{ color: COLORS.text.title }}>{course.courseTitle}</td>
    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{course.unit}</td>
    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap hidden md:table-cell">{course.session}</td>
    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{course.level}</td>
    <td className="px-5 py-3.5 hidden md:table-cell">
      <SemesterBadge semester={course.semester} />
    </td>
    <td className="px-5 py-3.5 hidden md:table-cell">
      <button onClick={() => onDelete(course.courseCode)} className="p-1.5 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
        <Trash2 size={15} />
      </button>
    </td>
    {/* Mobile */}
    <td className="px-4 py-3.5 font-medium text-gray-600 md:hidden">{course.courseCode}</td>
    <td className="px-4 py-3.5 font-semibold md:hidden" style={{ color: COLORS.text.title }}>{course.courseTitle}</td>
  </motion.tr>
));
CourseRow.displayName = 'CourseRow';

const SemesterBadge = ({ semester }: { semester: 'First' | 'Second' }) => (
  <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold',
    semester === 'First' ? 'bg-[#20A8D8]/10 text-[#20A8D8]' : 'bg-purple-50 text-purple-600'
  )}>
    {semester}
  </span>
);

// ─── Filter dropdown (desktop) ─────────────────────────────────
const FilterDropdown = ({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
        <span className="text-gray-600">{value || label}</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-20 min-w-[140px] overflow-hidden"
          >
            <button onClick={() => { onChange(''); setOpen(false); }} className={cn('w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors', !value && 'text-[#20A8D8] font-semibold')}>{label}</button>
            {options.map(o => (
              <button key={o} onClick={() => { onChange(o); setOpen(false); }} className={cn('w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors', value === o && 'text-[#20A8D8] font-semibold')}>{o}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Pagination ────────────────────────────────────────────────
const Pagination = memo(({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) => {
  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3);
    if (page > 5) pages.push('...');
    if (page > 3 && page < totalPages - 2) pages.push(page);
    if (page < totalPages - 4) pages.push('...');
    pages.push(totalPages - 2, totalPages - 1, totalPages);
  }

  return (
    <div className="flex items-center justify-between">
      {/* Mobile: simple prev/next */}
      <div className="flex md:hidden items-center gap-4 w-full justify-between">
        <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"><ChevronLeft size={16} /></button>
        <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
        <button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"><ChevronRight size={16} /></button>
      </div>
      {/* Desktop: page numbers */}
      <div className="hidden md:flex items-center gap-2">
        <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-40 transition-colors">
          <ChevronLeft size={14} /> Previous
        </button>
        {pages.map((p, i) => (
          <button
            key={i}
            onClick={() => typeof p === 'number' && onChange(p)}
            disabled={p === '...'}
            className={cn('w-8 h-8 rounded-lg text-sm font-medium transition-colors',
              p === page ? 'bg-[#20A8D8] text-white' : 'text-gray-500 hover:bg-gray-100',
              p === '...' && 'cursor-default'
            )}
          >{p}</button>
        ))}
        <button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-40 transition-colors">
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
});
Pagination.displayName = 'Pagination';

// ════════════════════════════════════════════════════════════════
// ── ALLOCATE COURSES DRAWER ────────────────────────────────────
// ════════════════════════════════════════════════════════════════
interface AllocateCoursesDrawerProps {
  onSave: (selected: AvailableCourse[], session: string, semester: string) => void;
}

const AllocateCoursesDrawer = ({ onSave }: AllocateCoursesDrawerProps) => {
  const { allocateCoursesOpen, setAllocateCoursesOpen, setAllocateOtherSchoolsOpen } = useUIStore();
  const [session, setSession] = useState('');
  const [semester, setSemester] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const hasFilters = session && semester;

  const availableCourses = useMemo(() => {
    if (!hasFilters) return [];
    return MOCK_AVAILABLE_COURSES.filter(c =>
      !search || c.courseCode.toLowerCase().includes(search.toLowerCase()) || c.courseTitle.toLowerCase().includes(search.toLowerCase())
    );
  }, [hasFilters, search]);

  const allChecked = availableCourses.length > 0 && availableCourses.every(c => selected.has(c.courseCode));

  const toggleAll = () => {
    if (allChecked) {
      setSelected(prev => { const n = new Set(prev); availableCourses.forEach(c => n.delete(c.courseCode)); return n; });
    } else {
      setSelected(prev => { const n = new Set(prev); availableCourses.forEach(c => n.add(c.courseCode)); return n; });
    }
  };

  const toggle = (code: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(code) ? n.delete(code) : n.add(code); return n; });
  };

  const handleClose = () => { setAllocateCoursesOpen(false); setSession(''); setSemester(''); setSearch(''); setSelected(new Set()); };

  const handleSave = () => {
    const picked = MOCK_AVAILABLE_COURSES.filter(c => selected.has(c.courseCode));
    onSave(picked, session, semester);
    handleClose();
  };

  const handleOtherSchools = () => {
    setAllocateCoursesOpen(false);
    setTimeout(() => setAllocateOtherSchoolsOpen(true), 150);
  };

  return (
    <RightDrawer isOpen={allocateCoursesOpen} onClose={handleClose} width={680}>
      <div className="flex flex-col min-h-full p-6 md:p-8 gap-5">
        {/* Back + header */}
        <div className="pr-8">
          <button onClick={handleClose} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors mb-3">
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold" style={{ color: COLORS.text.title }}>Allocate New Courses</h2>
              <p className="text-sm mt-0.5" style={{ color: COLORS.text.muted }}>Select Courses to Allocate to Lecturer</p>
            </div>
            <button onClick={handleOtherSchools} className="flex items-center gap-1 text-sm font-semibold flex-shrink-0 ml-4" style={{ color: COLORS.primary }}>
              <Plus size={14} /> Other schools
            </button>
          </div>
        </div>

        {/* Filter Options */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
            {hasFilters ? 'Set Options' : 'Filter Options'}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Session" placeholder="Select academic session" options={SESSIONS} value={session} onChange={v => { setSession(v); setSelected(new Set()); }} />
            <SelectField label="Semester" placeholder="Select academic semester" options={SEMESTERS} value={semester} onChange={v => { setSemester(v); setSelected(new Set()); }} />
          </div>
        </div>

        {/* Course list card */}
        <div className="flex flex-col flex-1 border border-gray-200 rounded-xl overflow-hidden">
          {/* Card header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold" style={{ color: COLORS.text.title }}>
              List of Courses in the School of Management Studies
              {hasFilters && <span className="font-normal text-gray-400"> {semester}st semester {session} Session</span>}
            </p>
          </div>

          {/* Search (only when filters set) */}
          {hasFilters && (
            <div className="px-4 py-2.5 border-b border-gray-100">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50">
                <Search size={14} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search a course"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          {/* Table header row */}
          <div className="grid grid-cols-[32px_1fr_2fr_64px_72px] px-4 py-2.5 border-b border-gray-100 bg-gray-50/60 gap-3">
            <div className="flex items-center justify-center">
              {hasFilters && availableCourses.length > 0 && (
                <Checkbox checked={allChecked} onChange={toggleAll} />
              )}
            </div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Course Code</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Course Title</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Unit</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Level</span>
          </div>

          {/* Course rows or empty state */}
          <div className="flex-1 overflow-y-auto">
            {!hasFilters ? (
              <EmptyState text="No available courses yet ?" sub="You need to select session and semester in order to proceed." />
            ) : availableCourses.length === 0 ? (
              <EmptyState text="No courses match your search" sub="Try a different search term." />
            ) : (
              availableCourses.map(course => (
                <div key={course.courseCode}
                  onClick={() => toggle(course.courseCode)}
                  className="grid grid-cols-[32px_1fr_2fr_64px_72px] px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50/60 transition-colors gap-3 items-center"
                >
                  <div className="flex items-center justify-center">
                    <Checkbox checked={selected.has(course.courseCode)} onChange={() => toggle(course.courseCode)} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">{course.courseCode}</span>
                  <span className="text-sm font-semibold" style={{ color: COLORS.text.title }}>{course.courseTitle}</span>
                  <span className="text-sm text-gray-500 text-right">{course.unit}</span>
                  <span className="text-sm text-gray-500 text-right">{course.level}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 sticky bottom-0 bg-white pb-2">
          <button onClick={handleClose} className="py-3 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={selected.size === 0}
            className={cn('py-3 rounded-lg text-sm font-semibold text-white transition-colors', selected.size > 0 ? 'bg-[#20A8D8] hover:bg-[#1a91bb]' : 'bg-[#20A8D8]/40 cursor-not-allowed')}
          >
            Save my allocation
          </motion.button>
        </div>
      </div>
    </RightDrawer>
  );
};

// ════════════════════════════════════════════════════════════════
// ── ALLOCATE FROM OTHER SCHOOLS DRAWER ────────────────────────
// ════════════════════════════════════════════════════════════════
interface AllocateOtherSchoolsDrawerProps {
  onSave: (selected: AvailableCourse[]) => void;
}

const AllocateOtherSchoolsDrawer = ({ onSave }: AllocateOtherSchoolsDrawerProps) => {
  const { allocateOtherSchoolsOpen, setAllocateOtherSchoolsOpen } = useUIStore();
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState<AvailableCourse[]>([]);
  // expanded state drives the selected-courses list collapse (always visible)
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filteredOptions = useMemo(() =>
    MOCK_OTHER_SCHOOL_COURSES.filter(c =>
      c.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      c.courseTitle.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  const isSelected = (code: string) => selected.some(s => s.courseCode === code);

  const toggle = (course: AvailableCourse) => {
    setSelected(prev =>
      prev.some(s => s.courseCode === course.courseCode)
        ? prev.filter(s => s.courseCode !== course.courseCode)
        : [...prev, course]
    );
  };

  const remove = (code: string) => setSelected(prev => prev.filter(s => s.courseCode !== code));

  const handleClose = () => {
    setAllocateOtherSchoolsOpen(false);
    setSearch('');
    setSelected([]);
    setDropdownOpen(false);
  };

  const handleBack = () => {
    handleClose();
  };

  const handleSave = () => {
    onSave(selected);
    handleClose();
  };

  return (
    <RightDrawer isOpen={allocateOtherSchoolsOpen} onClose={handleClose} width={560}>
      <div className="flex flex-col min-h-full p-6 md:p-8 gap-5">
        {/* Back + header */}
        <div className="pr-8">
          <button onClick={handleBack} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors mb-3">
            <ChevronLeft size={16} />
          </button>
          <h2 className="text-xl font-bold" style={{ color: COLORS.text.title }}>Allocate Courses from Other Schools</h2>
          <p className="text-sm mt-0.5" style={{ color: COLORS.text.muted }}>Select Courses to Allocate to Lecturer</p>
        </div>

        {/* Search with dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.text.subtitle }}>Select course</label>
          <div className="relative" ref={dropdownRef}>
            <div
              className={cn(
                'flex items-center gap-2 px-3.5 py-2.5 rounded-lg border text-sm transition-all cursor-text',
                dropdownOpen ? 'border-[#20A8D8] ring-2 ring-[#20A8D8]/20' : 'border-gray-200'
              )}
              onClick={() => { setDropdownOpen(true); inputRef.current?.focus(); }}
            >
              <Search size={15} className="text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search or select a course"
                value={search}
                onChange={e => { setSearch(e.target.value); setDropdownOpen(true); }}
                onFocus={() => setDropdownOpen(true)}
                className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Dropdown list */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{ transformOrigin: 'top' }}
                  className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-20 max-h-56 overflow-y-auto"
                >
                  {filteredOptions.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-400">No courses found</p>
                  ) : (
                    filteredOptions.map(course => (
                      <div
                        key={course.courseCode}
                        onClick={() => { toggle(course); setSearch(''); }}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <span className="text-sm font-medium" style={{ color: COLORS.text.title }}>{course.courseCode}</span>
                        <Checkbox checked={isSelected(course.courseCode)} onChange={() => {}} />
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-xs text-gray-400 mt-1.5">You can select more than one course from the dropdown.</p>
        </div>

        {/* Selected courses list */}
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          {/* Expandable header */}
          <button
            onClick={() => {}}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors"
            style={{ color: COLORS.primary, backgroundColor: selected.length > 0 ? '#F0FAFF' : '#F8FAFC' }}
          >
            {selected.length > 0 ? <Minus size={15} /> : <Plus size={15} />}
            All Selected Courses
            {selected.length > 0 && (
              <span className="ml-auto text-xs font-medium text-gray-400">{selected.length} selected</span>
            )}
          </button>

          {/* Selected list */}
          <AnimatePresence>
            {selected.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {selected.map((course, i) => (
                  <motion.div
                    key={course.courseCode}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15, delay: i * 0.03 }}
                    className="flex items-center justify-between px-4 py-3 border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <span className="text-sm font-medium" style={{ color: COLORS.text.title }}>{course.courseCode}</span>
                    <button onClick={() => remove(course.courseCode)} className="p-0.5 text-gray-400 hover:text-red-500 transition-colors">
                      <X size={15} />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 sticky bottom-0 bg-white pb-2">
          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={selected.length === 0}
            className={cn('w-full py-3 rounded-lg text-sm font-semibold text-white transition-colors', selected.length > 0 ? 'bg-[#20A8D8] hover:bg-[#1a91bb]' : 'bg-[#20A8D8]/40 cursor-not-allowed')}
          >
            Save my allocation
          </motion.button>
          <button onClick={handleClose} className="w-full py-3 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </RightDrawer>
  );
};

// ─── Shared helpers ────────────────────────────────────────────
const EmptyState = ({ text, sub }: { text: string; sub: string }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <div className="relative mb-4">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <Search size={20} className="text-gray-400" />
        </div>
      </div>
      <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-gray-200" />
      <div className="absolute bottom-1 left-0 w-3 h-3 rounded-full bg-gray-100" />
    </div>
    <p className="font-semibold text-sm" style={{ color: COLORS.text.title }}>{text}</p>
    <p className="text-xs text-gray-400 mt-1 max-w-[240px] leading-relaxed">{sub}</p>
  </div>
);

const Checkbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <div
    onClick={e => { e.stopPropagation(); onChange(); }}
    className={cn(
      'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer',
      checked ? 'bg-[#20A8D8] border-[#20A8D8]' : 'bg-white border-gray-300 hover:border-[#20A8D8]'
    )}
  >
    {checked && (
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </div>
);

// ─── Shared select field ───────────────────────────────────────
interface SelectFieldProps { label: string; placeholder: string; options: string[]; value: string; onChange: (v: string) => void; }
const SelectField = memo(({ label, placeholder, options, value, onChange }: SelectFieldProps) => (
  <div>
    <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.text.subtitle }}>{label}</label>
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className={cn('w-full appearance-none px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all focus:border-[#20A8D8] focus:ring-2 focus:ring-[#20A8D8]/20 border-gray-200', value ? 'text-gray-800' : 'text-gray-400')}>
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  </div>
));
SelectField.displayName = 'SelectField';

export default CourseAllocationPage;
