const CustomInput = ({
  name,
  type = "text",
  placeholder,
  onChange,
}: {
  name: string;
  type?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div>
      <label htmlFor={name} className="block font-medium">
        {name}*
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
};
export default CustomInput;
