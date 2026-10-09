/**
 * UI component barrel file.
 * Import from "@/components/ui" instead of individual files.
 *
 * @example
 * import { Card, Badge, StatusBadge, Button, Input } from "@/components/ui";
 */

export {
  Badge,
  StatusBadge,
  type BadgeProps,
  type BadgeVariant,
  type BadgeSize,
  type StatusBadgeProps,
  type StatusValue,
} from "./Badge";

export {
  Button,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from "./Button";

export {
  Card,
  type CardProps,
  type CardVariant,
  type CardHeader,
} from "./Card";

export {
  Checkbox,
  type CheckboxProps,
  type CheckboxSize,
} from "./Checkbox";

export {
  Input,
  type InputProps,
} from "./Input";

export {
  Radio,
  RadioGroup,
  type RadioProps,
  type RadioGroupProps,
  type RadioOption,
  type RadioSize,
  type RadioOrientation,
} from "./Radio";

export {
  Select,
  type SelectProps,
  type SelectOption,
  type SelectSize,
} from "./Select";

export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonTable,
  SkeletonStatCard,
  SkeletonDashboard,
} from "./Skeleton";

export {
  Textarea,
  type TextareaProps,
} from "./Textarea";

export { CommandPalette } from "./CommandPalette";

export {
  CommandPaletteProvider,
  useCommandPalette,
} from "./CommandPaletteProvider";

export {
  EmptyState,
  useEmptyState,
  type EmptyStateProps,
  type EmptyStateVariant,
  type EmptyStateSize,
  type EmptyStateAction,
  type EmptyStateSecondaryAction,
} from "./EmptyState";

export {
  ErrorBoundary,
  withErrorBoundary,
  useErrorBoundary,
  type ErrorBoundaryProps,
  type WithErrorBoundaryOptions,
} from "./ErrorBoundary";
