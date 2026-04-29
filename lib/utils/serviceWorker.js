/**
 * Service Worker Registration Utility
 * Handles PWA service worker registration and lifecycle
 */

/**
 * Register service worker
 * @returns {Promise<ServiceWorkerRegistration|null>}
 */
export async function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('Service Worker not supported');
    return null;
  }

  try {
    // Wait for page load
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        window.addEventListener('load', resolve, { once: true });
      });
    }

    console.log('[SW] Registering Service Worker...');

    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[SW] Service Worker registered:', registration.scope);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('[SW] New Service Worker installing...');

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker available
          console.log('[SW] New content is available; please refresh.');

          // Show update notification
          if (window.confirm('New version available! Reload to update?')) {
            newWorker.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
          }
        }
      });
    });

    // Listen for controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[SW] Controller changed, reloading page...');
      window.location.reload();
    });

    return registration;
  } catch (error) {
    console.error('[SW] Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Unregister service worker
 * @returns {Promise<boolean>}
 */
export async function unregisterServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const success = await registration.unregister();
    console.log('[SW] Service Worker unregistered:', success);
    return success;
  } catch (error) {
    console.error('[SW] Service Worker unregistration failed:', error);
    return false;
  }
}

/**
 * Clear all caches
 * @returns {Promise<boolean>}
 */
export async function clearAllCaches() {
  if (!('caches' in window)) {
    return false;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('[SW] All caches cleared');
    return true;
  } catch (error) {
    console.error('[SW] Cache clearing failed:', error);
    return false;
  }
}

/**
 * Check if service worker is registered and active
 * @returns {boolean}
 */
export function isServiceWorkerActive() {
  return !!(
    'serviceWorker' in navigator &&
    navigator.serviceWorker.controller
  );
}

/**
 * Get service worker registration
 * @returns {Promise<ServiceWorkerRegistration|null>}
 */
export async function getServiceWorkerRegistration() {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  try {
    return await navigator.serviceWorker.ready;
  } catch (error) {
    console.error('[SW] Failed to get registration:', error);
    return null;
  }
}

/**
 * Check for service worker updates manually
 * @returns {Promise<boolean>}
 */
export async function checkForUpdates() {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    console.log('[SW] Update check complete');
    return true;
  } catch (error) {
    console.error('[SW] Update check failed:', error);
    return false;
  }
}

/**
 * Subscribe to push notifications (if needed in future)
 * @param {string} publicKey - VAPID public key
 * @returns {Promise<PushSubscription|null>}
 */
export async function subscribeToPushNotifications(publicKey) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    console.log('[SW] Push subscription:', subscription);
    return subscription;
  } catch (error) {
    console.error('[SW] Push subscription failed:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 * @returns {Promise<boolean>}
 */
export async function unsubscribeFromPushNotifications() {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      console.log('[SW] Push unsubscribed');
      return true;
    }

    return false;
  } catch (error) {
    console.error('[SW] Push unsubscription failed:', error);
    return false;
  }
}

/**
 * Convert VAPID key to Uint8Array
 * @param {string} base64String - Base64 encoded string
 * @returns {Uint8Array}
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Check if app is running in standalone mode (installed PWA)
 * @returns {boolean}
 */
export function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

/**
 * Check if app can be installed (A2HS)
 * @returns {boolean}
 */
export function canInstallApp() {
  return 'beforeinstallprompt' in window;
}
