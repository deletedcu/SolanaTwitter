import { ReactNode } from "react";
import { useForm } from "react-hook-form";

type SearchProps = {
  children?: ReactNode;
  modelValue?: string;
  setModelValue: (a: string) => void;
  placeholder?: string;
  disabled?: boolean;
  search: () => void;
};

export default function TweetSearch({
  children,
  modelValue,
  setModelValue,
  placeholder,
  disabled,
  search,
}: SearchProps) {
  const handleSearchSubmit = () => {
    search();
  };

  const { handleSubmit, register } = useForm();
  const onSubmit = () => handleSearchSubmit();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative border-b">
      <input
        {...register("search")}
        type="text"
        value={modelValue}
        className="w-full bg-gray-100 py-4 pl-16 pr-32 text-gray-700"
        placeholder={placeholder}
        onChange={(e) => setModelValue(e.target.value)}
        autoComplete="off"
      />
      <div
        className={
          (modelValue ? "text-gray-700 " : "text-gray-400 ") +
          "absolute inset-y-0 left-0 flex items-center justify-center pl-8 pr-2"
        }
      >
        {children}
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-8">
        <button
          type="submit"
          className={
            (!disabled
              ? "bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-white "
              : "cursor-not-allowed bg-gray-200 text-gray-400 ") +
            "rounded-full px-4 py-1 font-semibold"
          }
          disabled={disabled}
        >
          Search
        </button>
      </div>
    </form>
  );
}
