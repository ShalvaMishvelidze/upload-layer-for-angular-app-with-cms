const CustomInput = ({
  name,
  type = "text",
  placeholder,
  onChange,
  required = true,
  value,
}: {
  name: string;
  type?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  value?: string | number;
}) => {
  return (
    <div>
      <label htmlFor={name} className="block font-medium">
        {name}
        {required && "*"}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        type={type}
        required={required}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
};
export default CustomInput;
