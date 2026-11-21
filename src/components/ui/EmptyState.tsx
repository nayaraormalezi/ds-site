import type { ReactNode } from "react";
import { Button } from "./Button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  href,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  href?: string;
}) {
  let action: ReactNode = null;
  if (href && actionLabel) {
    action = (
      <Button href={href} variant="secondary">
        {actionLabel}
      </Button>
    );
  } else if (onAction && actionLabel) {
    action = (
      <Button variant="secondary" onClick={onAction}>
        {actionLabel}
      </Button>
    );
  }

  return (
    <div className="empty-state">
      <div style={{ fontSize: 32 }} aria-hidden>
        ▢
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
