import Button from "./Button";

/**
 * Generic empty/zero-state. Pass an icon component, a message, and an
 * optional CTA (action -> button, or actionTo -> link).
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      {Icon && (
        <div className="w-20 h-20 rounded-full bg-brand-50 dark:bg-slate-800 flex items-center justify-center mb-6">
          <Icon className="text-brand-400" size={36} />
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md">
          {description}
        </p>
      )}
      {actionLabel && (
        <Button
          to={actionTo}
          onClick={onAction}
          className="mt-6"
          variant="primary"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
