import { motion } from "framer-motion";
import SectionHeading from "../../../components/common/SectionHeading";
import { FaPaintBrush } from "react-icons/fa";
import maya from "../../../assets/website/Maya.jpeg";
import madhav from "../../../assets/website/Madhav.jpeg";
import radha from "../../../assets/website/RadhaJi.jpeg";
import madhvi from "../../../assets/website/Madhvi.jpeg";

const artisans = [
  {
    img: maya,
    name: "Maya Devi",
    craft: "Master Sculptor",
    bio: "Shapes the soul of every figure, translating the story into form with patient, practiced hands.",
  },
  {
    img: madhav,
    name: "Madhav Rao",
    craft: "Lead Painter",
    bio: "Brings each miniature to life with fine, hand-mixed pigments and an eye for serene detail.",
  },
  {
    img: radha,
    name: "Radha Sharma",
    craft: "Finishing Artisan",
    bio: "Perfects every surface and glaze so each piece feels timeless, refined and ready to treasure.",
  },
  {
    img: madhvi,
    name: "Madhvi Iyer",
    craft: "Quality & Care",
    bio: "Inspects, blesses and packs each collectible, ensuring it reaches you exactly as intended.",
  },
];

/** "Meet Our Artisans" - premium artisan cards. */
export default function Artisans() {
  return (
    <section className="bg-cream-100 dark:bg-slate-900 py-16 lg:py-24 border-y border-gray-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Meet Our"
          highlight="Artisans"
          subtitle="The hands and hearts behind every hand-painted Mohan Maya miniature."
        />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {artisans.map(({ img, name, craft, bio }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 text-center"
            >
              <div className="relative mx-auto h-24 w-24">
                <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-pink-500 to-rose-400 opacity-90" />
                <img
                  src={img}
                  alt={name}
                  loading="lazy"
                  decoding="async"
                  className="relative h-24 w-24 rounded-full object-cover ring-4 ring-white dark:ring-slate-800"
                />
              </div>
              <h3 className="mt-5 font-bold text-gray-900 dark:text-white">
                {name}
              </h3>
              <p className="mt-1 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-500">
                <FaPaintBrush size={12} />
                {craft}
              </p>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
