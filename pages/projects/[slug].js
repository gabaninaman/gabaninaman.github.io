import Head from 'next/head'
import Link from 'next/link'
import userData from '../data/user.json'

export async function getStaticPaths() {
  const paths = userData.projects.map((project) => ({
    params: { slug: project.slug },
  }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const project = userData.projects.find((p) => p.slug === params.slug)
  const projectIndex = userData.projects.findIndex((p) => p.slug === params.slug)
  
  // Get prev/next projects for navigation
  const prevProject = projectIndex > 0 ? userData.projects[projectIndex - 1] : null
  const nextProject = projectIndex < userData.projects.length - 1 ? userData.projects[projectIndex + 1] : null
  
  return {
    props: {
      project,
      prevProject,
      nextProject,
      user: {
        name: userData.name,
        title: userData.title,
        links: userData.links
      }
    },
  }
}

export default function ProjectPage({ project, prevProject, nextProject, user }) {
  const siteUrl = 'https://gabaninaman.github.io'
  const canonicalUrl = `${siteUrl}/projects/${project.slug}`

  // Category colors
  const categoryColors = {
    'Cloud & DevOps': 'from-blue-500 to-cyan-500',
    'Developer Tools': 'from-green-500 to-emerald-500',
    'Full-Stack': 'from-purple-500 to-pink-500',
    'Backend': 'from-orange-500 to-red-500',
  }

  const gradientColor = categoryColors[project.category] || 'from-purple-500 to-cyan-500'

  // Construct title for SEO
  const pageTitle = `${project.title} - ${project.category} | Naman Gabani`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={`${project.desc1} ${project.desc2}`} />
        <meta name="author" content={user.name} />
        <meta name="robots" content="index, follow, max-image-preview:large" />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${project.title} | ${user.name}`} />
        <meta property="og:description" content={project.desc1} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`${siteUrl}/gabaninaman.jpg`} />
        <meta property="og:locale" content="en_CA" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@gabaninaman7" />
        <meta name="twitter:creator" content="@gabaninaman7" />
        <meta name="twitter:title" content={`${project.title} | ${user.name}`} />
        <meta name="twitter:description" content={project.desc1} />
        <meta name="twitter:image" content={`${siteUrl}/gabaninaman.jpg`} />

        <link rel="canonical" href={canonicalUrl} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareSourceCode',
              name: project.title,
              description: project.desc1,
              programmingLanguage: project.tech,
              codeRepository: project.code,
              author: {
                '@type': 'Person',
                name: user.name
              }
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gray-950">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2 text-white hover:text-purple-400 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Back to Portfolio</span>
              </Link>
              
              <div className="flex items-center gap-4">
                {project.code && (
                  <a 
                    href={project.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    <span className="hidden sm:inline">View Code</span>
                  </a>
                )}
                {project.live && (
                  <a 
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="hidden sm:inline">Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <header className={`pt-32 pb-20 bg-gradient-to-br ${gradientColor} bg-opacity-10`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-gray-800/80 text-gray-300 rounded-full text-sm">
                {project.category}
              </span>
              <span className="text-gray-500 text-sm">{project.year}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {project.title}
            </h1>
            
            <p className="text-xl text-gray-400 mb-8">
              {project.subtitle}
            </p>
            
            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-800/50 border border-gray-700 rounded-full text-sm text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Description */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-white mb-6">About the Project</h2>
              <div className="space-y-4">
                {project.description.map((paragraph, index) => (
                  <p key={index} className="text-gray-400 text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Features */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-white mb-6">Key Features</h2>
              <ul className="grid md:grid-cols-2 gap-4">
                {project.features.map((feature, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-xl border border-gray-800"
                  >
                    <span className="text-purple-400 mt-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Tech Stack Details */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-white mb-6">Technology Stack</h2>
              <div className="flex flex-wrap gap-3">
                {project.tech.map((tech, index) => (
                  <div 
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-800/50 rounded-lg border border-gray-700 text-gray-300"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="p-8 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-2xl border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-2">Interested in the code?</h2>
              <p className="text-gray-400 mb-6">Check out the full source code on GitHub.</p>
              <div className="flex flex-wrap gap-4">
                {project.code && (
                  <a 
                    href={project.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    View on GitHub
                  </a>
                )}
                <Link 
                  href={`/?project=${encodeURIComponent(project.title)}#contact`}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-600 text-white rounded-lg font-medium hover:bg-gray-800 transition"
                >
                  Get in Touch
                </Link>
              </div>
            </section>
          </div>
        </main>

        {/* Project Navigation */}
        <nav className="border-t border-gray-800 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              {prevProject ? (
                <Link 
                  href={`/projects/${prevProject.slug}`}
                  className="group flex items-center gap-3 text-gray-400 hover:text-white transition"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div className="text-left">
                    <p className="text-sm text-gray-500">Previous</p>
                    <p className="font-medium">{prevProject.title}</p>
                  </div>
                </Link>
              ) : <div />}
              
              {nextProject ? (
                <Link 
                  href={`/projects/${nextProject.slug}`}
                  className="group flex items-center gap-3 text-gray-400 hover:text-white transition text-right"
                >
                  <div>
                    <p className="text-sm text-gray-500">Next</p>
                    <p className="font-medium">{nextProject.title}</p>
                  </div>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : <div />}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <footer className="py-8 border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {user.name}. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
