import { Suspense, useMemo, useState, useRef, useCallback, useEffect } from "react";
import * as THREE from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  OrbitControls,
  Html,
  useProgress,
  useGLTF,
} from "@react-three/drei";

import ModelErrorBoundary from "../../../components/website/ModelErrorBoundary";
import modelUrl from "../../../assets/models/mm-modal.glb";

// Self-hosted Draco decoder (public/draco/). The GLB is Draco-compressed, so a
// decoder is required; using a LOCAL path instead of drei's default gstatic CDN
// means the model always decodes - even offline or when the CDN is blocked. If
// decoding fails, ModelErrorBoundary shows the STATIC fallback image (and logs
// the error to the console).
const DRACO_PATH = "/draco/";

// Preload so the model is ready by the time the hero paints.
useGLTF.preload(modelUrl, DRACO_PATH);

// World-space size the model is normalised to so it reads as the dominant
// focal point regardless of the GLB's intrinsic scale. This MUST be tuned
// together with the camera (fov + distance) below: the camera at z=7 / fov=30
// shows ~3.75 world units of height, so 3.4 makes the figure fill ~91% of the
// frame - large and premium with a small margin so it never clips while it
// auto-rotates. Bigger number = bigger model (but raise it too far and the
// model overflows the frame).
const TARGET_SIZE = 3.4;

/* ---------------------------------------------------------------- Loader */
function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 text-white">
        <div className="h-9 w-9 rounded-full border-2 border-white/30 border-t-[#e34786] animate-spin" />
        <p className="text-xs font-medium text-white/80">
          {Math.round(progress)}%
        </p>
      </div>
    </Html>
  );
}

/* ----------------------------------------------------------------- Model */
function Model({ onOver, onOut }) {
  const { scene } = useGLTF(modelUrl, DRACO_PATH);

  // CRITICAL: `useGLTF` caches and returns the SAME `scene` object on every
  // mount. Applying scale/position to it via <primitive> mutates that shared
  // cached object, so the next time the Home route mounts, `setFromObject`
  // measures the ALREADY-scaled scene and derives a different normalisation
  // factor - the model visibly shrinks/drifts on navigation. Cloning gives this
  // instance its own pristine copy: measurement always runs on the raw geometry
  // and the cache is never touched, so the size is identical every mount.
  const { object, scale, offset, dims } = useMemo(() => {
    const cloned = cloneSkeleton(scene);

    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = TARGET_SIZE / maxDim;

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Normalised bounding-box dimensions - used to size the invisible hover
    // proxy so hover is detected over the model's volume, not the whole canvas.
    return {
      object: cloned,
      scale: s,
      offset: center,
      dims: [size.x * s, size.y * s, size.z * s],
    };
  }, [scene]);

  return (
    // The primitive is offset so its bounding-box centre sits at the origin, so
    // a box of `dims` centred at the origin exactly wraps the model.
    <group>
      <primitive
        object={object}
        scale={scale}
        position={[-offset.x * scale, -offset.y * scale, -offset.z * scale]}
      />

      {/* Invisible hover proxy: a SINGLE mesh wrapping the model gives clean
          pointer enter/leave over the model only - unlike attaching handlers to
          the multi-mesh model, which would flicker out/over as the pointer
          crosses internal sub-meshes. `opacity 0` + `depthWrite false` keep it
          fully invisible and free of z-fighting; it never casts shadows. */}
      <mesh onPointerOver={onOver} onPointerOut={onOut}>
        <boxGeometry args={dims} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ----------------------------------------------------------------- Scene */
function Scene({ hovering, autoRotateOn, onOver, onOut }) {
  return (
    <>
      {/* Lighting - soft key / fill / rim for a realistic, premium look */}
      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[4, 8, 5]}
        intensity={1.7}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-6, 3, -4]} intensity={0.5} color="#ffd9e8" />
      <spotLight
        position={[0, 6, -6]}
        angle={0.5}
        penumbra={1}
        intensity={0.8}
        color="#e34786"
      />

      <Suspense fallback={<CanvasLoader />}>
        <Model onOver={onOver} onOut={onOut} />
      </Suspense>

      {/* HDRI reflections are a progressive enhancement - isolated so a CDN
          failure can't take down the model. */}
      <ModelErrorBoundary resetKey="hero-env" fallback={null}>
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>
      </ModelErrorBoundary>

      {/* Soft contact shadow grounding the model. */}
      <ContactShadows
        position={[0, -1.75, 0]}
        opacity={0.5}
        scale={14}
        blur={2.8}
        far={4.5}
        resolution={512}
        frames={1}
        color="#000000"
      />

      {/* OrbitControls drives both the idle auto-rotation AND the hover-to-drag
          interaction:
            - `autoRotate` is on only when NOT interacting; on hover it pauses
              and resumes (after a delay) from the CURRENT angle.
            - `enableRotate` is on only while hovering the model, so the canvas
              edges never grab the pointer.
            - Azimuth is left at its default full 360° range (horizontal spin).
            - Polar is locked at the horizon (min == max == π/2) so the user can
              never tilt up/down to reveal the model's top or underside.
            - `enableDamping` makes the pause, the drag, and the resume glide
              instead of snapping. */}
      <OrbitControls
        makeDefault
        autoRotate={autoRotateOn}
        autoRotateSpeed={5}
        enableZoom={false}
        enablePan={false}
        enableRotate={hovering}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        target={[0, 0, 0]}
      />
    </>
  );
}

/* ------------------------------------------------------------- Component */
// Delay (ms) before auto-rotation resumes after the pointer leaves the model.
const RESUME_DELAY = 500;

export default function HeroModel() {
  // `hovering` gates manual rotation (immediate on/off). `autoRotateOn` gates
  // the idle spin and is turned back on only after RESUME_DELAY, so leaving the
  // model gives a brief, premium pause before it picks the spin back up.
  const [hovering, setHovering] = useState(false);
  const [autoRotateOn, setAutoRotateOn] = useState(true);
  const resumeTimer = useRef(null);

  const handleOver = useCallback(() => {
    clearTimeout(resumeTimer.current);
    setHovering(true);
    setAutoRotateOn(false);
  }, []);

  const handleOut = useCallback(() => {
    // Drop manual control immediately, then resume the spin after the delay.
    setHovering(false);
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setAutoRotateOn(true), RESUME_DELAY);
  }, []);

  // Don't leave a pending resume firing after the hero unmounts.
  useEffect(() => () => clearTimeout(resumeTimer.current), []);

  const fallback = (
    <img
      src="/website/images/mohanMaya2.png"
      alt="Mohan Maya collectible miniatures"
      decoding="async"
      className="w-[450px] max-w-full object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,.6)]"
    />
  );

  return (
    <div
      className={`relative w-full h-[400px] sm:h-[520px] lg:h-[640px] xl:h-[720px] select-none ${
        hovering ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      {/* Decorative glow behind the model */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[75%] h-[75%] rounded-full bg-[#e34786]/25 blur-[90px]" />
      </div>

      <ModelErrorBoundary
        resetKey={modelUrl}
        fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            {fallback}
          </div>
        }
      >
        {/* No `frameloop` prop → R3F's default "always" loop runs continuously
            and is NEVER toggled (toggling triggers fiber's setFrameloop →
            clock.stop(), which throws with this three build and freezes the
            scene). Mirrors the working product viewer's Canvas setup. */}
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0.2, 9], fov: 30 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          // R3F re-measures the canvas on scroll by default (`scroll: true`),
          // which is what let a mid-animation/mobile-bar size change "snap" the
          // model bigger on the first scroll. The container has a fixed height,
          // so only react to genuine element/viewport resizes - never scroll.
          resize={{ scroll: false }}
          className="!absolute inset-0"
        >
          <Scene
            hovering={hovering}
            autoRotateOn={autoRotateOn}
            onOver={handleOver}
            onOut={handleOut}
          />
        </Canvas>
      </ModelErrorBoundary>
    </div>
  );
}
