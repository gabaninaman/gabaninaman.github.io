// Naman Gabani Portfolio - Main Page
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import userData from "./data/user.json";
import ContactForm from "../components/ContactForm";
import ProjectFilter from "../components/ProjectFilter";
import ScrollProgress from "../components/ScrollProgress";
import CommandPalette from "../components/CommandPalette";
import { trackButtonClick, trackDownload, trackExternalLink } from "../components/Analytics";

// Dynamic import to avoid SSR issues with Three.js
const Logo3DProvider = dynamic(
  () => import("../components/Logo3D").then((mod) => mod.Logo3DProvider),
  { ssr: false }
);
const Logo3DView = dynamic(
  () => import("../components/Logo3D").then((mod) => mod.Logo3DView),
  { ssr: false }
);
// Standalone Logo3D for elements that need their own z-index layer (like navbar)
const Logo3D = dynamic(() => import("../components/Logo3D"), { ssr: false });

export default function Home({ githubStats, stackoverflowStats }) {
  // Merge live stats with user data
  const user = {
    ...userData,
    achievements: {
      ...userData.achievements,
      github: {
        ...userData.achievements?.github,
        stats: githubStats || userData.achievements?.github?.stats,
      },
      stackoverflow: {
        ...userData.achievements?.stackoverflow,
        stats: stackoverflowStats || userData.achievements?.stackoverflow?.stats,
      },
    },
  };
  const [showNavbar, setShowNavbar] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [orbitMode, setOrbitMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState(user.projects);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Custom smooth scroll function with configurable duration
  const smoothScrollTo = (elementId, duration = 2000) => {
    const target = document.getElementById(elementId);
    if (!target) return;

    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Ease-in-out cubic function for smooth animation
      const easeInOutCubic =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startPosition + distance * easeInOutCubic);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Calculate scroll progress (0 to 1) based on scrolling through hero section
      const progress = Math.min(scrollY / (viewportHeight * 0.8), 1);
      setScrollProgress(progress);

      // Show navbar when scrolled past 80% of viewport
      setShowNavbar(scrollY > viewportHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // SEO: Generate skills list for description
  const allSkills = Object.values(user.skills).flat();

  // SEO: Canonical URL
  const siteUrl = "https://gabaninaman.github.io";
  const canonicalUrl = siteUrl;

  // SEO: Structured Data (JSON-LD) for Person
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: user.name,
    url: siteUrl,
    image: `${siteUrl}/gabaninaman.jpg`,
    jobTitle: user.title,
    description: user.bio[0],
    email: user.email,
    telephone: user.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: user.location,
      addressCountry: "Canada",
    },
    sameAs: [user.links.linkedin, user.links.github, user.links.twitter],
    knowsAbout: allSkills,
    alumniOf: {
      "@type": "EducationalOrganization",
      name: user.education[0].institution,
    },
    hasCredential: user.certifications.map((cert) => ({
      "@type": "EducationalOccupationalCredential",
      name: cert.name,
      credentialCategory: "certification",
      recognizedBy: {
        "@type": "Organization",
        name: cert.issuer,
      },
    })),
  };

  // SEO: Structured Data for WebSite
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${user.name} - Portfolio`,
    url: siteUrl,
    description: user.bio[0],
    author: {
      "@type": "Person",
      name: user.name,
    },
  };

  // SEO: Structured Data for Professional Service
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${user.name} - ${user.title}`,
    description: user.bio.join(" "),
    url: siteUrl,
    telephone: user.phone,
    email: user.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: user.location,
      addressCountry: "Canada",
    },
    priceRange: "$$",
    areaServed: {
      "@type": "Country",
      name: "Canada",
    },
  };

  // SEO: BreadcrumbList for better navigation in search results
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: `${siteUrl}#about`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Skills",
        item: `${siteUrl}#skills`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Projects",
        item: `${siteUrl}#projects`,
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Contact",
        item: `${siteUrl}#contact`,
      },
    ],
  };

  return (
    <>
      <Head>
        {/* ==================== PRIMARY SEO ==================== */}
        <meta
          name="google-site-verification"
          content="5btffQ_j0ZyetQfVnTfJ0HtTRQXYxj3fwJFJTkpSOz8"
        />
        <title>Naman Gabani - Desktop Support Engineer | Calgary, Canada</title>
        <meta
          name="description"
          content={`${user.bio[0]} ${user.bio[1]} Based in ${
            user.location
          }. Specializing in ${allSkills.slice(0, 5).join(", ")}.`}
        />
        <meta name="author" content={user.name} />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* ==================== OPEN GRAPH (Facebook, LinkedIn) ==================== */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={`${user.name} Portfolio`} />
        <meta property="og:title" content={`${user.name} - ${user.title}`} />
        <meta property="og:description" content={`${user.bio[0]} ${user.bio[1]}`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`${siteUrl}/gabaninaman.jpg`} />
        <meta
          property="og:image:alt"
          content={`${user.name} - ${user.title}`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_CA" />

        {/* ==================== TWITTER CARD ==================== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@gabaninaman7" />
        <meta name="twitter:creator" content="@gabaninaman7" />
        <meta name="twitter:title" content={`${user.name} - ${user.title}`} />
        <meta name="twitter:description" content={`${user.bio[0]} ${user.bio[1]}`} />
        <meta name="twitter:image" content={`${siteUrl}/gabaninaman.jpg`} />
        <meta
          name="twitter:image:alt"
          content={`${user.name} - ${user.title}`}
        />

        {/* ==================== ADDITIONAL SEO META ==================== */}
        <meta name="subject" content={`${user.title} Portfolio`} />
        <meta name="rating" content="General" />
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="geo.region" content="CA-ON" />
        <meta name="geo.placename" content="Toronto" />
        <meta name="geo.position" content="43.6532;-79.3832" />
        <meta name="ICBM" content="43.6532, -79.3832" />

        {/* ==================== STRUCTURED DATA (JSON-LD) ==================== */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <Logo3DProvider>
        {/* Scroll Progress Indicator */}
        <ScrollProgress />

        {/* Command Palette - Press CMD+K or CTRL+K */}
        <CommandPalette projects={user.projects} socialLinks={user.links} />

        {/* SEO: Main wrapper with semantic structure */}
        <div
          className="min-h-screen bg-gray-950"
          itemScope
          itemType="https://schema.org/WebPage"
        >
          {/* Skip to main content for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded z-[9999]"
          >
            Skip to main content
          </a>

          {/* ============================================================ */}
          {/* NAVBAR / HEADER - Hidden until scroll */}
          {/* ============================================================ */}
          <header
            className={`fixed top-0 left-0 right-0 z-[1002] bg-gray-900/90 backdrop-blur-md border-b border-gray-800 transition-transform duration-300 ${
              showNavbar ? "translate-y-0" : "-translate-y-full"
            }`}
            role="banner"
          >
            <nav
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
              aria-label="Main navigation"
            >
              <div className="flex items-center justify-between h-20">
                {/* Logo + Brand Name */}
                <a
                  href="#hero"
                  className="flex items-center gap-4"
                  aria-label={`${user.name} - Go to homepage`}
                >
                  <Logo3D width={2} height={2} rotationSpeed={0.5} />
                  <span
                    className="text-white text-2xl font-bold"
                    itemProp="name"
                  >
                    {user.name}
                  </span>
                </a>

                {/* Nav Links */}
                <ul
                  className="hidden md:flex items-center gap-8"
                  role="menubar"
                >
                  <li role="none">
                    <a
                      href="#hero"
                      role="menuitem"
                      className="text-gray-300 hover:text-white transition"
                    >
                      Home
                    </a>
                  </li>
                  <li role="none">
                    <a
                      href="#about"
                      role="menuitem"
                      className="text-gray-300 hover:text-white transition"
                    >
                      About
                    </a>
                  </li>
                  <li role="none">
                    <a
                      href="#skills"
                      role="menuitem"
                      className="text-gray-300 hover:text-white transition"
                    >
                      Skills
                    </a>
                  </li>
                  <li role="none">
                    <a
                      href="#experience"
                      role="menuitem"
                      className="text-gray-300 hover:text-white transition"
                    >
                      Experience
                    </a>
                  </li>
                  <li role="none">
                    <a
                      href="#projects"
                      role="menuitem"
                      className="text-gray-300 hover:text-white transition"
                    >
                      Projects
                    </a>
                  </li>
                  <li role="none">
                    <a
                      href="#contact"
                      role="menuitem"
                      className="text-gray-300 hover:text-white transition"
                    >
                      Contact
                    </a>
                  </li>
                  <li role="none">
                    <Link
                      href="/blog"
                      role="menuitem"
                      className="text-gray-300 hover:text-white transition"
                    >
                      ✍️ Blog
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </header>

          {/* ============================================================ */}
          {/* STICKY 3D LOGO - Animates from hero to bottom-right corner */}
          {/* ============================================================ */}
          <div
            className="fixed z-[999] flex items-center justify-center transition-all duration-200 ease-out rounded-xl"
            style={{
              width:
                scrollProgress < 1 ? `${100 - scrollProgress * 88}%` : "120px",
              height:
                scrollProgress < 1 ? `${90 - scrollProgress * 78}%` : "120px",
              right: isMobile
                ? scrollProgress < 1
                  ? "0%"
                  : "20px"
                : scrollProgress < 1
                ? `${-20 + scrollProgress * 22}%`
                : "20px",
              left: isMobile && scrollProgress < 1 ? "0%" : "auto",
              bottom: scrollProgress < 1 ? "auto" : "20px",
              top: scrollProgress < 1 ? `${5 + scrollProgress * 40}%` : "auto",
              backgroundColor: "transparent",
              boxShadow: "none",
              cursor:
                scrollProgress >= 1
                  ? "pointer"
                  : orbitMode
                  ? "grab"
                  : "default",
              margin: isMobile && scrollProgress < 1 ? "0 auto" : undefined,
            }}
            onClick={() => {
              if (scrollProgress >= 1) {
                smoothScrollTo("hero", 2500);
              } else if (!orbitMode) {
                setOrbitMode(true);
              }
            }}
          >
            <Logo3DView
              width={scrollProgress < 1 ? 100 : 6}
              height={scrollProgress < 1 ? 100 : 6}
              interactive={!isMobile && orbitMode && scrollProgress < 1}
              animationType="explosion"
              materialPreset="brushed_metal"
              rotationSpeed={1.5}
            />
          </div>

          {/* ============================================================ */}
          {/* MAIN CONTENT - Wrapped for accessibility */}
          {/* ============================================================ */}
          <main id="main-content" role="main" itemProp="mainContentOfPage">
            {/* ============================================================ */}
            {/* HERO SECTION */}
            {/* ============================================================ */}
            <section
              id="hero"
              className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 overflow-hidden"
              aria-label="Introduction"
              itemScope
              itemType="https://schema.org/WPHeader"
            >
              <div className="absolute left-[5%] z-[1001] text-left px-4 max-w-xl">
                <p
                  className="text-lg text-purple-400 mb-2 animate-fade-in-up font-medium"
                  style={{ animationDelay: "0.1s", animationFillMode: "both" }}
                  itemProp="jobTitle"
                >
                  {user.title}
                </p>
                <h1
                  className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up"
                  style={{ animationDelay: "0.2s", animationFillMode: "both" }}
                  itemProp="headline"
                >
                  Hi, I'm
                  <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {" "}
                    {user.name.split(" ")[0]}
                  </span>
                </h1>
                <p
                  className="text-xl text-gray-400 mb-8 max-w-2xl animate-fade-in-up"
                  style={{ animationDelay: "0.5s", animationFillMode: "both" }}
                  itemProp="description"
                >
                  {user.bio[0]}
                </p>
                <nav
                  className="flex flex-wrap gap-4 justify-start animate-fade-in-up"
                  style={{ animationDelay: "0.8s", animationFillMode: "both" }}
                  aria-label="Primary actions"
                >
                  <button
                    onClick={() => {
                      smoothScrollTo("projects", 2500);
                      trackButtonClick("View Projects", "Hero Section");
                    }}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-950"
                    aria-label="View my projects"
                  >
                    View Projects
                  </button>
                  <button
                    onClick={() => {
                      smoothScrollTo("contact", 2500);
                      trackButtonClick("Contact Me", "Hero Section");
                    }}
                    className="px-8 py-3 border border-gray-600 hover:border-gray-500 text-white rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-950"
                    aria-label="Contact me"
                  >
                    Contact Me
                  </button>
                </nav>
              </div>
            </section>

            {/* ============================================================ */}
            {/* ABOUT SECTION */}
            {/* ============================================================ */}
            <section
              id="about"
              className="py-20 bg-gray-950"
              aria-labelledby="about-heading"
              itemScope
              itemType="https://schema.org/Person"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  {/* Image */}
                  <figure className="flex justify-center order-2 lg:order-1">
                    <div className="w-80 h-80 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-2xl border border-gray-800 overflow-hidden">
                      <img
                        src="/gabaninaman.jpg"
                        alt={`${user.name} - ${user.title} based in ${user.location}`}
                        className="w-full h-full object-cover"
                        itemProp="image"
                        loading="lazy"
                        width="320"
                        height="320"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = `<span class="text-gray-500 flex items-center justify-center h-full">${user.name}</span>`;
                        }}
                      />
                    </div>
                  </figure>

                  {/* Content */}
                  <article className="order-1 lg:order-2">
                    <h2
                      id="about-heading"
                      className="text-4xl font-bold text-white mb-6"
                    >
                      About Me
                    </h2>
                    <div itemProp="description">
                      {user.bio.map((paragraph, index) => (
                        <p key={index} className="text-gray-400 text-lg mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Hidden SEO data */}
                    <meta itemProp="name" content={user.name} />
                    <meta itemProp="jobTitle" content={user.title} />
                    <meta itemProp="email" content={user.email} />
                    <meta itemProp="telephone" content={user.phone} />
                    <span
                      itemProp="address"
                      itemScope
                      itemType="https://schema.org/PostalAddress"
                      className="hidden"
                    >
                      <meta
                        itemProp="addressLocality"
                        content={user.location}
                      />
                      <meta itemProp="addressCountry" content="Canada" />
                    </span>

                    {/* Certifications */}
                    {user.certifications && user.certifications.length > 0 && (
                      <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-300 mb-2">
                          Certifications
                        </h3>
                        <ul
                          className="space-y-1"
                          aria-label="Professional certifications"
                        >
                          {user.certifications.map((cert, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-2"
                              itemProp="hasCredential"
                              itemScope
                              itemType="https://schema.org/EducationalOccupationalCredential"
                            >
                              <span
                                className="text-cyan-400"
                                aria-hidden="true"
                              >
                                ✓
                              </span>
                              <span className="text-gray-400" itemProp="name">
                                {cert.name}
                              </span>
                              <span className="text-gray-600 text-sm">
                                (<time itemProp="dateCreated">{cert.date}</time>
                                )
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Education */}
                    <div
                      className="mt-6"
                      itemProp="alumniOf"
                      itemScope
                      itemType="https://schema.org/EducationalOrganization"
                    >
                      <h3 className="text-sm font-semibold text-gray-300 mb-2">
                        Education
                      </h3>
                      {user.education.map((edu, index) => (
                        <div key={index} className="text-gray-400">
                        <></>
                          <span className="text-white">{edu.degree}</span>
                          <span className="text-gray-500">
                            {" "}
                            • <span itemProp="name">{edu.institution}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* SKILLS SECTION */}
            {/* ============================================================ */}
            <section
              id="skills"
              className="py-20 bg-gray-900"
              aria-labelledby="skills-heading"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="text-center mb-12">
                  <h2
                    id="skills-heading"
                    className="text-3xl font-bold text-white mb-4"
                  >
                    Technical Skills
                  </h2>
                  <p className="text-gray-400">
                    Technologies and tools I work with
                  </p>
                </header>

                <div
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  role="list"
                  aria-label="Skill categories"
                >
                  {Object.entries(user.skills).map(
                    ([category, skills], index) => {
                      const icons = {
                        systems: "🏗️",
                        languages: "💻",
                        backend: "⚙️",
                        databases: "🗄️",
                        cloud: "☁️",
                        devops: "🔄",
                        tools: "🛠️",
                      };
                      const colors = {
                        systems: "purple",
                        languages: "cyan",
                        backend: "green",
                        databases: "orange",
                        cloud: "blue",
                        devops: "pink",
                        tools: "yellow",
                      };
                      const color = colors[category] || "purple";

                      return (
                        <article
                          key={category}
                          className={`bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-${color}-500/50 transition`}
                          role="listitem"
                          itemScope
                          itemType="https://schema.org/ItemList"
                        >
                          <header className="flex items-center gap-3 mb-4">
                            <span className="text-2xl" aria-hidden="true">
                              {icons[category] || "📦"}
                            </span>
                            <h3
                              className="text-lg font-bold text-white capitalize"
                              itemProp="name"
                            >
                              {category}
                            </h3>
                          </header>
                          <ul
                            className="flex flex-wrap gap-2"
                            aria-label={`${category} skills`}
                          >
                            {skills.map((skill, skillIndex) => (
                              <li
                                key={skillIndex}
                                className="px-3 py-1 bg-gray-700/50 rounded-full text-sm text-gray-300 hover:bg-gray-600/50 transition"
                                itemProp="itemListElement"
                              >
                                {skill}
                              </li>
                            ))}
                          </ul>
                        </article>
                      );
                    }
                  )}
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* ACHIEVEMENTS SECTION - GitHub & Stack Overflow */}
            {/* ============================================================ */}
            <section
              id="achievements"
              className="py-20 bg-gray-950"
              aria-labelledby="achievements-heading"
            >
              
            </section>

            {/* ============================================================ */}
            {/* EXPERIENCE SECTION */}
            {/* ============================================================ */}
            <section
              id="experience"
              className="py-20 bg-gray-900"
              aria-labelledby="experience-heading"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="text-center mb-12">
                  <h2
                    id="experience-heading"
                    className="text-3xl font-bold text-white mb-4"
                  >
                    Experience
                  </h2>
                  <p className="text-gray-400">My professional journey</p>
                </header>

                <div
                  className="max-w-4xl mx-auto space-y-8"
                  role="feed"
                  aria-label="Work experience"
                >
                  {user.experience.map((exp, index) => (
                    <article
                      key={index}
                      className="bg-gray-800/30 rounded-2xl p-6 border border-gray-800 hover:border-purple-500/30 transition"
                      itemScope
                      itemType="https://schema.org/OrganizationRole"
                    >
                      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                          <h3
                            className="text-xl font-bold text-white"
                            itemProp="roleName"
                          >
                            {exp.title}
                          </h3>
                          <p
                            className="text-purple-400"
                            itemProp="memberOf"
                            itemScope
                            itemType="https://schema.org/Organization"
                          >
                            <span itemProp="name">{exp.company}</span>
                          </p>
                        </div>
                        <time
                          className="text-gray-500 text-sm mt-2 md:mt-0"
                          itemProp="startDate"
                        >
                          {exp.date}
                        </time>
                      </header>
                      <ul
                        className="space-y-2"
                        aria-label={`Responsibilities at ${exp.company}`}
                      >
                        {exp.description.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="text-gray-400 text-sm flex items-start gap-2"
                            itemProp="description"
                          >
                            <span
                              className="text-cyan-400 mt-1"
                              aria-hidden="true"
                            >
                              ▹
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* PROJECTS SECTION */}
            {/* ============================================================ */}
            <section
              id="projects"
              className="py-20 bg-gray-900"
              aria-labelledby="projects-heading"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="text-center mb-12">
                  <h2
                    id="projects-heading"
                    className="text-3xl font-bold text-white mb-4"
                  >
                    Projects
                  </h2>
                  <p className="text-gray-400">Some of my technical work</p>
                </header>

                {/* Project Filter */}
                <ProjectFilter
                  projects={user.projects}
                  onFilterChange={setFilteredProjects}
                />

                <div
                  className="grid md:grid-cols-2 gap-8"
                  role="feed"
                  aria-label="Portfolio projects"
                >
                  {filteredProjects.map((project, index) => (
                    <article
                      key={index}
                      className="bg-gray-800/30 rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition group"
                      itemScope
                      itemType="https://schema.org/SoftwareSourceCode"
                    >
                      <Link
                        href={`/projects/${project.slug}`}
                        className="block"
                      >
                        <header className="h-32 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 flex items-center justify-center p-6 group-hover:from-purple-900/50 group-hover:to-cyan-900/50 transition">
                          <h3
                            className="text-2xl font-bold text-white text-center"
                            itemProp="name"
                          >
                            {project.title}
                          </h3>
                        </header>
                      </Link>
                      <div className="p-6">
                        <p
                          className="text-gray-400 text-sm mb-2"
                          itemProp="description"
                        >
                          {project.desc1}
                        </p>
                        <p className="text-gray-500 text-sm mb-4">
                          {project.desc2}
                        </p>
                        <ul
                          className="flex flex-wrap gap-2 mb-4"
                          aria-label={`Technologies used in ${project.title}`}
                        >
                          {project.tech.slice(0, 5).map((tech, techIndex) => (
                            <li
                              key={techIndex}
                              className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-400"
                              itemProp="programmingLanguage"
                            >
                              {tech}
                            </li>
                          ))}
                          {project.tech.length > 5 && (
                            <li className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-500">
                              +{project.tech.length - 5} more
                            </li>
                          )}
                        </ul>
                        <nav
                          className="flex gap-4"
                          aria-label={`Links for ${project.title}`}
                        >
                          <Link
                            href={`/projects/${project.slug}`}
                            className="text-sm text-purple-400 hover:text-purple-300 transition flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
                            aria-label={`View details for ${project.title}`}
                          >
                            <span>View Details</span>
                            <span aria-hidden="true">→</span>
                          </Link>
                          {project.code && (
                            <a
                              href={project.code}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded"
                              itemProp="codeRepository"
                              aria-label={`View source code for ${project.title} on GitHub (opens in new tab)`}
                            >
                              <span>GitHub</span>
                              <span aria-hidden="true">↗</span>
                            </a>
                          )}
                        </nav>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* CTA SECTION WITH CONTACT FORM */}
            {/* ============================================================ */}
            <section
              id="contact"
              className="py-20 bg-gradient-to-r from-purple-900/50 via-gray-950 to-cyan-900/50"
              aria-labelledby="cta-heading"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  {/* Left - Text & Links */}
                  <div>
                    <h2
                      id="cta-heading"
                      className="text-3xl md:text-4xl font-bold text-white mb-4"
                    >
                      Interested in working together?
                    </h2>
                    <p className="text-gray-400 text-lg mb-8">
                      Let's build scalable systems and robust infrastructure.
                    </p>

                    <nav
                      className="flex flex-wrap gap-4 mb-8"
                      aria-label="Contact actions"
                    >
                      <a
                        href={user.links.email}
                        className="px-8 py-4 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-950"
                        aria-label="Send me an email"
                      >
                        Email Me →
                      </a>
                      <a
                        href={user.resume_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackDownload("resume.pdf")}
                        className="px-8 py-4 border border-white text-white rounded-lg font-bold hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-950"
                        aria-label="Download my resume as PDF (opens in new tab)"
                        download
                      >
                        Download Resume
                      </a>
                    </nav>

                    {/* Quick Contact Info */}
                    <div className="space-y-3 text-gray-400">
                      <p className="flex items-center gap-2">
                        <span aria-hidden="true">📧</span>
                        <a
                          href={user.links.email}
                          className="hover:text-white transition"
                        >
                          {user.email}
                        </a>
                      </p>
                      <p className="flex items-center gap-2">
                        <span aria-hidden="true">📱</span>
                        <a
                          href={`tel:${user.phone.replace(/[^0-9+]/g, "")}`}
                          className="hover:text-white transition"
                        >
                          {user.phone}
                        </a>
                      </p>
                      <p className="flex items-center gap-2">
                        <span aria-hidden="true">📍</span>
                        <span>{user.location}, Canada</span>
                      </p>
                    </div>
                  </div>

                  {/* Right - Contact Form */}
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Drop me a line ✨
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                      No formal stuff here — just real talk.
                    </p>
                    <ContactForm />
                  </div>
                </div>
              </div>
            </section>
          </main>
          {/* END MAIN CONTENT */}

          {/* ============================================================ */}
          {/* FOOTER */}
          {/* ============================================================ */}
          <footer
            className="py-12 bg-gray-950 border-t border-gray-800"
            role="contentinfo"
            itemScope
            itemType="https://schema.org/WPFooter"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-4 gap-8">
                {/* Brand */}
                <div
                  className="md:col-span-1"
                  itemScope
                  itemType="https://schema.org/Person"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="text-white text-xl font-bold"
                      aria-hidden="true"
                    >
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <span className="text-white font-bold" itemProp="name">
                      {user.name}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm" itemProp="jobTitle">
                    {user.title}
                  </p>
                  <p
                    className="text-gray-600 text-xs mt-2"
                    itemProp="address"
                    itemScope
                    itemType="https://schema.org/PostalAddress"
                  >
                    <span itemProp="addressLocality">{user.location}</span>,{" "}
                    <span itemProp="addressCountry">Canada</span>
                  </p>
                </div>

                {/* Navigation Links */}
                <nav aria-label="Footer navigation">
                  <h3 className="text-white font-semibold mb-4">Navigation</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>
                      <a
                        href="#hero"
                        className="hover:text-white transition focus:outline-none focus:text-white"
                      >
                        Home
                      </a>
                    </li>
                    <li>
                      <a
                        href="#about"
                        className="hover:text-white transition focus:outline-none focus:text-white"
                      >
                        About
                      </a>
                    </li>
                    <li>
                      <a
                        href="#skills"
                        className="hover:text-white transition focus:outline-none focus:text-white"
                      >
                        Skills
                      </a>
                    </li>
                    <li>
                      <a
                        href="#experience"
                        className="hover:text-white transition focus:outline-none focus:text-white"
                      >
                        Experience
                      </a>
                    </li>
                    <li>
                      <a
                        href="#projects"
                        className="hover:text-white transition focus:outline-none focus:text-white"
                      >
                        Projects
                      </a>
                    </li>
                    <li className="pt-2">
                      <Link
                        href="/blog"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-400 rounded-full text-sm hover:from-purple-500/30 hover:to-cyan-500/30 hover:text-purple-300 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        ✍️ Blog
                      </Link>
                    </li>
                  </ul>
                </nav>

                {/* Social Links */}
                <nav aria-label="Social media links">
                  <h3 className="text-white font-semibold mb-4">Connect</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>
                      <a
                        href={user.links.github}
                        target="_blank"
                        rel="noopener noreferrer me"
                        className="hover:text-white transition focus:outline-none focus:text-white"
                        aria-label="Visit my GitHub profile (opens in new tab)"
                      >
                        GitHub
                      </a>
                    </li>
                    <li>
                      <a
                        href={user.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer me"
                        className="hover:text-white transition focus:outline-none focus:text-white"
                        aria-label="Connect with me on LinkedIn (opens in new tab)"
                      >
                        LinkedIn
                      </a>
                    </li>
                    <li>
                      <a
                        href={user.links.twitter}
                        target="_blank"
                        rel="noopener noreferrer me"
                        className="hover:text-white transition focus:outline-none focus:text-white"
                        aria-label="Follow me on Twitter (opens in new tab)"
                      >
                        Twitter
                      </a>
                    </li>
                  </ul>
                </nav>

                {/* Contact Info */}
                <address className="not-italic">
                  <h3 className="text-white font-semibold mb-4">Contact</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>
                      <a
                        href={user.links.email}
                        className="hover:text-white transition focus:outline-none focus:text-white"
                        aria-label={`Send email to ${user.email}`}
                      >
                        {user.email}
                      </a>
                    </li>
                    <li>
                      <a
                        href={`tel:${user.phone.replace(/[^0-9+]/g, "")}`}
                        className="hover:text-white transition focus:outline-none focus:text-white"
                        aria-label={`Call ${user.phone}`}
                      >
                        {user.phone}
                      </a>
                    </li>
                    <li className="pt-2">
                      <a
                        href={user.resume_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 transition focus:outline-none focus:text-purple-300"
                        aria-label="Download my resume as PDF (opens in new tab)"
                        download
                      >
                        Download Resume →
                      </a>
                    </li>
                  </ul>
                </address>
              </div>

              {/* Bottom */}
              <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-sm">
                  <small>
                    ©{" "}
                    <time dateTime={new Date().getFullYear().toString()}>
                      {new Date().getFullYear()}
                    </time>{" "}
                    {user.name}. All rights reserved. Portfolio designed and
                    built by {user.name}.
                  </small>
                </p>
                <p className="text-gray-600 text-xs">
                  <small>
                    Built with{" "}
                    <span itemProp="applicationCategory">
                      Next.js, Three.js & Tailwind CSS
                    </span>
                  </small>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </Logo3DProvider>
    </>
  );
}

// Fetch live GitHub and StackOverflow stats at build time
export async function getStaticProps() {
  const { fetchGitHubStats, formatStat: formatGitHubStat } = await import('../lib/api/github');
  const { fetchStackOverflowStats, formatStat: formatStackOverflowStat, formatReach } = await import('../lib/api/stackoverflow');

  try {
    // Fetch GitHub stats
    const githubData = await fetchGitHubStats('gabaninaman');

    // Fetch StackOverflow stats
    const stackoverflowData = await fetchStackOverflowStats('19144656');

    // Format stats for display
    const githubStats = {
      repositories: formatGitHubStat(githubData.repositories),
      contributions: formatGitHubStat(githubData.contributions),
      stars: formatGitHubStat(githubData.stars),
      followers: formatGitHubStat(githubData.followers),
    };

    const stackoverflowStats = {
      reputation: formatStackOverflowStat(stackoverflowData.reputation),
      answers: formatStackOverflowStat(stackoverflowData.answers),
      reached: formatReach(stackoverflowData.reached),
      badges: {
        gold: stackoverflowData.badges.gold,
        silver: stackoverflowData.badges.silver,
        bronze: stackoverflowData.badges.bronze,
      },
    };

    return {
      props: {
        githubStats,
        stackoverflowStats,
      },
      // Note: revalidate not supported with static export
      // Stats are fetched at build time only
    };
  } catch (error) {
    console.error('Error fetching stats in getStaticProps:', error);

    // Return null props to use fallback data from user.json
    return {
      props: {
        githubStats: null,
        stackoverflowStats: null,
      },
    };
  }
}
