import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { FiMail, FiUser, FiUserPlus, FiAlertCircle } from "react-icons/fi";

import AuthLayout from "./Components/AuthLayout";
import FormField from "../../components/common/form/FormField";
import PasswordField from "../../components/common/form/PasswordField";
import PasswordStrengthMeter from "../../components/common/form/PasswordStrengthMeter";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { VALIDATION } from "../../utils/validators";
import { isAcceptablePassword } from "../../utils/passwordStrength";

export default function Signup() {
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    clearErrors("root");
    await new Promise((r) => setTimeout(r, 600));
    const result = signup({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    if (!result.ok) {
      setError("root", { message: result.error });
      return;
    }
    toast.success("Account created - welcome to the family ✨");
    navigate("/", { replace: true });
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Mohan Maya to track orders, save favourites and more."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand-500 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {errors.root?.message && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10 px-3.5 py-3 text-sm text-red-600 dark:text-red-300"
          >
            <FiAlertCircle className="mt-0.5 shrink-0" />
            <span>{errors.root.message}</span>
          </div>
        )}

        <FormField
          label="Full Name"
          icon={FiUser}
          required
          placeholder="Your name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name", VALIDATION.name)}
        />

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

        <div>
          <PasswordField
            label="Password"
            required
            placeholder="At least 8 characters"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
              validate: (v) =>
                isAcceptablePassword(v) ||
                "Please choose a stronger password (mix letters, numbers & symbols).",
            })}
          />
          <PasswordStrengthMeter value={passwordValue} />
        </div>

        <PasswordField
          label="Confirm Password"
          required
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value, formValues) =>
              value === formValues.password || "Passwords do not match",
          })}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isSubmitting}
          icon={FiUserPlus}
        >
          Create Account
        </Button>
      </form>
    </AuthLayout>
  );
}
