# Quick Start Guide

Get started with your improved portfolio in 5 minutes!

## Step 1: Verify Everything Works (1 minute)

```bash
# Install dependencies (if needed)
npm install

# Build the site
npm run build

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your portfolio.

---

## Step 2: Add Theme Toggle (2 minutes)

**File:** `pages/index.js`

Add this at the top with other imports:
```jsx
import ThemeToggle from '../components/ThemeToggle';
```

Add this component anywhere in your JSX (recommended: inside your main return statement):
```jsx
<ThemeToggle />
```

**Example:**
```jsx
export default function Home() {
  return (
    <>
      <ThemeToggle />  {/* Add this line */}

      {/* Rest of your homepage */}
      <header>...</header>
      <main>...</main>
    </>
  );
}
```

**Result:** Users can now toggle between dark and light mode! The preference is saved to localStorage.

---

## Step 3: Add Project Filtering (5 minutes)

**File:** `pages/index.js`

1. Import the component and useState:
```jsx
import { useState } from 'react';
import ProjectFilter from '../components/ProjectFilter';
```

2. Add state for filtered projects (inside your component):
```jsx
const [filteredProjects, setFilteredProjects] = useState(user.projects);
```

3. Add the filter component before your projects grid:
```jsx
{/* Projects Section */}
<section id="projects">
  <h2>Projects</h2>

  {/* Add this filter */}
  <ProjectFilter
    projects={user.projects}
    onFilterChange={setFilteredProjects}
  />

  {/* Update this to use filteredProjects */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredProjects.map((project) => (
      <ProjectCard key={project.slug} project={project} />
    ))}
  </div>
</section>
```

**Result:** Users can search and filter your projects by technology!

---

## Step 4: Add Google Analytics (3 minutes)

**Optional but recommended for tracking visitors**

1. Get your GA4 tracking ID:
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a property
   - Copy your Measurement ID (starts with G-)

2. **File:** `pages/_app.js`

Add imports:
```jsx
import Analytics, { reportWebVitals } from '../components/Analytics';
```

Add the Analytics component:
```jsx
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* existing head content */}
      </Head>

      {/* Add this line */}
      <Analytics gaId="G-XXXXXXXXXX" />

      <Component {...pageProps} />
    </>
  )
}

// Add this export
export { reportWebVitals };

export default MyApp;
```

3. Replace `G-XXXXXXXXXX` with your actual GA4 ID

**Result:** Track page views, user interactions, and web vitals!

---

## Step 5: Track Button Clicks (2 minutes)

**File:** Any page with buttons (e.g., `pages/index.js`)

Import the tracking function:
```jsx
import { trackButtonClick, trackDownload } from '../components/Analytics';
```

Add to your buttons:
```jsx
{/* Example: Contact button */}
<button
  onClick={() => {
    smoothScrollTo('contact');
    trackButtonClick('Contact Me', 'Hero Section');
  }}
>
  Contact Me
</button>

{/* Example: Resume download */}
<a
  href="/sg_resume.pdf"
  onClick={() => trackDownload('resume.pdf')}
>
  Download Resume
</a>
```

**Result:** See which buttons users click in Google Analytics!

---

## Bonus: Use Lazy Loading for Images (3 minutes)

**For below-the-fold images (projects, blog posts, etc.)**

Import the component:
```jsx
import LazyImage from '../components/LazyImage';
```

Replace regular `<img>` tags:
```jsx
{/* Before */}
<img src={project.image} alt={project.title} />

{/* After */}
<LazyImage
  src={project.image}
  alt={project.title}
  className="w-full h-64 object-cover"
/>
```

**Result:** Images load only when users scroll to them - faster initial load!

---

## Deploy to GitHub Pages (2 minutes)

```bash
# Build the site
npm run build

# Commit and push changes
git add .
git commit -m "Portfolio improvements: performance, theme toggle, filtering"
git push origin main

# GitHub Pages will automatically deploy the 'out' folder
```

Visit `https://gabaninaman.github.io` in 2-3 minutes to see your live site!

---

## Testing Checklist

Before deploying, test these:

- [ ] Theme toggle works (dark/light mode)
- [ ] Theme preference is saved (refresh page)
- [ ] Project filter works (search and tech filters)
- [ ] Contact form validates correctly
- [ ] Images load smoothly
- [ ] Site works on mobile
- [ ] No console errors

---

## Common Issues

### Issue: "Module not found: Can't resolve '../components/...'"
**Solution:** Check the file path. Components are in `/components/` folder.

### Issue: Theme toggle not showing
**Solution:** Make sure you added `<ThemeToggle />` to your JSX and it's not hidden by z-index issues.

### Issue: Images not optimized
**Solution:** Run `npm run build` to generate optimized images in the `out` folder.

### Issue: Analytics not tracking
**Solution:**
1. Verify your GA4 ID is correct
2. Check browser console for errors
3. Use Google Analytics Debugger extension

---

## Performance Tips

1. **Above-the-fold images:** Use `<ResponsiveImage priority={true} />`
2. **Below-the-fold images:** Use `<LazyImage />`
3. **Large images:** Always optimize first (see image optimization guide)
4. **External links:** Add tracking with `trackExternalLink()`

---

## Next Steps

1. ✅ Add theme toggle
2. ✅ Enable project filtering
3. ✅ Set up analytics
4. ✅ Track button clicks
5. ⬜ Add case studies for projects
6. ⬜ Create skills visualization
7. ⬜ Add testimonials section
8. ⬜ Implement site-wide search
9. ⬜ Add newsletter signup
10. ⬜ Create blog with MDX

---

## Get Help

- **Component Documentation:** See `COMPONENT_USAGE.md`
- **All Improvements:** See `IMPROVEMENTS_SUMMARY.md`
- **Next.js Help:** https://nextjs.org/docs
- **Tailwind Help:** https://tailwindcss.com/docs

---

**You're all set! Your portfolio is now faster, more modern, and ready to impress. 🚀**

Start with Steps 1-3 for immediate visual improvements, then add analytics when you're ready to track visitors.
