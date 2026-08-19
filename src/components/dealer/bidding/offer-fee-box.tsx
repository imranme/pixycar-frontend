export function OfferFeeBox() {
  return (
    <div className="rounded-xl border border-[#FFA51F] bg-[#FFFBF5] p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-navbar text-base font-bold text-[#FFA51F]">Offer Fee</span>
        <span className="font-hero-heading text-lg font-bold text-[#1E1E1E]">$1.99</span>
      </div>
      <p className="mt-2 font-navbar text-xs leading-relaxed text-[#5E5E5E] sm:text-sm">
        Non-refundable • Charged when you submit your offer
      </p>
    </div>
  );
}
