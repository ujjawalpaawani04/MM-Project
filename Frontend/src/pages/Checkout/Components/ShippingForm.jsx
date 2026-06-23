import FormField from "../../../components/common/form/FormField";

export default function ShippingForm({ register, errors, fields }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
        Shipping Details
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <FormField
            key={f.name}
            label={f.label}
            type={f.type}
            required
            className={f.full ? "sm:col-span-2" : ""}
            error={errors[f.name]?.message}
            {...register(f.name, f.rules)}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4">
        This is a demo checkout - no payment is processed and no data
        leaves your browser.
      </p>
    </div>
  );
}
