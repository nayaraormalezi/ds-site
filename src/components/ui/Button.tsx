import Image from "next/image";
import Link from "next/link";
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

/**
 * Mapeia o component set Figma `button` (2027:25730)
 * Hierarchy Stroke + CTA secondary-brand + on-color.
 */
type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "soft"
  | "ghost"
  | "danger"
  | "on-color";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: ReactNode;
  /** Ícone externo ↗ do Figma (ic_linkexternal) */
  externalIcon?: boolean;
  style?: CSSProperties;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

function buttonClasses(
  variant: Variant,
  size: Size,
  className: string
): string {
  return [
    "btn",
    `btn-${variant}`,
    size === "lg" ? "btn-lg" : "",
    size === "sm" ? "btn-sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

function ExternalIcon({ onDark }: { onDark?: boolean }) {
  return (
    <Image
      className="btn-icon-ext"
      src={onDark ? "/icons/ic-link-external-white.svg" : "/icons/ic-link-external.svg"}
      alt=""
      width={20}
      height={20}
      aria-hidden
    />
  );
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    children,
    variant = "primary",
    size = "md",
    className = "",
    icon,
    externalIcon,
    style,
  } = props;
  const classes = buttonClasses(variant, size, className);
  const showWhiteIcon = variant === "secondary" || variant === "on-color";
  const trailing =
    icon ??
    (externalIcon ? <ExternalIcon onDark={showWhiteIcon} /> : null);

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        className={classes}
        target={props.target}
        rel={props.rel}
        style={style}
      >
        {children}
        {trailing}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button
      type={buttonProps.type ?? "button"}
      className={classes}
      style={style}
      disabled={buttonProps.disabled}
      onClick={buttonProps.onClick}
      aria-label={buttonProps["aria-label"]}
    >
      {children}
      {trailing}
    </button>
  );
}
