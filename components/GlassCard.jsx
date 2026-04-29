/**
 * Glassmorphism Card Component
 * Modern glass-effect cards with backdrop blur and transparency
 * Multiple variants for different use cases
 */

export default function GlassCard({
  children,
  className = '',
  variant = 'default',
  hover = true,
  bordered = true,
  onClick,
  as: Component = 'div',
}) {
  const variants = {
    default: 'bg-gray-900/50 backdrop-blur-md',
    light: 'bg-white/10 backdrop-blur-lg',
    dark: 'bg-black/30 backdrop-blur-md',
    purple: 'bg-purple-500/10 backdrop-blur-md border-purple-500/20',
    pink: 'bg-pink-500/10 backdrop-blur-md border-pink-500/20',
    cyan: 'bg-cyan-500/10 backdrop-blur-md border-cyan-500/20',
    gradient: 'bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10 backdrop-blur-md',
  };

  const hoverClasses = hover
    ? 'hover:bg-opacity-60 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300'
    : '';

  const borderClasses = bordered
    ? 'border border-gray-700/50'
    : '';

  const cursorClass = onClick ? 'cursor-pointer' : '';

  return (
    <Component
      className={`rounded-xl ${variants[variant]} ${borderClasses} ${hoverClasses} ${cursorClass} ${className}`}
      onClick={onClick}
      style={{
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }}
    >
      {children}
    </Component>
  );
}

/**
 * Glass Section
 * Full-width glass section for page sections
 */
export function GlassSection({ children, className = '', variant = 'default', id }) {
  return (
    <section id={id} className={`relative ${className}`}>
      <GlassCard variant={variant} bordered={false} hover={false} className="w-full p-8 md:p-12">
        {children}
      </GlassCard>
    </section>
  );
}

/**
 * Glass Modal
 * Modal dialog with glassmorphism effect
 */
export function GlassModal({ isOpen, onClose, children, title, className = '' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <GlassCard
        variant="dark"
        className={`relative max-w-2xl w-full max-h-[90vh] overflow-y-auto ${className}`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </GlassCard>
    </div>
  );
}

/**
 * Glass Button
 * Button with glassmorphism effect
 */
export function GlassButton({
  children,
  variant = 'default',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}) {
  const variants = {
    default: 'bg-gray-700/50 hover:bg-gray-600/50 text-white',
    primary: 'bg-gradient-to-r from-purple-600/50 to-pink-600/50 hover:from-purple-600/70 hover:to-pink-600/70 text-white',
    secondary: 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300',
    outline: 'bg-transparent border-2 border-gray-700/50 hover:border-gray-600/50 text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`backdrop-blur-md rounded-lg font-medium transition-all duration-200 ${variants[variant]} ${sizes[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'
      } ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * Glass Input
 * Input field with glassmorphism effect
 */
export function GlassInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  error,
  label,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 bg-gray-900/50 backdrop-blur-md border ${
          error ? 'border-red-500' : 'border-gray-700/50'
        } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

/**
 * Glass Badge
 * Small badge/tag with glass effect
 */
export function GlassBadge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-700/50 text-gray-300',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    pink: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    green: 'bg-green-500/20 text-green-300 border-green-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 backdrop-blur-md rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * Glass Tooltip
 * Tooltip with glassmorphism effect
 */
export function GlassTooltip({ children, content, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute ${positions[position]} z-50 px-3 py-2 bg-gray-900/90 backdrop-blur-md border border-gray-700/50 rounded-lg text-sm text-white whitespace-nowrap pointer-events-none shadow-xl`}
        >
          {content}
        </div>
      )}
    </div>
  );
}

/**
 * Glass Dropdown
 * Dropdown menu with glassmorphism
 */
export function GlassDropdown({ trigger, children, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`absolute right-0 mt-2 min-w-[200px] bg-gray-900/90 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-2xl z-50 py-2 ${className}`}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Glass Progress Bar
 * Progress bar with glass effect
 */
export function GlassProgress({ value = 0, max = 100, label, className = '' }) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">{label}</span>
          <span className="text-sm text-gray-400">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-gray-900/50 backdrop-blur-md rounded-full overflow-hidden border border-gray-700/50">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Import useState for tooltip and dropdown
import { useState } from 'react';
