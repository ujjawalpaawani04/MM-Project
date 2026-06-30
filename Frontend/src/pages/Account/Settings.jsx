import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import {
  FiSettings,
  FiSun,
  FiMoon,
  FiUser,
  FiMapPin,
  FiChevronRight,
  FiLock,
  FiLogOut,
  FiTrash2,
  FiAlertTriangle,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getProfile, saveProfile } from "../../utils/forms";
import { isAcceptablePassword } from "../../utils/passwordStrength";
import AccountLayout, { AccountCard, Button } from "./AccountLayout";
import FormField from "../../components/common/form/FormField";
import PasswordField from "../../components/common/form/PasswordField";
import PasswordStrengthMeter from "../../components/common/form/PasswordStrengthMeter";
import Modal from "../../components/common/Modal";

/** Accessible on/off switch. */
function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50 ${
        checked ? "bg-brand-500" : "bg-gray-300 dark:bg-slate-600"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

function Row({ title, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="font-medium text-gray-900 dark:text-white">{title}</p>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

/* --------------------------------------------------------- change password */
function ChangePasswordForm() {
  const { changePassword } = useAuth();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { current: "", next: "", confirm: "" },
  });

  const onSubmit = async (data) => {
    clearErrors("root");
    await new Promise((r) => setTimeout(r, 400));
    const result = changePassword(data.current, data.next);
    if (!result.ok) {
      setError("root", { message: result.error });
      return;
    }
    reset();
    toast.success("Password changed successfully.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {errors.root?.message && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10 px-3.5 py-3 text-sm text-red-600 dark:text-red-300"
        >
          <FiAlertTriangle className="mt-0.5 shrink-0" />
          <span>{errors.root.message}</span>
        </div>
      )}
      <PasswordField
        label="Current Password"
        required
        autoComplete="current-password"
        error={errors.current?.message}
        {...register("current", { required: "Enter your current password" })}
      />
      <div>
        <PasswordField
          label="New Password"
          required
          placeholder="At least 8 characters"
          autoComplete="new-password"
          error={errors.next?.message}
          {...register("next", {
            required: "Enter a new password",
            validate: (v) =>
              isAcceptablePassword(v) || "Please choose a stronger password.",
          })}
        />
        <PasswordStrengthMeter value={watch("next")} />
      </div>
      <PasswordField
        label="Confirm New Password"
        required
        autoComplete="new-password"
        error={errors.confirm?.message}
        {...register("confirm", {
          required: "Please confirm your new password",
          validate: (value, values) =>
            value === values.next || "Passwords do not match",
        })}
      />
      <div className="flex justify-end pt-1">
        <Button type="submit" icon={FiLock} loading={isSubmitting}>
          Update Password
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------ delete modal */
function DeleteAccountModal({ open, onClose }) {
  const { deleteAccount } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { password: "", confirm: "" } });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    clearErrors("root");
    await new Promise((r) => setTimeout(r, 500));
    const result = deleteAccount(data.password);
    if (!result.ok) {
      setError("root", { message: result.error });
      return;
    }
    toast.success("Your account has been deleted.");
    navigate("/", { replace: true });
  };

  return (
    <Modal isOpen={open} onClose={close} size="sm" title="Delete account">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-5 pt-4 space-y-4">
        <div className="flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-500/10 p-3.5">
          <FiAlertTriangle className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-sm text-red-600 dark:text-red-300">
            This permanently removes your profile, addresses, orders, cart and
            wishlist on this device. This cannot be undone.
          </p>
        </div>

        {errors.root?.message && (
          <p role="alert" className="text-sm text-red-500">
            {errors.root.message}
          </p>
        )}

        <PasswordField
          label="Confirm your password"
          required
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password", { required: "Password is required" })}
        />
        <FormField
          label='Type "DELETE" to confirm'
          required
          placeholder="DELETE"
          error={errors.confirm?.message}
          {...register("confirm", {
            required: "Please type DELETE to confirm",
            validate: (v) => v === "DELETE" || 'Type "DELETE" exactly',
          })}
        />

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-1">
          <Button variant="ghost" onClick={close} type="button">
            Cancel
          </Button>
          <Button type="submit" variant="danger" icon={FiTrash2} loading={isSubmitting}>
            Delete forever
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, logoutEverywhere } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const stored = getProfile(user?.email);
  const [prefs, setPrefs] = useState({
    orderUpdates: stored.prefOrderUpdates ?? true,
    promotions: stored.prefPromotions ?? true,
    newsletter: stored.prefNewsletter ?? false,
  });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [logoutAllOpen, setLogoutAllOpen] = useState(false);

  const updatePref = (key, value) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    saveProfile(user?.email, {
      prefOrderUpdates: next.orderUpdates,
      prefPromotions: next.promotions,
      prefNewsletter: next.newsletter,
    });
    toast.success("Preferences saved");
  };

  const confirmLogoutAll = () => {
    setLogoutAllOpen(false);
    const result = logoutEverywhere();
    if (result.ok) {
      toast.success("Signed out on all devices.");
      navigate("/login", { replace: true });
    }
  };

  return (
    <AccountLayout
      title="Settings"
      description="Personalise your experience, security and notification preferences."
      icon={FiSettings}
    >
      <div className="space-y-6">
        {/* Appearance */}
        <AccountCard title="Appearance">
          <Row title="Theme" description="Switch between light and dark mode.">
            <div className="inline-flex rounded-xl border border-gray-200 dark:border-slate-700 p-1">
              <button
                onClick={() => setTheme("light")}
                aria-pressed={!isDark}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  !isDark ? "bg-brand-500 text-white" : "text-gray-600 dark:text-gray-300"
                }`}
              >
                <FiSun size={15} /> Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                aria-pressed={isDark}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isDark ? "bg-brand-500 text-white" : "text-gray-600 dark:text-gray-300"
                }`}
              >
                <FiMoon size={15} /> Dark
              </button>
            </div>
          </Row>
        </AccountCard>

        {/* Security */}
        <AccountCard title="Security">
          <div className="mb-5 flex items-center gap-2 rounded-xl bg-brand-50 dark:bg-brand-500/10 px-3.5 py-2.5 text-sm text-brand-700 dark:text-brand-300">
            <FiShield className="shrink-0" />
            Choose a strong, unique password you don't use elsewhere.
          </div>
          <ChangePasswordForm />
        </AccountCard>

        {/* Notifications */}
        <AccountCard title="Notification Preferences">
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            <Row title="Order updates" description="Shipping and delivery alerts.">
              <Toggle
                label="Order updates"
                checked={prefs.orderUpdates}
                onChange={(v) => updatePref("orderUpdates", v)}
              />
            </Row>
            <Row title="Promotions & drops" description="New releases and offers.">
              <Toggle
                label="Promotions"
                checked={prefs.promotions}
                onChange={(v) => updatePref("promotions", v)}
              />
            </Row>
            <Row title="Email newsletter" description="Occasional collector stories.">
              <Toggle
                label="Newsletter"
                checked={prefs.newsletter}
                onChange={(v) => updatePref("newsletter", v)}
              />
            </Row>
          </div>
        </AccountCard>

        {/* Account */}
        <AccountCard title="Account">
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {[
              { icon: FiUser, label: "Edit profile", to: "/account" },
              { icon: FiMapPin, label: "Manage addresses", to: "/addresses" },
            ].map(({ icon: Icon, label, to }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 py-3.5 text-gray-700 dark:text-gray-200 hover:text-brand-500 transition-colors"
              >
                <Icon size={18} className="shrink-0" />
                <span className="flex-1 font-medium">{label}</span>
                <FiChevronRight className="text-gray-400" />
              </Link>
            ))}
            <Row
              title="Log out everywhere"
              description="Sign out of this account on all devices."
            >
              <Button
                size="sm"
                variant="outline"
                icon={FiLogOut}
                onClick={() => setLogoutAllOpen(true)}
              >
                Sign out all
              </Button>
            </Row>
          </div>
        </AccountCard>

        {/* Danger zone */}
        <AccountCard className="border-red-200 dark:border-red-500/30">
          <h2 className="text-lg font-bold text-red-600 dark:text-red-400">
            Danger Zone
          </h2>
          <Row
            title="Delete account"
            description="Permanently remove your account and all of its data."
          >
            <Button
              size="sm"
              variant="danger"
              icon={FiTrash2}
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </Button>
          </Row>
        </AccountCard>
      </div>

      <DeleteAccountModal open={deleteOpen} onClose={() => setDeleteOpen(false)} />

      <Modal
        isOpen={logoutAllOpen}
        onClose={() => setLogoutAllOpen(false)}
        size="sm"
        title="Log out everywhere?"
      >
        <div className="p-5 pt-4">
          <p className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
            <FiCheckCircle className="mt-0.5 shrink-0 text-brand-500" />
            This signs you out of every active session on all devices. You'll
            need to sign in again here too.
          </p>
          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Button variant="ghost" onClick={() => setLogoutAllOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" icon={FiLogOut} onClick={confirmLogoutAll}>
              Sign out all
            </Button>
          </div>
        </div>
      </Modal>
    </AccountLayout>
  );
}
