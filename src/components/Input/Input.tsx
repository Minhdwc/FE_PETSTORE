import React, { useState, ChangeEvent } from "react";

type InputProps = {
  icon?: React.ReactNode;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

const CustomInput: React.FC<InputProps> = ({
  icon,
  className = "",
  placeholder = "",
  value,
  onChange,
  type = "text",
}) => {
  const [inputValue, setInputValue] = useState(value || "");

  React.useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <div className={`relative w-full max-w-md mx-auto ${className}`}>
      {icon && (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </span>
      )}
      <input
        type={type}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`block w-full rounded-xl border border-gray-300 py-2 pr-4 pl-10
                    text-gray-900 placeholder-gray-400 shadow-sm `}
      />
    </div>
  );
};

export default CustomInput;
