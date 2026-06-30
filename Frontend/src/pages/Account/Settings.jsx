import { useState } from "react";
import { Link } from "react-router";
import {
  FiSettings,
  FiSun,
  FiMoon,
  FiUser,
  FiMapPin,
  FiChevronRight,
} from "react-icons/fi";

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getProfile, saveProfile } from "../../utils/forms";
import AccountLayout, { AccountCard } from "./AccountLayout";

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

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const toast = useToast();
  const isDark = theme === "dark";

  const stored = getProfile(user?.email);
  const [prefs, setPrefs] = useState({
    orderUpdates: stored.prefOrderUpdates ?? true,
    promotions: stored.prefPromotions ?? true,
    newsletter: stored.prefNewsletter ?? false,
  });

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

  return (
    <AccountLayout
      title="Settings"
      description="Personalise your experience and notification preferences."
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
                  !isDark
                    ? "bg-brand-500 text-white"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                <FiSun size={15} /> Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                aria-pressed={isDark}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isDark
                    ? "bg-brand-500 text-white"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                <FiMoon size={15} /> Dark
              </button>
            </div>
          </Row>
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
          </div>
        </AccountCard>
      </div>
    </AccountLayout>
  );
}
