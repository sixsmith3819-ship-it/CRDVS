import { cn } from "@/lib/cn";

// ---------------------------------------------------------------------------
// Base Skeleton
// ---------------------------------------------------------------------------

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  /** Renders a circle — useful for avatars */
  circle?: boolean;
  /** Applies rounded-md corners (ignored when circle is true) */
  rounded?: boolean;
}

export function Skeleton({
  width,
  height,
  className,
  circle = false,
  rounded = false,
}: SkeletonProps) {
  const style: React.CSSProperties = {
    ...(width !== undefined
      ? { width: typeof width === "number" ? `${width}px` : width }
      : {}),
    ...(height !== undefined
      ? { height: typeof height === "number" ? `${height}px` : height }
      : {}),
    backgroundColor: "#3a4254",
  };

  return (
    <div
      style={style}
      className={cn(
        "animate-shimmer",
        circle ? "rounded-full" : rounded ? "rounded-md" : "rounded",
        className
      )}
      aria-hidden="true"
    />
  );
}

// ---------------------------------------------------------------------------
// SkeletonText — single line placeholder
// ---------------------------------------------------------------------------

interface SkeletonTextProps {
  /** Width as a Tailwind class string or inline value, defaults to "100%" */
  width?: string;
  className?: string;
}

export function SkeletonText({ width, className }: SkeletonTextProps) {
  return (
    <Skeleton
      height={14}
      width={width ?? "100%"}
      rounded
      className={className}
    />
  );
}

// ---------------------------------------------------------------------------
// SkeletonAvatar — circular avatar placeholder
// ---------------------------------------------------------------------------

type AvatarSize = 32 | 40 | 48;

interface SkeletonAvatarProps {
  size?: AvatarSize;
  className?: string;
}

export function SkeletonAvatar({ size = 40, className }: SkeletonAvatarProps) {
  return <Skeleton width={size} height={size} circle className={className} />;
}

// ---------------------------------------------------------------------------
// SkeletonCard — card with header + 3 body lines
// ---------------------------------------------------------------------------

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn("rounded-lg p-4 space-y-3", className)}
      style={{ backgroundColor: "rgba(58,66,84,0.15)" }}
      aria-hidden="true"
    >
      {/* Header */}
      <Skeleton height={18} width="60%" rounded />
      {/* Body lines */}
      <div className="space-y-2 pt-1">
        <Skeleton height={12} width="100%" rounded />
        <Skeleton height={12} width="90%" rounded />
        <Skeleton height={12} width="75%" rounded />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SkeletonTable — header row + 5 data rows
// ---------------------------------------------------------------------------

interface SkeletonTableProps {
  columns?: number;
  rows?: number;
  className?: string;
}

export function SkeletonTable({
  columns = 4,
  rows = 5,
  className,
}: SkeletonTableProps) {
  return (
    <div className={cn("w-full space-y-2", className)} aria-hidden="true">
      {/* Header row */}
      <div
        className="flex gap-3 px-3 py-2 rounded"
        style={{ backgroundColor: "rgba(58,66,84,0.25)" }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height={14} width={`${100 / columns}%`} rounded />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex gap-3 px-3 py-2 rounded"
          style={{ backgroundColor: "rgba(58,66,84,0.10)" }}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              height={12}
              /* Vary last column width so it looks natural */
              width={colIdx === columns - 1 ? "60%" : `${100 / columns}%`}
              rounded
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SkeletonStatCard — icon + number + label
// ---------------------------------------------------------------------------

interface SkeletonStatCardProps {
  className?: string;
}

export function SkeletonStatCard({ className }: SkeletonStatCardProps) {
  return (
    <div
      className={cn("rounded-lg p-4 space-y-3", className)}
      style={{ backgroundColor: "rgba(58,66,84,0.15)" }}
      aria-hidden="true"
    >
      {/* Icon */}
      <Skeleton width={40} height={40} rounded className="mb-1" />
      {/* Big number */}
      <Skeleton height={28} width="55%" rounded />
      {/* Label */}
      <Skeleton height={12} width="70%" rounded />
    </div>
  );
}

// ---------------------------------------------------------------------------
// SkeletonDashboard — 3 stat cards + 2 content areas
// ---------------------------------------------------------------------------

interface SkeletonDashboardProps {
  className?: string;
}

export function SkeletonDashboard({ className }: SkeletonDashboardProps) {
  return (
    <div className={cn("space-y-6", className)} aria-hidden="true">
      {/* Stat cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>

      {/* Content areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Table-like content area */}
        <div
          className="rounded-lg p-4 space-y-3"
          style={{ backgroundColor: "rgba(58,66,84,0.12)" }}
        >
          <Skeleton height={18} width="40%" rounded />
          <SkeletonTable columns={3} rows={5} />
        </div>

        {/* Card-list content area */}
        <div
          className="rounded-lg p-4 space-y-3"
          style={{ backgroundColor: "rgba(58,66,84,0.12)" }}
        >
          <Skeleton height={18} width="45%" rounded />
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
