"use client";

import { useEffect } from "react";

type ConfirmOfferModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  amount?: string;
  isLoading?: boolean;
};

export function ConfirmOfferModal({
  open,
  onClose,
  onConfirm,
  title = "Vehicle Offer",
  amount = "25,000",
  isLoading = false,
}: ConfirmOfferModalProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const formattedAmount = isNaN(Number(amount.replace(/[^0-9.]/g, "")))
    ? amount
    : `$${Number(amount.replace(/[^0-9.]/g, "")).toLocaleString()}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-[1px]"
        aria-label="Close modal overlay"
        onClick={onClose}
      />
      <div
        className="relative z-[101] w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-offer-title"
      >
        <h2 id="confirm-offer-title" className="font-hero-heading text-xl font-bold text-[#1E1E1E]">
          Confirm Your Offer
        </h2>
        <p className="mt-2 font-navbar text-sm text-[#5E5E5E]">{title}</p>
        <p className="mt-3 font-hero-heading text-3xl font-bold text-[#1E1E1E] sm:text-4xl">
          {formattedAmount}
        </p>
        <p className="mt-2 font-navbar text-sm text-[#5E5E5E]">Offer Fee: $1.99</p>

        <div className="mt-6 rounded-xl border border-emerald-300 bg-emerald-50/90 p-4">
          <p className="font-navbar text-sm font-bold text-emerald-800">You&apos;ll be notified if:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 font-navbar text-sm text-emerald-800">
            <li>You&apos;re outbid</li>
            <li>Your offer wins</li>
            <li>Offer period ends</li>
          </ul>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-xl border-2 border-[#FFA51F] bg-white py-3 font-navbar text-sm font-semibold text-[#FFA51F] transition hover:bg-amber-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 cursor-pointer rounded-xl bg-[#FFA51F] py-3 font-navbar text-sm font-semibold text-[#1E1E1E] transition hover:bg-[#e8940f]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
