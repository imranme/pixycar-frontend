"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createImproveOfferSchema, type ImproveOfferFormValues } from "@/components/dealer/my-offers/improve-offer-schema";
import { cn } from "@/lib/utils";

type ImproveOfferModalProps = {
  open: boolean;
  onClose: () => void;
  carName: string;
  currentOffer: number;
  minIncrement: number;
  initialAmount?: number;
  onConfirm: (amount: number) => void;
  isLoading?: boolean;
};

export function ImproveOfferModal({
  open,
  onClose,
  carName,
  currentOffer,
  minIncrement,
  initialAmount,
  onConfirm,
  isLoading = false,
}: ImproveOfferModalProps) {
  const schema = useMemo(
    () => createImproveOfferSchema(currentOffer, minIncrement),
    [currentOffer, minIncrement]
  );

  const defaultAmt = initialAmount && initialAmount > currentOffer
    ? initialAmount.toLocaleString("en-US")
    : (currentOffer + minIncrement).toLocaleString("en-US");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ImproveOfferFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: defaultAmt },
  });

  useEffect(() => {
    if (open) {
      reset({ amount: defaultAmt });
    }
  }, [open, defaultAmt, reset]);

  if (!open) return null;

  const onSubmit = (data: ImproveOfferFormValues) => {
    const raw = data.amount.replace(/[$,\s]/g, "").trim();
    const n = Number(raw);
    if (!isNaN(n) && n > 0) {
      onConfirm(n);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, "");
    if (rawVal === "") {
      setValue("amount", "", { shouldValidate: true });
      return;
    }
    const num = Number(rawVal);
    setValue("amount", num.toLocaleString("en-US"), { shouldValidate: true });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Dimmed backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="improve-modal-title"
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-2xl transition-all"
      >
        <h2 id="improve-modal-title" className="text-center font-hero-heading text-xl sm:text-2xl font-bold text-[#1E1E1E]">
          Improve Offer
        </h2>

        <p className="mt-1.5 text-center font-navbar text-xs sm:text-sm text-[#5E5E5E]">
          {carName}
        </p>

        <p className="mt-1 text-center font-hero-heading text-2xl sm:text-3xl font-bold text-[#1E1E1E]">
          ${currentOffer.toLocaleString("en-US")}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <label htmlFor="improve-amount-input" className="block font-navbar text-sm font-semibold text-[#1E1E1E]">
            Improve Your Offer Amount
          </label>

          <div className="mt-2 flex items-center rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-3 transition focus-within:border-[#FFA51F] focus-within:ring-2 focus-within:ring-[#FFA51F]/20">
            <span className="font-navbar text-base font-bold text-[#1E1E1E] mr-1.5">$</span>
            <input
              id="improve-amount-input"
              type="text"
              inputMode="numeric"
              placeholder={(currentOffer + minIncrement).toLocaleString("en-US")}
              className="w-full bg-transparent font-navbar text-base font-bold text-[#1E1E1E] outline-none placeholder:text-neutral-300"
              {...register("amount")}
              onChange={handleInputChange}
              autoFocus
            />
          </div>

          {errors.amount ? (
            <p className="mt-1.5 font-navbar text-xs text-red-500">{errors.amount.message}</p>
          ) : (
            <p className="mt-1.5 font-navbar text-xs text-[#5E5E5E]">
              Minimum increment: ${minIncrement.toLocaleString("en-US")}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 cursor-pointer rounded-xl border border-[#E5E7EB] bg-white py-3 text-center font-navbar text-sm font-semibold text-[#1E1E1E] transition hover:bg-neutral-50 active:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "flex-1 cursor-pointer rounded-xl bg-[#FFA51F] py-3 text-center font-navbar text-sm font-bold text-[#1E1E1E] transition hover:bg-[#e8940f] active:bg-[#d88709] shadow-sm",
                isLoading && "opacity-60 cursor-not-allowed"
              )}
            >
              {isLoading ? "Saving..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
