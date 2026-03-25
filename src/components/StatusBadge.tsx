import { DocumentStatus } from "@/data/documents";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

const statusConfig: Record<DocumentStatus, { label: string; className: string }> = {
  valid: {
    label: "Valid",
    className: "bg-success/15 text-success border-success/20",
  },
  expiring: {
    label: "Expiring Soon",
    className: "bg-warning/15 text-warning border-warning/20",
  },
  expired: {
    label: "Expired",
    className: "bg-expired/15 text-expired border-expired/20",
  },
  missing: {
    label: "Missing",
    className: "bg-muted text-muted-foreground border-border",
  },
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", {
          "bg-success": status === "valid",
          "bg-warning": status === "expiring",
          "bg-expired": status === "expired",
          "bg-muted-foreground": status === "missing",
        })}
      />
      {config.label}
    </span>
  );
};

export default StatusBadge;
