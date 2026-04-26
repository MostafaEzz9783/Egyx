import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div className={cn("rounded-md border border-border bg-panel shadow-sm", className)} {...props} />
  );
}
