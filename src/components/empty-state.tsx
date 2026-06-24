import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-white/12 bg-background/25 p-8 text-center">
      <div>
        <div className="mx-auto grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/5">
          <Icon className="size-5 text-primary" />
        </div>
        <h2 className="mt-5 font-semibold">{title}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button className="mt-5" variant="outline" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
