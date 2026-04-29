/**
 * Enhanced Scroll Progress Component
 * Shows progress bar, current section indicator, and navigation dots
 */

import { useState, useEffect } from 'react';

export default function ScrollProgressEnhanced({ sections = [] }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(null);
  const [showNav, setShowNav] = useState(false);

  // Default sections if none provided
  const defaultSections = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'about', label: 'About', icon: '👤' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'contact', label: 'Contact', icon: '📧' },
  ];

  const sectionList = sections.length > 0 ? sections : defaultSections;

  useEffect(() => {
    const handleScroll = () => {
      // Calculate overall scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const totalScroll = documentHeight - windowHeight;
      const progress = (scrollTop / totalScroll) * 100;

      setScrollProgress(Math.min(Math.max(progress, 0), 100));

      // Determine active section
      const sections = sectionList.map(section => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const top = rect.top;
          const height = rect.height;
          // Section is considered active if its top is in the upper half of viewport
          const isActive = top < windowHeight / 2 && top + height > 0;
          return { ...section, isActive, top, element };
        }
        return null;
      }).filter(Boolean);

      // Find the topmost active section
      const currentSection = sections.find(s => s.isActive) || sections[0];
      if (currentSection) {
        setActiveSection(currentSection.id);
      }

      // Show navigation after scrolling a bit
      setShowNav(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionList]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Top progress bar with section markers */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-900 z-[9999]">
        {/* Progress fill */}
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />

        {/* Section markers */}
        <div className="absolute inset-0 flex justify-around pointer-events-none">
          {sectionList.map((section, index) => {
            const position = (index / (sectionList.length - 1)) * 100;
            return (
              <div
                key={section.id}
                className="absolute top-0 bottom-0 w-px bg-gray-700"
                style={{ left: `${position}%` }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-700" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Current section indicator (top-left) */}
      {showNav && activeSection && (
        <div className="fixed top-4 left-4 z-[9998] animate-fade-in-up">
          <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {sectionList.find(s => s.id === activeSection)?.icon}
              </span>
              <span className="text-sm font-medium text-gray-300">
                {sectionList.find(s => s.id === activeSection)?.label}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Side navigation dots (right side) */}
      {showNav && (
        <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
          <ul className="space-y-3">
            {sectionList.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`group relative block w-3 h-3 rounded-full transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  aria-label={`Navigate to ${section.label}`}
                >
                  {/* Tooltip */}
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs font-medium text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <span className="mr-1">{section.icon}</span>
                    {section.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Circular progress indicator with back-to-top (bottom right) */}
      {scrollProgress > 10 && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="relative w-14 h-14 bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700 rounded-full border border-gray-700 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xl hover:shadow-2xl hover:scale-110"
            aria-label="Scroll to top"
            title="Back to top"
          >
            {/* Progress circle */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-700"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - scrollProgress / 100)}`}
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
              className="h-6 w-6 text-gray-300 group-hover:text-white transition absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
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

            {/* Percentage text (on hover) */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs font-medium text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              {Math.round(scrollProgress)}%
            </div>
          </button>
        </div>
      )}
    </>
  );
}

/**
 * Simple version - just the progress bar and back-to-top button
 */
export function ScrollProgressSimple() {
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
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-900 z-[9999]">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Back to top button */}
      {scrollProgress > 10 && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full border border-gray-700 transition group focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xl hover:shadow-2xl flex items-center justify-center"
            aria-label="Scroll to top"
          >
            <svg
              className="h-6 w-6 text-gray-300 group-hover:text-white transition"
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
