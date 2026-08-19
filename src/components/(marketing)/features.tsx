import {
  BadgeCheck,
  Clock,
  DollarSign,
  MessageCircle,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FeatureCardData = {
  Icon: LucideIcon;
  iconBoxClass: string;
  iconClass: string;
  title: string;
  description: string;
};

const featuresRow1: FeatureCardData[] = [
  {
    Icon: Shield,
    iconBoxClass: "bg-[#EDE9FE]",
    iconClass: "text-violet-600",
    title: "Blind Offer System",
    description:
      "Verified dealers submit competitive offers during a 1-hour window.",
  },
  {
    Icon: Clock,
    iconBoxClass: "bg-[#EFF6FF]",
    iconClass: "text-blue-600",
    title: "1-Hour Offer Windows",
    description:
      "Structured time windows create urgency and ensure sellers get timely, competitive offers from motivated dealers.",
  },
  {
    Icon: DollarSign,
    iconBoxClass: "bg-[#F0FDF4]",
    iconClass: "text-green-600",
    title: "Refundable Listing Fee",
    description:
      "Your $4.95 listing fee is 100% refundable if no offers are received. We only win when you win.",
  },
];

const featuresRow2: FeatureCardData[] = [
  {
    Icon: BadgeCheck,
    iconBoxClass: "bg-[#FFF7ED]",
    iconClass: "text-orange-600",
    title: "Verified Dealers Only",
    description:
      "Every dealer on the platform is verified and vetted. No scammers, no tire-kickers.",
  },
  {
    Icon: MessageCircle,
    iconBoxClass: "bg-[#F9FAFB]",
    iconClass: "text-gray-600",
    title: "Secure Messaging",
    description:
      "Contact info is only revealed after seller accepts offer.",
  },
];

function FeatureCard({
  Icon,
  iconBoxClass,
  iconClass,
  title,
  description,
}: FeatureCardData) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-[#E5E7EB] bg-white p-6">
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-xl",
          iconBoxClass
        )}
      >
        <Icon className={cn("size-6", iconClass)} strokeWidth={2} aria-hidden />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-hero-heading text-lg font-bold leading-snug text-[#1E1E1E]">
          {title}
        </h3>
        <p className="font-navbar text-sm font-normal leading-relaxed text-[#5E5E5E] sm:text-base">
          {description}
        </p>
      </div>
    </article>
  );
}

export interface FeaturesProps {
  id?: string;
}

export function Features({ id }: FeaturesProps) {
  return (
    <section
      id={id}
      className="scroll-mt-24 bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-screen-2xl px-3 sm:px-4 lg:px-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-hero-heading text-[32px] font-semibold leading-tight tracking-tight text-[#1E1E1E]">
            Built for Trust &amp; Transparency
          </h2>
          <p className="mt-4 max-w-2xl font-navbar text-base font-normal leading-relaxed text-[#5E5E5E]">
            Every feature is designed to protect sellers and empower dealers.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {featuresRow1.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>

        <div className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-6 md:mt-6 md:grid-cols-2">
          {featuresRow2.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
