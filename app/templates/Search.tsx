import { ReactNode } from "react";
import TweetSearch from "../components/TweetSearch";
import Base from "./Base";

export interface SearchProps {
  icon?: ReactNode;
  children?: ReactNode;
  modelValue?: string;
  setModelValue: (a: string) => {};
  placeholder?: string;
  disabled?: boolean;
  search: () => {};
}

export default function Search({
  icon,
  children,
  placeholder,
  modelValue,
  setModelValue,
  search,
}: SearchProps) {
  return (
    <Base>
      <TweetSearch
        placeholder={placeholder}
        disabled={!modelValue}
        modelValue={modelValue}
        setModelValue={setModelValue}
        search={search}
      >
        {icon}
      </TweetSearch>
      {children}
    </Base>
  );
}
