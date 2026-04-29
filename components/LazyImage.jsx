// Lazy-loaded image component with Intersection Observer
import { useState, useEffect, useRef } from 'react';

export default function LazyImage({
  src,
  alt,
  className = '',
  placeholder = '/placeholder.svg',
  threshold = 0.1,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin: '50px', // Start loading 50px before element is visible
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (observer) observer.disconnect();
    };
  }, [threshold]);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
      )}

      {/* Image loads only when visible */}
      {isVisible && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
    </div>
  );
}
