"use client";

import { useEffect } from "react";
import { Trash2 } from "lucide-react";

type DeleteAccountModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteAccountModal({ open, onClose, onConfirm }: DeleteAccountModalProps) {
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
        className="absolute inset-0 cursor-default bg-black/50"
        aria-label="Close modal overlay"
        onClick={onClose}
      />
      <div
        className="relative z-[101] w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100">
          <Trash2 className="size-6 text-red-600" strokeWidth={2} aria-hidden />
        </div>
        <h2 id="delete-account-title" className="mt-4 text-center font-hero-heading text-xl font-bold text-[#1E1E1E]">
          Delete Account
        </h2>
        <p className="mt-2 text-center font-navbar text-sm text-[#5E5E5E]">
          Are you sure, delete your account permanently
        </p>
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
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
