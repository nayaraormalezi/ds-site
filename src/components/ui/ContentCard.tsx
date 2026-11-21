import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Card editorial do Figma (Cards → Image 1:1 / Icon Shape)
 * Estrutura: mídia ou ícone + tag + título + descrição + link "Saber mais"
 */
export function ContentCard({
  href,
  media,
  icon,
  eyebrow,
  title,
  description,
  meta,
  actionLabel = "Saber mais",
  footer,
  variant = "image",
}: {
  href: string;
  media?: ReactNode;
  icon?: ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: string;
  actionLabel?: string;
  footer?: ReactNode;
  variant?: "image" | "icon";
}) {
  return (
    <article className={`content-card content-card--${variant}`}>
      {variant === "image" && media ? (
        <Link href={href} className="content-card__media">
          {media}
          {meta ? <span className="content-card__date">{meta}</span> : null}
        </Link>
      ) : null}
      {variant === "icon" ? (
        <Link href={href} className="content-card__icon-shape" aria-hidden>
          {icon ?? (
            <Image
              src="/icons/ic-link-external.svg"
              alt=""
              width={32}
              height={32}
            />
          )}
        </Link>
      ) : null}
      <div className="content-card__body">
        {eyebrow ? <p className="content-card__eyebrow">{eyebrow}</p> : null}
        <h3 className="content-card__title">
          <Link href={href}>{title}</Link>
        </h3>
        {description ? (
          <p className="content-card__desc">{description}</p>
        ) : null}
        {footer ?? (
          <Link href={href} className="text-link">
            {actionLabel}
            <Image
              src="/icons/ic-link-external.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden
            />
          </Link>
        )}
      </div>
    </article>
  );
}
