import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
function ContextGuard({ onLoss }) {
  const { gl } = useThree();
  useEffect(() => {
    const lost = (e) => {
      e.preventDefault();
      onLoss();
    };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl, onLoss]);
  return null;
}
function Sculpture() {
  const ref = useRef();
  useFrame(({ pointer }, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.12;
      ref.current.rotation.x +=
        (pointer.y * 0.25 - ref.current.rotation.x) * 0.03;
    }
  });
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={ref}>
        <torusKnotGeometry args={[1.5, 0.46, 160, 24, 2, 3]} />
        <meshStandardMaterial color="#c1c8cd" metalness={1} roughness={0.18} />
      </mesh>
    </Float>
  );
}
export default function Artifact() {
  const [lost, setLost] = useState(false);
  if (lost) return null;
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 45 }}>
      <ContextGuard onLoss={() => setLost(true)} />
      <ambientLight intensity={1} />
      <directionalLight position={[3, 4, 5]} intensity={4} />
      <directionalLight position={[-4, -2, 2]} color="#75e5f0" intensity={3} />
      <Environment preset={undefined}>
        <mesh scale={20}>
          <sphereGeometry />
          <meshBasicMaterial color="#efede6" side={1} />
        </mesh>
      </Environment>
      <Sculpture />
    </Canvas>
  );
}
