import { useId, useState } from "react";
import { FiAlertTriangle, FiXCircle } from "react-icons/fi";

import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";
import { formatCurrency } from "../../../utils/formatCurrency";
import { CANCELLATION_REASONS, OTHER_REASON } from "../../../utils/orders";

/**
 * Dedicated, production-grade order-cancellation dialog (Amazon/Flipkart style).
 *
 * Unlike a generic yes/no confirm, this collects *why* the order is being
 * cancelled: the customer must pick a predefined reason, and choosing "Other"
 * reveals a required free-text field. It surfaces an irreversible-action
 * warning, validates before allowing submit, shows a loading state while the
 * request is in flight, and reports API errors inline (so the modal stays open
 * for a retry instead of vanishing).
 *
 * State is fully self-contained; the parent remounts this via a `key` per order
 * (so form state resets cleanly on each open without a reset effect), and only
 * owns the async `onConfirm(reason)` and the persistence.
 */
export default function CancelOrderModal({ order, isOpen, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const [otherText, setOtherText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const groupId = useId();

  const isOther = reason === OTHER_REASON;
  const trimmedOther = otherText.trim();
  // Ready to submit once a reason is chosen (and, for "Other", some text typed).
  const isValid = reason !== "" && (!isOther || trimmedOther.length > 0);

  if (!order) return null;

  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);

  // Block close (backdrop / Esc) while a request is in flight so the user can't
  // dismiss a half-finished cancellation.
  const handleClose = () => {
    if (!loading) onClose();
  };

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    const finalReason = isOther ? trimmedOther : reason;
    setError("");
    setLoading(true);
    try {
      // onConfirm resolves on success and throws on failure; the parent decides
      // what "failure" means (e.g. the order became ineligible mid-flow).
      await onConfirm(finalReason);
      // On success the parent closes the modal; no local state change needed.
    } catch (err) {
      setError(
        err?.message ||
          "Something went wrong while cancelling. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      title={`Cancel order ${order.orderNumber}`}
    >
      <div className="p-5 sm:p-6 space-y-5">
        {/* Order recap so the user is certain which order they're cancelling. */}
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 dark:border-slate-700 p-3">
          <img
            src={order.items[0].image}
            alt=""
            aria-hidden="true"
            className="h-12 w-12 rounded-xl object-cover bg-gray-100 dark:bg-slate-700 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {order.items[0].name}
              {order.items.length > 1 && (
                <span className="font-normal text-gray-400">
                  {" "}& {order.items.length - 1} more
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {itemCount} item{itemCount !== 1 ? "s" : ""} ·{" "}
              {formatCurrency(order.total)}
            </p>
          </div>
        </div>

        {/* Irreversible-action warning. */}
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-300"
        >
          <FiAlertTriangle className="shrink-0 mt-0.5" size={16} />
          <p>
            This action <strong>cannot be undone</strong>. Prepaid orders will be
            refunded to your original payment method.
          </p>
        </div>

        {/* Reason picker - required. Rendered as an accessible radiogroup. */}
        <fieldset>
          <legend className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Please tell us why you're cancelling
          </legend>
          <div role="radiogroup" aria-label="Cancellation reason" className="space-y-2">
            {CANCELLATION_REASONS.map((option) => {
              const selected = reason === option;
              return (
                <label
                  key={option}
                  className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm cursor-pointer transition-colors ${
                    selected
                      ? "border-brand-400 bg-brand-50 dark:bg-brand-500/10 dark:border-brand-500/40"
                      : "border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <input
                    type="radio"
                    name={groupId}
                    value={option}
                    checked={selected}
                    onChange={() => setReason(option)}
                    disabled={loading}
                    className="h-4 w-4 accent-brand-500"
                  />
                  <span className="text-gray-800 dark:text-gray-200">{option}</span>
                </label>
              );
            })}
          </div>

          {/* Conditional free-text field for "Other". */}
          {isOther && (
            <div className="mt-3">
              <label htmlFor={`${groupId}-other`} className="sr-only">
                Tell us more about your reason for cancelling
              </label>
              <textarea
                id={`${groupId}-other`}
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                disabled={loading}
                rows={3}
                maxLength={300}
                autoFocus
                placeholder="Tell us a bit more (required)…"
                className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/30 resize-none"
              />
              <p className="mt-1 text-right text-xs text-gray-400">
                {trimmedOther.length}/300
              </p>
            </div>
          )}
        </fieldset>

        {/* Inline API error - keeps the modal open for a retry. */}
        {error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-1">
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            Keep my order
          </Button>
          <Button
            variant="danger"
            icon={FiXCircle}
            onClick={handleSubmit}
            loading={loading}
            disabled={!isValid}
          >
            {loading ? "Cancelling…" : "Cancel order"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
