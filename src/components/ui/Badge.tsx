import React from "react";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Circle,
  AlertOctagon,
} from "lucide-react";
import { cn } from "@/lib/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "glass";

export type BadgeSize = "sm" | "md" | "lg";

export type StatusValue =
  | "verified"
  | "pending"
  | "flagged"
  | "unverified"
  | "conflict";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style of the badge */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /**
   * Icon rendered to the left of the label.
   * Always pair color with an icon or text for accessibility.
   */
  icon?: React.ReactNode;
  /** Render a small colored dot before the content */
  dot?: boolean;
  children: React.ReactNode;
}

// ─── Color maps (inline styles for non-standard palette values) ────────────────

/** Background and text colors keyed by variant */
const variantStyles: Record<
  BadgeVariant,
  { background: string; color: string; border?: string }
> = {
  default: {
    background: "#252d48", // Surface_Dark
    color: "#ffffff",
  },
  success: {
    background: "#10b981",
    color: "#ffffff",
  },
  warning: {
    background: "#f59e0b",
    color: "#1a1a1a", // dark text for contrast on amber
  },
  danger: {
    background: "#dc2626",
    color: "#ffffff",
  },
  info: {
    background: "#3b82f6",
    color: "#ffffff",
  },
  glass: {
    background: "rgba(255, 255, 255, 0.10)",
    color: "#ffffff",
    border: "1px solid rgba(255, 255, 255, 0.15)",
  },
};

/** Dot color keyed by variant */
const dotColors: Record<BadgeVariant, string> = {
  default: "#a0a9c9",
  success: "#ffffff",
  warning: "#1a1a1a",
  danger: "#ffffff",
  info: "#ffffff",
  glass: "#ffffff",
};

// ─── Size classes ─────────────────────────────────────────────────────────────

const sizeClasses: Record<BadgeSize, string> = {
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-sm px-3 py-1 gap-1.5",
  lg: "text-base px-4 py-1.5 gap-2",
};

/** Icon size in px per badge size */
const iconSizes: Record<BadgeSize, number> = {
  sm: 12,
  md: 14,
  lg: 16,
};

/** Dot dimension classes per badge size */
const dotSizeClasses: Record<BadgeSize, string> = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-2.5 h-2.5",
};

// ─── Badge Component ──────────────────────────────────────────────────────────

/**
 * Badge — pill-shaped status / label indicator.
 *
 * Always pair a color variant with either an `icon`, a `dot`, or visible
 * `children` text so the badge conveys meaning beyond colour alone.
 *
 * @example
 * <Badge variant="success" icon={<CheckCircle size={14} />}>Verified</Badge>
 * <Badge variant="warning" dot>Pending</Badge>
 */
export function Badge({
  variant = "default",
  size = "md",
  icon,
  dot = false,
  children,
  className,
  style,
  ...props
}: BadgeProps) {
  const colors = variantStyles[variant];
  const iconSize = iconSizes[size];

  // Clone icon with forced size if it's a valid element
  const sizedIcon =
    icon && React.isValidElement<{ size?: number }>(icon)
      ? React.cloneElement(icon, { size: iconSize })
      : icon;

  return (
    <span
      role="status"
      className={cn(
        "inline-flex items-center rounded-full font-medium whitespace-nowrap select-none",
        sizeClasses[size],
        // Glassmorphic variant needs backdrop blur
        variant === "glass" && "backdrop-blur-sm",
        className
      )}
      style={{
        backgroundColor: colors.background,
        color: colors.color,
        border: colors.border ?? "none",
        ...style,
      }}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn("rounded-full flex-shrink-0", dotSizeClasses[size])}
          style={{ backgroundColor: dotColors[variant] }}
        />
      )}
      {sizedIcon}
      {children}
    </span>
  );
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────

export interface StatusBadgeProps
  extends Omit<BadgeProps, "variant" | "icon" | "children"> {
  /** Predefined status value that maps to a variant + icon automatically */
  status: StatusValue;
  /** Override the default label derived from the status value */
  label?: string;
}

/** Configuration for each known status value */
const statusConfig: Record<
  StatusValue,
  { variant: BadgeVariant; Icon: React.ElementType; defaultLabel: string }
> = {
  verified: {
    variant: "success",
    Icon: CheckCircle,
    defaultLabel: "Verified",
  },
  pending: {
    variant: "warning",
    Icon: Clock,
    defaultLabel: "Pending",
  },
  flagged: {
    variant: "danger",
    Icon: AlertTriangle,
    defaultLabel: "Flagged",
  },
  unverified: {
    variant: "default",
    Icon: Circle,
    defaultLabel: "Unverified",
  },
  conflict: {
    variant: "danger",
    Icon: AlertOctagon,
    defaultLabel: "Conflict",
  },
};

/**
 * StatusBadge — convenience wrapper around Badge that auto-applies the
 * correct variant and icon for common system status values.
 *
 * @example
 * <StatusBadge status="verified" />
 * <StatusBadge status="pending" size="sm" />
 * <StatusBadge status="flagged" label="Needs Review" />
 */
export function StatusBadge({ status, label, size = "md", ...rest }: StatusBadgeProps) {
  const { variant, Icon, defaultLabel } = statusConfig[status];
  const iconSize = iconSizes[size];

  return (
    <Badge
      variant={variant}
      size={size}
      icon={<Icon size={iconSize} aria-hidden="true" />}
      {...rest}
    >
      {label ?? defaultLabel}
    </Badge>
  );
}

export default Badge;
