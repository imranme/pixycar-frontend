"use client";

type CarSpecsGridProps = {
  specs: { label: string; value: string }[];
};

export function CarSpecsGrid({ specs }: CarSpecsGridProps) {
  if (!specs || specs.length === 0) return null;

  return (
    <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {specs.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]/80 px-3.5 py-2.5 transition hover:bg-neutral-50"
        >
          <p className="font-navbar text-xs font-normal text-[#5E5E5E]">{s.label}</p>
          <p className="mt-0.5 font-navbar text-sm font-bold text-[#1E1E1E]">{s.value || "N/A"}</p>
        </div>
      ))}
    </div>
  );
}
