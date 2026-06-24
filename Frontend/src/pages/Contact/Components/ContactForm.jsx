import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiUser,
  FiSend,
  FiUploadCloud,
} from "react-icons/fi";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaPinterestP,
} from "react-icons/fa";

import FormField from "../../../components/common/form/FormField";
import TextAreaField from "../../../components/common/form/TextAreaField";
import SelectField from "../../../components/common/form/SelectField";
import Button from "../../../components/common/Button";
import { useToast } from "../../../context/ToastContext";
import { VALIDATION } from "../../../utils/validators";

const info = [
  {
    Icon: FiMapPin,
    label: "Visit Us",
    value: "Ganga Enclave, Canal Rd, near Ganeshpur, Ganesh Pur, Roorkee, Uttarakhand 247667",
    href: null,
  },
  {
    Icon: FiPhone,
    label: "Call Us",
    value: "+91 88889 79697",
    href: "tel:+918888979697",
  },
  {
    Icon: FiMail,
    label: "Email Us",
    value: "support@mohanmaya.com",
    href: "mailto:support@mohanmaya.com",
  },
];

const socials = [
  { Icon: FaInstagram, label: "Instagram", url: "#" },
  { Icon: FaFacebookF, label: "Facebook", url: "#" },
  { Icon: FaYoutube, label: "YouTube", url: "#" },
  { Icon: FaPinterestP, label: "Pinterest", url: "#" },
];

const subjects = [
  "General Inquiry",
  "Custom Miniature Request",
  "Order Support",
  "Wholesale / Bulk Order",
  "Press & Partnerships",
];

export default function ContactForm() {
  const toast = useToast();
  const [fileName, setFileName] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "General Inquiry",
      message: "",
      customRequest: false,
    },
  });

  // Compose the file input's onChange so we can surface the chosen file name
  // without relying on watch() (keeps the React Compiler happy).
  const referenceField = register("reference");

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    // No backend - log for demo and confirm to the user.
    console.info("Contact request:", data);
    toast.success("Message sent! We'll get back to you within 24 hours.");
    reset();
    setFileName(null);
  };

  return (
    <section className=" px-4 sm:px-6 py-14 lg:py-20 bg-cream dark:bg-ink-900">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 max-w-[1200px] mx-auto">
        {/* Info side */}
        <div>
          <div className="flex flex-col gap-3 items-start">
  <span class="inline-flex items-center gap-2 px-5 py-2 rounded-full   bg-gradient-to-r from-pink-500 to-rose-400 backdrop-blur-md text-[#ffffff] text-sm font-semibold">Get in Touch</span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Let's start a <span className="text-[#e34786]">Conversation</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
              Every miniature tells a story, and every conversation begins a new
              one. Reach out for inquiries, custom orders, or support - we'd love
              to hear from you.
            </p>
          </div>

          {/* Contact info cards */}
          <div className="mt-8 space-y-4">
            {info.map(({ Icon, label, value, href }) => (
              <div
                key={label}
                className="flex items-start gap-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white shrink-0">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      className="font-medium text-gray-900 dark:text-white hover:text-brand-500 transition-colors"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-white">
                      {value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Business hours */}
          {/* <div className="mt-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
            <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
              <FiClock className="text-brand-500" /> Business Hours
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {hours.map((h) => (
                <li
                  key={h.day}
                  className="flex justify-between text-gray-600 dark:text-gray-300"
                >
                  <span>{h.day}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Socials */}
          <div className="mt-6">
            <p className="text-sm text-[#e34786] dark:text-gray-400 mb-3">
              Follow our journey
            </p>
            <div className="flex gap-3">
              {socials.map(({ Icon, label, url }) => (
                <a
                  key={label}
                  href={url}
                  aria-label={label}
                  className="grid place-items-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-400 hover:text-white hover:border-transparent transition-all"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Form side */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-700 space-y-5 h-fit"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <FormField
              label="Full Name"
              icon={FiUser}
              required
              placeholder="Your name"
              error={errors.name?.message}
              {...register("name", VALIDATION.name)}
            />
            <FormField
              label="Email Address"
              type="email"
              icon={FiMail}
              required
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email", VALIDATION.email)}
            />
            <FormField
              label="Phone Number"
              type="tel"
              icon={FiPhone}
              required
              placeholder="+91 98765 43210"
              error={errors.phone?.message}
              {...register("phone", VALIDATION.phone)}
            />
            <SelectField
              label="Subject"
              required
              options={subjects}
              error={errors.subject?.message}
              {...register("subject", { required: "Please choose a subject" })}
            />
          </div>

          <TextAreaField
            label="Message"
            required
            rows={5}
            placeholder="Tell us about your inquiry or custom miniature idea…"
            error={errors.message?.message}
            {...register("message", VALIDATION.message)}
          />

          {/* Custom request toggle */}
          <label className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("customRequest")}
              className="w-4 h-4 rounded border-gray-300 accent-brand-500"
            />
            This is a custom miniature request
          </label>

          {/* Optional reference image upload */}
          <div>
            <label
              htmlFor="reference"
              className="flex items-center justify-center gap-3 w-full px-4 py-5 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-600 text-gray-500 dark:text-gray-400 cursor-pointer hover:border-brand-400 hover:text-brand-500 transition-colors"
            >
              <FiUploadCloud size={20} />
              <span className="text-sm">
                {fileName || "Attach a reference image (optional)"}
              </span>
            </label>
            <input
              id="reference"
              type="file"
              accept="image/*"
              className="sr-only"
              {...referenceField}
              onChange={(e) => {
                referenceField.onChange(e);
                setFileName(e.target.files?.[0]?.name || null);
              }}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isSubmitting}
            icon={FiSend}
          >
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
}
