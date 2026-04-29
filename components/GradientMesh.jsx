/**
 * Gradient Mesh Background Component
 * Animated gradient backgrounds with smooth transitions
 * Multiple variants for different sections
 */

export default function GradientMesh({ variant = 'default', className = '', animate = true }) {
  const variants = {
    default: 'from-purple-900/20 via-pink-900/20 to-cyan-900/20',
    hero: 'from-purple-600/10 via-pink-600/10 to-cyan-600/10',
    purple: 'from-purple-600/20 via-purple-800/20 to-indigo-900/20',
    blue: 'from-blue-600/20 via-cyan-600/20 to-teal-600/20',
    green: 'from-green-600/20 via-emerald-600/20 to-teal-600/20',
    pink: 'from-pink-600/20 via-rose-600/20 to-orange-600/20',
    rainbow: 'from-purple-600/15 via-pink-600/15 via-cyan-600/15 to-green-600/15',
  };

  const animationClass = animate
    ? 'animate-gradient-xy'
    : '';

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Main gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${variants[variant]} ${animationClass}`}
        style={{
          backgroundSize: '200% 200%',
        }}
      />

      {/* Mesh overlay */}
      <div className="absolute inset-0 opacity-30">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id={`mesh-${variant}`}
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="50" cy="50" r="1" fill="currentColor" className="text-white/10" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#mesh-${variant})`} />
        </svg>
      </div>

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 bg-radial-gradient"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, rgba(0, 0, 0, 0) 50%)',
        }}
      />
    </div>
  );
}

/**
 * Animated Orbs Background
 * Floating gradient orbs with blur effect
 */
export function AnimatedOrbs({ count = 3, className = '' }) {
  const orbs = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 300 + Math.random() * 300,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: 10 + Math.random() * 10,
    delay: Math.random() * 5,
    color: i % 3 === 0 ? 'purple' : i % 3 === 1 ? 'pink' : 'cyan',
  }));

  const colorClasses = {
    purple: 'bg-purple-600/30',
    pink: 'bg-pink-600/30',
    cyan: 'bg-cyan-600/30',
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className={`absolute rounded-full ${colorClasses[orb.color]} blur-3xl animate-float`}
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            top: `${orb.top}%`,
            left: `${orb.left}%`,
            animationDuration: `${orb.duration}s`,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Grid Lines Background
 * Subtle grid pattern for tech aesthetic
 */
export function GridLines({ spacing = 50, opacity = 0.1, color = 'white', className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid-pattern"
            x="0"
            y="0"
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${spacing} 0 L 0 0 0 ${spacing}`}
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              opacity={opacity}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    </div>
  );
}

/**
 * Spotlight Effect
 * Following cursor spotlight effect
 */
export function SpotlightEffect({ color = 'purple', intensity = 0.3 }) {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const colors = {
    purple: `rgba(139, 92, 246, ${intensity})`,
    pink: `rgba(236, 72, 153, ${intensity})`,
    cyan: `rgba(6, 182, 212, ${intensity})`,
    blue: `rgba(59, 130, 246, ${intensity})`,
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[120px] transition-all duration-300 ease-out"
        style={{
          background: `radial-gradient(circle, ${colors[color]} 0%, transparent 70%)`,
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
}

/**
 * Noise Texture Overlay
 * Adds subtle grain effect
 */
export function NoiseTexture({ opacity = 0.05, className = '' }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div
        className="w-full h-full"
        style={{
          opacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
}

/**
 * Composite Background
 * Combines multiple background effects
 */
export function CompositeBackground({ variant = 'default', includeOrbs = true, includeGrid = false, includeNoise = true }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <GradientMesh variant={variant} animate />
      {includeOrbs && <AnimatedOrbs count={3} />}
      {includeGrid && <GridLines spacing={50} opacity={0.05} />}
      {includeNoise && <NoiseTexture opacity={0.03} />}
    </div>
  );
}

// Add to globals.css or include here:
const styles = `
@keyframes gradient-xy {
  0%, 100% {
    background-position: 0% 0%;
  }
  25% {
    background-position: 100% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  75% {
    background-position: 0% 100%;
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-gradient-xy {
  animation: gradient-xy 15s ease infinite;
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}
`;

export { styles as gradientStyles };

// Import missing useState and useEffect
import { useState, useEffect } from 'react';
