"use client";

type TypingIndicatorProps = {
  partnerInitial?: string;
};

export function TypingIndicator({ partnerInitial = "•" }: TypingIndicatorProps) {
  return (
    <div className="flex max-w-[80%] gap-2.5 self-start items-end transition-all duration-200 animate-in fade-in slide-in-from-bottom-2">
      {/* Avatar */}
      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1E1E1E] text-white font-navbar text-xs font-bold shadow-xs"
        aria-hidden
      >
        {partnerInitial}
      </div>

      {/* Dancing Dots Bubble */}
      <div className="rounded-2xl rounded-bl-xs bg-[#F3F4F6] border border-[#E5E7EB]/60 px-4 py-3 shadow-2xs">
        <div className="flex items-center gap-1.5 h-3">
          <span className="size-2 rounded-full bg-[#9CA3AF] animate-bounce [animation-duration:800ms] [animation-delay:-300ms]" />
          <span className="size-2 rounded-full bg-[#9CA3AF] animate-bounce [animation-duration:800ms] [animation-delay:-150ms]" />
          <span className="size-2 rounded-full bg-[#9CA3AF] animate-bounce [animation-duration:800ms]" />
        </div>
      </div>
    </div>
  );
}
