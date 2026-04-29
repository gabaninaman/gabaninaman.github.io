/**
 * Logo3D Module - Reusable 3D Animated Logo Component
 * 
 * This module provides two ways to render 3D logos:
 * 
 * ============================================================================
 * OPTION 1: Standalone Logo3D (Simple, Independent)
 * ============================================================================
 * Use when: You need a single 3D logo with its own Canvas
 * Pros: Simple to use, works anywhere, independent z-index control
 * Cons: Each instance creates its own WebGL context (performance impact with many)
 * 
 * Example:
 *   import Logo3D from '@/components/Logo3D'
 *   <Logo3D width={5} height={5} animationType="spiral" />
 * 
 * ============================================================================
 * OPTION 2: Shared Scene with Logo3DProvider + Logo3DView (Performance)
 * ============================================================================
 * Use when: You have multiple 3D logos on the same page
 * Pros: Single WebGL context, better performance, synchronized rendering
 * Cons: All views share same z-index layer (z-1000), requires Provider wrapper
 * 
 * IMPORTANT: The shared Canvas has position:fixed and z-index:1000
 * - Content behind the Canvas needs z-index < 1000
 * - Content in front of the Canvas needs z-index > 1000 (e.g., z-[1001])
 * - The Logo3DView uses View component from @react-three/drei which renders
 *   via scissor clipping to match DOM element positions
 * 
 * Example:
 *   import { Logo3DProvider, Logo3DView } from '@/components/Logo3D'
 *   
 *   <Logo3DProvider>
 *     <div className="z-[1001]">Content in front of 3D</div>
 *     <Logo3DView width={100} height={100} animationType="spiral" />
 *     <Logo3DView width={5} height={5} animationType="orbit" />
 *   </Logo3DProvider>
 * 
 * ============================================================================
 * PROPS (same for both Logo3D and Logo3DView)
 * ============================================================================
 * @prop {number} width - Scale 1-100 (1 = ~40px navbar size, 100 = 90% viewport)
 * @prop {number} height - Scale 1-100 (1 = ~40px navbar size, 100 = 90% viewport)
 * @prop {boolean} interactive - Enable OrbitControls for drag-to-rotate (default: false)
 *                               NOTE: When true, scroll events are captured!
 * @prop {string} color - Logo color in hex (default: '#8b5cf6')
 * @prop {string} materialPreset - 'standard' | 'iridescent' | 'holographic' | 'neon' | 'brushed_metal' | 'gradient'
 * @prop {string} animationType - 'spiral' | 'explosion' | 'drop' | 'orbit' | 'wave' | 'zoom' | 'portal' | 'helix' | 'tornado' | 'matrix' | 'vortex' | 'assemble'
 * @prop {number} rotationSpeed - Speed of continuous rotation after entry animation (default: 1)
 * @prop {number} metalness - Material metalness 0-1 (default: 0.5)
 * @prop {number} roughness - Material roughness 0-1 (default: 0.3)
 * @prop {function} onAnimationComplete - Callback when entry animation finishes
 * 
 * ============================================================================
 * CAMERA & SCENE NOTES
 * ============================================================================
 * - Camera is positioned at [distance, distance, distance] looking at origin
 * - This creates ~35° elevation and 45° azimuth (isometric-like view)
 * - The logo is ~7 units tall, so cameraDistance of 5-6 fills the view nicely
 * - Animation orbitRadius is 8 units, so ensure cameraDistance/FOV can see the full animation
 * - Each View needs its own lights (shared Canvas lights don't apply to Views)
 */

export { 
  default, 
  MATERIAL_PRESETS, 
  ANIMATION_TYPES,
  Logo3DProvider,
  Logo3DView
} from './Logo3D'
