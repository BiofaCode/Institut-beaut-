import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#8B7355] text-white",
        secondary: "bg-[#F5F0EB] text-[#8B7355]",
        success: "bg-green-100 text-green-800",
        destructive: "bg-red-100 text-red-800",
        warning: "bg-yellow-100 text-yellow-800",
        outline: "border border-[#8B7355] text-[#8B7355]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
