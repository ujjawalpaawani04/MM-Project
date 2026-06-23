import { Swiper, SwiperSlide } from "swiper/react";
import "../../../index.css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
// icons
import { FaQuoteLeft } from "react-icons/fa";
import { IoChevronForward } from "react-icons/io5";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import bgImage from "../../../assets/website/image.png";

const testimonials = [
  {
    id: 1,
    name: "Fatima Khoury",
    handle: "@dilatory_curtains_98",
    review:
      "The progress tracker is fantastic. It’s motivating to see how much I’ve improved over time. The app has a great mix of common and challenging words.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 2,
    name: "Annette Black",
    handle: "@annette_creative",
    review:
      "This service makes studying feel smooth and professional. The UI is crisp, and the experience is incredibly polished.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 3,
    name: "Ralph Edwards",
    handle: "@ralph_designs",
    review:
      "The card design is clean and the slider interaction is so easy to use. It retains a premium visual style throughout.",
    image:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 4,
    name: "Jerome Bell",
    handle: "@jerome_studio",
    review:
      "The testimonial cards look modern and trustworthy. The spacing and typography are on point for a professional website.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
  },
];

const Testimonial = () => {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background Image */}
      <img
        src={bgImage}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/75"></div>

      {/* Content */}
      <div className="relative z-10 mx-auto container   px-4">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full   bg-white backdrop-blur-md text-[#e34786] text-sm font-semibold">This Month</span>
            <h2 className="mt-5  text-4xl font-bold text-white md:text-6xl">
              What <span className="text-[#e34786]">Our Clients</span> Say
            </h2>
            <p className="mt-4 text-base text-white text-[18px]">
              Hear what our happy customers have to say about their experience
              with us.
            </p>
          </div>

          <div className="flex items-center gap-4 justify-start lg:justify-end">
            <button className="testimonial-prev inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20  text-white transition hover:bg-gradient-to-r from-pink-500 to-rose-400 hover:text-white">
              <IoChevronForward className="transform rotate-180" />
            </button>
            <button className="testimonial-next inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-gradient-to-r from-pink-500 to-rose-400">
              <IoChevronForward />
            </button>
          </div>
        </div>

        <Swiper
          className="testimonial-slider"
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={5}
          spaceBetween={16}
          loop={true}
          speed={1000}
          grabCursor={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            prevEl: ".testimonial-prev",
            nextEl: ".testimonial-next",
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 3,
            },
          }}
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="rounded-[30px] border border-white/15 bg-white/95 px-8 py-8 shadow-[0_24px_64px_rgba(15,23,42,0.12)] h-[320px]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-start text-[#e34786]">
                    <FaQuoteLeft size={24} />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-[#c1ba5e]">
                    <span className="text-[#ffb207] text-[24px]">☆</span>
                    <span className="text-[#ffb207] text-[24px]">☆</span>
                    <span className="text-[#ffb207] text-[24px]">☆</span>
                    <span className="text-[#ffb207] text-[24px]">☆</span>
                    <span className="text-[#ffb207] text-[24px]">☆</span>
                  </div>
                </div>

                <p className="mt-4 text-base leading-[22px] text-black">
                  {item.review}
                </p>

                {/* divider */}
                <div className="my-6 h-px w-full bg-slate-200/80"></div>

                <div className=" flex items-center gap-4 ">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-500">{item.handle}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonial;
