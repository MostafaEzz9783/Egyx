import { Card } from "@/components/ui/Card";

type AdSlotProps = {
  code?: string | null;
  enabled?: boolean;
  fallbackLabel: string;
  className?: string;
  minHeightClassName?: string;
};

export function AdSlot({
  code,
  enabled = true,
  fallbackLabel,
  className = "",
  minHeightClassName = "min-h-[120px]"
}: AdSlotProps) {
  if (!enabled) {
    return null;
  }

  const hasCode = Boolean(code?.trim());

  return (
    <Card className={`overflow-hidden ${minHeightClassName} ${className}`}>
      <div className={`flex h-full w-full items-center justify-center p-4 text-center ${minHeightClassName}`}>
        {hasCode ? (
          <div
            className="flex min-h-full w-full items-center justify-center rounded-md border border-dashed border-[#d8d8d8] bg-[#fafafa] p-4 text-sm text-[#444]"
            dangerouslySetInnerHTML={{ __html: code as string }}
          />
        ) : process.env.NODE_ENV === "development" ? (
          <div className="rounded-md border border-dashed border-[#d8d8d8] bg-[#fafafa] px-4 py-3 text-xs text-muted">
            {fallbackLabel}
          </div>
        ) : (
          <div aria-hidden="true" className="w-full" />
        )}
      </div>
    </Card>
  );
}
