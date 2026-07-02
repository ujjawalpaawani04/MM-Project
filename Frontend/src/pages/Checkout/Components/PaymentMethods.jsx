import {
  FiTruck,
  FiSmartphone,
  FiCreditCard,
  FiHome,
  FiCheck,
  FiLock,
} from "react-icons/fi";
import FormField from "../../../components/common/form/FormField";
import SelectField from "../../../components/common/form/SelectField";
import { cn } from "../../../utils/cn";

/**
 * Supported payment methods. `value` is stored on the order; `label` is the
 * human-readable name shown everywhere else. Exported so the Checkout page can
 * resolve the label without duplicating the list.
 */
export const PAYMENT_METHODS = [
  { value: "cod", label: "Cash on Delivery", desc: "Pay in cash when it arrives.", icon: FiTruck },
  { value: "upi", label: "UPI", desc: "GPay, PhonePe, Paytm & more.", icon: FiSmartphone },
  { value: "credit", label: "Credit Card", desc: "Visa, Mastercard, RuPay, Amex.", icon: FiCreditCard },
  { value: "debit", label: "Debit Card", desc: "All major bank debit cards.", icon: FiCreditCard },
  { value: "netbanking", label: "Net Banking", desc: "Pay via your bank portal.", icon: FiHome },
];

export const paymentLabel = (value) =>
  PAYMENT_METHODS.find((m) => m.value === value)?.label || "Cash on Delivery";

const BANKS = [
  "HDFC Bank",
  "State Bank of India",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
];

/**
 * Fields that appear for the chosen method. Because the parent form uses
 * `shouldUnregister: true`, unmounting these (by switching method) also drops
 * their validation - so hidden card fields never block submission.
 */
function MethodFields({ method, register, errors }) {
  if (method === "upi") {
    return (
      <FormField
        label="UPI ID"
        placeholder="name@bank"
        error={errors.upiId?.message}
        {...register("upiId", {
          required: "UPI ID is required",
          pattern: {
            value: /^[\w.-]{2,}@[a-zA-Z]{2,}$/,
            message: "Enter a valid UPI ID (e.g. name@okhdfc)",
          },
        })}
      />
    );
  }

  if (method === "credit" || method === "debit") {
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          label="Name on card"
          className="sm:col-span-2"
          error={errors.cardName?.message}
          {...register("cardName", { required: "Name on card is required" })}
        />
        <FormField
          label="Card number"
          placeholder="1234 5678 9012 3456"
          inputMode="numeric"
          className="sm:col-span-2"
          error={errors.cardNumber?.message}
          {...register("cardNumber", {
            required: "Card number is required",
            validate: (v) =>
              /^\d{16}$/.test(String(v).replace(/\s/g, "")) ||
              "Enter a valid 16-digit card number",
          })}
        />
        <FormField
          label="Expiry (MM/YY)"
          placeholder="08/28"
          error={errors.expiry?.message}
          {...register("expiry", {
            required: "Expiry is required",
            pattern: {
              value: /^(0[1-9]|1[0-2])\/\d{2}$/,
              message: "Use MM/YY format",
            },
          })}
        />
        <FormField
          label="CVV"
          type="password"
          placeholder="123"
          inputMode="numeric"
          error={errors.cvv?.message}
          {...register("cvv", {
            required: "CVV is required",
            pattern: { value: /^\d{3,4}$/, message: "3–4 digits" },
          })}
        />
      </div>
    );
  }

  if (method === "netbanking") {
    return (
      <SelectField
        label="Select your bank"
        placeholder="Choose a bank"
        options={BANKS}
        error={errors.bank?.message}
        {...register("bank", { required: "Please select a bank" })}
      />
    );
  }

  // COD - nothing to collect.
  return (
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Keep the exact amount ready. Pay by cash when your miniatures are
      delivered.
    </p>
  );
}

/**
 * Payment method chooser: accessible radio cards driven by react-hook-form
 * (`register("paymentMethod")`), plus the method-specific fields for the
 * selected option. Purely front-end - no real payment is processed.
 */
export default function PaymentMethods({ register, errors, selected }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Payment Method
        </h2>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
          <FiLock size={13} /> Secure
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        Choose how you'd like to pay. This is a demo — no real charge is made.
      </p>

      <div
        role="radiogroup"
        aria-label="Payment method"
        className="grid sm:grid-cols-2 gap-3"
      >
        {PAYMENT_METHODS.map(({ value, label, desc, icon: Icon }) => {
          const active = selected === value;
          return (
            <label
              key={value}
              className={cn(
                "relative flex items-start gap-3 rounded-2xl border-2 p-4 cursor-pointer transition-colors",
                active
                  ? "border-brand-400 bg-brand-50/60 dark:bg-brand-500/10"
                  : "border-gray-100 dark:border-slate-700 hover:border-brand-200 dark:hover:border-slate-600"
              )}
            >
              <input
                type="radio"
                value={value}
                className="sr-only"
                {...register("paymentMethod", {
                  required: "Please select a payment method",
                })}
              />
              <span
                className={cn(
                  "grid place-items-center h-10 w-10 shrink-0 rounded-xl",
                  active
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-300"
                )}
              >
                <Icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                  {label}
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  {desc}
                </span>
              </span>
              {active && (
                <span className="absolute top-3 right-3 grid place-items-center h-5 w-5 rounded-full bg-brand-500 text-white">
                  <FiCheck size={12} />
                </span>
              )}
            </label>
          );
        })}
      </div>

      {errors.paymentMethod && (
        <p role="alert" className="mt-2 text-xs text-red-500">
          {errors.paymentMethod.message}
        </p>
      )}

      {/* Method-specific inputs */}
      <div className="mt-5 border-t border-gray-100 dark:border-slate-700 pt-5">
        <MethodFields method={selected} register={register} errors={errors} />
      </div>
    </div>
  );
}
