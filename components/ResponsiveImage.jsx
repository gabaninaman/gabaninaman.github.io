// Responsive Image component with srcset for optimal loading
import { useState } from 'react';

export default function ResponsiveImage({
  src,
  alt,
  thumbnailSrc,
  className = '',
  priority = false,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate srcset from available images
  const srcSet = thumbnailSrc
    ? `${thumbnailSrc} 600w, ${src} 1200w`
    : undefined;

  const sizes = thumbnailSrc
    ? '(max-width: 768px) 600px, 1200px'
    : '100vw';

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
      )}

      {/* Actual image */}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${hasError ? 'hidden' : ''}`}
        {...props}
      />

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  );
}
