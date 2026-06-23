import { Link } from "react-router";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import SectionHeading from "../../../components/common/SectionHeading";
import { characters } from "../../../data/characters";

// Display-only item counts per collection card (the catalog is a demo set).
const itemCounts = [12, 18, 14, 10, 16, 20];

export default function MostLoved() {
  return (
    <section className="bg-cream dark:bg-ink-900 pt-10 lg:p-20">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Meet Our Miniatures"
          highlight="Collection"
         
          viewAllTo="/shop"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {characters.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <Link
                to={`/shop?search=${encodeURIComponent(c.name)}`}
                className="group relative block aspect-[3/4] rounded-2xl overflow-hidden shadow-sm"
              >
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-3 flex items-end justify-between gap-2 backdrop-blur-[2px]">
                  <div className="text-white">
                    <p className="font-semibold leading-tight text-sm">{c.name}</p>
                    <p className="text-[11px] text-white/80">
                      {itemCounts[i]}+ Items
                    </p>
                  </div>
                  <span className="grid place-items-center w-8 h-8 shrink-0 rounded-full bg-white/90 text-gray-800 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-rose-400 group-hover:text-white transition-colors duration-300">
                    <FaArrowRight className="text-xs" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
