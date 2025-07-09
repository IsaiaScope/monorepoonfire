// React JSX type definitions for component props
import type { JSX } from "react";
// Three.js core library types for 3D objects and materials
import type * as THREE from "three";
// GLTF loader type definitions from three-stdlib for 3D model loading
import type { GLTF } from "three-stdlib";

// React Three Fiber utilities for animations and GLTF model loading
import { useAnimations, useGLTF } from "@react-three/drei";
// React Three Fiber hook for accessing the render loop
import { useFrame } from "@react-three/fiber";
// Motion library hooks for creating smooth animated values
import { useMotionValue, useSpring } from "motion/react";
// React hooks for side effects, references, and component lifecycle
import { useEffect, useRef } from "react";

/**
 * Type definition for the GLTF result specific to the alien 3D model.
 * Extends the base GLTF type with model-specific node and material structure.
 */
type GLTFResult = GLTF & {
  // 3D geometry nodes available in the alien model
  nodes: {
    Object_2: THREE.Mesh; // Main mesh object containing the alien's geometry
  };
  // Materials used by the alien model for rendering
  materials: {
    material_0: THREE.MeshStandardMaterial; // Primary material with PBR properties
  };
};

/**
 * Alien 3D Model Component
 *
 * Renders an animated 3D alien model with fade-in animation.
 * The component loads a GLTF model, plays its embedded animations,
 * and applies a smooth opacity transition on mount.
 *
 * @param props - Standard Three.js group element properties (position, rotation, scale, etc.)
 * @returns JSX element containing the 3D alien model
 */
export function Alien(props: JSX.IntrinsicElements["group"]) {
  // Load the GLTF model file and extract nodes, materials, and animations
  // Type assertion ensures TypeScript knows the specific structure of our alien model
  const { nodes, materials, animations } = useGLTF("/models/small_alien_3d_model.glb") as unknown as GLTFResult & { animations: THREE.AnimationClip[] };

  // Create a ref to access the Three.js group object for animations
  const group = useRef<THREE.Group>(null);

  // Initialize animation mixer and actions from the loaded animations
  const { actions } = useAnimations(animations, group);

  /**
   * Auto-play the first animation found in the GLTF file
   * This effect runs once when the component mounts and animations are loaded
   */
  useEffect(() => {
    if (animations.length > 0) {
      // Play the first animation clip (index 0) if available
      // Optional chaining ensures we don't crash if the animation doesn't exist
      actions[animations[0].name]?.play();
    }
  }, [actions, animations]); // Re-run if actions or animations change

  /**
   * Fade-in Animation Setup
   * Creates a smooth opacity transition from 0 to 1 when the component mounts
   */

  // Motion value for controlling opacity (starts at 0, invisible)
  const opacity = useMotionValue(0);

  // Spring animation for smooth opacity transitions
  // Higher damping (50) = less bouncy, moderate stiffness (30) = slower animation
  const opacitySpring = useSpring(opacity, { damping: 50, stiffness: 30 });

  /**
   * Trigger the fade-in animation on component mount
   * Sets opacity from 0 to 1, which will be smoothly animated by the spring
   */
  useEffect(() => {
    opacity.set(1); // Animate to fully opaque
  }, [opacity]); // Only run once when opacity motion value is created

  /**
   * Render Loop Integration
   * Updates the 3D material opacity on every frame using the animated spring value
   * This ensures smooth visual transitions synchronized with the render loop
   */
  useFrame(() => {
    // Ensure the group reference exists before accessing materials
    if (group.current) {
      // Apply the animated opacity to the alien's primary material
      if (materials.material_0) {
        // Get the current spring value and apply it to material opacity
        materials.material_0.opacity = opacitySpring.get();
        // Enable transparency to allow opacity changes to be visible
        materials.material_0.transparent = true;
      }
    }
  });

  /**
   * Render the 3D Alien Model
   * Returns a Three.js group containing the alien mesh with all transformations and properties
   */
  return (
    <group ref={group} {...props} dispose={null}>
      {/*
        Main alien mesh element:
        - castShadow: Allows this object to cast shadows on other objects
        - receiveShadow: Allows this object to receive shadows from other objects
        - geometry: The 3D shape/vertices from the GLTF model's Object_2 node
        - material: The surface appearance (material_0) with PBR properties
        - rotation: Rotates the model -90 degrees around X-axis to correct orientation
        - dispose={null}: Prevents automatic cleanup of the group when unmounted
      */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_2.geometry}
        material={materials.material_0}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

/**
 * Preload the GLTF model for better performance
 * This ensures the model is loaded and cached before the component is rendered,
 * preventing loading delays and improving user experience
 */
useGLTF.preload("/models/small_alien_3d_model.glb");
