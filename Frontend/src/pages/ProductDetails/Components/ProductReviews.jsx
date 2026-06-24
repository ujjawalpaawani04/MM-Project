import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { FaStar, FaRegStar, FaQuoteLeft, FaCheckCircle } from "react-icons/fa";
import { FiImage, FiX, FiUploadCloud } from "react-icons/fi";

import { useToast } from "../../../context/ToastContext";
import Button from "../../../components/common/Button";
import Rating from "../../../components/common/Rating";
import FormField from "../../../components/common/form/FormField";
import TextAreaField from "../../../components/common/form/TextAreaField";
import Pagination from "../../../components/common/Pagination";

const REVIEWS_PER_PAGE = 4;

/** Interactive 1-5 star picker for the review form. */
function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (hover || value) >= n;
        return (
          <button
            type="button"
            key={n}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            className="text-2xl text-amber-400 transition-transform hover:scale-110 focus-visible:outline-none"
          >
            {filled ? <FaStar /> : <FaRegStar className="text-gray-300 dark:text-slate-600" />}
          </button>
        );
      })}
      <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
        {value ? `${value}.0` : "Tap to rate"}
      </span>
    </div>
  );
}

function ReviewCard({ review }) {
  const initial = review.name?.trim()?.charAt(0)?.toUpperCase() || "?";
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <FaQuoteLeft
        className="absolute top-5 right-5 text-brand-100 dark:text-slate-700"
        size={26}
        aria-hidden="true"
      />
      <div className="flex items-center gap-3">
        <span className="grid place-items-center h-11 w-11 rounded-full bg-gradient-to-br from-pink-500 to-rose-400 text-white font-bold shrink-0">
          {initial}
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
            {review.name}
            {review.verified !== false && (
              <FaCheckCircle className="text-green-500" size={13} title="Verified buyer" />
            )}
          </p>
          <p className="text-xs text-gray-400">{review.date}</p>
        </div>
      </div>

      <div className="mt-3">
        <Rating value={review.rating} />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {review.comment}
      </p>

      {review.images?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {review.images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="Customer upload"
              loading="lazy"
              className="h-16 w-16 rounded-xl object-cover border border-gray-100 dark:border-slate-700"
            />
          ))}
        </div>
      )}
    </motion.article>
  );
}

function RatingSummary({ reviews }) {
  const total = reviews.length;
  const average =
    total === 0 ? 0 : reviews.reduce((s, r) => s + (r.rating || 0), 0) / total;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  return (
    <div className="rounded-3xl bg-gradient-to-br from-brand-50 to-rose-50 dark:from-slate-800 dark:to-slate-800 border border-brand-100/60 dark:border-slate-700 p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="text-center sm:border-r sm:border-brand-100 dark:sm:border-slate-700 sm:pr-7">
          <p className="text-5xl font-bold text-gray-900 dark:text-white">
            {average.toFixed(1)}
          </p>
          <div className="mt-2 flex justify-center">
            <Rating value={average} size={18} />
          </div>
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {total} review{total !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex-1 space-y-1.5">
          {dist.map(({ star, count }) => {
            const pct = total ? (count / total) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-sm">
                <span className="w-10 text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  {star} <FaStar className="text-amber-400" size={11} />
                </span>
                <div className="flex-1 h-2 rounded-full bg-white/70 dark:bg-slate-700 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-400"
                  />
                </div>
                <span className="w-6 text-right text-gray-400">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Full reviews block: summary, paginated review cards, and the review form. */
export default function ProductReviews({ product }) {
  const [reviews, setReviews] = useState(product.reviews || []);
  const [rating, setRating] = useState(5);
  const [images, setImages] = useState([]); // [{ url, name }] - UI-only previews
  const [page, setPage] = useState(1);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: "", comment: "" } });

  const totalPages = Math.max(1, Math.ceil(reviews.length / REVIEWS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageReviews = useMemo(
    () =>
      reviews.slice(
        (currentPage - 1) * REVIEWS_PER_PAGE,
        currentPage * REVIEWS_PER_PAGE
      ),
    [reviews, currentPage]
  );

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 4 - images.length);
    const next = files.map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
    setImages((prev) => [...prev, ...next].slice(0, 4));
    e.target.value = "";
  };

  const removeImage = (idx) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const submit = (data) => {
    setReviews((r) => [
      {
        name: data.name,
        comment: data.comment,
        rating,
        date: "Just now",
        verified: false,
        images: images.map((i) => i.url),
      },
      ...r,
    ]);
    reset();
    setRating(5);
    setImages([]);
    setPage(1);
    toast.success("Thanks for your review!");
  };

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-start">
      {/* Reviews list */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Customer Reviews
            <span className="ml-2 text-base font-medium text-gray-400">
              ({reviews.length})
            </span>
          </h3>
        </div>

        {reviews.length > 0 ? (
          <>
            <RatingSummary reviews={reviews} />

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {pageReviews.map((r, i) => (
                  <ReviewCard key={`${currentPage}-${i}-${r.date}`} review={r} />
                ))}
              </AnimatePresence>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-8"
            />
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 p-10 text-center text-gray-500 dark:text-gray-400">
            No reviews yet - be the first to share your thoughts.
          </div>
        )}
      </div>

      {/* Write a review */}
      <div className="lg:sticky lg:top-28">
        <div className="rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm p-6 sm:p-7">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Write a Review
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Share your experience with this piece.
          </p>

          <form onSubmit={handleSubmit(submit)} noValidate className="mt-5 space-y-4">
            <div>
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Your rating
              </span>
              <StarInput value={rating} onChange={setRating} />
            </div>

            <FormField
              label="Your name"
              placeholder="e.g. Ananya R."
              error={errors.name?.message}
              {...register("name", { required: "Please enter your name" })}
            />

            <TextAreaField
              label="Your review"
              rows={4}
              placeholder="What did you love about it? How was the craftsmanship?"
              error={errors.comment?.message}
              {...register("comment", {
                required: "Please write a short review",
                minLength: { value: 10, message: "A little more detail, please" },
              })}
            />

            {/* Image upload (UI only) */}
            <div>
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Add photos <span className="text-gray-400 font-normal">(optional)</span>
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative h-16 w-16 group">
                    <img
                      src={img.url}
                      alt={img.name}
                      className="h-16 w-16 rounded-xl object-cover border border-gray-200 dark:border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      aria-label="Remove image"
                      className="absolute -top-2 -right-2 grid place-items-center h-5 w-5 rounded-full bg-gray-900/80 text-white hover:bg-red-500 transition-colors"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
                {images.length < 4 && (
                  <label className="h-16 w-16 grid place-items-center rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-600 text-gray-400 hover:border-brand-300 hover:text-brand-500 cursor-pointer transition-colors">
                    <FiUploadCloud size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFiles}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
              <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-1">
                <FiImage size={12} /> Up to 4 images. Previews only in this demo.
              </p>
            </div>

            <Button type="submit" fullWidth size="lg" icon={FaStar}>
              Submit Review
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
