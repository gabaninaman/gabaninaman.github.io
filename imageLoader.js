// Custom image loader for GitHub Pages static export
// This allows us to use Next.js Image component with static export

export default function imageLoader({ src, width, quality }) {
  // For external images, return as-is
  if (src.startsWith('http')) {
    return src;
  }

  // For local images, just return the path
  // Images are already optimized during build
  return src;
}
