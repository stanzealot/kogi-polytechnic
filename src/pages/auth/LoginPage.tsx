import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowLeft, ExternalLink } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/constants/routes.constants';
import { APP_NAME } from '@/constants/app.constants';
import { cn } from '@/utils';
import type { User } from '@/types';

// ─── Validation Schema ─────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});
type LoginFormData = z.infer<typeof loginSchema>;

// ─── News Slider Data ──────────────────────────────────────────
const NEWS_SLIDES = [
  {
    id: 1,
    label: 'News update',
    headline: 'Polytechnic Launches New Academic Session',
    body: 'The 2025/2026 academic session has officially commenced. All students and staff are advised to complete registration on the portal.',
    author: 'ITRC Director',
  },
  {
    id: 2,
    label: 'News update',
    headline: 'Result Upload Deadline Extended',
    body: 'Lecturers are reminded that the deadline for uploading first semester results has been extended to January 31st, 2026.',
    author: 'Academic Affairs',
  },
  {
    id: 3,
    label: 'News update',
    headline: 'ICT Training for Academic Staff',
    body: 'A free ICT training programme for all academic staff is scheduled for next week. Register now through the portal to secure your spot.',
    author: 'ITRC Director',
  },
];

// ─── Login Page ────────────────────────────────────────────────
const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left Panel — Building Image + News Slider ── */}
      <LeftPanel />

      {/* ── Right Panel — Login Form ── */}
      <div className="flex-1 flex flex-col justify-center bg-white px-6 sm:px-10 md:px-16 py-10 lg:py-0 min-h-screen lg:min-h-0 lg:max-w-[50%]">
        {/* Back to portal */}
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 text-sm text-[#20A8D8] font-medium mb-8 self-start hover:underline"
        >
          <ArrowLeft size={16} />
          Back to portal home
        </Link>

        <div className="w-full max-w-[420px] mx-auto">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

// ─── Left Panel ────────────────────────────────────────────────
const LeftPanel = () => {
  const [current, setCurrent] = useState(0);
  const total = NEWS_SLIDES.length;

  // Auto-advance every 4 seconds
  const advance = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    const timer = setInterval(advance, 4000);
    return () => clearInterval(timer);
  }, [advance]);

  return (
    <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
      {/* Building image — replace src when available */}
      <img
        src="/images/school-building.jpeg"
        alt="Kogi State Polytechnic Campus"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

      {/* Fallback gradient if image fails */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(160deg, #1a2a3a 0%, #2d4a6b 60%, #1f3a52 100%)',
        }}
      />

      {/* Back to portal — top left */}
      <Link
        to={ROUTES.HOME}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/90 text-sm hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        Back to portal home
      </Link>

      {/* ── Glass News Slider ── */}
      <div className="absolute bottom-8 left-6 right-6 z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="rounded-xl p-5 backdrop-blur-md"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            }}
          >
            <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-2">
              {NEWS_SLIDES[current].label}
            </p>
            <h3 className="text-white font-semibold text-base leading-snug mb-1">
              {NEWS_SLIDES[current].headline}
            </h3>
            <p className="text-white/75 text-sm leading-relaxed line-clamp-2">
              {NEWS_SLIDES[current].body}
            </p>

            <div className="flex items-center justify-between mt-4">
              <span className="text-white/60 text-xs">
                {NEWS_SLIDES[current].author}
              </span>
              <button className="flex items-center gap-1 text-[#20A8D8] text-xs font-medium hover:text-[#4fc8e8] transition-colors">
                Read more <ExternalLink size={11} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="flex items-center gap-2 mt-4">
          {NEWS_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                'transition-all duration-300 rounded-full',
                i === current
                  ? 'w-6 h-2 bg-[#20A8D8]'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Login Form ────────────────────────────────────────────────
const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo =
    (location.state as { from?: string })?.from || ROUTES.LECTURER.DASHBOARD;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    // TODO: Replace with actual API call
    await new Promise((r) => setTimeout(r, 1200)); // Simulate network

    // Mock successful login
    const mockUser: User = {
      id: '1',
      name: 'Julius Adebo',
      email: data.email,
      role: 'lecturer',
      title: 'Senior Lecturer',
      faculty: 'School of Management Studies',
      programme: 'Business Administration',
      mobile: '08146628482',
    };

    login(mockUser, 'mock-jwt-token');
    navigate(redirectTo, { replace: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Logo */}
      <div className="flex flex-col items-start mb-8">
        <img
          src="/images/logo2.png"
          alt="KSP Crest"
          className="object-contain mb-[24px]"
          onError={(e) => {
            const el = e.target as HTMLImageElement;
            el.style.display = 'none';
            el.parentElement!.innerHTML = `<span class="text-[#20A8D8] font-bold text-lg">KSP</span>`;
          }}
        />

        <h1
          className="text-2xl font-bold text-center"
          style={{ color: '#171A1F' }}
        >
          {APP_NAME}
        </h1>
        <p className="text-md mt-1 text-center" style={{ color: '#1F2329' }}>
          Welcome back! Please enter your details.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5"
      >
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1.5"
            style={{ color: '#1F2329' }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            {...register('email')}
            className={cn(
              'w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all',
              'placeholder:text-gray-300',
              errors.email
                ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                : 'border-gray-300 focus:border-[#20A8D8] focus:ring-2 focus:ring-[#20A8D8]/20',
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1.5"
            style={{ color: '#1F2329' }}
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
              className={cn(
                'w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all pr-10',
                'placeholder:text-gray-300',
                errors.password
                  ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-300 focus:border-[#20A8D8] focus:ring-2 focus:ring-[#20A8D8]/20',
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="w-4 h-4 rounded border-gray-300 accent-[#20A8D8] cursor-pointer"
            />
            <span className="text-sm" style={{ color: '#1F2329' }}>
              Remember me
            </span>
          </label>
          <Link
            to="#"
            className="text-sm text-[#20A8D8] font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          className={cn(
            'w-full py-3 rounded-lg text-white text-sm font-semibold transition-all',
            'flex items-center justify-center gap-2',
            isSubmitting
              ? 'bg-[#20A8D8]/60 cursor-not-allowed'
              : 'bg-[#20A8D8] hover:bg-[#1a91bb] active:bg-[#178cb3]',
          )}
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </>
          ) : (
            'Button'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default LoginPage;
