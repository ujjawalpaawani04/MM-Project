import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FiShoppingBag } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { EMAIL_PATTERN } from "../../utils/validators";
import { createOrder } from "../../utils/orders";
import { formatCurrency } from "../../utils/formatCurrency";
import { getProfile, getAddresses } from "../../utils/forms";
import CheckoutHero from "./Components/CheckoutHero";
import OrderConfirmation from "./Components/OrderConfirmation";
import ShippingForm from "./Components/ShippingForm";
import PaymentMethods, { paymentLabel } from "./Components/PaymentMethods";
import OrderSummary from "./Components/OrderSummary";
import EmptyState from "../../components/common/EmptyState";
import Seo from "../../components/common/Seo";

const FIELDS = [
  {
    name: "fullName",
    label: "Full name",
    type: "text",
    rules: { required: "Full name is required" },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    rules: {
      required: "Email is required",
      pattern: { value: EMAIL_PATTERN, message: "Enter a valid email" },
    },
  },
  {
    name: "phone",
    label: "Phone",
    type: "tel",
    rules: {
      required: "Phone is required",
      validate: (v) =>
        /^\d{10}$/.test(v.replace(/\D/g, "")) || "Enter a 10-digit phone",
    },
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    full: true,
    rules: { required: "Address is required" },
  },
  { name: "city", label: "City", type: "text", rules: { required: "City is required" } },
  { name: "state", label: "State", type: "text", rules: { required: "State is required" } },
  {
    name: "pincode",
    label: "PIN code",
    type: "text",
    rules: {
      required: "PIN code is required",
      pattern: { value: /^\d{6}$/, message: "Enter a 6-digit PIN" },
    },
  },
];

// Only the shipping fields are persisted onto the order - card/UPI details are
// intentionally NOT stored (they're simulated and sensitive).
const SHIPPING_KEYS = FIELDS.map((f) => f.name);

// Demo coupon catalogue (front-end only). `pct` = percent off subtotal,
// `flat` = fixed rupees off.
const COUPONS = {
  MOHAN10: { type: "pct", value: 10 },
  MINI15: { type: "pct", value: 15 },
  FLAT200: { type: "flat", value: 200 },
};

export default function Checkout() {
  const { items, subtotal, shipping, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const [placed, setPlaced] = useState(null);
  const [coupon, setCoupon] = useState(null); // { code, amount }
  const [couponError, setCouponError] = useState("");

  // Pre-fill the shipping form for signed-in users from their profile and
  // default saved address - faster checkout and fewer typos.
  const defaultValues = useMemo(() => {
    const blank = Object.fromEntries(FIELDS.map((f) => [f.name, ""]));
    const base = { ...blank, paymentMethod: "cod" };
    if (!user?.email) return base;
    const profile = getProfile(user.email);
    const [defaultAddress] = getAddresses(user.email);
    return {
      ...base,
      fullName: user.name || "",
      email: user.email || "",
      phone: profile.phone || defaultAddress?.phone || "",
      address: defaultAddress?.address || "",
      city: defaultAddress?.city || "",
      state: defaultAddress?.state || "",
      pincode: defaultAddress?.pin || "",
    };
  }, [user]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    // shouldUnregister drops hidden payment fields from validation, so e.g. card
    // fields never block a COD checkout.
  } = useForm({ defaultValues, shouldUnregister: true });

  const paymentMethod = watch("paymentMethod");

  // Money: discount is capped at the subtotal; shipping comes from the cart.
  const discount = Math.min(coupon?.amount || 0, subtotal);
  const total = Math.max(0, subtotal - discount) + shipping;
  const isCOD = paymentMethod === "cod";

  const applyCoupon = (rawCode) => {
    const code = rawCode.trim().toUpperCase();
    const rule = COUPONS[code];
    if (!rule) {
      setCoupon(null);
      setCouponError("That coupon code isn't valid.");
      return;
    }
    const amount =
      rule.type === "pct"
        ? Math.round((subtotal * rule.value) / 100)
        : Math.min(rule.value, subtotal);
    setCoupon({ code, amount });
    setCouponError("");
    toast.success(`Coupon ${code} applied — you saved ${formatCurrency(amount)}!`);
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError("");
  };

  const placeOrder = async (data) => {
    // Simulate payment processing latency (no backend) so the loading state
    // and "Processing…" button are visible.
    await new Promise((r) => setTimeout(r, 1200));

    // Store only shipping details on the order (never card/UPI data).
    const customer = Object.fromEntries(
      SHIPPING_KEYS.map((k) => [k, data[k]])
    );
    const method = paymentLabel(data.paymentMethod);
    const paymentStatus = isCOD ? "Pending" : "Paid";

    // Persist the order (generates a unique tracking number) BEFORE clearing.
    const order = createOrder({
      userEmail: user?.email,
      customer,
      items,
      subtotal,
      shipping,
      discount,
      total,
      paymentMethod: method,
      paymentStatus,
    });

    setPlaced({ ...customer, order });
    clearCart();
    window.scrollTo({ top: 0 });
  };

  const onInvalid = () => toast.error("Please fix the highlighted fields");

  if (placed) {
    return <OrderConfirmation placed={placed} />;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <EmptyState
          icon={FiShoppingBag}
          title="Nothing to check out"
          description="Your cart is empty. Add some products first."
          actionLabel="Go to Shop"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <>
      <Seo title="Checkout" noindex />
      <CheckoutHero />
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">
        <form
          onSubmit={handleSubmit(placeOrder, onInvalid)}
          noValidate
          className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8 items-start"
        >
          <div className="space-y-6">
            <ShippingForm register={register} errors={errors} fields={FIELDS} />
            <PaymentMethods
              register={register}
              errors={errors}
              selected={paymentMethod}
            />
          </div>
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shipping={shipping}
            discount={discount}
            total={total}
            isSubmitting={isSubmitting}
            buttonLabel={isCOD ? "Place Order" : `Pay ${formatCurrency(total)}`}
            coupon={coupon}
            couponError={couponError}
            onApplyCoupon={applyCoupon}
            onRemoveCoupon={removeCoupon}
          />
        </form>
      </div>
    </>
  );
}
