import { Link } from "react-router";
import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:opacity-90 shadow-sm",
  secondary:
    "bg-brand-500 text-white hover:bg-brand-600 shadow-sm",
  outline:
    "border-2 border-brand-400 text-brand-500 hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-slate-800",
  ghost:
    "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-800",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const sizes = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-7 py-3.5 text-base gap-2.5",
};

/**
 * Polymorphic button. Renders an <a>/<Link>/<button> based on props:
 *   <Button to="/shop">      -> react-router Link
 *   <Button href="...">      -> anchor
 *   <Button onClick={...}>   -> button
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  to,
  href,
  type = "button",
  className,
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  iconRight = false,
  ...props
}) {
  const classes = cn(
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className
  );

  const content = (
    <>
      {loading && (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {!loading && Icon && !iconRight && <Icon size={18} />}
      {children}
      {!loading && Icon && iconRight && <Icon size={18} />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
}
