/**
 * Copy Button Component
 * Reusable button to copy text to clipboard with toast notifications
 * Uses react-hot-toast for visual feedback
 */

import { useState } from 'react';
import toast from 'react-hot-toast';
import { copyToClipboard } from '../lib/utils/clipboard';
import { trackButtonClick } from './Analytics';

export default function CopyButton({ text, label = 'Copy', className = '', variant = 'default', trackingLabel = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);

    if (success) {
      setCopied(true);
      toast.success('Copied to clipboard!', {
        duration: 2000,
        position: 'bottom-right',
        style: {
          background: '#10b981',
          color: '#fff',
        },
        icon: '✓',
      });

      // Track copy action
      if (trackingLabel) {
        trackButtonClick(`Copy ${trackingLabel}`, 'CopyButton');
      }

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy', {
        duration: 2000,
        position: 'bottom-right',
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
    }
  };

  const variants = {
    default: 'bg-gray-700 hover:bg-gray-600 text-white',
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white',
    outline: 'border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white bg-transparent',
    minimal: 'text-gray-400 hover:text-white bg-transparent',
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${variants[variant]} ${className}`}
      aria-label={label}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

/**
 * Icon-only Copy Button (compact version)
 */
export function CopyIconButton({ text, size = 'md', trackingLabel = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);

    if (success) {
      setCopied(true);
      toast.success('Copied!', {
        duration: 1500,
        position: 'bottom-right',
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });

      if (trackingLabel) {
        trackButtonClick(`Copy ${trackingLabel}`, 'CopyIconButton');
      }

      setTimeout(() => setCopied(false), 1500);
    }
  };

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <button
      onClick={handleCopy}
      className={`${sizes[size]} inline-flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors duration-200`}
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      )}
    </button>
  );
}

/**
 * Copy Code Block Component
 * For displaying code snippets with copy functionality
 */
export function CopyCodeBlock({ code, language = 'text', className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);

    if (success) {
      setCopied(true);
      toast.success('Code copied!', {
        duration: 2000,
        position: 'bottom-right',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`relative bg-gray-900 rounded-lg border border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs font-mono text-gray-400 uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Code */}
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-gray-300">{code}</code>
      </pre>
    </div>
  );
}
