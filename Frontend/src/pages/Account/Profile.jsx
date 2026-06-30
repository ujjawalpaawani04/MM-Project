import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { FiUser, FiPackage, FiHeart, FiSave } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import { getUserOrders } from "../../utils/orders";
import { getProfile, saveProfile } from "../../utils/forms";
import { VALIDATION } from "../../utils/validators";
import AccountLayout, { AccountCard, Button } from "./AccountLayout";
import FormField from "../../components/common/form/FormField";
import SelectField from "../../components/common/form/SelectField";

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 dark:border-slate-700 p-4">
      <span className="grid place-items-center w-11 h-11 rounded-xl bg-brand-50 dark:bg-slate-700/70 text-brand-500">
        <Icon size={18} />
      </span>
      <div>
        <p className="text-xl font-bold text-gray-900 dark:text-white leading-none">
          {value}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const toast = useToast();
  const verified = user?.verified !== false;
  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  const orderCount = useMemo(
    () => getUserOrders(user?.email).length,
    [user?.email]
  );
  const stored = useMemo(() => getProfile(user?.email), [user?.email]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      phone: stored.phone || "",
      gender: stored.gender || "",
      dob: stored.dob || "",
    },
  });

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    saveProfile(user?.email, data);
    toast.success("Profile updated");
  };

  return (
    <AccountLayout
      title="My Profile"
      description="Manage your personal details and see your account at a glance."
      icon={FiUser}
    >
      <div className="space-y-6">
        {/* Identity card */}
        <AccountCard>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="grid place-items-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-400 text-white text-2xl font-bold uppercase shadow-md">
              {initial}
            </span>
            <div className="min-w-0">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                {user?.name}
                {verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 dark:bg-brand-500/15 px-2.5 py-1 text-xs font-semibold text-brand-600 dark:text-brand-300">
                    <FaCheckCircle size={12} /> Verified
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-6">
            <Stat icon={FiPackage} label="Total orders" value={orderCount} />
            <Stat icon={FiHeart} label="Wishlist items" value={wishlistCount} />
          </div>
        </AccountCard>

        {/* Editable details */}
        <AccountCard title="Personal Information">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                icon={FiUser}
                error={errors.name?.message}
                {...register("name", VALIDATION.name)}
              />
              <FormField
                label="Email"
                value={user?.email || ""}
                readOnly
                disabled
                hint="Email is tied to your sign-in and can't be changed here."
              />
              <FormField
                label="Phone Number"
                placeholder="98765 43210"
                error={errors.phone?.message}
                {...register("phone", {
                  pattern: {
                    value: /^[+]?[\d\s-]{10,15}$/,
                    message: "Enter a valid phone number",
                  },
                })}
              />
              <SelectField
                label="Gender"
                {...register("gender")}
                options={[
                  { value: "", label: "Prefer not to say" },
                  { value: "female", label: "Female" },
                  { value: "male", label: "Male" },
                  { value: "other", label: "Other" },
                ]}
              />
              <FormField label="Date of Birth" type="date" {...register("dob")} />
            </div>
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                icon={FiSave}
                loading={isSubmitting}
                disabled={!isDirty}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </AccountCard>
      </div>
    </AccountLayout>
  );
}
