// ProductModel.jsx
/* eslint-disable react-refresh/only-export-components -- the preloadModel() prefetch helper is intentionally co-located with the viewer it warms */
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";

function Model({ url, onLoaded }) {
  // Local Draco decoder (public/draco/) - see HeroModel for the rationale.
  const { scene } = useGLTF(url, "/draco/");
  // Notify the parent once the GLTF has resolved so it can hide the loader.
  useEffect(() => {
    onLoaded?.();
  }, [onLoaded]);

  // CRITICAL: `useGLTF` caches and returns the SAME `scene` object on every
  // mount. Mounting it in a second canvas (the fullscreen overlay) via
  // <primitive> MOVES that node out of the inline canvas's scene graph, so after
  // exiting fullscreen the inline viewer went blank. Cloning gives each canvas
  // its own copy (SkeletonUtils.clone preserves any skinned meshes and shares
  // geometry/materials, so it's cheap) — both views render independently and the
  // shared cache is never mutated. Same rationale as HeroModel.
  const object = useMemo(() => cloneSkeleton(scene), [scene]);
  return <primitive object={object} scale={6} />;
}

export default function ProductModel({ modelUrl, onLoaded }) {
  const orbitControlsRef = useRef();
  const [zoomLevel, setZoomLevel] = useState(8);

  const handleZoomIn = () => {
    const newZoom = Math.max(2, zoomLevel - 1);
    setZoomLevel(newZoom);
    if (orbitControlsRef.current) {
      orbitControlsRef.current.object.position.z = newZoom;
    }
  };

  const handleZoomOut = () => {
    const newZoom = Math.min(15, zoomLevel + 1);
    setZoomLevel(newZoom);
    if (orbitControlsRef.current) {
      orbitControlsRef.current.object.position.z = newZoom;
    }
  };

  const handleResetView = () => {
    setZoomLevel(7);
    if (orbitControlsRef.current) {
      orbitControlsRef.current.object.position.z = 7;
      orbitControlsRef.current.object.position.x = 0;
      orbitControlsRef.current.object.position.y = 0;
      orbitControlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [1, 3, zoomLevel] }}
        // Cap the device-pixel-ratio so high-DPI phones don't render the scene
        // at 3x (a large, needless GPU cost); [1,2] keeps it crisp and fast.
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={2} />
        <directionalLight position={[2, 2, 2]} intensity={1.5} />

        {/* Suspense lives INSIDE the Canvas so the model's loading suspension
            stays contained in the react-three-fiber renderer and never bubbles
            up to the DOM tree (which previously tore down the surrounding
            modal on the first "View in 3D" click). */}
        <Suspense fallback={null}>
          <Model url={modelUrl} onLoaded={onLoaded} />
        </Suspense>

        <OrbitControls
          ref={orbitControlsRef}
          enableZoom={true}
          enablePan={true}
            minAzimuthAngle={-Infinity}
  maxAzimuthAngle={Infinity}
    minPolarAngle={Math.PI / 2}
  maxPolarAngle={Math.PI / 2}
          enableRotate={true}
          // autoRotate
          autoRotateSpeed={3}
          zoomSpeed={1.5}
          rotateSpeed={1}
          minDistance={2}
          maxDistance={15}
        />

      </Canvas>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-lg">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          className="p-2 hover:bg-[#D97BA8] hover:text-white text-[#D97BA8] rounded transition-colors"
          title="Zoom In"
        >
          <FiZoomIn size={20} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleResetView();
          }}
          className="p-2 hover:bg-[#D97BA8] hover:text-white text-[#D97BA8] rounded transition-colors text-sm font-bold"
          title="Reset View"
        >
          ↺
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          className="p-2 hover:bg-[#D97BA8] hover:text-white text-[#D97BA8] rounded transition-colors"
          title="Zoom Out"
        >
          <FiZoomOut size={20} />
        </button>
      </div>

      {/* Mouse Control Info */}
      <div className="absolute top-20 left-4 bg-black/60 text-white text-xs px-3 py-2 rounded transition-opacity pointer-events-none">
        <p>🖱️ Drag: Rotate</p>
        <p>Scroll: Zoom</p>
      </div>
    </div>
  );
}

/**
 * Warm the GLTF + Draco cache for a model so opening the 3D view feels instant.
 * Called on intent (hover/focus of the "View in 3D" button). Safe to call
 * repeatedly — drei dedupes by URL, and subsequent views hit the cache.
 */
export function preloadModel(url) {
  if (url) useGLTF.preload(url, "/draco/");
}
