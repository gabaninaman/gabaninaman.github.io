# Component Usage Guide

This guide explains how to use the new components added to your portfolio.

## Table of Contents

1. [Loading Skeletons](#loading-skeletons)
2. [Responsive Images](#responsive-images)
3. [Lazy Loading Images](#lazy-loading-images)
4. [Theme Toggle](#theme-toggle)
5. [Project Filter](#project-filter)
6. [Enhanced Contact Form](#enhanced-contact-form)
7. [Analytics](#analytics)

---

## Loading Skeletons

Display loading states while content is being fetched.

### Usage

```jsx
import { Logo3DSkeleton, ProjectCardSkeleton, BlogPostSkeleton, FormLoadingSpinner, PageLoader } from '../components/LoadingSkeleton';

// For 3D logo loading
{isLoading ? <Logo3DSkeleton /> : <Logo3D />}

// For project cards
{isLoading ? <ProjectCardSkeleton /> : <ProjectCard project={project} />}

// For blog posts
{isLoading ? <BlogPostSkeleton /> : <BlogPost post={post} />}

// For form submissions
<button disabled={isSubmitting}>
  {isSubmitting ? <FormLoadingSpinner /> : 'Submit'}
</button>

// For full page loading
{isLoading && <PageLoader />}
```

---

## Responsive Images

Optimized images with srcset for different screen sizes.

### Usage

```jsx
import ResponsiveImage from '../components/ResponsiveImage';

<ResponsiveImage
  src="/gabaninaman.jpg"
  thumbnailSrc="/gabaninaman-thumb.jpg"
  alt="Naman Gabani"
  className="w-full h-auto rounded-lg"
  priority={true} // Set to true for above-the-fold images
/>
```

### Props

- `src` (required): Main image URL
- `thumbnailSrc` (optional): Smaller version for mobile
- `alt` (required): Alt text for accessibility
- `className`: CSS classes
- `priority`: Load image eagerly (default: false)

---

## Lazy Loading Images

Load images only when they're about to be visible in the viewport.

### Usage

```jsx
import LazyImage from '../components/LazyImage';

<LazyImage
  src="/project-screenshot.jpg"
  alt="Project Screenshot"
  className="w-full h-64 object-cover rounded-lg"
  threshold={0.1} // Start loading when 10% visible
/>
```

### Props

- `src` (required): Image URL
- `alt` (required): Alt text
- `className`: CSS classes
- `threshold`: Intersection observer threshold (0-1)
- `placeholder`: Placeholder image while loading

---

## Theme Toggle

Add dark/light mode switching with system preference detection.

### Usage

```jsx
import ThemeToggle from '../components/ThemeToggle';

// In your layout or _app.js
function Layout({ children }) {
  return (
    <>
      <ThemeToggle />
      {children}
    </>
  );
}
```

### Features

- Saves user preference to localStorage
- Detects system preference on first visit
- Smooth transitions between themes
- Accessible with keyboard navigation

### Customizing Theme Colors

Edit `styles/globals.css` to customize theme colors:

```css
:root {
  --bg-primary: #f9fafb;    /* Light mode background */
  --text-primary: #111827;   /* Light mode text */
}

.dark {
  --bg-primary: #030712;     /* Dark mode background */
  --text-primary: #ffffff;   /* Dark mode text */
}
```

---

## Project Filter

Filter projects by technology and search query.

### Usage

```jsx
import { useState } from 'react';
import ProjectFilter from '../components/ProjectFilter';
import userData from './data/user.json';

export default function ProjectsPage() {
  const [filteredProjects, setFilteredProjects] = useState(userData.projects);

  return (
    <div>
      <ProjectFilter
        projects={userData.projects}
        onFilterChange={setFilteredProjects}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
```

### Features

- Search by project title or description
- Filter by technology stack
- Shows result count
- Responsive pill-style filters

---

## Enhanced Contact Form

Contact form with validation and improved UX.

### Usage

The ContactForm is already enhanced! It now includes:

- Client-side validation
- Real-time error messages
- Character counter
- Auto-hide success message
- Better accessibility

```jsx
import ContactForm from '../components/ContactForm';

<ContactForm />
```

### Features Added

- Email format validation
- Minimum length requirements
- Visual error indicators
- Success message auto-dismiss (5 seconds)
- Character count display

---

## Analytics

Track user interactions and web vitals.

### Setup

1. Get your Google Analytics ID from [Google Analytics](https://analytics.google.com/)
2. Add to `_app.js`:

```jsx
import Analytics, { reportWebVitals } from '../components/Analytics';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Analytics gaId="G-XXXXXXXXXX" />
      <Component {...pageProps} />
    </>
  );
}

export { reportWebVitals };
export default MyApp;
```

### Tracking Events

```jsx
import { trackEvent, trackButtonClick, trackDownload, trackProjectView } from '../components/Analytics';

// Track button clicks
<button onClick={() => trackButtonClick('Contact', 'Hero Section')}>
  Contact Me
</button>

// Track downloads
<a href="/resume.pdf" onClick={() => trackDownload('resume.pdf')}>
  Download Resume
</a>

// Track project views
useEffect(() => {
  trackProjectView(project.title);
}, [project]);

// Custom events
trackEvent('video_play', 'engagement', 'Demo Video');
```

### Available Tracking Functions

- `trackEvent(action, category, label, value)` - General event tracking
- `trackButtonClick(buttonName, location)` - Track button interactions
- `trackExternalLink(url, linkText)` - Track external link clicks
- `trackFormSubmission(formName, success)` - Track form submissions
- `trackProjectView(projectName)` - Track project page views
- `trackDownload(fileName)` - Track file downloads

---

## Integration Examples

### Example 1: Homepage with Theme Toggle and Lazy Images

```jsx
import ThemeToggle from '../components/ThemeToggle';
import LazyImage from '../components/LazyImage';
import { trackButtonClick } from '../components/Analytics';

export default function Home() {
  return (
    <>
      <ThemeToggle />

      <section className="hero">
        <h1>Welcome</h1>
        <button onClick={() => trackButtonClick('Get Started', 'Hero')}>
          Get Started
        </button>
      </section>

      <section className="projects">
        {projects.map(project => (
          <LazyImage
            key={project.slug}
            src={project.image}
            alt={project.title}
          />
        ))}
      </section>
    </>
  );
}
```

### Example 2: Projects Page with Filtering

```jsx
import { useState } from 'react';
import ProjectFilter from '../components/ProjectFilter';
import LazyImage from '../components/LazyImage';
import { trackProjectView } from '../components/Analytics';

export default function Projects() {
  const [filtered, setFiltered] = useState(projects);

  return (
    <div>
      <h1>My Projects</h1>

      <ProjectFilter
        projects={projects}
        onFilterChange={setFiltered}
      />

      <div className="grid gap-6">
        {filtered.map(project => (
          <div key={project.slug} onClick={() => trackProjectView(project.title)}>
            <LazyImage src={project.image} alt={project.title} />
            <h3>{project.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Performance Tips

1. **Use ResponsiveImage for hero images** - Provides srcset for optimal loading
2. **Use LazyImage for below-fold content** - Defers loading until needed
3. **Add loading skeletons** - Improves perceived performance
4. **Enable theme toggle** - Better UX and accessibility
5. **Track user interactions** - Understand how users engage with your portfolio

---

## Accessibility Features

All components include:

- Proper ARIA labels
- Keyboard navigation support
- Focus indicators
- Screen reader compatibility
- Reduced motion support (respects `prefers-reduced-motion`)

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

All components use progressive enhancement and will gracefully degrade in older browsers.
