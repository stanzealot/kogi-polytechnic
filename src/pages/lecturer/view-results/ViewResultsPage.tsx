import { useState, useMemo, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, ChevronLeft, ChevronRight, Eye, Upload, Download, Search, X } from 'lucide-react';
import { cn } from '@/utils';
import { COLORS } from '@/constants/theme.constants';
import { useUIStore } from '@/store/ui.store';
import {
  MOCK_UPLOADED_RESULTS, SESSIONS, SEMESTERS, DEPARTMENTS, PAGE_SIZE,
  type AttendanceCourse,
} from '@/constants/mock.data';

type ViewMode = 'list' | 'detail';

// ══════════════════════════════════════════════════════════════
// ── MAIN PAGE ─────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
const ViewResultsPage = () => {
  const [view, setView] = useState<ViewMode>('list');
  const [selectedCourse, setSelectedCourse] = useState<AttendanceCourse | null>(null);

  return (
    <AnimatePresence mode="wait">
      {view === 'list' ? (
        <motion.div
          key="list"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <ResultList
            onView={(c) => { setSelectedCourse(c); setView('detail'); }}
          />
        </motion.div>
      ) : (
        <motion.div
          key="detail"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.25 }}
        >
          <ResultDetail
            course={selectedCourse!}
            onBack={() => { setView('list'); setSelectedCourse(null); }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ══════════════════════════════════════════════════════════════
// ── LIST VIEW ─────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
const ResultList = ({ onView }: { onView: (c: AttendanceCourse) => void }) => {
  const { setUploadResultOpen, setDownloadTemplateOpen } = useUIStore();
  const [filterDept, setFilterDept] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [filterSession, setFilterSession] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [tempDept, setTempDept] = useState('');
  const [tempSemester, setTempSemester] = useState('');
  const [tempSession, setTempSession] = useState('');
  const [page, setPage] = useState(1);

  const hasFilters = filterSemester || filterSession || filterDept;

  const filtered = useMemo(() => {
    const source = MOCK_UPLOADED_RESULTS;
    if (!hasFilters) return source;
    return source.filter(c => {
      if (filterDept && c.department !== filterDept) return false;
      if (filterSemester && c.semester !== filterSemester) return false;
      if (filterSession && c.session !== filterSession) return false;
      return true;
    });
  }, [filterDept, filterSemester, filterSession, hasFilters]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openMobileFilter = () => {
    setTempDept(filterDept); setTempSemester(filterSemester); setTempSession(filterSession);
    setMobileFilterOpen(true);
  };

  const applyMobileFilter = () => {
    setFilterDept(tempDept); setFilterSemester(tempSemester); setFilterSession(tempSession);
    setPage(1); setMobileFilterOpen(false);
  };

  return (
    <div className="flex flex-col gap-5 max-w-[1100px]">
      {/* ── Table card ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-base" style={{ color: COLORS.text.title }}>All Result</h3>
          {/* Desktop filters */}
          <div className="hidden md:flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm text-gray-400"><Filter size={14} /> Filter By</span>
            <FilterDropdown label="All Department" options={DEPARTMENTS} value={filterDept} onChange={v => { setFilterDept(v); setPage(1); }} />
            <FilterDropdown label="All Semester" options={SEMESTERS} value={filterSemester} onChange={v => { setFilterSemester(v); setPage(1); }} />
            <FilterDropdown label="All Session" options={SESSIONS} value={filterSession} onChange={v => { setFilterSession(v); setPage(1); }} />
          </div>
          {/* Mobile filter button */}
          <button onClick={openMobileFilter} className="md:hidden flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={14} /> Apply Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Course Code</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Course Title</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Unit</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Department</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Session</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Level</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Semester</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">No. of Student</th>
                <th className="hidden md:table-cell px-5 py-3"></th>
                {/* Mobile */}
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide md:hidden">Course Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide md:hidden">Course Title</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={9}><EmptyState /></td></tr>
              ) : (
                paginated.map((course, i) => (
                  <ResultRow key={course.courseCode} course={course} index={i} onView={onView} />
                ))
              )}
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

      {/* Mobile filter sheet */}
      <MobileFilterSheet
        isOpen={mobileFilterOpen}
        dept={tempDept} semester={tempSemester} session={tempSession}
        onDept={setTempDept} onSemester={setTempSemester} onSession={setTempSession}
        onApply={applyMobileFilter}
        onCancel={() => setMobileFilterOpen(false)}
      />
    </div>
  );
};

// ── Table row ──────────────────────────────────────────────────
const ResultRow = memo(({ course, index, onView }: { course: AttendanceCourse; index: number; onView: (c: AttendanceCourse) => void }) => (
  <motion.tr
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, delay: index * 0.04 }}
    className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors"
  >
    <td className="px-5 py-3.5 font-medium text-gray-600 whitespace-nowrap hidden md:table-cell">{course.courseCode}</td>
    <td className="px-5 py-3.5 font-semibold whitespace-nowrap hidden md:table-cell" style={{ color: COLORS.text.title }}>{course.courseTitle}</td>
    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{course.unit}</td>
    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap hidden md:table-cell">{course.department}</td>
    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap hidden md:table-cell">{course.session}</td>
    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{course.level}</td>
    <td className="px-5 py-3.5 hidden md:table-cell">
      <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold',
        course.semester === 'First' ? 'bg-[#20A8D8]/10 text-[#20A8D8]' : 'bg-purple-50 text-purple-600'
      )}>{course.semester}</span>
    </td>
    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{course.studentCount}</td>
    <td className="px-5 py-3.5 hidden md:table-cell">
      <button onClick={() => onView(course)} className="p-1.5 rounded-md text-gray-300 hover:text-[#20A8D8] hover:bg-[#20A8D8]/10 transition-colors" title="View result">
        <Eye size={16} />
      </button>
    </td>
    {/* Mobile */}
    <td className="px-4 py-3.5 font-medium text-gray-600 md:hidden" onClick={() => onView(course)}>{course.courseCode}</td>
    <td className="px-4 py-3.5 font-semibold md:hidden" style={{ color: COLORS.text.title }} onClick={() => onView(course)}>{course.courseTitle}</td>
  </motion.tr>
));
ResultRow.displayName = 'ResultRow';

// ══════════════════════════════════════════════════════════════
// ── DETAIL VIEW ───────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
const ResultDetail = ({ course, onBack }: { course: AttendanceCourse; onBack: () => void }) => {
  const [page, setPage] = useState(1);
  // Result detail is empty in design (Image 5/6) — just the card with course code + Export + pagination
  const totalPages = 10; // placeholder

  const handleExport = () => {
    const header = 'S/N,Matriculation Number,Full Name,CA Score,Exam Score,Total\n';
    const blob = new Blob([header], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `result-${course.courseCode}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-5 max-w-[1100px]">
      <div>
        <button onClick={onBack} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors mb-3">
          <ChevronLeft size={16} />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: COLORS.text.title }}>View Result</h1>
        <p className="text-sm mt-1" style={{ color: COLORS.text.muted }}>View result records for the selected exam.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-base" style={{ color: COLORS.text.title }}>{course.courseCode}</h3>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold"
            style={{ backgroundColor: COLORS.primary }}
          >
            Export <Upload size={14} />
          </motion.button>
        </div>

        {/* Results content area — empty per design, ready for API data */}
        <div className="min-h-[400px]" />

        {/* Pagination */}
        <div className="border-t border-gray-100 px-5 py-4">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// ── SHARED COMPONENTS ──────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="relative mb-5">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
          <Search size={22} className="text-gray-400" />
        </div>
      </div>
      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gray-100 border-2 border-white" />
      <div className="absolute bottom-2 left-0 w-3.5 h-3.5 rounded-full bg-gray-200 border-2 border-white" />
      <div className="absolute top-0 left-2 w-2.5 h-2.5 rounded-full bg-gray-100 border border-white" />
    </div>
    <p className="font-semibold text-sm mb-1" style={{ color: COLORS.text.title }}>No available courses yet ?</p>
    <p className="text-xs leading-relaxed max-w-[220px]" style={{ color: COLORS.text.muted }}>
      You need to select session and semester in order to proceed.
    </p>
  </div>
);

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
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors whitespace-nowrap">
        <span className="text-gray-600">{value || label}</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
            style={{ transformOrigin: 'top' }} transition={{ duration: 0.14 }}
            className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-20 min-w-[150px] overflow-hidden"
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

interface MobileFilterSheetProps {
  isOpen: boolean;
  dept: string; semester: string; session: string;
  onDept: (v: string) => void; onSemester: (v: string) => void; onSession: (v: string) => void;
  onApply: () => void; onCancel: () => void;
}

const MobileFilterSheet = memo(({ isOpen, dept, semester, session, onDept, onSemester, onSession, onApply, onCancel }: MobileFilterSheetProps) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/30" onClick={onCancel} />
        <motion.div
          initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl p-6 pb-8"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base" style={{ color: COLORS.text.title }}>Filter by</h3>
            <button onClick={onCancel} className="p-1 text-gray-400 hover:text-gray-600 transition-colors"><X size={18} /></button>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { label: 'Department', options: DEPARTMENTS, value: dept, onChange: onDept, allLabel: 'All Department' },
              { label: 'Semester', options: SEMESTERS, value: semester, onChange: onSemester, allLabel: 'All Semester' },
              { label: 'Session', options: SESSIONS, value: session, onChange: onSession, allLabel: 'All Session' },
            ].map(({ label, options, value, onChange, allLabel }) => (
              <div key={label}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.text.subtitle }}>{label}</label>
                <div className="relative">
                  <select value={value} onChange={e => onChange(e.target.value)} className="w-full appearance-none px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#20A8D8] bg-white">
                    <option value="">{allLabel}</option>
                    {options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-6">
            <button onClick={onApply} className="w-full py-3.5 rounded-xl text-white text-sm font-semibold" style={{ backgroundColor: COLORS.primary }}>Apply Filter</button>
            <button onClick={onCancel} className="w-full py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
));
MobileFilterSheet.displayName = 'MobileFilterSheet';

const Pagination = memo(({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) => {
  const pages: (number | '...')[] = [];
  if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
  else {
    pages.push(1, 2, 3);
    if (page > 5) pages.push('...');
    if (page > 3 && page < totalPages - 2) pages.push(page);
    if (page < totalPages - 4) pages.push('...');
    pages.push(totalPages - 2, totalPages - 1, totalPages);
  }
  return (
    <div className="flex items-center justify-between">
      <div className="flex md:hidden items-center gap-4 w-full justify-between">
        <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"><ChevronLeft size={16} /></button>
        <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
        <button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"><ChevronRight size={16} /></button>
      </div>
      <div className="hidden md:flex items-center gap-2">
        <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-40 transition-colors"><ChevronLeft size={14} /> Previous</button>
        {pages.map((p, i) => (
          <button key={i} onClick={() => typeof p === 'number' && onChange(p)} disabled={p === '...'}
            className={cn('w-8 h-8 rounded-lg text-sm font-medium transition-colors', p === page ? 'bg-[#20A8D8] text-white' : 'text-gray-500 hover:bg-gray-100', p === '...' && 'cursor-default')}
          >{p}</button>
        ))}
        <button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800 disabled:opacity-40 transition-colors">Next <ChevronRight size={14} /></button>
      </div>
    </div>
  );
});
Pagination.displayName = 'Pagination';

export default ViewResultsPage;
