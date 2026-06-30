import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { FiLogOut, FiChevronDown } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

import Modal from "../common/Modal";
import Button from "../common/Button";
import { ACCOUNT_NAV_GROUPS } from "./accountNav";

/**
 * Premium authenticated-account dropdown (Amazon / Myntra style) themed to
 * MohanMaya: white surface, rounded corners, soft shadow, pink accent and a
 * spring-y open/close animation.
 *
 * Self-contained: owns its open state and the avatar trigger. Auth logic stays
 * in the parent - it only calls back `onLogout` (after a confirmation dialog).
 *
 * Accessibility: opens to the first item, ArrowUp/Down + Home/End roving focus,
 * Escape closes and restores focus to the trigger, outside-click closes, and the
 * trigger exposes aria-haspopup / aria-expanded.
 */
export default function AccountMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  const verified = user?.verified !== false; // signed-in demo accounts are verified

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  // Close on outside click / tap.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  // Focus the first menu item once the panel is open.
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      menuRef.current?.querySelector("[data-menuitem]")?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  // Roving keyboard navigation within the menu.
  const onMenuKeyDown = (e) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll("[data-menuitem]") || []
    );
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        items[(index + 1 + items.length) % items.length]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        items[(index - 1 + items.length) % items.length]?.focus();
        break;
      case "Home":
        e.preventDefault();
        items[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        items[items.length - 1]?.focus();
        break;
      case "Escape":
        e.preventDefault();
        close(true);
        break;
      case "Tab":
        // Let focus leave naturally but close the menu.
        setOpen(false);
        break;
      default:
        break;
    }
  };

  const itemClass =
    "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-brand-50 dark:hover:bg-slate-700/60 focus-visible:bg-brand-50 dark:focus-visible:bg-slate-700/60 focus-visible:outline-none transition-colors";

  const requestLogout = () => {
    setOpen(false);
    setConfirmOpen(true);
  };

  const confirmLogout = () => {
    setConfirmOpen(false);
    onLogout?.();
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="flex items-center gap-1.5 rounded-full p-1 pr-2 text-gray-800 dark:text-gray-100 hover:text-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50 transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt=""
            className="w-9 h-9 rounded-full object-cover shadow-sm"
          />
        ) : (
          <span className="grid place-items-center w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-semibold uppercase shadow-sm">
            {initial}
          </span>
        )}
        <FiChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            role="menu"
            aria-label="Account"
            onKeyDown={onMenuKeyDown}
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-0 top-full mt-3 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] max-h-[min(82vh,34rem)] flex flex-col origin-top-right overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-[0_20px_60px_rgba(15,23,42,0.18)] z-[1000]"
          >
            {/* Profile header - pinned at the top */}
            <div className="shrink-0 p-2 border-b border-gray-100 dark:border-slate-700">
              <Link
                to="/account"
                data-menuitem
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl p-3 bg-gradient-to-br from-brand-50 to-rose-50 dark:from-slate-700/50 dark:to-slate-700/30 hover:from-brand-100 hover:to-rose-100 dark:hover:from-slate-700 dark:hover:to-slate-700/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50 transition-colors"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="w-12 h-12 shrink-0 rounded-full object-cover shadow-sm ring-2 ring-white dark:ring-slate-800"
                  />
                ) : (
                  <span className="grid place-items-center w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-pink-500 to-rose-400 text-white text-lg font-bold uppercase shadow-sm">
                    {initial}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white truncate">
                    {user?.name || "Your Account"}
                    {verified && (
                      <FaCheckCircle
                        className="text-brand-500 shrink-0"
                        size={14}
                        title="Verified account"
                      />
                    )}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                  {verified && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/70 dark:bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold text-brand-600 dark:text-brand-300">
                      Verified Account
                    </span>
                  )}
                </div>
              </Link>
            </div>

            {/* Scrollable nav - grows/scrolls so the menu never leaves the viewport */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-2 [scrollbar-width:thin] [scrollbar-color:var(--color-gray-300)_transparent] dark:[scrollbar-color:var(--color-slate-600)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-slate-500">
              {ACCOUNT_NAV_GROUPS.map((group, gi) => (
                <div key={gi}>
                  {group.map(({ label, to, icon: Icon, description }) => (
                    <Link
                      key={to}
                      to={to}
                      data-menuitem
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className={itemClass}
                    >
                      <span className="grid place-items-center w-9 h-9 shrink-0 rounded-lg bg-gray-50 dark:bg-slate-700/70 text-gray-500 dark:text-gray-300 group-hover:bg-white group-hover:text-brand-500 dark:group-hover:bg-slate-600 transition-colors">
                        <Icon size={17} />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium leading-tight">{label}</span>
                        <span className="block text-[11px] text-gray-400 dark:text-gray-500 leading-tight">
                          {description}
                        </span>
                      </span>
                    </Link>
                  ))}
                  {gi < ACCOUNT_NAV_GROUPS.length - 1 && (
                    <div className="my-2 h-px bg-gray-100 dark:bg-slate-700" />
                  )}
                </div>
              ))}
            </div>

            {/* Sign out - pinned at the bottom, always visible */}
            <div className="shrink-0 p-2 border-t border-gray-100 dark:border-slate-700">
              <button
                data-menuitem
                role="menuitem"
                onClick={requestLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 focus-visible:bg-red-50 dark:focus-visible:bg-red-500/10 focus-visible:outline-none transition-colors"
              >
                <span className="grid place-items-center w-9 h-9 shrink-0 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500">
                  <FiLogOut size={17} />
                </span>
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout confirmation */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        size="sm"
        title="Sign out?"
      >
        <div className="p-5 pt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You'll be signed out of your MohanMaya account on this device. Your
            cart and wishlist stay saved for when you return.
          </p>
          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" icon={FiLogOut} onClick={confirmLogout}>
              Yes, sign out
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
