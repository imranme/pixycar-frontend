"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { TermsModal } from "@/components/auth/terms-modal";
import { cn } from "@/lib/utils";
import { FieldError } from "@/components/auth/sign-up/field-error";
import type { ConditionDetailsValues } from "@/components/seller/list-car/schemas";
import { PHOTO_SLOT_KEYS, reviewPublishSchema, type ReviewPublishValues } from "@/components/seller/list-car/schemas";
import type { VehicleInfoValues } from "@/components/seller/list-car/schemas";
import type { PhotosFormValues } from "@/components/seller/list-car/schemas";

type ReviewPublishProps = {
  vehicle: VehicleInfoValues;
  condition: ConditionDetailsValues;
  photos: PhotosFormValues;
  onBack: () => void;
  onPublish: () => void;
  onEditVehicle: () => void;
};

function displayColor(c: ConditionDetailsValues) {
  if (c.colorPreset === "custom") return c.customColor?.trim() || "—";
  return c.colorPreset;
}

export function ReviewPublish({
  vehicle,
  condition,
  photos,
  onBack,
  onPublish,
  onEditVehicle,
}: ReviewPublishProps) {
  const [termsOpen, setTermsOpen] = useState(false);
  const [heroUrl, setHeroUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReviewPublishValues>({
    resolver: zodResolver(reviewPublishSchema),
    defaultValues: {
      owner: false,
      accurate: false,
      noGuarantee: false,
      dealersContact: false,
      terms: false,
    },
    mode: "onChange",
  });

  const values = watch();

  useEffect(() => {
    for (const key of PHOTO_SLOT_KEYS) {
      const f = photos.slots[key];
      if (f) {
        const url = URL.createObjectURL(f);
        setHeroUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    }
    return undefined;
  }, [photos.slots]);

  const rows = useMemo(
    () => [
      { label: "Mileage", value: `${condition.mileage} miles` },
      { label: "Color", value: displayColor(condition) },
      { label: "Body Type", value: condition.bodyType },
      { label: "Accident History", value: condition.accidentHistory ? "Yes" : "None" },
      { label: "Drivable", value: condition.drivable ? "Yes" : "No" },
      { label: "Tire Condition", value: condition.tireCondition },
      { label: "Keys", value: condition.numberOfKeys },
    ],
    [condition]
  );

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`;

  const allChecked =
    values.owner && values.accurate && values.noGuarantee && values.dealersContact && values.terms;

  return (
    <>
      <TermsModal
        open={termsOpen}
        title="Terms of Use"
        onCancel={() => setTermsOpen(false)}
        onConfirm={() => {
          setValue("terms", true, { shouldValidate: true });
          setTermsOpen(false);
        }}
      />

      <div>
        <h1 className="font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">Before You Publish</h1>
        <p className="mt-2 font-navbar text-sm text-[#5E5E5E] sm:text-base">Please confirm the following</p>

        <div className="mx-auto mt-8 w-full max-w-3xl space-y-8 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-neutral-100 lg:max-w-xs">
              {heroUrl ? (
                <Image src={heroUrl} alt="" fill className="object-cover" unoptimized />
              ) : (
                <div className="flex h-full min-h-[200px] items-center justify-center font-navbar text-sm text-[#5E5E5E]">
                  No photo
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2">
                <h2 className="font-hero-heading text-xl font-bold text-[#1E1E1E]">{title}</h2>
                <button
                  type="button"
                  onClick={onEditVehicle}
                  className="mt-0.5 cursor-pointer rounded-md p-1 text-[#5E5E5E] hover:bg-neutral-100 hover:text-[#FFA51F]"
                  aria-label="Edit vehicle"
                >
                  <Pencil className="size-5" strokeWidth={2} />
                </button>
              </div>
              <dl className="mt-4 space-y-2">
                {rows.map((row) => (
                  <div key={row.label} className="flex justify-between gap-4 font-navbar text-sm">
                    <dt className="text-[#5E5E5E]">{row.label}</dt>
                    <dd className="text-right font-medium text-[#1E1E1E]">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <form onSubmit={handleSubmit(() => onPublish())} className="space-y-3">
            {(
              [
                ["owner", "I am the owner of this vehicle and have the right to sell it"],
                ["accurate", "All information provided is accurate to the best of my knowledge"],
                ["noGuarantee", "I understand this platform does not guarantee a sale"],
                ["dealersContact", "Dealers will contact me through the platform after bidding"],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E5E7EB] bg-neutral-50/80 px-4 py-3"
              >
                <input
                  type="checkbox"
                  className="mt-1 size-4 shrink-0 rounded border-[#E5E7EB] accent-[#FFA51F]"
                  {...register(key)}
                />
                <span className="font-navbar text-sm text-[#1E1E1E]">{label}</span>
              </label>
            ))}

            <div className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] bg-neutral-50/80 px-4 py-3">
              <input
                type="checkbox"
                className="mt-1 size-4 shrink-0 rounded border-[#E5E7EB] accent-[#FFA51F]"
                {...register("terms")}
              />
              <span className="font-navbar text-sm text-[#1E1E1E]">
                I agree to the{" "}
                <button
                  type="button"
                  className="cursor-pointer font-semibold text-[#FFA51F] hover:underline"
                  onClick={() => setTermsOpen(true)}
                >
                  Terms of Use
                </button>{" "}
                of this Platform
              </span>
            </div>

            <FieldError message={errors.owner?.message} />

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={onBack}
                className={cn(
                  "cursor-pointer rounded-xl border-2 border-[#FFA51F] px-6 py-3 font-navbar text-base font-semibold text-[#FFA51F]",
                  "hover:bg-[#FFA51F]/10"
                )}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!allChecked}
                className={cn(
                  "cursor-pointer rounded-xl px-6 py-3 font-navbar text-base font-semibold text-white sm:min-w-[200px]",
                  allChecked ? "bg-[#FFA51F] hover:opacity-90" : "cursor-not-allowed bg-neutral-300 text-neutral-500"
                )}
              >
                Publish Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
