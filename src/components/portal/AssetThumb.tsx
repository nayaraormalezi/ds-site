export function AssetThumb({
  gradient,
  label,
  ratio = "16/10",
}: {
  gradient: string;
  label: string;
  ratio?: string;
}) {
  return (
    <div
      className="thumb"
      style={{ background: gradient, aspectRatio: ratio }}
      aria-hidden
    >
      <span>{label}</span>
    </div>
  );
}
