import { FiAlertTriangle } from "react-icons/fi";
import Modal from "./Modal";
import Button from "./Button";

/**
 * Reusable confirmation dialog for destructive / irreversible actions.
 *
 * Built on the shared <Modal> (focus trap, Esc-to-close, scroll lock). The
 * confirm button shows a loading spinner while `loading` is true and both
 * actions are disabled, so an async confirm (e.g. writing to localStorage)
 * can't be double-fired.
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Go back",
  tone = "danger",
  loading = false,
  icon: Icon = FiAlertTriangle,
}) {
  const iconTone =
    tone === "danger"
      ? "bg-red-50 text-red-500 dark:bg-red-500/10"
      : "bg-brand-50 text-brand-500 dark:bg-brand-500/10";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" hideClose>
      <div className="p-6 text-center">
        <span
          className={`mx-auto grid place-items-center h-14 w-14 rounded-full ${iconTone}`}
        >
          <Icon size={26} />
        </span>
        <h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        {message && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {message}
          </p>
        )}
        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
          <Button
            variant="ghost"
            fullWidth
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={tone === "danger" ? "danger" : "primary"}
            fullWidth
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
