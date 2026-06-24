import { lazy, Suspense } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

// 3D viewer pulls in three/fiber/drei - load it lazily so the hero text and
// CTAs paint instantly while the model chunk streams in behind a placeholder.
const HeroModel = lazy(() => import("./HeroModel"));

function ModelPlaceholder() {
  return (
    <div className="relative w-full h-[400px] sm:h-[520px] lg:h-[640px] xl:h-[720px] flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[70%] h-[70%] rounded-full bg-[#e34786]/25 blur-[90px]" />
      </div>
      <div className="h-9 w-9 rounded-full border-2 border-white/30 border-t-[#e34786] animate-spin" />
    </div>
  );
}

const HomeHero = () => {
  return (
    // `svh` (small viewport height) instead of `vh`: on mobile, `100vh` grows
    // when the address bar collapses on scroll, which shifts the layout and
    // re-measures the Canvas. `svh` is the stable bar-visible height, so the
    // hero - and the model inside it - never resizes on scroll.
    <section className="relative  pt-32 lg:pt-40  h-svh max-h-[1000px] overflow-hidden">
      {/* Background image */}
      <img
        src="/website/images/heroBg.webp"
        alt=""
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#090909]/95 via-[#090909]/50 to-transparent" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-5">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start gap-7"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/95 backdrop-blur-md text-[#e34786] text-xs font-semibold tracking-wide uppercase">
            Hand-Painted Collectibles
            </span>

            <div className="space-y-4">
              <h1 className="text-white text-4xl md:text-6xl xl:text-7xl leading-[1.12] font-bold">
              Where Tiny Arts
                <br />
                Comes To <span className="text-[#e34786]">Life</span>
              </h1>
              <p className="text-gray-300 text-sm md:text-lg max-w-xl">
                Hand-sculpted, hand-painted miniatures from the Mohan-Maya
                story - crafted in fine detail by artisans and made to be
                treasured for generations.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="group px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold flex items-center gap-3 shadow-xl shadow-pink-500/20 hover:opacity-95 duration-200"
              >
                Shop Collection
                <FaArrowRight className="group-hover:translate-x-1 duration-300" />
              </Link>
              <Link
                to="/about"
                className="group px-6 py-3 rounded-full border border-white/70 text-white font-semibold flex items-center gap-3 hover:bg-white hover:text-[#1a1a1a] duration-200"
              >
                Our Story
                <FaArrowRight className="group-hover:translate-x-1 duration-300" />
              </Link>
            </div>
          </motion.div>

          {/* Right - interactive 3D model (primary focal point).
              NOTE: the entrance animation must NOT use `scale` - that puts a
              CSS transform on the <Canvas>'s ancestor, so R3F measures the
              WebGL viewport while the box is shrunk and the model renders too
              small until the first scroll re-measure snaps it bigger. A `y`
              translate moves the box without changing its measured size, so it
              keeps a subtle entrance while the model stays a constant size. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative z-10 lg:flex justify-center items-center hidden
            "
          >
            <Suspense fallback={<ModelPlaceholder />}>
              <HeroModel />
            </Suspense>
          </motion.div>
        </div>
      </div>

      {/* Overlapping trust strip */}
      {/* <div className="absolute inset-x-0 bottom-0 translate-y-1/2 z-30 px-5">
        <div className="max-w-5xl mx-auto">
          <FeatureStrip />
        </div>
      </div> */}
    </section>
  );
};

export default HomeHero;
