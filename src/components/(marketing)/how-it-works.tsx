import {
  Award,
  BarChart3,
  CarFront,
  DollarSign,
  MessageCircle,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StepItem = {
  stepLabel: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  iconBoxClass: string;
  iconClass: string;
};

const sellerSteps: StepItem[] = [
  {
    stepLabel: "Step 01",
    title: "List Your Car",
    description:
      "Create a detailed listing with photos, specs, and your asking price. Pay a $4.95 non-refundable Listing Access Fee.",
    Icon: CarFront,
    iconBoxClass: "bg-indigo-100",
    iconClass: "text-indigo-600",
  },
  {
    stepLabel: "Step 02",
    title: "Receive Blind Offers",
    description:
      "Verified dealers submit competitive offers within a one hour time frame.",
    Icon: Shield,
    iconBoxClass: "bg-purple-100",
    iconClass: "text-purple-600",
  },
  {
    stepLabel: "Step 03",
    title: "Choose Your Best Deal",
    description:
      "Review all offers, pick the best one, and connect with the winning dealer directly through our platform.",
    Icon: Award,
    iconBoxClass: "bg-green-100",
    iconClass: "text-green-600",
  },
];

const dealerSteps: StepItem[] = [
  {
    stepLabel: "Step 01",
    title: "Browse Inventory",
    description: "Get full specs and photo galleries.",
    Icon: BarChart3,
    iconBoxClass: "bg-green-100",
    iconClass: "text-green-600",
  },
  {
    stepLabel: "Step 02",
    title: "Submit Competitive Offers",
    description:
      "Submit your best offer and track your ranking in real-time to stay ahead of the competition.",
    Icon: DollarSign,
    iconBoxClass: "bg-orange-100",
    iconClass: "text-orange-600",
  },
  {
    stepLabel: "Step 03",
    title: "Win & Connect",
    description:
      "If selected, unlock seller contact details and close the deal through our secure messaging system.",
    Icon: MessageCircle,
    iconBoxClass: "bg-blue-100",
    iconClass: "text-blue-600",
  },
];

function StepRow({
  stepLabel,
  title,
  description,
  Icon,
  iconBoxClass,
  iconClass,
}: StepItem) {
  return (
    <div className="flex gap-4">
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl",
          iconBoxClass
        )}
      >
        <Icon className={cn("size-6", iconClass)} strokeWidth={2} aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-400">{stepLabel}</p>
        <h3 className="mt-1 font-bold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export interface HowItWorksProps {
  id?: string;
}

export function HowItWorks({ id }: HowItWorksProps) {
  return (
    <section
      id={id}
      className="scroll-mt-24 bg-white py-16 font-navbar sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-screen-2xl px-3 sm:px-4 lg:px-6">
        <div className="flex flex-col items-center text-center">
          <span className="rounded-full bg-[#FFA51F]/15 px-4 py-1.5 text-sm font-medium text-[#FFA51F]">
            Simple Process
          </span>
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-gray-900">
            How PixyCar Works
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-500">
            From listing to deal — a streamlined, transparent process that works
            for both sellers and dealers.
          </p>
        </div>

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="text-lg font-bold text-gray-900">For Sellers</h3>
            <ul className="mt-8 flex flex-col gap-10" role="list">
              {sellerSteps.map((step) => (
                <li key={step.stepLabel + step.title}>
                  <StepRow {...step} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">For Dealers</h3>
            <ul className="mt-8 flex flex-col gap-10" role="list">
              {dealerSteps.map((step) => (
                <li key={step.stepLabel + step.title}>
                  <StepRow {...step} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
