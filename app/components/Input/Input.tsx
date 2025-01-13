import {ChangeEvent} from "react";

interface InputProps {
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type: "text" | "number";
  placeholder?: string;
  helper?: string;
}

export function Input({ label, value, onChange, type, placeholder, helper }: InputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (type === "number") {
      const numericValue = parseInt(newValue, 10);

      if (!isNaN(numericValue)) {
        onChange(numericValue);
      } else if (newValue === "") {
        onChange(0);
      }
    } else {
      onChange(newValue);
    }
  };

  return (
    <label>
      {label && (
       <span className="block mb-2">{label}</span>
      )}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        className="border px-4 py-2 rounded-lg border-gray w-full bg-black"
        placeholder={placeholder}
      />
      {helper && (
        <span className={"block mt-2 text-gray text-sm"}>{helper}</span>
      )}
    </label>
  );
}
