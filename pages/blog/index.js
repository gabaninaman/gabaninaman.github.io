import Head from 'next/head'
import Link from 'next/link'
import userData from '../data/user.json'

// Fetch Medium RSS feed at build time
export async function getStaticProps() {
  let posts = []
  let totalPosts = 0
  
  // Your Medium username
  const MEDIUM_USERNAME = 'gabaninaman'
  
  try {
    // Fetch directly from Medium RSS feed
    const RSS_URL = `https://medium.com/feed/@${MEDIUM_USERNAME}`
    
    const response = await fetch(RSS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Portfolio/1.0)'
      }
    })
    const xmlText = await response.text()
    
    // Parse XML manually
    const items = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || []
    
    posts = items.slice(0, 10).map(item => {
      const getTagContent = (tag) => {
        const match = item.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`)) ||
                      item.match(new RegExp(`<${tag}>([^<]*)<\\/${tag}>`))
        return match ? match[1].trim() : ''
      }
      
      const title = getTagContent('title')
      const link = getTagContent('link')
      const pubDate = getTagContent('pubDate')
      const content = getTagContent('content:encoded') || getTagContent('description')
      const categories = (item.match(/<category><!\[CDATA\[([^\]]+)\]\]><\/category>/g) || [])
        .map(cat => cat.replace(/<category><!\[CDATA\[|\]\]><\/category>/g, ''))
      
      // Extract thumbnail from content
      const imgMatch = content.match(/<img[^>]+src="([^"]+)"/)
      const thumbnail = imgMatch ? imgMatch[1] : null
      
      return {
        title,
        link,
        pubDate,
        thumbnail,
        description: stripHtml(content).substring(0, 200) + '...',
        categories,
        author: MEDIUM_USERNAME
      }
    })
    
    totalPosts = items.length
  } catch (error) {
    console.error('Error fetching Medium posts:', error)
  }
  
  return {
    props: {
      posts,
      totalPosts,
      mediumUsername: MEDIUM_USERNAME,
      user: {
        name: userData.name,
        title: userData.title,
        links: userData.links
      }
    }
  }
}

// Helper function to strip HTML tags
function stripHtml(html) {
  return html ? html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() : ''
}

// Helper function to extract first image from content
function extractFirstImage(content) {
  if (!content) return null
  const match = content.match(/<img[^>]+src="([^">]+)"/)
  return match ? match[1] : null
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Calculate read time (rough estimate)
function getReadTime(description) {
  const words = description.split(' ').length
  const minutes = Math.ceil(words / 200)
  return `${minutes} min read`
}

export default function Blog({ posts, totalPosts, mediumUsername, user }) {
  const siteUrl = "https://gabaninaman.github.io";
  const canonicalUrl = `${siteUrl}/blog`;

  // Structured Data for Blog Collection
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${user.name} Technical Blog`,
    description: "Articles about cloud architecture, DevOps, systems development, and software engineering best practices",
    url: canonicalUrl,
    author: {
      "@type": "Person",
      name: user.name
    },
    publisher: {
      "@type": "Person",
      name: user.name,
      url: siteUrl
    }
  };

  // Generate ItemList structured data for blog posts
  const blogPostListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: post.link,
      name: post.title
    }))
  };

  return (
    <>
      <Head>
        <title>Blog | Naman Gabani - Technical Articles on Cloud &amp; DevOps</title>
        <meta name="description" content={`Technical blog by ${user.name} - ${user.title}. Articles about cloud architecture, DevOps, systems development, and software engineering best practices.`} />
        <meta name="author" content={user.name} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Blog | ${user.name}`} />
        <meta property="og:description" content={`Technical articles by ${user.name} on cloud architecture, DevOps, and systems development.`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`${siteUrl}/gabaninaman.jpg`} />
        <meta property="og:locale" content="en_CA" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@gabaninaman7" />
        <meta name="twitter:creator" content="@gabaninaman7" />
        <meta name="twitter:title" content={`Blog | ${user.name}`} />
        <meta name="twitter:description" content={`Technical articles by ${user.name} on cloud architecture, DevOps, and systems development.`} />
        <meta name="twitter:image" content={`${siteUrl}/gabaninaman.jpg`} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostListSchema) }}
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
              
              <a 
                href={`https://medium.com/@gabaninaman`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition"
              >
                <span className="text-sm">Follow on Medium</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                </svg>
              </a>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <header className="pt-32 pb-16 bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              ✍️ <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Blog</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Thoughts on cloud architecture, systems design, DevOps practices, and lessons learned building scalable infrastructure.
            </p>
          </div>
        </header>

        {/* Blog Posts */}
        <main className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post, index) => (
                  <article 
                    key={index}
                    className="bg-gray-800/30 rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition group"
                  >
                    <a 
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col-reverse md:flex-row"
                    >
                      {/* Content */}
                      <div className="flex-1 p-6">
                        {/* Meta top row */}
                        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                          <span>{formatDate(post.pubDate)}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {getReadTime(post.description)}
                          </span>
                        </div>
                        
                        {/* Title */}
                        <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition">
                          {post.title}
                        </h2>
                        
                        {/* Description */}
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {post.description}
                        </p>
                        
                        {/* Categories */}
                        {post.categories.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.categories.slice(0, 3).map((cat, i) => (
                              <span 
                                key={i}
                                className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Read more */}
                        <div className="mt-4 text-purple-400 text-sm font-medium group-hover:text-purple-300 transition flex items-center gap-1">
                          Read on Medium
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Thumbnail */}
                      <div className="md:w-64 md:flex-shrink-0 h-48 md:h-auto bg-gradient-to-br from-purple-900/30 to-cyan-900/30 overflow-hidden md:rounded-r-2xl">
                        {post.thumbnail ? (
                          <img 
                            src={post.thumbnail} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center min-h-[160px]">
                            <span className="text-4xl">📝</span>
                          </div>
                        )}
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            ) : (
              /* No Posts / Coming Soon */
              <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-800">
                <div className="text-6xl mb-6">🚀</div>
                <h2 className="text-2xl font-bold text-white mb-4">Coming Soon</h2>
                <p className="text-gray-400 max-w-md mx-auto mb-8">
                  I'm working on some exciting content about cloud infrastructure, microservices, and DevOps best practices. Stay tuned!
                </p>
                <a 
                  href="https://medium.com/@gabaninaman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
                >
                  Follow on Medium
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            )}
            
            {/* CTA to Medium */}
            {posts.length > 0 && (
              <div className="mt-12 text-center">
                {totalPosts > posts.length && (
                  <p className="text-gray-500 text-sm mb-4">
                    Showing {posts.length} of {totalPosts} posts
                  </p>
                )}
                <a 
                  href={`https://medium.com/@${mediumUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition border border-gray-700"
                >
                  View all posts on Medium
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 border-t border-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {user.name}. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
      
      {/* Add line-clamp utility styles */}
      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  )
}
