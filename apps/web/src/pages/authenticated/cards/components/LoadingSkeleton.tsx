export const LoadingSkeleton = () => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="h-72 rounded-3xl border border-[#E5E7EB] bg-white shadow-[0px_28px_48px_-28px_rgba(15,23,42,0.12)]"
        />
      ))}
    </div>
  );
};

