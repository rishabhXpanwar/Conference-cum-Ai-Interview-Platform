import { memo, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ------------ Camera: scroll-based z zoom ------------ */

function CameraRig() {
  const { camera } = useThree();

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1.5,
      onUpdate(self) {
        camera.position.z = 6.5 - self.progress * 1.0; // 6.5 → 5.5
      },
    });
    return () => st.kill();
  }, [camera]);

  return null;
}

/* ------------ Particle Field ------------ */

function ParticleField() {
  const pointsRef = useRef(null);

  const positions = useMemo(() => {
    const count = 260;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 3.2 + Math.random() * 2.2;
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.045;
      pointsRef.current.rotation.x += delta * 0.018;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={260}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#4f7df9"
        transparent
        opacity={0.38}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ------------ Geometry ------------ */

function WireSphere() {
  const groupRef  = useRef(null);
  const outerRef  = useRef(null);
  const innerRef  = useRef(null);
  const mouse     = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  /* Mouse tracking */
  useEffect(() => {
    const onMove = (e) => {
      mouse.current.tx = (e.clientX / window.innerWidth  - 0.5) *  0.55;
      mouse.current.ty = (e.clientY / window.innerHeight - 0.5) * -0.35;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    const m = mouse.current;
    /* Lerp mouse offset */
    m.x += (m.tx - m.x) * 0.04;
    m.y += (m.ty - m.y) * 0.04;

    /* Mouse tilt applied to group (non-accumulating) */
    if (groupRef.current) {
      groupRef.current.rotation.y = m.x * 0.45;
      groupRef.current.rotation.x = m.y * 0.30;
    }

    /* Self-rotation on each mesh */
    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.10;
      outerRef.current.rotation.x += delta * 0.04;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.06;
      innerRef.current.rotation.z += delta * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer low-poly wireframe — blue */}
      <mesh ref={outerRef} scale={2.2}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#4f7df9"
          emissive="#4f7df9"
          emissiveIntensity={0.55}
          wireframe
          transparent
          opacity={0.22}
        />
      </mesh>

      {/* Inner low-poly wireframe — violet, counter-rotates */}
      <mesh ref={innerRef} scale={1.45}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#7c5bf5"
          emissive="#7c5bf5"
          emissiveIntensity={0.40}
          wireframe
          transparent
          opacity={0.14}
        />
      </mesh>
    </group>
  );
}

/* ------------ Scene Canvas ------------ */

function HeroScene() {
  return (
    <Canvas
      className="hero-three-canvas"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6.5], fov: 60 }}
      gl={{ antialias: false, alpha: true, powerPreference: "default" }}
      style={{ pointerEvents: "none", background: "transparent" }}
    >
      <ambientLight intensity={0.15} />
      <CameraRig />
      <ParticleField />
      <WireSphere />
    </Canvas>
  );
}

export default memo(HeroScene);
