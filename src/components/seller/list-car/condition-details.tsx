"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldError } from "@/components/auth/sign-up/field-error";
import {
  conditionDetailsSchema,
  type ConditionDetailsValues,
} from "@/components/seller/list-car/schemas";

type ConditionDetailsProps = {
  defaultValues: ConditionDetailsValues | null;
  onBack: () => void;
  onContinue: (data: ConditionDetailsValues) => void;
};

const input = cn(
  "w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 font-navbar text-base text-[#1E1E1E]",
  "outline-none transition-colors placeholder:text-neutral-400",
  "focus:border-[#FFA51F] focus:ring-2 focus:ring-[#FFA51F]/20"
);

const selectClass = cn(input, "cursor-pointer bg-white");

const PRESET_COLORS = [
  { id: "Black" as const, bg: "bg-neutral-900" },
  { id: "White" as const, bg: "bg-white ring-1 ring-[#E5E7EB]" },
  { id: "Pearl White" as const, bg: "bg-stone-100 ring-1 ring-stone-300" },
  { id: "Gray" as const, bg: "bg-neutral-400" },
  { id: "Silver" as const, bg: "bg-neutral-300" },
  { id: "Blue" as const, bg: "bg-blue-600" },
  { id: "Red" as const, bg: "bg-red-600" },
] as const;

const FEATURE_OPTIONS = [
  "Leather Seats",
  "Sunroof",
  "Push Start",
  "Back Camera",
  "Navigation",
  "Heated Seats",
] as const;

function SwitchField({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#E5E7EB] bg-neutral-50/80 px-4 py-3">
      <div>
        <p className="font-navbar text-sm font-medium text-[#1E1E1E]">{label}</p>
        <p className="mt-0.5 font-navbar text-xs text-[#5E5E5E]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 cursor-pointer overflow-hidden rounded-full border-2 border-transparent transition-colors",
          checked ? "bg-emerald-500" : "bg-neutral-300"
        )}
      >
        <span
          className={cn(
            "pointer-events-none absolute left-0.5 top-0.5 size-6 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-[22px]"
          )}
        />
      </button>
    </div>
  );
}

export function ConditionDetails({ defaultValues, onBack, onContinue }: ConditionDetailsProps) {
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<ConditionDetailsValues>({
    resolver: zodResolver(conditionDetailsSchema),
    defaultValues: defaultValues ?? {
      mileage: "",
      colorPreset: "Silver",
      customColor: "",
      titleStatus: "Clean Title",
      bodyType: "Sedan",
      drivetrain: "Front-Wheel Drive (FWD)",
      features: ["Leather Seats", "Sunroof"],
      mechanicalCondition: "Excellent",
      ownershipStatus: "Owned",
      numberOfKeys: "2",
      tireCondition: "New",
      drivable: true,
      accidentHistory: false,
      shortDescription: "",
    },
    mode: "onTouched",
  });

  const colorPreset = watch("colorPreset");
  const features = watch("features") ?? [];

  const toggleFeature = (f: string) => {
    const next = features.includes(f) ? features.filter((x) => x !== f) : [...features, f];
    setValue("features", next, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div>
      <h1 className="font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">Condition &amp; Details</h1>
      <p className="mt-2 font-navbar text-sm text-[#5E5E5E] sm:text-base">
        Help dealers understand your car&apos;s condition
      </p>

      <form
        onSubmit={handleSubmit(onContinue)}
        className="mx-auto mt-8 w-full max-w-3xl rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="space-y-5">
          <div>
            <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">Mileage</label>
            <input type="text" placeholder="28,000" className={cn(input, "mt-1.5")} {...register("mileage")} />
            <FieldError message={errors.mileage?.message} />
          </div>

          <div>
            <p className="font-navbar text-sm font-medium text-[#1E1E1E]">Color</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setValue("colorPreset", c.id, { shouldDirty: true, shouldValidate: true });
                    setValue("customColor", "", { shouldDirty: true });
                  }}
                  className={cn(
                    "size-10 rounded-lg border-2 transition-shadow sm:size-11",
                    c.bg,
                    colorPreset === c.id ? "border-[#FFA51F] ring-2 ring-[#FFA51F]/30" : "border-transparent"
                  )}
                  aria-label={c.id}
                />
              ))}
              <button
                type="button"
                onClick={() => setValue("colorPreset", "custom", { shouldDirty: true, shouldValidate: true })}
                className={cn(
                  "flex size-10 items-center justify-center rounded-lg border-2 border-dashed border-violet-300 bg-violet-50 sm:size-11",
                  colorPreset === "custom" && "border-[#FFA51F] ring-2 ring-[#FFA51F]/30"
                )}
                aria-label="Add custom color"
              >
                <Pencil className="size-4 text-violet-600" />
              </button>
            </div>
            {colorPreset === "custom" ? (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Describe your color"
                  className={cn(input)}
                  {...register("customColor")}
                />
                <FieldError message={errors.customColor?.message} />
              </div>
            ) : null}
            <input type="hidden" {...register("colorPreset")} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">Title status</label>
              <select className={cn(selectClass, "mt-1.5")} {...register("titleStatus")}>
                {(["Clean Title", "Clean", "Like New", "Average", "Need Replacement", "Rebuilt Title", "Salvage Title"] as const).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">Body Type</label>
              <select className={cn(selectClass, "mt-1.5")} {...register("bodyType")}>
                {(["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Wagon", "Minivan", "Truck", "Van"] as const).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">DRIVETRAIN</label>
            <select className={cn(selectClass, "mt-1.5")} {...register("drivetrain")}>
              {(["Front-Wheel Drive (FWD)", "All-Wheel Drive (AWD)", "Four-Wheel Drive (4WD)", "Rear-Wheel Drive (RWD)"] as const).map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="font-navbar text-sm font-medium text-[#1E1E1E]">Any Options / Features</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {FEATURE_OPTIONS.map((f) => (
                <label
                  key={f}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 font-navbar text-sm",
                    features.includes(f)
                      ? "border-[#FFA51F] bg-[#FFA51F]/10 text-[#1E1E1E]"
                      : "border-[#E5E7EB] bg-white text-[#5E5E5E]"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={features.includes(f)}
                    onChange={() => toggleFeature(f)}
                    className="size-4 rounded border-[#E5E7EB] accent-[#FFA51F]"
                  />
                  {f}
                </label>
              ))}
            </div>
            <FieldError message={errors.features?.message} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">Mechanical Condition</label>
              <select className={cn(selectClass, "mt-1.5")} {...register("mechanicalCondition")}>
                {(["Excellent", "Good", "Needs Attention", "Non-runner"] as const).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">Ownership Status</label>
              <select className={cn(selectClass, "mt-1.5")} {...register("ownershipStatus")}>
                {(["Owned", "Financed", "Leased"] as const).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">Number of keys</label>
              <select className={cn(selectClass, "mt-1.5")} {...register("numberOfKeys")}>
                {(["1", "2", "3", "4"] as const).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">Tire Condition</label>
              <select className={cn(selectClass, "mt-1.5")} {...register("tireCondition")}>
                {(["New", "Good", "Used", "Fair", "Need replacement", "Needs Replacement"] as const).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="drivable"
              control={control}
              render={({ field }) => (
                <SwitchField
                  checked={field.value}
                  onChange={field.onChange}
                  label="Drivable"
                  description="Can the car be driven?"
                />
              )}
            />
            <Controller
              name="accidentHistory"
              control={control}
              render={({ field }) => (
                <SwitchField
                  checked={field.value}
                  onChange={field.onChange}
                  label="Accident History"
                  description="Has the car been in an accident?"
                />
              )}
            />
          </div>

          <div>
            <label className="block font-navbar text-sm font-medium text-[#1E1E1E]">Short Description</label>
            <textarea
              rows={4}
              placeholder="Any details dealers should know..."
              className={cn(input, "mt-1.5 resize-y")}
              {...register("shortDescription")}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className={cn(
              "cursor-pointer rounded-xl border-2 border-[#FFA51F] px-6 py-3 font-navbar text-base font-semibold text-[#FFA51F]",
              "transition-colors hover:bg-[#FFA51F]/10"
            )}
          >
            Back
          </button>
          <button
            type="submit"
            className={cn(
              "cursor-pointer rounded-xl bg-[#FFA51F] px-6 py-3 font-navbar text-base font-semibold text-white sm:min-w-[200px]",
              "transition-opacity hover:opacity-90"
            )}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
