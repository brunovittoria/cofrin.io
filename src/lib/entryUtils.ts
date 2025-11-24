import { type CSSProperties } from "react";

export const DEFAULT_CATEGORY_COLOR = "#10b981";

export const sanitizeHexColor = (
  hex: string | null | undefined,
  fallback: string
): string => {
  if (!hex) return fallback;
  const normalized = hex.trim();
  return /^#([0-9a-f]{3}){1,2}$/i.test(normalized) ? normalized : fallback;
};

export const buildCategoryBadgeTokens = (
  hex: string | null | undefined,
  fallback: string
) => {
  const color = sanitizeHexColor(hex, fallback);
  const style: CSSProperties = {
    background: color + "12",
    borderColor: color + "33",
    boxShadow: "0 6px 18px " + color + "1f",
  };
  return { accent: color, style };
};

