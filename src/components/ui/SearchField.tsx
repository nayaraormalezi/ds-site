import Image from "next/image";
import type { FormEventHandler, InputHTMLAttributes, ReactNode } from "react";

/** Figma `search-field` (2235:809) */
export function SearchField({
  id,
  value,
  onChange,
  placeholder = "Buscar materiais oficiais...",
  onSubmit,
  action,
  className = "",
  ...rest
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  action?: ReactNode;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "id">) {
  return (
    <form
      className={`search-field ${className}`.trim()}
      role="search"
      onSubmit={onSubmit ?? ((e) => e.preventDefault())}
    >
      <Image src="/icons/ic-search.svg" alt="" width={24} height={24} aria-hidden />
      <label className="sr-only" htmlFor={id}>
        Buscar
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        {...rest}
      />
      {action}
    </form>
  );
}
