/**
 * Share Buttons Component
 * Social sharing with native Web Share API fallback
 * Supports Twitter, LinkedIn, Facebook, and native sharing
 */

import { useState } from 'react';
import toast from 'react-hot-toast';
import { copyToClipboard } from '../lib/utils/clipboard';
import { trackButtonClick } from './Analytics';

export default function ShareButtons({ url, title, description, variant = 'default' }) {
  const [showMenu, setShowMenu] = useState(false);

  // Use current page if no URL provided
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || 'Check out this portfolio';
  const shareDescription = description || '';

  // Check if Web Share API is available
  const canShare = typeof navigator !== 'undefined' && navigator.share;

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareDescription,
        url: shareUrl,
      });
      trackButtonClick('Native Share', 'ShareButtons');
      toast.success('Shared successfully!');
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        toast.error('Failed to share');
      }
    }
  };

  const shareOnPlatform = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedDescription = encodeURIComponent(shareDescription);

    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      hackernews: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'noopener,noreferrer,width=600,height=600');
      trackButtonClick(`Share on ${platform}`, 'ShareButtons');
      setShowMenu(false);
    }
  };

  const copyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      toast.success('Link copied to clipboard!');
      trackButtonClick('Copy Link', 'ShareButtons');
      setShowMenu(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className="relative inline-block">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Share
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
              <div className="p-2">
                {canShare && (
                  <ShareMenuItem
                    icon="📱"
                    label="Share via..."
                    onClick={handleNativeShare}
                  />
                )}
                <ShareMenuItem
                  icon={<TwitterIcon />}
                  label="Twitter"
                  onClick={() => shareOnPlatform('twitter')}
                />
                <ShareMenuItem
                  icon={<LinkedInIcon />}
                  label="LinkedIn"
                  onClick={() => shareOnPlatform('linkedin')}
                />
                <ShareMenuItem
                  icon={<FacebookIcon />}
                  label="Facebook"
                  onClick={() => shareOnPlatform('facebook')}
                />
                <ShareMenuItem
                  icon="📧"
                  label="Email"
                  onClick={() => shareOnPlatform('email')}
                />
                <div className="border-t border-gray-700 my-2" />
                <ShareMenuItem
                  icon="📋"
                  label="Copy Link"
                  onClick={copyLink}
                />
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Default variant - horizontal buttons
  return (
    <div className="flex flex-wrap gap-2">
      {canShare && (
        <button
          onClick={handleNativeShare}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Share
        </button>
      )}

      <ShareButton
        icon={<TwitterIcon />}
        label="Twitter"
        onClick={() => shareOnPlatform('twitter')}
        color="hover:bg-blue-600"
      />

      <ShareButton
        icon={<LinkedInIcon />}
        label="LinkedIn"
        onClick={() => shareOnPlatform('linkedin')}
        color="hover:bg-blue-700"
      />

      <ShareButton
        icon={<FacebookIcon />}
        label="Facebook"
        onClick={() => shareOnPlatform('facebook')}
        color="hover:bg-blue-800"
      />

      <button
        onClick={copyLink}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        Copy Link
      </button>
    </div>
  );
}

// Share Button Component
function ShareButton({ icon, label, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors ${color}`}
      aria-label={`Share on ${label}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

// Share Menu Item Component
function ShareMenuItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors text-sm"
    >
      {typeof icon === 'string' ? <span className="text-lg">{icon}</span> : icon}
      <span>{label}</span>
    </button>
  );
}

// Social Media Icons
function TwitterIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

/**
 * Floating Share Button (sticky)
 */
export function FloatingShareButton({ url, title, description }) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <ShareButtons url={url} title={title} description={description} variant="compact" />
    </div>
  );
}
