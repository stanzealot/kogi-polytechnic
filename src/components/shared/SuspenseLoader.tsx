const SuspenseLoader = () => {
  return (
    <div className="min-h-screen flex flex-col gap-4 p-8 bg-gray-50 animate-pulse">
      {/* Top bar skeleton */}
      <div className="flex gap-4 mb-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-1 bg-white rounded-xl p-5 shadow-sm flex flex-col gap-3"
          >
            <div className="h-4 bg-gray-200 rounded w-2/5" />
            <div className="h-8 bg-gray-200 rounded w-3/5" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="flex gap-4">
        <div className="flex-1 bg-white rounded-xl p-6 min-h-[400px] shadow-sm flex flex-col gap-4">
          <div className="h-5 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-100 rounded-lg" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};

export default SuspenseLoader;
