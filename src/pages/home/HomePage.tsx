import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes.constants';
import {
  APP_NAME,
  APP_TAGLINE,
  APP_SUBTITLE,
  POWERED_BY,
} from '@/constants/app.constants';

// ─── Portal Card Data ──────────────────────────────────────────
const PORTAL_CARDS = [
  {
    id: 'edu',
    title: 'Edu-Portal',
    subtitle: 'Click here to login to your portal',
    bg: '#20A8D8',
    route: ROUTES.LOGIN,
  },
  {
    id: 'ful',
    title: 'FUL Conversion Programme Portal',
    subtitle: 'Click here to login to your portal',
    bg: '#F86C6B',
    route: ROUTES.LOGIN,
  },
  {
    id: 'payments',
    title: 'Other Payments',
    subtitle:
      'Click here to make Payments for Certificate, Transcript, statement of result etc..',
    bg: '#4DBD74',
    route: ROUTES.LOGIN,
  },
  {
    id: 'apply',
    title: 'Apply Online',
    subtitle: 'Click here to apply to our various programme.',
    bg: '#272C33',
    route: ROUTES.LOGIN,
  },
];

// ─── Animation Variants ────────────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const leftVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

// ─── Component ─────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* ── Left Panel ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={leftVariants}
        className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-10 lg:py-0 lg:max-w-[55%]"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12 lg:mb-16">
          <div className="w-10 h-10 rounded-full bg-[#20A8D8] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
            <img
              src="/images/logo.png"
              alt={APP_NAME}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="hidden only-if-no-img">KSP</span>
          </div>
          <span className="text-lg font-bold tracking-wide uppercase text-[#000000]">
            {APP_NAME}
          </span>
        </div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1
            className="text-3xl sm:text-4xl font-bold mb-2"
            style={{ color: '#171A1F' }}
          >
            {APP_TAGLINE}
          </h1>
          <p className="text-sm mb-8" style={{ color: '#1F2329' }}>
            {APP_SUBTITLE}
          </p>
        </motion.div>

        {/* Portal Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-3 w-full max-w-[520px]"
        >
          {PORTAL_CARDS.map((card) => (
            <PortalCard
              key={card.id}
              card={card}
              onClick={() => navigate(card.route)}
            />
          ))}
        </motion.div>

        {/* Footer */}
        <p className="mt-10 text-xs text-gray-400 text-center lg:text-right">
          {POWERED_BY}
        </p>
      </motion.div>

      {/* ── Right Panel — School Image ── */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden">
        <img
          src="/images/school-building.jpeg"
          alt="Kogi State Polytechnic Campus"
          className="w-full h-full object-cover"
        />
        {/* Gradient fallback background shown when no image */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(135deg, #1a2a3a 0%, #2d4a6b 50%, #1f3a52 100%)',
          }}
        />
      </div>
    </div>
  );
};

// ─── Portal Card ───────────────────────────────────────────────
interface PortalCardProps {
  card: (typeof PORTAL_CARDS)[number];
  onClick: () => void;
}

const PortalCard = ({ card, onClick }: PortalCardProps) => {
  return (
    <motion.button
      variants={cardVariants}
      whileHover={{ scale: 1.015, x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center justify-between px-5 py-4 rounded-lg text-left transition-shadow hover:shadow-md"
      style={{ backgroundColor: card.bg }}
    >
      <div>
        <p className="text-white font-semibold text-sm sm:text-base leading-tight">
          {card.title}
        </p>
        <p className="text-white/80 text-xs mt-0.5 leading-snug">
          {card.subtitle}
        </p>
      </div>
      <ChevronRight size={20} className="text-white flex-shrink-0 ml-4" />
    </motion.button>
  );
};

export default HomePage;
