"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { FieldError } from "@/components/auth/sign-up/field-error";
import {
  TRIM_OPTIONS,
  vehicleInfoSchema,
  type VehicleInfoValues,
} from "@/components/seller/list-car/schemas";

type VehicleInfoProps = {
  defaultValues: VehicleInfoValues | null;
  onContinue: (data: VehicleInfoValues) => void;
};

const input = cn(
  "w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 font-navbar text-base text-[#1E1E1E]",
  "outline-none transition-colors placeholder:text-neutral-400",
  "focus:border-[#FFA51F] focus:ring-2 focus:ring-[#FFA51F]/20"
);

const selectClass = cn(input, "cursor-pointer bg-white");

export function VehicleInfo({ defaultValues, onContinue }: VehicleInfoProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleInfoValues>({
    resolver: zodResolver(vehicleInfoSchema),
    defaultValues: defaultValues ?? {
      vin: "",
      year: "",
      make: "",
      model: "",
      trim: "",
    },
    mode: "onTouched",
  });

  return (
    <div>
      <h1 className="font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">Vehicle Basics</h1>
      <p className="mt-2 font-navbar text-sm text-[#5E5E5E] sm:text-base">
        Let&apos;s start with your car&apos;s information
      </p>

      <form
        onSubmit={handleSubmit(onContinue)}
        className="mx-auto mt-8 w-full max-w-lg rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="space-y-4">
          <div>
            <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">
              VIN / Registration Number
            </label>
            <input
              type="text"
              placeholder="e.g. DHAKA-METRO-KA-12-3456"
              className={cn(input, "mt-1.5")}
              {...register("vin")}
            />
            <FieldError message={errors.vin?.message} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">Year</label>
              <input type="text" inputMode="numeric" placeholder="2022" className={cn(input, "mt-1.5")} {...register("year")} />
              <FieldError message={errors.year?.message} />
            </div>
            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">Make</label>
              <input type="text" placeholder="Toyota" className={cn(input, "mt-1.5")} {...register("make")} />
              <FieldError message={errors.make?.message} />
            </div>
          </div>

          <div>
            <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">Model</label>
            <input type="text" placeholder="Premio" className={cn(input, "mt-1.5")} {...register("model")} />
            <FieldError message={errors.model?.message} />
          </div>

          <div>
            <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">Trim</label>
            <input
              type="text"
              list="trim-options"
              placeholder="e.g. F EX Package, LX, Sport"
              className={cn(input, "mt-1.5")}
              {...register("trim")}
            />
            <datalist id="trim-options">
              {TRIM_OPTIONS.map((opt) => (
                <option key={opt} value={opt} />
              ))}
            </datalist>
            <FieldError message={errors.trim?.message} />
          </div>
        </div>

        <button
          type="submit"
          className={cn(
            "mt-8 w-full cursor-pointer rounded-xl bg-[#FFA51F] py-3 font-navbar text-base font-semibold text-black",
            "transition-opacity hover:opacity-90"
          )}
        >
          Continue
        </button>
      </form>
    </div>
  );
}
