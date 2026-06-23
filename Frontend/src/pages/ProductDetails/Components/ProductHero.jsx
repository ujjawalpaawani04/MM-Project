// import bgImg from "../../../assets/website/productDetails-hero.webp"
import Breadcrumbs from "../../../components/common/Breadcrumbs";
export default function ProductHero({product}) {
  return (
    <section className="relative overflow-hidden h-[70vh] max-h-[1000px] pt-30 bg-ink-900 content-center">
            <img
        src="/website/images/heroBg.webp"
        alt=""
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
<div class="absolute inset-0 z-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>

      {/* content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-20 text-white flex flex-col gap-3 items-center justify-center">
        <span className="inline-block bg-[#efebe4] dark:bg-slate-700 text-[#e34786] dark:text-brand-300 px-4 py-2 text-sm font-semibold uppercase tracking-wide rounded-lg">
          Collectible Details
        </span>
        <h1 class="font-bold text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mt-5">Where Every Detail<span class="text-[#e34786]"> Matters</span></h1>
        <p className="mt-3 max-w-2xl mx-auto text-white dark:text-gray-300">
          Explore the craftsmanship, story and specifications behind your
          handcrafted miniature.
        </p>
         <Breadcrumbs
                items={[
                  { label: "Home", to: "/" },
                  { label: "Shop", to: "/shop" },
                  { label: product },
                ]}
              />
      </div>
    </section>
  );
}
