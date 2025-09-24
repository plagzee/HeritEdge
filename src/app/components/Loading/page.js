import { FaSpinner } from "react-icons/fa";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-stone-900 to-stone-800">
      <div className="w-12 h-12 border-4 border-amber-200 border-t-transparent rounded-full animate-spin">
        <FaSpinner />
      </div>
    </div>
  );
};

export default LoadingSpinner;