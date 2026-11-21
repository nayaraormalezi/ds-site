import type { AssetStatus } from "@/lib/types";
import { statusLabel } from "@/lib/utils";

export function StatusBadge({ status }: { status: AssetStatus }) {
  return <span className={`badge badge-${status}`}>{statusLabel(status)}</span>;
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: string;
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
