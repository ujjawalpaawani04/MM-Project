import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiMapPin, FiPlus, FiTrash2, FiStar, FiCheck } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getAddresses, saveAddresses } from "../../utils/forms";
import { VALIDATION } from "../../utils/validators";
import AccountLayout, { AccountCard, Button } from "./AccountLayout";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import FormField from "../../components/common/form/FormField";

const PHONE_RULE = {
  required: "Phone is required",
  pattern: { value: /^[+]?[\d\s-]{10,15}$/, message: "Enter a valid phone number" },
};
const PIN_RULE = {
  required: "PIN code is required",
  pattern: { value: /^\d{6}$/, message: "Enter a valid 6-digit PIN" },
};

export default function Addresses() {
  const { user } = useAuth();
  const toast = useToast();
  const [addresses, setAddresses] = useState(() => getAddresses(user?.email));
  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const persist = (next) => {
    setAddresses(next);
    saveAddresses(user?.email, next);
  };

  const onAdd = (data) => {
    persist([...addresses, { id: `${user?.email}-${addresses.length}-${data.pin}`, ...data }]);
    setModalOpen(false);
    reset();
    toast.success("Address saved");
  };

  const remove = (id) => {
    persist(addresses.filter((a) => a.id !== id));
    toast.info("Address removed");
  };

  const makeDefault = (id) => {
    const target = addresses.find((a) => a.id === id);
    persist([target, ...addresses.filter((a) => a.id !== id)]);
    toast.success("Default address updated");
  };

  return (
    <AccountLayout
      title="Saved Addresses"
      description="Manage where your handcrafted pieces are delivered."
      icon={FiMapPin}
    >
      <AccountCard
        title="Your Addresses"
        action={
          <Button size="sm" icon={FiPlus} onClick={() => setModalOpen(true)}>
            Add Address
          </Button>
        }
      >
        {addresses.length === 0 ? (
          <EmptyState
            icon={FiMapPin}
            title="No saved addresses"
            description="Add a delivery address to check out faster next time."
            actionLabel="Add Address"
            onAction={() => setModalOpen(true)}
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {addresses.map((a, i) => (
              <div
                key={a.id}
                className="relative rounded-2xl border border-gray-100 dark:border-slate-700 p-4"
              >
                {i === 0 && (
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-brand-50 dark:bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold text-brand-600 dark:text-brand-300">
                    <FiStar size={10} /> Default
                  </span>
                )}
                <p className="font-semibold text-gray-900 dark:text-white">
                  {a.fullName}
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {a.address}, {a.city}, {a.state} - {a.pin}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {a.phone}
                </p>
                <div className="mt-3 flex items-center gap-3 text-sm">
                  {i !== 0 && (
                    <button
                      onClick={() => makeDefault(a.id)}
                      className="inline-flex items-center gap-1 font-medium text-brand-500 hover:underline"
                    >
                      <FiCheck size={14} /> Set default
                    </button>
                  )}
                  <button
                    onClick={() => remove(a.id)}
                    className="inline-flex items-center gap-1 font-medium text-red-500 hover:underline"
                  >
                    <FiTrash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AccountCard>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        size="md"
        title="Add a new address"
      >
        <form onSubmit={handleSubmit(onAdd)} noValidate className="p-5 pt-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              label="Full Name"
              required
              error={errors.fullName?.message}
              {...register("fullName", VALIDATION.name)}
            />
            <FormField
              label="Phone"
              required
              error={errors.phone?.message}
              {...register("phone", PHONE_RULE)}
            />
          </div>
          <FormField
            label="Address"
            required
            placeholder="House no, street, area"
            error={errors.address?.message}
            {...register("address", VALIDATION.required("Address"))}
          />
          <div className="grid sm:grid-cols-3 gap-4">
            <FormField
              label="City"
              required
              error={errors.city?.message}
              {...register("city", VALIDATION.required("City"))}
            />
            <FormField
              label="State"
              required
              error={errors.state?.message}
              {...register("state", VALIDATION.required("State"))}
            />
            <FormField
              label="PIN Code"
              required
              error={errors.pin?.message}
              {...register("pin", PIN_RULE)}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" icon={FiPlus}>
              Save Address
            </Button>
          </div>
        </form>
      </Modal>
    </AccountLayout>
  );
}
