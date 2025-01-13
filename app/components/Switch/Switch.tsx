interface SwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Switch({ label, description, checked, onChange }: SwitchProps) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div>
        <span className="block text-white">{label}</span>
        {description && (
          <p className="text-sm text-gray">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition ${
          checked ? "bg-blue" : "bg-blue-light"
        }`}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
