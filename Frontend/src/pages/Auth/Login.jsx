import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router";
import { FiMail, FiLogIn, FiAlertCircle } from "react-icons/fi";

import AuthLayout from "./Components/AuthLayout";
import FormField from "../../components/common/form/FormField";
import PasswordField from "../../components/common/form/PasswordField";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { VALIDATION } from "../../utils/validators";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "", remember: true } });

  const onSubmit = async (data) => {
    clearErrors("root");
    // Simulated request (no backend) - mimics latency for realistic UX.
    await new Promise((r) => setTimeout(r, 600));
    const result = login({
      email: data.email,
      password: data.password,
      remember: data.remember,
    });
    if (!result.ok) {
      setError("root", { message: result.error });
      return;
    }
    toast.success(`Welcome back, ${result.user.name}! You're now signed in.`);
    navigate(redirectTo, { replace: true });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your Mohan Maya account."
      footer={
        <>
          New to Mohan Maya?{" "}
          <Link
            to="/signup"
            className="font-semibold text-brand-500 hover:underline"
          >
            Create an account
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
          label="Email"
          type="email"
          icon={FiMail}
          required
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email", VALIDATION.email)}
        />

        <PasswordField
          label="Password"
          required
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password", { required: "Password is required" })}
        />

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
            className="text-sm font-medium text-brand-500 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isSubmitting}
          icon={FiLogIn}
        >
          Sign In
        </Button>
      </form>
    </AuthLayout>
  );
}
