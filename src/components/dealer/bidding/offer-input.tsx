type OfferInputProps = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
};

export function OfferInput({ value, onChange, disabled }: OfferInputProps) {
  return (
    <div>
      <label htmlFor="offer-amount" className="block font-hero-heading text-base font-bold text-[#1E1E1E]">
        Your Offer Amount
      </label>
      <div className="relative mt-2">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-navbar text-lg text-[#9CA3AF]">
          $
        </span>
        <input
          id="offer-amount"
          type="text"
          inputMode="decimal"
          disabled={disabled}
          placeholder="25,000"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-[#E5E7EB] py-3 pl-9 pr-4 font-navbar text-lg text-[#1E1E1E] outline-none transition placeholder:text-neutral-400 focus:border-[#FFA51F] focus:ring-2 focus:ring-[#FFA51F]/20 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500"
        />
      </div>
      <p className="mt-1.5 font-navbar text-xs text-[#5E5E5E] sm:text-sm">Minimum Increment: $100</p>
    </div>
  );
}
