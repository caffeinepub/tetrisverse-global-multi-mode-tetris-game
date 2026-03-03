export function adjustBrightness(hex: string, amount: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;

  const r = Math.round(
    Math.min(255, Math.max(0, Number.parseInt(result[1], 16) + amount)),
  );
  const g = Math.round(
    Math.min(255, Math.max(0, Number.parseInt(result[2], 16) + amount)),
  );
  const b = Math.round(
    Math.min(255, Math.max(0, Number.parseInt(result[3], 16) + amount)),
  );

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function safeColor(color: string): string {
  if (
    !color ||
    color.startsWith("var(") ||
    color.startsWith("rgba") ||
    color.startsWith("rgb")
  ) {
    return color || "#ffffff";
  }
  return color;
}
