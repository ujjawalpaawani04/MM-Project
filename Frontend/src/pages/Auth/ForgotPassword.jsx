import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import {
  FiMail,
  FiSend,
  FiShield,
  FiLock,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi";

import AuthLayout from "./Components/AuthLayout";
import FormField from "../../components/common/form/FormField";
import PasswordField from "../../components/common/form/PasswordField";
import PasswordStrengthMeter from "../../components/common/form/PasswordStrengthMeter";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { VALIDATION } from "../../utils/validators";
import { isAcceptablePassword } from "../../utils/passwordStrength";

const STEPS = ["email", "otp", "reset", "done"];

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10 px-3.5 py-3 text-sm text-red-600 dark:text-red-300"
    >
      <FiAlertCircle className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

/**
 * Complete forgot-password flow simulated entirely in localStorage:
 *   1. Email     - verify an account exists, generate a 6-digit code.
 *   2. OTP        - the code is shown on-screen (it would be emailed in prod).
 *   3. Reset      - choose + confirm a new password (with strength meter).
 *   4. Done       - success, link back to sign in.
 */
export default function ForgotPassword() {
  const { requestPasswordReset, verifyResetCode, resetPassword } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState(null); // simulated "emailed" code

  const form = useForm({
    defaultValues: { email: "", otp: "", password: "", confirmPassword: "" },
  });
  const {
    register,
    handleSubmit,
    watch,
    reset: resetForm,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = form;

  const delay = () => new Promise((r) => setTimeout(r, 600));

  const submitEmail = async (data) => {
    clearErrors("root");
    await delay();
    const result = requestPasswordReset(data.email);
    if (!result.ok) {
      setError("root", { message: result.error });
      return;
    }
    setEmail(data.email.trim());
    setDevCode(result.code);
    resetForm({ otp: "", password: "", confirmPassword: "" });
    setStep("otp");
  };

  const submitOtp = async (data) => {
    clearErrors("root");
    await delay();
    const result = verifyResetCode(email, data.otp);
    if (!result.ok) {
      setError("root", { message: result.error });
      return;
    }
    setCode(data.otp.trim());
    resetForm({ password: "", confirmPassword: "" });
    setStep("reset");
  };

  const submitReset = async (data) => {
    clearErrors("root");
    await delay();
    const result = resetPassword(email, code, data.password);
    if (!result.ok) {
      setError("root", { message: result.error });
      return;
    }
    setStep("done");
    toast.success("Password updated successfully.");
  };

  const resendCode = () => {
    const result = requestPasswordReset(email);
    if (result.ok) {
      setDevCode(result.code);
      toast.info("A new code has been sent.");
    }
  };

  const titles = {
    email: "Forgot password?",
    otp: "Enter your code",
    reset: "Set a new password",
    done: "All set!",
  };
  const subtitles = {
    email: "Enter your account email and we'll send a verification code.",
    otp: `We've sent a 6-digit code to ${email}.`,
    reset: "Choose a strong new password for your account.",
    done: "Your password has been changed.",
  };

  return (
    <AuthLayout
      title={titles[step]}
      subtitle={subtitles[step]}
      footer={
        step !== "done" && (
          <>
            Remembered it?{" "}
            <Link to="/login" className="font-semibold text-brand-500 hover:underline">
              Back to sign in
            </Link>
          </>
        )
      }
    >
      {/* Progress dots */}
      {step !== "done" && (
        <div className="mb-6 flex items-center justify-center gap-2" aria-hidden>
          {STEPS.slice(0, 3).map((s) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                STEPS.indexOf(s) <= STEPS.indexOf(step)
                  ? "w-8 bg-brand-500"
                  : "w-4 bg-gray-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
      )}

      {/* Step 1: email */}
      {step === "email" && (
        <form onSubmit={handleSubmit(submitEmail)} noValidate className="space-y-5">
          <ErrorBanner message={errors.root?.message} />
          <FormField
            label="Email"
            type="email"
            icon={FiMail}
            required
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email", VALIDATION.email)}
          />
          <Button type="submit" fullWidth size="lg" loading={isSubmitting} icon={FiSend}>
            Send Code
          </Button>
        </form>
      )}

      {/* Step 2: OTP */}
      {step === "otp" && (
        <form onSubmit={handleSubmit(submitOtp)} noValidate className="space-y-5">
          <ErrorBanner message={errors.root?.message} />

          {devCode && (
            <div className="rounded-xl border border-brand-200 bg-brand-50 dark:border-brand-500/30 dark:bg-brand-500/10 px-4 py-3 text-sm">
              <p className="text-gray-600 dark:text-gray-300">
                Demo mode — your code is{" "}
                <span className="font-bold tracking-widest text-brand-600 dark:text-brand-300">
                  {devCode}
                </span>
              </p>
            </div>
          )}

          <FormField
            label="Verification Code"
            icon={FiShield}
            required
            inputMode="numeric"
            maxLength={6}
            placeholder="6-digit code"
            autoComplete="one-time-code"
            error={errors.otp?.message}
            {...register("otp", {
              required: "Enter the 6-digit code",
              pattern: { value: /^\d{6}$/, message: "Code must be 6 digits" },
            })}
          />
          <Button type="submit" fullWidth size="lg" loading={isSubmitting} icon={FiShield}>
            Verify Code
          </Button>
          <button
            type="button"
            onClick={resendCode}
            className="w-full text-center text-sm font-medium text-brand-500 hover:underline"
          >
            Didn't get a code? Resend
          </button>
        </form>
      )}

      {/* Step 3: reset */}
      {step === "reset" && (
        <form onSubmit={handleSubmit(submitReset)} noValidate className="space-y-5">
          <ErrorBanner message={errors.root?.message} />
          <div>
            <PasswordField
              label="New Password"
              required
              placeholder="At least 8 characters"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                validate: (v) =>
                  isAcceptablePassword(v) || "Please choose a stronger password.",
              })}
            />
            <PasswordStrengthMeter value={watch("password")} />
          </div>
          <PasswordField
            label="Confirm New Password"
            required
            placeholder="Re-enter your password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value, values) =>
                value === values.password || "Passwords do not match",
            })}
          />
          <Button type="submit" fullWidth size="lg" loading={isSubmitting} icon={FiLock}>
            Update Password
          </Button>
        </form>
      )}

      {/* Step 4: done */}
      {step === "done" && (
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
            <FiCheckCircle className="text-green-500" size={34} />
          </div>
          <p className="mt-5 text-gray-600 dark:text-gray-300">
            Your password has been updated. You can now sign in with your new
            password.
          </p>
          <Button
            onClick={() => navigate("/login")}
            fullWidth
            size="lg"
            icon={FiArrowLeft}
            className="mt-6"
          >
            Back to Sign In
          </Button>
        </div>
      )}
    </AuthLayout>
  );
}
