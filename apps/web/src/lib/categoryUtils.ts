import { type CSSProperties } from "react";

export const formatCountLabel = (count: number) =>
  `${count} categoria${count === 1 ? "" : "s"}`;

export const normalizeHex = (hex?: string): string => {
  if (!hex) return "#0A84FF";
  const match = hex.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  return match ? hex : "#0A84FF";
};

export const colorStyle = (hex?: string): CSSProperties => {
  const color = normalizeHex(hex);
  return {
    backgroundColor: color,
    boxShadow: "0 4px 12px " + color + "30",
  };
};

