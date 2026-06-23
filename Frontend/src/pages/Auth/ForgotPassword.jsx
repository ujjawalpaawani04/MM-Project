import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { FiMail, FiSend, FiCheckCircle } from "react-icons/fi";

import AuthLayout from "./Components/AuthLayout";
import FormField from "../../components/common/form/FormField";
import Button from "../../components/common/Button";
import { VALIDATION } from "../../utils/validators";

export default function ForgotPassword() {
  const [sentTo, setSentTo] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "" } });

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    setSentTo(data.email);
  };

  // Success state
  if (sentTo) {
    return (
      <AuthLayout
        title="Check your inbox"
        subtitle="We've sent password-reset instructions your way."
        footer={
          <Link
            to="/login"
            className="font-semibold text-brand-500 hover:underline"
          >
            Back to sign in
          </Link>
        }
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
            <FiCheckCircle className="text-green-500" size={34} />
          </div>
          <p className="mt-5 text-gray-600 dark:text-gray-300">
            If an account exists for{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {sentTo}
            </span>
            , you'll receive an email with a link to reset your password
            shortly.
          </p>
          <button
            type="button"
            onClick={() => setSentTo(null)}
            className="mt-5 text-sm font-medium text-brand-500 hover:underline"
          >
            Didn't get it? Try another email
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <>
          Remembered it?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand-500 hover:underline"
          >
            Back to sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isSubmitting}
          icon={FiSend}
        >
          Send Reset Link
        </Button>
      </form>
    </AuthLayout>
  );
}
