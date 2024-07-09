/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.18 assets/models/portal.glb -t -o features/three/PortalModel.tsx
*/

import { useGLTF, useTexture } from '@react-three/drei/native';
import { GLTF } from 'three-stdlib';
import { GroupProps, useFrame } from '@react-three/fiber/native';
import { Mesh, MeshBasicMaterial } from 'three';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useRef } from 'react';
import { extend } from '@react-three/fiber';

import texturePath from '@assets/models/portal.jpg';
import modelPath from '@assets/models/portal.glb';
import {
  poleLightColorAtom,
  portalColorInnerAtom,
  portalColorOuterAtom,
  portalDisplacementAtom,
  portalStrengthAtom,
} from '@state/portal';

import { PortalMaterial, PortalMaterialRef } from './PortalMaterial';

type GLTFResult = GLTF & {
  nodes: {
    poleLightR: Mesh;
    poleLightL: Mesh;
    portalLight: Mesh;
    baked: Mesh;
  };
  materials: {};
};

extend({ PortalMaterial });

export function PortalModel(props: GroupProps) {
  const { nodes } = useGLTF(modelPath) as GLTFResult;
  const bakedTexture = useTexture(texturePath);

  const poleLightColor = useAtomValue(poleLightColorAtom);
  const portalColorEnd = useAtomValue(portalColorOuterAtom);
  const portalColorStart = useAtomValue(portalColorInnerAtom);
  const portalDisplacement = useAtomValue(portalDisplacementAtom);
  const portalStrength = useAtomValue(portalStrengthAtom);

  const poleLightMaterial = useMemo(
    () => new MeshBasicMaterial({ color: '#ff0000' }),
    []
  );

  const portalMaterial = useRef<PortalMaterialRef>(null);

  useEffect(() => {
    poleLightMaterial.color.set(poleLightColor);
  }, [poleLightColor, poleLightMaterial]);

  useEffect(() => {
    if (!portalMaterial.current) return;
    portalMaterial.current.uColorEnd = portalColorEnd;
    portalMaterial.current.uColorStart = portalColorStart;
    portalMaterial.current.uOffsetDisplacementUv = portalDisplacement;
    portalMaterial.current.uOffsetStrengthUv = portalStrength;
  }, [
    portalColorEnd,
    portalColorStart,
    portalDisplacement,
    portalStrength,
    portalMaterial,
  ]);

  useFrame((_, delta) => {
    if (!portalMaterial.current) return;
    portalMaterial.current.uTime += delta;
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.poleLightR.geometry}
        material={poleLightMaterial}
        position={[0.612, 1.308, 0.161]}
      />
      <mesh
        geometry={nodes.poleLightL.geometry}
        material={poleLightMaterial}
        position={[-0.687, 1.308, 0.161]}
        rotation={[-Math.PI, 0, -Math.PI]}
      />
      <mesh
        geometry={nodes.portalLight.geometry}
        // material={nodes.portalLight.material}
        position={[0, 0.855, -1.878]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <portalMaterial ref={portalMaterial} attach="material" />
      </mesh>
      <mesh
        geometry={nodes.baked.geometry}
        material={nodes.baked.material}
        position={[0, 0.859, -1.843]}
        rotation={[0, 0, 3.133]}
      >
        <meshBasicMaterial map={bakedTexture} map-flipY={false} />
      </mesh>
    </group>
  );
}

useGLTF.preload(modelPath);
