/**
 * Clipboard Utility
 * Copy text to clipboard with fallback support and toast notifications
 */

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
  try {
    // Modern Clipboard API (preferred)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers or non-HTTPS
    return fallbackCopyToClipboard(text);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return fallbackCopyToClipboard(text);
  }
}

/**
 * Fallback clipboard copy using execCommand
 * @param {string} text - Text to copy
 * @returns {boolean} Success status
 */
function fallbackCopyToClipboard(text) {
  try {
    // Create temporary textarea
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Make it invisible but still accessible
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.setAttribute('readonly', '');

    document.body.appendChild(textArea);

    // Select and copy
    textArea.select();
    textArea.setSelectionRange(0, 99999); // For mobile devices

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    return successful;
  } catch (error) {
    console.error('Fallback copy failed:', error);
    return false;
  }
}

/**
 * Copy with visual feedback
 * @param {string} text - Text to copy
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export async function copyWithFeedback(text, onSuccess, onError) {
  const success = await copyToClipboard(text);

  if (success && onSuccess) {
    onSuccess();
  } else if (!success && onError) {
    onError();
  }

  return success;
}

/**
 * Format text for sharing (email, social media, etc.)
 * @param {Object} options - Share options
 * @returns {string} Formatted text
 */
export function formatShareText({ title, url, description }) {
  let text = '';

  if (title) {
    text += `${title}\n\n`;
  }

  if (description) {
    text += `${description}\n\n`;
  }

  if (url) {
    text += url;
  }

  return text.trim();
}

/**
 * Copy URL with query parameters
 * @param {Object} params - Query parameters to add
 * @returns {Promise<boolean>} Success status
 */
export async function copyUrlWithParams(params = {}) {
  const url = new URL(window.location.href);

  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return copyToClipboard(url.toString());
}

/**
 * Check if clipboard API is available
 * @returns {boolean} Availability status
 */
export function isClipboardAvailable() {
  return !!(
    navigator.clipboard ||
    document.queryCommandSupported?.('copy')
  );
}
