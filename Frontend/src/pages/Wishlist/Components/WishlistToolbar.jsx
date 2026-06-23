import { FiShoppingBag, FiTrash2 } from "react-icons/fi";

import Button from "../../../components/common/Button";

/** Header row: title, saved count, and add-all / clear actions. */
export default function WishlistToolbar({ count, onAddAll, onClear }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Wishlist
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {count} item{count !== 1 ? "s" : ""} saved
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="primary" icon={FiShoppingBag} onClick={onAddAll}>
          Add all to cart
        </Button>
        <Button variant="ghost" icon={FiTrash2} onClick={onClear}>
          Clear all
        </Button>
      </div>
    </div>
  );
}
