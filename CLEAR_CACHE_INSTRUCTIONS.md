# How to Clear Service Worker Cache

## The Problem
You're seeing the old broken code because the Service Worker cached it. The new fixed code was built successfully, but your browser is serving the cached version.

## Quick Fix (Choose One)

### Option 1: Hard Refresh (Easiest)
1. Open your site in the browser
2. Press:
   - **Mac:** `CMD + SHIFT + R`
   - **Windows/Linux:** `CTRL + SHIFT + R`
3. This bypasses the cache and loads fresh files

### Option 2: Clear Service Worker in DevTools
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers** (left sidebar)
4. Click **Unregister** next to your service worker
5. Go to **Storage** (left sidebar)
6. Click **Clear site data**
7. Refresh the page (F5)

### Option 3: Incognito/Private Window
1. Open an **Incognito** (Chrome) or **Private** (Firefox/Safari) window
2. Visit your site
3. It will load the fresh version without cache

### Option 4: Clear All Browser Data
1. Open browser settings
2. Privacy & Security
3. Clear browsing data
4. Select "Cached images and files"
5. Click Clear data
6. Refresh your site

---

## For Deployment (GitHub Pages)

When you push to GitHub:
```bash
git add .
git commit -m "Fix: Handle array descriptions in Command Palette"
git push origin main
```

The Service Worker will automatically:
1. Detect new version
2. Download new files
3. Prompt user to reload
4. Update to new version

---

## Why This Happened

The Service Worker was doing its job too well! It cached:
- `/_next/static/chunks/*.js` - Your JavaScript files
- `/` - The homepage

When you fixed the code and rebuilt, the Service Worker kept serving the old cached files instead of the new ones.

---

## Testing the Fix

After clearing cache:
1. Open site (fresh, no cache)
2. Open DevTools Console (F12)
3. You should see NO errors
4. Press CMD+K
5. Command Palette opens perfectly!
6. Try typing in search
7. Everything works!

---

## Preventing This During Development

### Disable Service Worker in Dev
The Service Worker only registers in **production** mode. During development with `npm run dev`, it won't cache anything.

### For Local Testing
If you want to test the production build locally:

```bash
# Build the site
npm run build

# Serve it locally with cache disabled
npx serve out -s --no-cache

# Or with Python
cd out
python3 -m http.server 8000
```

Then visit `http://localhost:8000` - no Service Worker will interfere.

---

## The Fix is Already in Your Code

The build was successful:
- ✅ CommandPalette.jsx - Fixed to handle array descriptions
- ✅ ProjectFilter.jsx - Fixed to handle array descriptions
- ✅ Build completed with zero errors

You just need to clear the old cached version from your browser!

---

## Quick Test Script

Run this in your browser console to check if cache is cleared:

```javascript
// Check Service Worker status
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations.length);
  registrations.forEach(registration => {
    console.log('SW Scope:', registration.scope);
  });
});

// Check cache storage
caches.keys().then(keys => {
  console.log('Caches:', keys);
});
```

After clearing, both should show empty or minimal data.

---

**TL;DR: Press CMD+SHIFT+R (Mac) or CTRL+SHIFT+R (Windows) to hard refresh and bypass cache!**
