import type { JSX } from "react";
import type * as THREE from "three";
import type { GLTF } from "three-stdlib";

import { useGLTF } from "@react-three/drei";

type GLTFResult = GLTF & {
  nodes: {
    Object_2: THREE.Mesh;
  };
  materials: {
    material_0: THREE.MeshStandardMaterial;
  };
};

export function Alien(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/models/small_alien_3d_model.glb") as unknown as GLTFResult;

  return (
    <group {...props} dispose={null}>
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

useGLTF.preload("/models/small_alien_3d_model.glb");
