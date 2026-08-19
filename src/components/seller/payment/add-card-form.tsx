"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { FieldError } from "@/components/auth/sign-up/field-error";
import { addDebitCardSchema, type AddDebitCardInput } from "@/components/seller/settings/settings-schemas";
import { cn } from "@/lib/utils";

function formatCardDigits(digits: string) {
  const d = digits.replace(/\D/g, "").slice(0, 16);
  return d.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

const orangeInput = cn(
  "w-full rounded-lg border border-[#FFA51F] px-4 py-3 font-navbar text-base text-[#1E1E1E]",
  "outline-none transition placeholder:text-neutral-400",
  "focus:ring-1 focus:ring-orange-400"
);

type AddCardFormProps = {
  onSuccess?: () => void;
  /** Where to navigate after successful add when `onSuccess` is not provided */
  redirectAfterAdd?: string;
};

export function AddCardForm({ onSuccess, redirectAfterAdd }: AddCardFormProps) {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const { control, register, handleSubmit, formState: { errors } } = useForm<AddDebitCardInput>({
    resolver: zodResolver(addDebitCardSchema),
    defaultValues: {
      cardNumber: "",
      expiry: "",
      cvv: "",
      billingZip: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data: AddDebitCardInput) => {
    console.log("add-debit-card", data);
    setToast("Card added successfully.");
    window.setTimeout(() => {
      setToast(null);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectAfterAdd ?? ROUTES.seller.settingsPaymentMethods);
      }
    }, 1200);
  };

  return (
    <>
      {toast ? (
        <div
          className="fixed bottom-6 left-1/2 z-[110] w-[min(90vw,400px)] -translate-x-1/2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center font-navbar text-sm font-medium text-emerald-900 shadow-lg"
          role="status"
        >
          {toast}
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex w-full max-w-sm flex-col gap-5">
        <div>
          <label htmlFor="cardNumber" className="block font-navbar text-sm font-medium text-[#1E1E1E]">
            Card Number
          </label>
          <Controller
            name="cardNumber"
            control={control}
            render={({ field }) => (
              <input
                id="cardNumber"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="456453456345"
                className={cn(orangeInput, "mt-1.5")}
                value={formatCardDigits(field.value)}
                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 16))}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            )}
          />
          <FieldError message={errors.cardNumber?.message} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="expiry" className="block font-navbar text-sm font-medium text-[#1E1E1E]">
              Expiry Date
            </label>
            <div className="relative mt-1.5">
              <input
                id="expiry"
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                className={cn(orangeInput, "pr-11")}
                {...register("expiry")}
              />
              <Calendar className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#5E5E5E]" aria-hidden />
            </div>
            <FieldError message={errors.expiry?.message} />
          </div>
          <div>
            <label htmlFor="cvv" className="block font-navbar text-sm font-medium text-[#1E1E1E]">
              CVV
            </label>
            <input
              id="cvv"
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              className={cn(orangeInput, "mt-1.5")}
              {...register("cvv")}
            />
            <FieldError message={errors.cvv?.message} />
          </div>
        </div>

        <div>
          <label htmlFor="billingZip" className="block font-navbar text-sm font-medium text-[#1E1E1E]">
            Billing ZIP Code
          </label>
          <input
            id="billingZip"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="0001112541"
            className={cn(orangeInput, "mt-1.5")}
            {...register("billingZip")}
          />
          <FieldError message={errors.billingZip?.message} />
        </div>

        <button
          type="submit"
          className="mt-2 w-full cursor-pointer rounded-xl bg-[#FFA51F] py-3 font-navbar text-base font-bold text-[#1E1E1E] transition hover:bg-[#e8940f]"
        >
          Add Debit Card
        </button>
      </form>
    </>
  );
}
