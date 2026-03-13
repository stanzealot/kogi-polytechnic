import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes.constants';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-[8rem] font-bold leading-none text-gray-200">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-2">Page Not Found</h2>
        <p className="text-gray-400 mt-3 max-w-md">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="flex gap-3 mt-8 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="px-5 py-2.5 bg-[#20A8D8] text-white rounded-lg text-sm font-medium hover:bg-[#1a91bb] transition-colors"
          >
            Go Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
