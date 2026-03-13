import { useState, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Eye, EyeOff, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils';
import { COLORS } from '@/constants/theme.constants';
import { useAuthStore } from '@/store/auth.store';

type SettingsTab = 'bio' | 'password' | 'signature';
const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'bio',       label: 'Bio & Other details' },
  { id: 'password',  label: 'Change Password'     },
  { id: 'signature', label: 'Upload Signature'    },
];
const ACADEMIC_RANKS = ['Professor','Associate Professor','Senior Lecturer','Lecturer I','Lecturer II','Assistant Lecturer','Graduate Assistant'];
const COUNTRY_CODES = [
  { code: '+234', flag: '🇳🇬' },{ code: '+1', flag: '🇺🇸' },{ code: '+44', flag: '🇬🇧' },
  { code: '+233', flag: '🇬🇭' },{ code: '+254', flag: '🇰🇪' },
];

// ── Page ──────────────────────────────────────────────────────
const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('bio');
  return (
    <div className="flex flex-col gap-5 max-w-[1100px]">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: COLORS.text.title }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: COLORS.text.muted }}>Manage your account settings and preferences</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* Left nav */}
          <nav className="flex md:flex-col border-b md:border-b-0 md:border-r border-gray-100 md:w-[220px] flex-shrink-0">
            <div className="flex md:flex-col w-full overflow-x-auto md:overflow-visible p-2 md:p-3 gap-1">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={cn('relative whitespace-nowrap text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 flex-shrink-0 md:flex-shrink',
                    activeTab === tab.id ? 'text-[#20A8D8]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  )}
                  style={activeTab === tab.id ? { backgroundColor: '#EBF8FD' } : {}}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="st-active" className="hidden md:block absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-[#20A8D8]" />
                  )}
                </button>
              ))}
            </div>
          </nav>
          {/* Right content */}
          <div className="flex-1 p-6 md:p-8 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === 'bio' && <motion.div key="bio" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}><BioTab /></motion.div>}
              {activeTab === 'password' && <motion.div key="pw" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}><PasswordTab /></motion.div>}
              {activeTab === 'signature' && <motion.div key="sig" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}><SignatureTab /></motion.div>}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Tab 1: Bio ────────────────────────────────────────────────
const BioTab = () => {
  const { user, login, token } = useAuthStore();
  const [avatarSrc, setAvatarSrc] = useState<string | null>(user?.avatar ?? null);
  const [form, setForm] = useState({ fullName: user?.name ?? 'Julius Adebo', phoneCode: '+234', phone: user?.mobile ?? '8146628482', email: user?.email ?? 'julius@getflick.app', academicRank: 'Senior Lecturer' });
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatarSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (user && token) login({ ...user, name: form.fullName, email: form.email, mobile: form.phone, avatar: avatarSrc ?? undefined }, token);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-5 max-w-[600px]">
      {/* Avatar row */}
      <div className="flex items-center justify-between pb-5 border-b border-gray-100">
        <div className="relative">
          {avatarSrc ? (
            <img src={avatarSrc} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-gray-100" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-100">
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-gray-400" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {avatarSrc && (
            <button onClick={() => { setAvatarSrc(null); if (fileRef.current) fileRef.current.value = ''; }}
              className="p-2.5 rounded-lg border border-gray-200 text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors" title="Remove photo">
              <Trash2 size={16} />
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <Upload size={15} /> Upload
          </button>
        </div>
      </div>

      {/* Full name */}
      <InputField label="Full name" value={form.fullName} onChange={v => set('fullName', v)} placeholder="Enter your full name" />

      {/* Phone + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.text.subtitle }}>Phone number</label>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#20A8D8] focus-within:ring-2 focus-within:ring-[#20A8D8]/20 transition-all">
            <select value={form.phoneCode} onChange={e => set('phoneCode', e.target.value)}
              className="px-2 py-2.5 text-sm bg-white border-r border-gray-200 outline-none appearance-none cursor-pointer flex-shrink-0">
              {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
            </select>
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
              className="flex-1 px-3 py-2.5 text-sm outline-none min-w-0 bg-white" placeholder="8000000000" />
          </div>
        </div>
        <InputField label="Email address" value={form.email} onChange={v => set('email', v)} type="email" placeholder="your@email.com" />
      </div>

      {/* Academic rank */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.text.subtitle }}>Academic Rank</label>
        <div className="relative">
          <select value={form.academicRank} onChange={e => set('academicRank', e.target.value)}
            className="w-full appearance-none px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#20A8D8] focus:ring-2 focus:ring-[#20A8D8]/20 bg-white text-gray-800 transition-all">
            {ACADEMIC_RANKS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <SaveButton saved={saved} onClick={handleSave} />
    </div>
  );
};

// ── Tab 2: Password ───────────────────────────────────────────
const PasswordTab = () => {
  const [form, setForm] = useState({ old: '', newPass: '', confirm: '' });
  const [show, setShow] = useState({ old: false, newPass: false, confirm: false });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const set = (k: keyof typeof form, v: string) => { setForm(p => ({ ...p, [k]: v })); setError(''); };
  const toggleShow = (k: keyof typeof show) => setShow(p => ({ ...p, [k]: !p[k] }));

  const handleSave = () => {
    if (!form.old || !form.newPass || !form.confirm) { setError('Please fill in all fields.'); return; }
    if (form.newPass !== form.confirm) { setError('New passwords do not match.'); return; }
    if (form.newPass.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setSaved(true);
    setForm({ old: '', newPass: '', confirm: '' });
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-5 max-w-[600px]">
      <PasswordField label="Old Password" value={form.old} onChange={v => set('old', v)} show={show.old} onToggle={() => toggleShow('old')} />
      <PasswordField label="New Password" value={form.newPass} onChange={v => set('newPass', v)} show={show.newPass} onToggle={() => toggleShow('newPass')} />
      <PasswordField label="Confirm Password" value={form.confirm} onChange={v => set('confirm', v)} show={show.confirm} onToggle={() => toggleShow('confirm')} />
      <AnimatePresence>
        {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs font-medium text-red-500">{error}</motion.p>}
      </AnimatePresence>
      <SaveButton saved={saved} onClick={handleSave} />
    </div>
  );
};

// ── Tab 3: Upload Signature ───────────────────────────────────
const SignatureTab = () => {
  const [sigSrc, setSigSrc] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setSigSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="flex flex-col gap-6 max-w-[600px]">
      <div className="pb-5 border-b border-gray-100">
        {/* Signature preview */}
        <div className="mb-4">
          {sigSrc ? (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              className="w-48 h-28 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
              <img src={sigSrc} alt="Signature" className="max-w-full max-h-full object-contain p-2" />
            </motion.div>
          ) : (
            <div className="w-48 h-28 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
              <ImageIcon size={28} className="text-gray-300" />
            </div>
          )}
        </div>
        {/* Actions row — mirrors Bio Upload row but right-aligned */}
        <div className="flex items-center gap-2 justify-end">
          {sigSrc && (
            <button onClick={() => { setSigSrc(null); if (fileRef.current) fileRef.current.value = ''; }}
              className="p-2.5 rounded-lg border border-gray-200 text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors" title="Remove signature">
              <Trash2 size={16} />
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <Upload size={15} /> Upload
          </button>
        </div>
      </div>
      <SaveButton saved={saved} onClick={handleSave} />
    </div>
  );
};

// ── Shared ────────────────────────────────────────────────────
const InputField = memo(({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
  <div>
    <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.text.subtitle }}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#20A8D8] focus:ring-2 focus:ring-[#20A8D8]/20 transition-all bg-white"
      style={{ color: COLORS.text.title }} />
  </div>
));
InputField.displayName = 'InputField';

const PasswordField = memo(({ label, value, onChange, show, onToggle, placeholder = '••••••••' }: { label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; placeholder?: string }) => (
  <div>
    <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.text.subtitle }}>{label}</label>
    <div className="relative">
      <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3.5 py-2.5 pr-11 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#20A8D8] focus:ring-2 focus:ring-[#20A8D8]/20 transition-all bg-white"
        style={{ color: COLORS.text.title }} />
      <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5">
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  </div>
));
PasswordField.displayName = 'PasswordField';

const SaveButton = ({ saved, onClick }: { saved: boolean; onClick: () => void }) => (
  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={onClick}
    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold w-fit transition-colors"
    style={{ backgroundColor: saved ? COLORS.feedback.success : COLORS.primary }}>
    <AnimatePresence mode="wait">
      {saved ? (
        <motion.span key="saved" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
          <CheckCircle2 size={15} /> Saved!
        </motion.span>
      ) : (
        <motion.span key="save" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>Save Changes</motion.span>
      )}
    </AnimatePresence>
  </motion.button>
);

export default SettingsPage;
