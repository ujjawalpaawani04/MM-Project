import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { FiMail, FiUser, FiLogIn, FiUserPlus, FiX } from "react-icons/fi";

import Modal from "../common/Modal";
import Button from "../common/Button";
import FormField from "../common/form/FormField";
import PasswordField from "../common/form/PasswordField";
import { useAuth } from "../../context/AuthContext";
import { EMAIL_PATTERN, PHONE_PATTERN } from "../../utils/validators";

import logo from "../../assets/website/mmLogo.png";

/**
 * Professional, theme-matched authentication modal used to gate "Add to Cart"
 * for guests. Front-end only (no backend) - it drives the same localStorage
 * `useAuth` session as the dedicated /login and /signup pages.
 *
 * Toggles between a "login" and "register" view in place (modern e-commerce
 * pattern). On a successful login/register it calls `onAuthenticated`, which the
 * LoginGate uses to resume whatever the user was trying to do (e.g. add the
 * product they just clicked) and close the modal.
 */

// Accepts either a valid email OR a valid mobile number in the single identifier
// field (mirrors the validation rules used across the site's forms).
const validateIdentifier = (value) => {
  const v = (value || "").trim();
  return (
    EMAIL_PATTERN.test(v) ||
    PHONE_PATTERN.test(v) ||
    "Enter a valid email or mobile number"
  );
};

export default function LoginModal({ isOpen, onClose, onAuthenticated }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login");

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      identifier: "",
      name: "",
      password: "",
      confirmPassword: "",
      remember: true,
    },
  });

  // Snap back to the login view whenever the modal (re)opens (prev-prop pattern -
  // a cheap state adjustment during render, no effect needed).
  const [prevOpen, setPrevOpen] = useState(isOpen);
  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen);
    if (isOpen) setMode("login");
  }

  // Clear the form fields each time the modal opens.
  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  const switchMode = (next) => {
    setMode(next);
    reset();
  };

  const onSubmit = async (data) => {
    // Simulated latency for a realistic feel (no backend in this project).
    await new Promise((r) => setTimeout(r, 600));
    if (mode === "login") {
      login({ email: data.identifier.trim() });
    } else {
      signup({ name: data.name.trim(), email: data.identifier.trim() });
    }
    // Hand control back to the gate so it can run the pending action (add to
    // cart) and dismiss. Silent by design - no toast/notification.
    onAuthenticated?.();
  };

  const isLogin = mode === "login";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" hideClose>
      <button
        onClick={onClose}
        aria-label="Close dialog"
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
      >
        <FiX size={20} />
      </button>

      <div className="p-7 sm:p-8">
        {/* Brand mark */}
        <div className="flex flex-col items-center text-center">
          <img
            src={logo}
            alt="Mohan Maya logo"
            className="w-14 h-14 object-contain rounded-full"
          />
          <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            {isLogin
              ? "Sign in to add items to your cart and check out."
              : "Join Mohan Maya to start your collection."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-7 space-y-5"
        >
          {!isLogin && (
            <FormField
              label="Full Name"
              icon={FiUser}
              required
              placeholder="Your name"
              autoComplete="name"
              error={errors.name?.message}
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Please enter at least 2 characters",
                },
              })}
            />
          )}

          <FormField
            label="Email or Mobile Number"
            icon={FiMail}
            required
            placeholder="you@example.com or 98765 43210"
            autoComplete="username"
            error={errors.identifier?.message}
            {...register("identifier", {
              required: "Email or mobile number is required",
              validate: validateIdentifier,
            })}
          />

          <PasswordField
            label="Password"
            required
            placeholder={
              isLogin ? "Enter your password" : "At least 6 characters"
            }
            autoComplete={isLogin ? "current-password" : "new-password"}
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />

          {!isLogin && (
            <PasswordField
              label="Confirm Password"
              required
              placeholder="Re-enter your password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === getValues("password") || "Passwords do not match",
              })}
            />
          )}

          {isLogin && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register("remember")}
                  className="w-4 h-4 rounded border-gray-300 text-brand-500 accent-brand-500"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                onClick={onClose}
                className="text-sm font-medium text-brand-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isSubmitting}
            icon={isLogin ? FiLogIn : FiUserPlus}
          >
            {isLogin ? "Login" : "Create Account"}
          </Button>
        </form>

        {/* Continue as guest - dismisses without adding to the cart. */}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-brand-500 transition-colors"
        >
          Continue as Guest
        </button>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-gray-200 dark:bg-slate-700" />
          <span className="text-xs uppercase tracking-wide text-gray-400">
            {isLogin ? "New here?" : "Already a member?"}
          </span>
          <span className="h-px flex-1 bg-gray-200 dark:bg-slate-700" />
        </div>

        <button
          type="button"
          onClick={() => switchMode(isLogin ? "register" : "login")}
          className="w-full rounded-xl border-2 border-brand-400 py-2.5 text-sm font-semibold text-brand-500 hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-slate-800 transition-colors"
        >
          {isLogin ? "Create New Account" : "Sign in instead"}
        </button>
      </div>
    </Modal>
  );
}
