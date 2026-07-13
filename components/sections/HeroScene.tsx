'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';
import useMousePosition from '@/lib/useMousePosition';

function AnimatedShape() {
  const mesh = useRef<THREE.Mesh>(null!);
  const mouse = useMousePosition();

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.2;
      mesh.current.rotation.y += delta * 0.3;
      
      // Smooth parallax lerp instead of direct addition for better feel
      mesh.current.rotation.x += (mouse.y - mesh.current.rotation.x) * delta * 5;
      mesh.current.rotation.y += (mouse.x - mesh.current.rotation.y) * delta * 5;
    }
  });

  return (
    <mesh ref={mesh} scale={2.4}>
      <icosahedronGeometry args={[1, 0]} /> 
      <MeshDistortMaterial
        color="#D6B16D"
        envMapIntensity={3}
        metalness={1}
        roughness={0.2}
        distort={0.45}
        speed={2}
      />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 w-full h-full">
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 45 }} 
        dpr={[1, 2]} // Performance optimization
      >
        <ambientLight intensity={0.2} />
        <spotLight position={[-10, -10, -10]} angle={0.5} penumbra={1} intensity={2} color="#D6B16D" />
        <Environment preset="city" />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5}
        />

        <AnimatedShape />
      </Canvas>
    </div>
  );
}