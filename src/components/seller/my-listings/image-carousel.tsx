"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ImageCarouselProps = {
  images: string[];
  className?: string;
};

export function ImageCarousel({ images, className }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const safe = images.length > 0 ? images : [""];
  const current = safe[index] ?? safe[0]!;

  const prev = () => setIndex((i) => (i === 0 ? safe.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === safe.length - 1 ? 0 : i + 1));

  return (
    <div className={cn("relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-100", className)}>
      {current ? (
        <Image src={current} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 55vw" unoptimized />
      ) : null}
      <button
        type="button"
        onClick={prev}
        className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#1E1E1E] shadow-md transition hover:bg-white"
        aria-label="Previous image"
      >
        <ChevronLeft className="size-6" strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#1E1E1E] shadow-md transition hover:bg-white"
        aria-label="Next image"
      >
        <ChevronRight className="size-6" strokeWidth={2} />
      </button>
      <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 font-navbar text-xs font-medium text-white">
        {index + 1} / {safe.length}
      </div>
    </div>
  );
}
