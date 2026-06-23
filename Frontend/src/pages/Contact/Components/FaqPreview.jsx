import { Link } from "react-router";
import { FaArrowRight } from "react-icons/fa";
import Accordion from "../../../components/common/Accordion";
import { faqs } from "../../../data/faqs";
import faqImg from "../../../assets/website/Contact/contaxtFaqImage.png"

export default function FaqPreview() {
  return (
    <section className="bg-cream-100 dark:bg-slate-900/40 py-10 lg:py-16">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 lg:justify-center items-center max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="w-full lg:w-1/2 lg:shrink-0">
          <img src={faqImg} alt="Frequently asked questions" className="w-full object-cover"/>
        </div>
        <div className="w-full lg:w-1/2">
            <div className=" mx-auto   space-y-3">
    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full   bg-gradient-to-r from-pink-500 to-rose-400 backdrop-blur-md text-[#ffffff] text-sm font-semibold">Quick Answers</span>
        <h2 className=" text-3xl font-bold text-gray-900 dark:text-white">
          Frequently Asked <span className="text-[#e34786]">Questions</span>
        </h2>
        <p className=" text-gray-600 dark:text-gray-300">
          Can't find what you're looking for? Reach out and we'll help.
        </p>
      </div>

      <div className=" mx-auto   mt-6">
        <Accordion items={faqs.slice(0, 4)} />
        <div className="mt-8 ">
                  <Link
                   to="/faq"
                   className="group px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold inline-flex items-center gap-3 shadow-xl shadow-pink-500/20 hover:opacity-95 duration-200"
                 >
                  View All
                   <FaArrowRight className="group-hover:translate-x-1 duration-300" />
                 </Link>
        </div>
      </div></div>
      </div>

    </section>
  );
}
