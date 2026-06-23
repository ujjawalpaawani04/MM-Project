import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiBox, FiImage, FiMaximize2, FiX } from "react-icons/fi";
import ProductModel from "./ProductModel";
import ModelErrorBoundary from "./ModelErrorBoundary";

function Loader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-brand-400 pointer-events-none">
      <div className="h-8 w-8 rounded-full border-2 border-current border-t-transparent animate-spin" />
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading 3D model…</p>
    </div>
  );
}

/**
 * Media viewer for the product page / quick-view. Shows the gallery image by
 * default and, when a `.glb` is available, lets the user switch to an
 * interactive 3D view (rotate / zoom / pan / fullscreen). Falls back to the
 * image if the model fails to load.
 *
 * Stability note: switching to 3D no longer closes a surrounding modal. The
 * loading suspension is contained inside the Canvas (see ProductModel), and
 * every interactive control stops event propagation so clicks can never reach
 * a parent modal's backdrop.
 */
export default function Product3DViewer({ images = [], modelUrl, name }) {
  const [active, setActive] = useState(0);
  const [is3D, setIs3D] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const mainImage = images[active] || images[0];

  const handleLoaded = useCallback(() => setLoaded(true), []);

  // Exit fullscreen with Escape without bubbling up to a parent modal.
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setFullscreen(false);
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [fullscreen]);

  const show3D = (e) => {
    e?.stopPropagation();
    setLoaded(false);
    setIs3D(true);
  };

  const showPhoto = (e) => {
    e?.stopPropagation();
    setIs3D(false);
  };

  const fallback = (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
      <img src={mainImage} alt={name} className="max-h-[70%] object-contain" />
      <p className="text-xs text-gray-500">3D preview unavailable - showing image.</p>
    </div>
  );

  const canvas = (
    <ModelErrorBoundary resetKey={modelUrl} fallback={fallback}>
      <div className="absolute inset-0">
        <ProductModel modelUrl={modelUrl} onLoaded={handleLoaded} />
        {!loaded && <Loader />}
      </div>
    </ModelErrorBoundary>
  );

  return (
    <div>
      {/* Main stage */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
        {is3D && modelUrl ? (
          canvas
        ) : (
          <img
            src={mainImage}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        )}

        {/* View toggle */}
        {modelUrl && (
          <div className="absolute top-3 left-3 z-10 flex gap-1 bg-white/90 dark:bg-slate-900/90 rounded-full p-1 shadow">
            <button
              type="button"
              onClick={showPhoto}
              aria-pressed={!is3D}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                !is3D ? "bg-brand-500 text-white" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <FiImage size={14} /> Photo
            </button>
            <button
              type="button"
              onClick={show3D}
              aria-pressed={is3D}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                is3D ? "bg-brand-500 text-white" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <FiBox size={14} /> View in 3D
            </button>
          </div>
        )}

        {is3D && modelUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreen(true);
            }}
            aria-label="View 3D model fullscreen"
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center text-gray-700 dark:text-white shadow hover:bg-brand-500 hover:text-white transition"
          >
            <FiMaximize2 size={16} />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {images.map((img, i) => (
            <button
              type="button"
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setActive(i);
                setIs3D(false);
              }}
              onMouseEnter={() => {
                setActive(i);
                setIs3D(false);
              }}
              aria-label={`View image ${i + 1}`}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition ${
                !is3D && active === i
                  ? "border-brand-400"
                  : "border-transparent hover:border-brand-300"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen overlay */}
      {fullscreen &&
        createPortal(
          <div
            className="fixed inset-0 z-[1100] bg-black flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 text-white">
              <span className="font-medium">{name} - 3D View</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreen(false);
                }}
                aria-label="Exit fullscreen"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <FiX size={22} />
              </button>
            </div>
            <div className="relative flex-1">
              <ModelErrorBoundary resetKey={modelUrl} fallback={fallback}>
                <div className="absolute inset-0">
                  <ProductModel modelUrl={modelUrl} />
                </div>
              </ModelErrorBoundary>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
