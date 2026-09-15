"use client";

import { useEffect } from "react";

type ConfirmSelectionModalProps = {
  open: boolean;
  dealerName: string;
  amount: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmSelectionModal({
  open,
  dealerName,
  amount,
  isLoading = false,
  onClose,
  onConfirm,
}: ConfirmSelectionModalProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-[2px]"
        aria-label="Close modal overlay"
        onClick={onClose}
        disabled={isLoading}
      />
      <div
        className="relative z-[101] w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-selection-title"
      >
        <h2 id="confirm-selection-title" className="font-hero-heading text-xl font-bold text-[#1E1E1E]">
          Confirm Selection
        </h2>
        <p className="mt-3 font-navbar text-sm text-[#5E5E5E]">{dealerName}</p>
        <p className="mt-1 font-hero-heading text-3xl font-bold text-[#1E1E1E] sm:text-4xl">{amount}</p>

        <div className="mt-6 rounded-xl border border-emerald-300 bg-emerald-50/90 p-4">
          <p className="font-navbar text-sm font-semibold text-emerald-800">This will:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 font-navbar text-sm text-emerald-800">
            <li>Unlock chat with this dealer</li>
            <li>Share your contact information</li>
          </ul>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-full border-2 border-[#FFA51F] bg-white py-3 font-navbar text-sm font-semibold text-[#FFA51F] transition hover:bg-amber-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="flex-1 cursor-pointer rounded-full bg-[#FFA51F] py-3 font-navbar text-sm font-semibold text-[#1E1E1E] transition hover:bg-[#e8940f] disabled:opacity-60"
          >
            {isLoading ? "Connecting..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
