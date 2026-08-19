"use client";

import { cn } from "@/lib/utils";

type TermsModalProps = {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.";

export function TermsModal({ open, title, onCancel, onConfirm }: TermsModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-[480px] flex-col rounded-2xl bg-white p-6 shadow-xl">
        <h2
          id="legal-modal-title"
          className="font-hero-heading text-xl font-bold text-[#1E1E1E]"
        >
          {title}
        </h2>
        <div className="mt-4 max-h-[min(50vh,320px)] overflow-y-auto text-justify font-navbar text-sm font-normal leading-relaxed text-[#5E5E5E]">
          {LOREM}
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={cn(
              "flex-1 cursor-pointer rounded-xl border border-[#FFA51F] px-4 py-3",
              "font-navbar text-base font-semibold text-[#FFA51F] transition-colors hover:bg-[#FFA51F]/10"
            )}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "flex-1 cursor-pointer rounded-xl bg-[#FFA51F] px-4 py-3",
              "font-navbar text-base font-semibold text-black transition-opacity hover:opacity-90"
            )}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
