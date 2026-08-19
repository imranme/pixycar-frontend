import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatsCardProps = {
  icon: LucideIcon;
  iconWrapClass: string;
  value: string;
  label: string;
};

export function StatsCard({ icon: Icon, iconWrapClass, value, label }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", iconWrapClass)}>
          <Icon className="size-5" strokeWidth={2} aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="font-hero-heading text-2xl font-bold text-[#1E1E1E]">{value}</p>
          <p className="font-navbar text-sm text-[#5E5E5E]">{label}</p>
        </div>
      </div>
    </div>
  );
}
