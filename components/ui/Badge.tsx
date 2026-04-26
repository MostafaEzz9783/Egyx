import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "accent" | "muted" | "success";
};

const variants = {
  accent: "border-[#f0c94e] bg-[#f7d96b] text-[#2d2d2d]",
  muted: "border-border bg-[#f5f5f5] text-[#555555]",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700"
};

export function Badge({ className, variant = "muted", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
