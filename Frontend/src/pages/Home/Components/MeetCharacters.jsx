import { Link } from "react-router";
import { motion } from "framer-motion";
import { characters } from "../../../data/characters";

export default function MeetCharacters() {
  return (
    <section className="bg-[#ffefe2] dark:bg-ink-900 py-16">
      <div className="max-w-7xl  mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
                 <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full   bg-gradient-to-r from-pink-500 to-rose-400 backdrop-blur-md text-[#ffffff] text-sm font-semibold">
 
            
 Characters
 
            </span>
 
          <h2 className="mt-2 text-2xl sm:text-5xl font-bold text-[#4a3747] dark:text-white">
            Meet the <span className="text-[#e34786]">Characters</span>
          </h2>
          <p className="mt-3  dark:text-gray-300 lg:w-[70%] mx-auto">
            Every miniature carries a soul from the Mohan-Maya story. Discover
            the heroes behind the collection.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {characters.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/shop?search=${encodeURIComponent(c.name)}`}
                className="group block text-center"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4]">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-3 text-left text-white backdrop-blur-[2px] ">
                    <p className=" font-semibold text-center ">{c.name}</p>
                    <p className=" text-xs text-center">{c.tagline}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
