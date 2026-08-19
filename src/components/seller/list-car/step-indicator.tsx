import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { n: 1, label: "Vehicle Info", sub: "VIN, Make, Model" },
  { n: 2, label: "Details", sub: "Condition & Features" },
  { n: 3, label: "Photos", sub: "Upload Images" },
  { n: 4, label: "Review & Pay", sub: "Confirm & Publish" },
] as const;

type AppStep = 1 | 2 | 3 | 4 | 5;

type StepIndicatorProps = {
  appStep: AppStep;
};

export function StepIndicator({ appStep }: StepIndicatorProps) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="mx-auto flex min-w-[600px] max-w-3xl items-start px-1">
        {STEPS.map((step, index) => {
          const n = step.n;
          const completed = appStep === 5 ? false : n < appStep;
          const current = appStep === 5 ? n === 4 : n === appStep;
          const allFee = appStep === 5;

          const lineLeftOrange = index === 0 ? allFee : allFee || appStep > STEPS[index - 1].n;
          const lineRightOrange = allFee || appStep > n;

          return (
            <div key={n} className="flex min-w-0 flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <div
                  className={cn(
                    "h-0.5 min-w-[8px] flex-1 rounded-full",
                    lineLeftOrange ? "bg-[#FFA51F]" : "bg-[#E5E7EB]"
                  )}
                />
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold sm:size-10",
                    completed || current || allFee
                      ? "border-[#FFA51F] bg-[#FFA51F] text-white"
                      : "border-[#E5E7EB] bg-white text-[#5E5E5E]"
                  )}
                >
                  {completed && !allFee ? (
                    <Check className="size-4 sm:size-5" strokeWidth={3} aria-hidden />
                  ) : (
                    <span>{n}</span>
                  )}
                </div>
                {index < STEPS.length - 1 ? (
                  <div
                    className={cn(
                      "h-0.5 min-w-[8px] flex-1 rounded-full",
                      lineRightOrange ? "bg-[#FFA51F]" : "bg-[#E5E7EB]"
                    )}
                  />
                ) : (
                  <div className={cn("h-0.5 min-w-[8px] flex-1", allFee ? "bg-[#FFA51F]" : "bg-transparent")} />
                )}
              </div>
              <p
                className={cn(
                  "mt-2 text-center font-navbar text-xs font-semibold sm:text-sm",
                  current ? "text-[#FFA51F]" : "text-[#5E5E5E]"
                )}
              >
                {step.label}
              </p>
              <p className="mt-0.5 hidden text-center font-navbar text-[10px] text-[#5E5E5E] sm:block sm:text-xs">
                {step.sub}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
