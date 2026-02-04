import { useEffect, useState } from 'react';

const Loader = ({ isVisible }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
    } else {
      // Delay hiding to allow smooth transition
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Loader Container */}
      <div className="flex flex-col items-center gap-6">
        {/* Logo with Spinner */}
        <div className="relative w-24 h-24">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin"></div>

          {/* Middle spinning ring */}
          <div className="absolute inset-2 rounded-full border-4 border-teal-50 border-b-teal-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>

          {/* Inner logo */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center">
            <span className="text-white font-bold text-3xl">H</span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading</h2>
          <div className="flex gap-1 justify-center">
            <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>

        {/* Loading message */}
        <p className="text-sm text-gray-500">Getting things ready...</p>
      </div>
    </div>
  );
};

export default Loader;
