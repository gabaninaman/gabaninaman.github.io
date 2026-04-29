// Scroll progress indicator
import { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const totalScroll = documentHeight - windowHeight;
      const progress = (scrollTop / totalScroll) * 100;

      setScrollProgress(Math.min(Math.max(progress, 0), 100));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-900 z-[9999]">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Circular progress indicator (bottom right) */}
      {scrollProgress > 10 && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="relative w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full border border-gray-700 transition group focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Scroll to top"
            title="Back to top"
          >
            {/* Progress circle */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-700"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - scrollProgress / 100)}`}
                className="transition-all duration-150"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Arrow icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-300 group-hover:text-white transition absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
