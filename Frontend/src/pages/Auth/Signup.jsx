import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { FiMail, FiUser, FiUserPlus } from "react-icons/fi";

import AuthLayout from "./Components/AuthLayout";
import FormField from "../../components/common/form/FormField";
import PasswordField from "../../components/common/form/PasswordField";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { VALIDATION } from "../../utils/validators";

export default function Signup() {
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    signup({ name: data.name, email: data.email });
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

        <PasswordField
          label="Password"
          required
          placeholder="At least 6 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password", VALIDATION.password)}
        />

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
