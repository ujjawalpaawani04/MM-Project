import { useState } from "react";
import {
  FiBell,
  FiPackage,
  FiTag,
  FiGift,
  FiCheckCircle,
} from "react-icons/fi";

import AccountLayout, { AccountCard, Button } from "./AccountLayout";
import EmptyState from "../../components/common/EmptyState";

// Seeded sample notifications - ready to be replaced by a real feed later.
const SEED = [
  {
    id: 1,
    icon: FiPackage,
    title: "Your order is on the way",
    body: "Order #MM000124 has shipped and is arriving soon.",
    time: "2h ago",
    unread: true,
    tone: "text-blue-500 bg-blue-50 dark:bg-blue-500/15",
  },
  {
    id: 2,
    icon: FiTag,
    title: "Festival Collection — early access",
    body: "Limited pieces just dropped. Be the first to collect them.",
    time: "1d ago",
    unread: true,
    tone: "text-brand-500 bg-brand-50 dark:bg-brand-500/15",
  },
  {
    id: 3,
    icon: FiGift,
    title: "A little thank-you",
    body: "Enjoy complimentary gift wrapping on your next order.",
    time: "3d ago",
    unread: false,
    tone: "text-amber-500 bg-amber-50 dark:bg-amber-500/15",
  },
];

export default function Notifications() {
  const [items, setItems] = useState(SEED);
  const unreadCount = items.filter((n) => n.unread).length;

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  const markRead = (id) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  const clearAll = () => setItems([]);

  return (
    <AccountLayout
      title="Notifications"
      description="Order updates, drops and offers — all in one place."
      icon={FiBell}
    >
      <AccountCard
        title={
          unreadCount > 0 ? `Notifications (${unreadCount} new)` : "Notifications"
        }
        action={
          items.length > 0 && (
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button size="sm" variant="ghost" icon={FiCheckCircle} onClick={markAllRead}>
                  Mark all read
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={clearAll}>
                Clear
              </Button>
            </div>
          )
        }
      >
        {items.length === 0 ? (
          <EmptyState
            icon={FiBell}
            title="You're all caught up"
            description="New order updates and offers will show up here."
          />
        ) : (
          <ul className="space-y-2">
            {items.map(({ id, icon: Icon, title, body, time, unread, tone }) => (
              <li key={id}>
                <button
                  onClick={() => markRead(id)}
                  className={`w-full flex items-start gap-4 rounded-2xl border p-4 text-left transition-colors ${
                    unread
                      ? "border-brand-100 bg-brand-50/40 dark:border-slate-600 dark:bg-slate-700/40"
                      : "border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/40"
                  }`}
                >
                  <span className={`grid place-items-center w-11 h-11 shrink-0 rounded-xl ${tone}`}>
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                      {title}
                      {unread && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                      )}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">
                      {body}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">{time}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </AccountCard>
    </AccountLayout>
  );
}
