import { Link, NavLink } from "react-router";
import { FiLogOut, FiChevronRight } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { ACCOUNT_NAV } from "../../components/website/accountNav";
import Seo from "../../components/common/Seo";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";

/**
 * Shared shell for the authenticated account section: a branded header, a
 * sticky sidebar (the same nav as the dropdown) and a content card. Keeps the
 * six account pages visually consistent and production-ready for backend wiring.
 *
 * Guests see a friendly sign-in prompt instead of the content - this gates the
 * UI only and does not alter the app's auth logic.
 */
export default function AccountLayout({
  title,
  description,
  icon: Icon,
  children,
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const toast = useToast();
  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  const verified = user?.verified !== false;

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <Seo title={title} noindex />
        <EmptyState
          title="Please sign in"
          description="Sign in to your MohanMaya account to view this page."
          actionLabel="Sign In"
          actionTo="/login"
        />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success("You've been signed out.");
  };

  return (
    <>
      <Seo title={title} description={description} noindex />

      {/* Header band */}
      <section className="bg-gradient-to-br from-brand-50 to-rose-50 dark:from-slate-900 dark:to-slate-800 py-10 lg:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link to="/" className="hover:text-brand-500 transition-colors">
                  Home
                </Link>
              </li>
              <FiChevronRight className="shrink-0 opacity-60" size={14} />
              <li aria-current="page" className="font-semibold text-gray-700 dark:text-gray-200">
                {title}
              </li>
            </ol>
          </nav>
          <div className="mt-4 flex items-center gap-4">
            <span className="grid place-items-center w-14 h-14 shrink-0 rounded-2xl bg-white dark:bg-slate-800 text-brand-500 shadow-sm">
              {Icon ? <Icon size={26} /> : initial}
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              {description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <div className="grid lg:grid-cols-[260px_1fr] gap-6 lg:gap-8 items-start">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28">
            <div className="rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
              {/* User card */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-slate-700">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="w-11 h-11 shrink-0 rounded-full object-cover shadow-sm"
                  />
                ) : (
                  <span className="grid place-items-center w-11 h-11 shrink-0 rounded-full bg-gradient-to-br from-pink-500 to-rose-400 text-white font-bold uppercase shadow-sm">
                    {initial}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 font-semibold text-sm text-gray-900 dark:text-white truncate">
                    {user.name}
                    {verified && (
                      <FaCheckCircle className="text-brand-500 shrink-0" size={12} />
                    )}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Nav */}
              <nav className="p-2" aria-label="Account">
                {ACCOUNT_NAV.map(({ label, to, icon: ItemIcon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/account"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/60"
                      }`
                    }
                  >
                    <ItemIcon size={17} className="shrink-0" />
                    {label}
                  </NavLink>
                ))}
              </nav>

              <div className="p-2 border-t border-gray-100 dark:border-slate-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <FiLogOut size={17} className="shrink-0" />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </>
  );
}

/** Consistent content card used by the account pages. */
export function AccountCard({ title, action, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm p-5 sm:p-6 ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 mb-5">
          {title && (
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export { Button };
