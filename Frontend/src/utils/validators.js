/**
 * Shared React Hook Form validation rules so every form validates consistently.
 * Spread them into register(): register("email", VALIDATION.email)
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_PATTERN = /^[+]?[\d\s-]{10,15}$/;

export const VALIDATION = {
  required: (label = "This field") => ({
    required: `${label} is required`,
  }),
  name: {
    required: "Name is required",
    minLength: { value: 2, message: "Please enter at least 2 characters" },
  },
  email: {
    required: "Email is required",
    pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address" },
  },
  phone: {
    required: "Phone number is required",
    pattern: {
      value: PHONE_PATTERN,
      message: "Enter a valid phone number",
    },
  },
  password: {
    required: "Password is required",
    minLength: { value: 6, message: "Password must be at least 6 characters" },
  },
  message: {
    required: "Message is required",
    minLength: { value: 10, message: "Please write at least 10 characters" },
  },
};
