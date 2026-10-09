import React from "react";
import cn from "@/lib/cn";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CardVariant = "default" | "glass" | "elevated";

export interface CardHeader {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: CardVariant;
  /** Optional header section */
  header?: CardHeader;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Makes the card interactive (cursor-pointer + hover effects) */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  /** Additional class names */
  className?: string;
  children?: React.ReactNode;
}

// ─── Variant styles ───────────────────────────────────────────────────────────

/**
 * Returns Tailwind classes for each variant.
 * Non-standard rgba values (glass) are applied via `style` prop instead
 * because Tailwind v4 uses @import-based CSS and arbitrary rgba values
 * in class names are unreliable without a full JIT scan of source files.
 */
function getVariantClasses(variant: CardVariant, clickable: boolean): string {
  const base =
    "rounded-xl border transition-all duration-300 ease-in-out";

  switch (variant) {
    case "glass":
      return cn(
        base,
        "backdrop-blur-md",
        clickable &&
          "cursor-pointer hover:shadow-[0_8px_32px_rgba(20,184,166,0.15)]"
      );

    case "elevated":
      return cn(
        base,
        // Slightly lighter than Surface_Dark (#252d48)
        "bg-[#2e3752] border-[#4a5268]",
        "shadow-[0_4px_24px_rgba(0,0,0,0.45)]",
        clickable &&
          "cursor-pointer hover:shadow-[0_8px_40px_rgba(0,0,0,0.6)] hover:border-[#5a6278]"
      );

    case "default":
    default:
      return cn(
        base,
        // Surface_Dark / Elevation_Light from design tokens
        "bg-[#252d48] border-[#3a4254]",
        "shadow-[0_2px_12px_rgba(0,0,0,0.3)]",
        clickable &&
          "cursor-pointer hover:shadow-[0_6px_28px_rgba(20,184,166,0.12)] hover:border-[#4a5570]"
      );
  }
}

/**
 * Inline styles for the glass variant's rgba-based background/border,
 * and for hover state management via JS since CSS-in-JS hover isn't available
 * in plain React without a library.
 */
function getVariantStyle(
  variant: CardVariant,
  hovered: boolean
): React.CSSProperties {
  if (variant !== "glass") return {};

  return {
    background: hovered
      ? "rgba(255, 255, 255, 0.12)"
      : "rgba(255, 255, 255, 0.08)",
    border: `1px solid ${hovered ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.15)"}`,
    boxShadow: hovered
      ? "0 8px 32px rgba(20, 184, 166, 0.15)"
      : "0 2px 12px rgba(0, 0, 0, 0.25)",
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function CardHeaderSection({ header }: { header: CardHeader }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex items-center gap-3 min-w-0">
        {header.icon && (
          <div className="flex-shrink-0 text-[#14b8a6]">{header.icon}</div>
        )}
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-white leading-tight truncate">
            {header.title}
          </h3>
          {header.subtitle && (
            <p className="mt-0.5 text-sm text-[#a0a9c9] truncate">
              {header.subtitle}
            </p>
          )}
        </div>
      </div>
      {header.action && (
        <div className="flex-shrink-0">{header.action}</div>
      )}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function Card({
  variant = "default",
  header,
  footer,
  onClick,
  className,
  children,
  style,
  ...rest
}: CardProps) {
  const [hovered, setHovered] = React.useState(false);
  const clickable = Boolean(onClick);

  const variantClasses = getVariantClasses(variant, clickable);
  const variantStyle = getVariantStyle(variant, hovered);

  const handleMouseEnter = () => {
    if (clickable || variant === "glass") setHovered(true);
  };
  const handleMouseLeave = () => {
    if (clickable || variant === "glass") setHovered(false);
  };

  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
              }
            }
          : undefined
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(variantClasses, "p-5", className)}
      style={{ ...variantStyle, ...style }}
      {...rest}
    >
      {header && <CardHeaderSection header={header} />}

      {/* Main content */}
      <div className="flex-1">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="mt-4 pt-4 border-t border-[#3a4254]">{footer}</div>
      )}
    </div>
  );
}

export default Card;
