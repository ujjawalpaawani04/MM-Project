import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FiShoppingBag } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { EMAIL_PATTERN } from "../../utils/validators";
import { createOrder } from "../../utils/orders";
import { getProfile, getAddresses } from "../../utils/forms";
import CheckoutHero from "./Components/CheckoutHero";
import OrderConfirmation from "./Components/OrderConfirmation";
import ShippingForm from "./Components/ShippingForm";
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

export default function Checkout() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const [placed, setPlaced] = useState(null);

  // Pre-fill the shipping form for signed-in users from their profile and
  // default saved address - faster checkout and fewer typos.
  const defaultValues = useMemo(() => {
    const blank = Object.fromEntries(FIELDS.map((f) => [f.name, ""]));
    if (!user?.email) return blank;
    const profile = getProfile(user.email);
    const [defaultAddress] = getAddresses(user.email);
    return {
      ...blank,
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
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  const placeOrder = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    // Persist the order (generates a unique tracking number) BEFORE clearing.
    // Linked to the signed-in account so it appears under their My Orders.
    const order = createOrder({
      userEmail: user?.email,
      customer: data,
      items,
      subtotal,
      shipping,
      total,
    });
    setPlaced({ ...data, order });
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
          <ShippingForm register={register} errors={errors} fields={FIELDS} />
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </>
  );
}
