import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "swiper/css";
import "swiper/css/pagination";

import SectionHeading from "../../../components/common/SectionHeading";
import ProductCard from "../../../components/website/ProductCard";
import { getBestSellers } from "../../../data/products";

export default function BestSellers({ onQuickView }) {
  const products = getBestSellers();
  if (!products.length) return null;

  return (
    <section className="bg-cream-100 dark:bg-ink-900 py-16">
      <div className="container mx-auto px-4">
        <SectionHeading title="Our Best" highlight="Sellers" viewAllTo="/shop"  />

        <Swiper
          className="best-sellers-slider pb-0"
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1.15}
          grabCursor
          // autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          navigation={{ prevEl: ".bs-prev", nextEl: ".bs-next" }}
          pagination={{ el: ".bs-dots", clickable: true }}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 22 },
            1280: { slidesPerView: 5, spaceBetween: 16 },
          }}
        >
          {products.map((p) => (
            <SwiperSlide key={p.id} className="h-auto pb-2">
              <ProductCard product={p} onQuickView={onQuickView} tag="Best Seller" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            className="bs-prev grid place-items-center w-9 h-9 rounded-full border border-[#e34786]/40 text-[#e34786] hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-400 hover:text-white hover:border-transparent transition-colors"
            aria-label="Previous"
          >
            <FiChevronLeft />
          </button>
          <div className="bs-dots flex items-center gap-2 w-[auto]" />
          <button
            className="bs-next grid place-items-center w-9 h-9 rounded-full border border-[#e34786]/40 text-[#e34786] hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-400 hover:text-white hover:border-transparent transition-colors"
            aria-label="Next"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
