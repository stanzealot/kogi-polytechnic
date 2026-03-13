import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Download, X, Check, ChevronDown, ChevronLeft,
  Upload, FileSpreadsheet, Info, Trash2,
} from 'lucide-react';
import { cn } from '@/utils';
import { COLORS } from '@/constants/theme.constants';
import RightDrawer from '@/components/ui/RightDrawer';
import { useUIStore } from '@/store/ui.store';
import { useAuthStore } from '@/store/auth.store';
import {
  SESSIONS, SEMESTERS, STUDENT_TYPES, DEPARTMENTS, MOCK_AVAILABLE_COURSES,
} from '@/constants/mock.data';

// ─── Types ─────────────────────────────────────────────────────
type UploadStep = 'form' | 'confirm';
type FileStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UploadForm {
  session: string;
  semester: string;
  studentType: string;
  course: string;
  department: string;
}

interface UploadedFile {
  file: File;
  status: FileStatus;
  progress: number;
}

const EMPTY_FORM: UploadForm = {
  session: '', semester: '', studentType: '', course: '', department: '',
};

// ══════════════════════════════════════════════════════════════
// ── UPLOAD RESULT DRAWER ──────────────────────────────────────
// ══════════════════════════════════════════════════════════════
export const UploadResultDrawer = () => {
  const { uploadResultOpen, setUploadResultOpen, setDownloadTemplateOpen } = useUIStore();
  const [step, setStep] = useState<UploadStep>('form');
  const [form, setForm] = useState<UploadForm>(EMPTY_FORM);
  const [uploaded, setUploaded] = useState<UploadedFile | null>(null);

  const handleClose = useCallback(() => {
    setUploadResultOpen(false);
    setTimeout(() => { setStep('form'); setForm(EMPTY_FORM); setUploaded(null); }, 350);
  }, [setUploadResultOpen]);

  const handleOpenDownload = useCallback(() => {
    setUploadResultOpen(false);
    setTimeout(() => setDownloadTemplateOpen(true), 250);
  }, [setUploadResultOpen, setDownloadTemplateOpen]);

  return (
    <RightDrawer isOpen={uploadResultOpen} onClose={handleClose} width={620} hideCloseButton>
      <AnimatePresence mode="wait">
        {step === 'form' ? (
          <motion.div key="form"
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}
            className="min-h-full"
          >
            <UploadForm
              form={form}
              setForm={setForm}
              uploaded={uploaded}
              setUploaded={setUploaded}
              onDownloadTemplate={handleOpenDownload}
              onClose={handleClose}
              onNext={() => setStep('confirm')}
            />
          </motion.div>
        ) : (
          <motion.div key="confirm"
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}
            className="min-h-full"
          >
            <ConfirmDetails
              form={form}
              uploaded={uploaded}
              onBack={() => setStep('form')}
              onClose={handleClose}
              onConfirm={handleClose}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </RightDrawer>
  );
};

// ══════════════════════════════════════════════════════════════
// ── STEP 1: UPLOAD FORM ───────────────────────────────────────
// ══════════════════════════════════════════════════════════════
interface UploadFormProps {
  form: UploadForm;
  setForm: (f: UploadForm) => void;
  uploaded: UploadedFile | null;
  setUploaded: (f: UploadedFile | null) => void;
  onDownloadTemplate: () => void;
  onClose: () => void;
  onNext: () => void;
}

const UploadForm = memo(({
  form, setForm, uploaded, setUploaded, onDownloadTemplate, onClose, onNext,
}: UploadFormProps) => {
  const set = (k: keyof UploadForm, v: string) => setForm({ ...form, [k]: v });
  const courseOptions = MOCK_AVAILABLE_COURSES.map(c => c.courseCode);

  const simulateUpload = useCallback((file: File) => {
    setUploaded({ file, status: 'uploading', progress: 0 });
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(p + Math.floor(Math.random() * 20) + 10, 100);
      if (p >= 100) {
        clearInterval(iv);
        // Always succeed for demo — remove the random error
        setUploaded({ file, status: 'success', progress: 100 });
      } else {
        setUploaded({ file, status: 'uploading', progress: p });
      }
    }, 120);
  }, [setUploaded]);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) simulateUpload(accepted[0]);
  }, [simulateUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'], 'application/vnd.ms-excel': ['.xls', '.xlsx'] },
    maxFiles: 1,
    disabled: uploaded?.status === 'uploading',
  });

  const canProceed = uploaded?.status === 'success';

  return (
    <div className="flex flex-col h-full px-7 py-7 gap-5">
      {/* ── Header ── */}
      <div>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors mb-4"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1.5" style={{ color: COLORS.text.title }}>Upload Result</h2>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: COLORS.text.muted }}>
              Use the downloaded template to enter student records, then save and upload the completed file here.
            </p>
          </div>
          <button
            onClick={onDownloadTemplate}
            className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold mt-0.5"
            style={{ color: COLORS.primary }}
          >
            <Download size={14} />
            Download result template
          </button>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="flex flex-col gap-4">
        {/* Row 1: Session + Semester */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DrawerSelect
            label="Session" placeholder="Select academic session"
            options={SESSIONS} value={form.session}
            onChange={v => set('session', v)}
          />
          <DrawerSelect
            label="Semester" placeholder="Select academic semester"
            options={SEMESTERS} value={form.semester}
            onChange={v => set('semester', v)}
          />
        </div>
        {/* Row 2: Student Type + Course */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DrawerSelect
            label="Student Type" placeholder="Select student type"
            options={STUDENT_TYPES} value={form.studentType}
            onChange={v => set('studentType', v)}
          />
          <DrawerSelect
            label="Course" placeholder="Select course"
            options={courseOptions} value={form.course}
            onChange={v => set('course', v)}
          />
        </div>
        {/* Row 3: Department (full width) */}
        <DrawerSelect
          label="Department" placeholder="Select department"
          options={DEPARTMENTS} value={form.department}
          onChange={v => set('department', v)}
        />
      </div>

      {/* ── Drop zone / file states ── */}
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="wait">
          {!uploaded ? (
            <motion.div key="dropzone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div
                {...getRootProps()}
                className={cn(
                  'border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 py-9 cursor-pointer transition-all',
                  isDragActive
                    ? 'border-[#20A8D8] bg-[#20A8D8]/5'
                    : 'border-gray-200 bg-white hover:border-[#20A8D8]/40 hover:bg-gray-50/50'
                )}
              >
                <input {...getInputProps()} />
                <div className="w-11 h-11 rounded-xl border border-gray-200 bg-white shadow-sm flex items-center justify-center">
                  <Upload size={20} className="text-gray-400" />
                </div>
                <p className="text-sm text-center leading-relaxed">
                  <span className="font-semibold" style={{ color: COLORS.primary }}>Click to upload</span>
                  <span className="text-gray-400"> or drag and drop</span>
                </p>
                <p className="text-xs text-gray-400">csv file here.</p>
              </div>
            </motion.div>
          ) : uploaded.status === 'uploading' ? (
            <motion.div key="uploading" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <FileProgressCard file={uploaded.file} progress={uploaded.progress} onRemove={() => setUploaded(null)} />
            </motion.div>
          ) : uploaded.status === 'success' ? (
            <motion.div key="success" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <FileSuccessCard file={uploaded.file} onRemove={() => setUploaded(null)} />
            </motion.div>
          ) : (
            <motion.div key="error" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <FileErrorCard
                file={uploaded.file}
                onRemove={() => setUploaded(null)}
                onRetry={() => simulateUpload(uploaded.file)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1" />

      {/* ── Actions ── */}
      <div className="pt-5 border-t border-gray-100 grid grid-cols-2 gap-3">
        <button
          onClick={onClose}
          className="py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <motion.button
          whileHover={canProceed ? { scale: 1.01 } : {}}
          whileTap={canProceed ? { scale: 0.98 } : {}}
          onClick={canProceed ? onNext : undefined}
          className={cn(
            'py-3.5 rounded-xl text-sm font-semibold text-white transition-colors',
            canProceed
              ? 'cursor-pointer bg-[#20A8D8] hover:bg-[#1a91bb]'
              : 'cursor-not-allowed bg-[#20A8D8]/40'
          )}
        >
          Upload
        </motion.button>
      </div>
    </div>
  );
});
UploadForm.displayName = 'UploadForm';

// ── File cards ─────────────────────────────────────────────────
const CsvIcon = ({ variant }: { variant: 'success' | 'error' }) => (
  <div className={cn(
    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 relative',
    variant === 'success' ? 'bg-[#E8F5E9]' : 'bg-red-50'
  )}>
    <FileSpreadsheet size={20} className={variant === 'success' ? 'text-green-700' : 'text-red-500'} />
    <span className={cn(
      'absolute bottom-0.5 left-0.5 text-[7px] font-bold text-white px-0.5 rounded-sm',
      variant === 'success' ? 'bg-green-600' : 'bg-red-500'
    )}>CSV</span>
  </div>
);

const FileProgressCard = ({ file, progress, onRemove }: { file: File; progress: number; onRemove: () => void }) => (
  <div className="border border-gray-200 rounded-xl p-4">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
        <FileSpreadsheet size={18} className="text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-sm font-semibold truncate pr-2" style={{ color: COLORS.text.title }}>{file.name}</p>
          <button onClick={onRemove} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
            <X size={15} />
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-2">{Math.round(file.size / 1024)} KB</p>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.15 }}
          />
        </div>
        <p className="text-xs text-gray-400 text-right mt-1">{progress}%</p>
      </div>
    </div>
  </div>
);

// Image 9 — success state: CSV icon + filename + file size + green progress bar at 100% + green checkmark top-right
const FileSuccessCard = ({ file, onRemove: _r }: { file: File; onRemove: () => void }) => (
  <div className="border border-gray-200 rounded-xl p-4">
    <div className="flex items-start gap-3">
      <CsvIcon variant="success" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-sm font-semibold truncate pr-2" style={{ color: COLORS.text.title }}>{file.name}</p>
          <Check size={18} className="text-green-500 flex-shrink-0" />
        </div>
        <p className="text-xs text-gray-400 mb-2">{Math.round(file.size / 1024)} KB</p>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full w-full rounded-full bg-green-500" />
        </div>
        <p className="text-xs text-gray-400 text-right mt-1">100%</p>
      </div>
    </div>
  </div>
);

// Image 10 — error state: red border, red CSV icon, "Try again" link, trash icon
const FileErrorCard = ({ file, onRemove, onRetry }: { file: File; onRemove: () => void; onRetry: () => void }) => (
  <div className="border-2 border-red-400 rounded-xl p-4">
    <div className="flex items-center gap-3">
      <CsvIcon variant="error" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: COLORS.text.title }}>{file.name}</p>
        <button onClick={onRetry} className="text-xs font-semibold mt-0.5 transition-colors" style={{ color: COLORS.primary }}>
          Try again
        </button>
      </div>
      <button onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1">
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════
// ── STEP 2: CONFIRM DETAILS ────────────────────────────────────
// ══════════════════════════════════════════════════════════════
interface ConfirmDetailsProps {
  form: UploadForm;
  uploaded: UploadedFile | null;
  onBack: () => void;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDetails = memo(({ form, uploaded, onBack, onClose, onConfirm }: ConfirmDetailsProps) => {
  const { user } = useAuthStore();

  const details = [
    { label: 'Current Session', value: form.session || '2025/2026' },
    { label: 'Current Semester', value: form.semester || 'First' },
    { label: 'Programme', value: user?.programme || 'Business Administration' },
    { label: 'Student type', value: form.studentType || 'Full time' },
    { label: 'Document uploaded', value: uploaded?.file?.name || `${form.course || 'ACC101'} Result template.csv` },
  ];

  return (
    <div className="flex flex-col h-full px-7 py-7 gap-5">
      {/* ── Header ── */}
      <div>
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors mb-4"
        >
          <ChevronLeft size={16} />
        </button>
        <h2 className="text-xl font-bold mb-1.5" style={{ color: COLORS.text.title }}>Confirm Details</h2>
        <p className="text-sm leading-relaxed" style={{ color: COLORS.text.muted }}>
          Please review the details of this result upload and ensure all information provided is accurate before proceeding.
        </p>
      </div>

      {/* ── Warning banner ── */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-lg bg-amber-50 border border-amber-200">
        <Info size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs font-medium leading-relaxed text-amber-800">
          This action is permanent. Once the result is uploaded, it cannot be edited or deleted.
        </p>
      </div>

      {/* ── Details card ── */}
      <div className="rounded-xl px-5 py-5 flex flex-col gap-5" style={{ backgroundColor: COLORS.lecturer.bioBg }}>
        {details.map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs font-medium mb-0.5" style={{ color: COLORS.text.muted }}>{label}</p>
            <p className="text-sm font-semibold" style={{ color: COLORS.text.title }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      {/* ── Actions ── */}
      <div className="pt-5 border-t border-gray-100 grid grid-cols-2 gap-3">
        <button
          onClick={onClose}
          className="py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          onClick={onConfirm}
          className="py-3.5 rounded-xl text-sm font-semibold text-white bg-[#20A8D8] hover:bg-[#1a91bb] transition-colors"
        >
          Confirm
        </motion.button>
      </div>
    </div>
  );
});
ConfirmDetails.displayName = 'ConfirmDetails';

// ══════════════════════════════════════════════════════════════
// ── DOWNLOAD TEMPLATE DRAWER ───────────────────────────────────
// ══════════════════════════════════════════════════════════════
export const DownloadTemplateDrawer = () => {
  const { downloadTemplateOpen, setDownloadTemplateOpen } = useUIStore();
  const [form, setForm] = useState({
    session: '2025/2026', semester: 'First',
    studentType: 'Full time', department: 'Accounting',
  });
  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));
  const handleClose = () => setDownloadTemplateOpen(false);

  const handleProceed = () => {
    const header = 'S/N,Matriculation Number,Full Name,CA Score,Exam Score,Total\n';
    const rows = Array.from({ length: 20 }, (_, i) => `${i + 1},,,,, `).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `result-template-${form.session.replace('/', '-')}-${form.semester}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    handleClose();
  };

  return (
    <RightDrawer isOpen={downloadTemplateOpen} onClose={handleClose} width={620}>
      <div className="flex flex-col h-full px-7 py-7 gap-5">
        {/* Header — RightDrawer X button still visible */}
        <div className="pr-8">
          <h2 className="text-xl font-bold mb-1.5" style={{ color: COLORS.text.title }}>Download Results Template</h2>
          <p className="text-sm leading-relaxed" style={{ color: COLORS.text.muted }}>
            Download the template to enter student results before uploading.
          </p>
        </div>

        <div className="border-t border-gray-100 -mx-7" />

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DrawerSelect label="Session" placeholder="Select session" options={SESSIONS} value={form.session} onChange={v => set('session', v)} />
            <DrawerSelect label="Semester" placeholder="Select semester" options={SEMESTERS} value={form.semester} onChange={v => set('semester', v)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DrawerSelect label="Student Type" placeholder="Select student type" options={STUDENT_TYPES} value={form.studentType} onChange={v => set('studentType', v)} />
            <DrawerSelect label="Department" placeholder="Select department" options={DEPARTMENTS} value={form.department} onChange={v => set('department', v)} />
          </div>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="pt-5 border-t border-gray-100 grid grid-cols-2 gap-3">
          <button onClick={handleClose} className="py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleProceed}
            className="py-3.5 rounded-xl text-sm font-semibold text-white bg-[#20A8D8] hover:bg-[#1a91bb] transition-colors">
            Proceed
          </motion.button>
        </div>
      </div>
    </RightDrawer>
  );
};

// ─── Shared: drawer select field ──────────────────────────────
interface DrawerSelectProps {
  label: string; placeholder: string;
  options: string[]; value: string;
  onChange: (v: string) => void;
}
const DrawerSelect = memo(({ label, placeholder, options, value, onChange }: DrawerSelectProps) => (
  <div>
    <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.text.subtitle }}>{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(
          'w-full appearance-none px-3.5 py-3 rounded-xl border text-sm outline-none transition-all bg-white',
          'focus:border-[#20A8D8] focus:ring-2 focus:ring-[#20A8D8]/20',
          'border-gray-200',
          value ? 'text-gray-800' : 'text-gray-400'
        )}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  </div>
));
DrawerSelect.displayName = 'DrawerSelect';

// Page stub — upload result is fully drawer-based
const UploadResultPage = () => null;
export default UploadResultPage;
