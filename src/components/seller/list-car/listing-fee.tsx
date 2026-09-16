"use client";

import { CreditCard, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import {
  useCreateVehicleListingMutation,
  useUploadListingImagesMutation,
} from "@/store/features/listings/listingsApi";
import type { CreateVehicleListingRequest } from "@/store/features/listings/listingsApi.types";
import type { VehicleInfoValues } from "@/components/seller/list-car/schemas";
import type { ConditionDetailsValues } from "@/components/seller/list-car/schemas";
import type { PhotosFormValues } from "@/components/seller/list-car/schemas";
import toast from "react-hot-toast";

export type FullListingPayload = {
  vehicle: VehicleInfoValues;
  condition: ConditionDetailsValues;
  photos: PhotosFormValues;
};

type ListingFeeProps = {
  formData: FullListingPayload;
  onBack: () => void;
};

/* ── helpers to map form values → API body ── */

const BODY_TYPE_MAP: Record<string, string> = {
  Sedan: "SEDAN",
  SUV: "SUV",
  Hatchback: "HATCHBACK",
  Coupe: "COUPE",
  Convertible: "CONVERTIBLE",
  Wagon: "WAGON",
  Minivan: "MINIVAN",
  Truck: "TRUCK",
  Van: "VAN",
};

const OWNERSHIP_MAP: Record<string, string> = {
  Owned: "OWNED",
  Financed: "FINANCED",
  Leased: "LEASED",
  OWNED: "OWNED",
  FINANCED: "FINANCED",
  LEASED: "LEASED",
};

const TIRE_MAP: Record<string, string> = {
  New: "NEW",
  Good: "GOOD",
  Used: "USED",
  Fair: "FAIR",
  "Need replacement": "NEED_REPLACEMENT",
  "Need Replacement": "NEED_REPLACEMENT",
  "Needs replacement": "BAD",
  "Needs Replacement": "BAD",
};

const DRIVETRAIN_MAP: Record<string, string> = {
  "Front-Wheel Drive (FWD)": "FWD",
  "Front Wheel Drive": "FWD",
  "Front-Wheel Drive": "FWD",
  FWD: "FWD",
  "All-Wheel Drive (AWD)": "AWD",
  "All Wheel Drive": "AWD",
  "All-Wheel Drive": "AWD",
  AWD: "AWD",
  "Four-Wheel Drive (4WD)": "4WD",
  "Four Wheel Drive": "4WD",
  "Four-Wheel Drive": "4WD",
  "4WD": "4WD",
  "Rear-Wheel Drive (RWD)": "RWD",
  "Rear Wheel Drive": "RWD",
  "Rear-Wheel Drive": "RWD",
  RWD: "RWD",
};

const TITLE_STATUS_MAP: Record<string, string> = {
  Clean: "Clean Title",
  "Clean Title": "Clean Title",
  "Like New": "LIKE_NEW",
  Average: "AVERAGE",
  "Need Replacement": "NEED_REPLACEMENT",
  Rebuilt: "Rebuilt Title",
  "Rebuilt Title": "Rebuilt Title",
  Salvage: "Salvage Title",
  "Salvage Title": "Salvage Title",
  Lien: "Lien Title",
  "Lien Title": "Lien Title",
};

const MECHANICAL_MAP: Record<string, string> = {
  Excellent: "Excellent",
  Good: "Good",
  "Needs attention": "Needs Attention",
  "Needs Attention": "Needs Attention",
  "Non-runner": "Non-runner",
};

function resolveColor(c: ConditionDetailsValues): string {
  if (c.colorPreset === "custom") return c.customColor?.trim() || "Other";
  return c.colorPreset;
}

function buildApiPayload(
  vehicle: VehicleInfoValues = {} as VehicleInfoValues,
  condition: ConditionDetailsValues = {} as ConditionDetailsValues
): CreateVehicleListingRequest {
  const safeVin = (vehicle?.vin || "").trim();
  const safeYear = Number(vehicle?.year || new Date().getFullYear());
  const safeMake = (vehicle?.make || "Toyota").trim();
  const safeModel = (vehicle?.model || "Camry").trim();
  const safeTrim = (vehicle?.trim || "").trim();
  const safeMileage = Number(String(condition?.mileage || "0").replace(/,/g, ""));
  const safeColor = resolveColor(condition || {});
  
  const rawBodyType = condition?.bodyType || "Sedan";
  const safeBodyType = BODY_TYPE_MAP[rawBodyType] ?? (rawBodyType ? rawBodyType.toUpperCase() : "SEDAN");

  const rawOwnership = condition?.ownershipStatus || "Owned";
  const safeOwnership = OWNERSHIP_MAP[rawOwnership] ?? (rawOwnership ? rawOwnership.toUpperCase() : "OWNED");

  const rawTire = condition?.tireCondition || "Good";
  const safeTire = TIRE_MAP[rawTire] ?? (rawTire ? rawTire.toUpperCase() : "GOOD");

  const rawDrivetrain = condition?.drivetrain || "FWD";
  const safeDrivetrain = DRIVETRAIN_MAP[rawDrivetrain] ?? (rawDrivetrain ? rawDrivetrain.toUpperCase() : "FWD");

  const rawTitle = condition?.titleStatus || "Clean Title";
  const safeTitle = TITLE_STATUS_MAP[rawTitle] ?? rawTitle;

  const rawMechanical = condition?.mechanicalCondition || "Good";
  const safeMechanical = MECHANICAL_MAP[rawMechanical] ?? rawMechanical;

  return {
    registration_number: safeVin || "VIN123456789",
    year: safeYear,
    make: safeMake,
    model: safeModel,
    trim: safeTrim,
    mileage: safeMileage,
    color: safeColor || "Black",
    body_type: safeBodyType,
    ownership_status: safeOwnership,
    number_of_keys: Number(condition?.numberOfKeys || 1),
    tire_condition: safeTire,
    drivetrain: safeDrivetrain,
    has_accident_history: Boolean(condition?.accidentHistory),
    is_drivable: Boolean(condition?.drivable ?? true),
    description: condition?.shortDescription?.trim() || "Mint condition, fresh interior, single hand driven.",
    title_status: safeTitle,
    mechanical_condition: safeMechanical,
    options: condition?.features ?? [],
    payment_method_id: "pm_mock_12345",
  };
}

export function ListingFee({ formData, onBack }: ListingFeeProps) {
  const router = useRouter();
  const [createListing, { isLoading: isCreating }] = useCreateVehicleListingMutation();
  const [uploadImages, { isLoading: isUploading }] = useUploadListingImagesMutation();
  const isLoading = isCreating || isUploading;

  const pay = async () => {
    const body = buildApiPayload(formData.vehicle, formData.condition);

    try {
      const res = await createListing(body).unwrap();
      const listingId = res.id || res.listing?.id;

      if (listingId && formData.photos) {
        const hasFiles =
          Object.keys(formData.photos.slots).length > 0 ||
          formData.photos.extras.length > 0 ||
          formData.photos.video !== null;

        if (hasFiles) {
          const imageFormData = new FormData();
          Object.values(formData.photos.slots).forEach((file) => {
            if (file) imageFormData.append("images", file);
          });
          formData.photos.extras.forEach((file) => {
            imageFormData.append("images", file);
          });
          if (formData.photos.video) {
            imageFormData.append("video_file", formData.photos.video);
          }

          try {
            await uploadImages({ id: listingId, formData: imageFormData }).unwrap();
          } catch (uploadErr) {
            console.error("Failed to upload images:", uploadErr);
          }
        }
      }

      if (res.checkout_url) {
        toast.success("Redirecting to Stripe checkout payment…");
        window.location.href = res.checkout_url;
        return;
      }
      toast.success(res.message || "Vehicle listing created successfully!");
      setTimeout(() => {
        router.push(ROUTES.seller.dashboard);
      }, 1200);
    } catch (err: any) {
      let errorMsg = "Failed to create listing. Please try again.";
      if (err?.data) {
        const data = err.data;
        if (typeof data.detail === "string") {
          errorMsg = data.detail;
        } else if (typeof data.message === "string") {
          errorMsg = data.message;
        } else if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
          errorMsg = data.non_field_errors[0];
        } else {
          for (const key in data) {
            const val = data[key];
            if (Array.isArray(val) && val.length > 0) {
              errorMsg = `${key}: ${val[0]}`;
              break;
            } else if (typeof val === "string") {
              errorMsg = `${key}: ${val}`;
              break;
            }
          }
        }
      } else if (err?.message) {
        errorMsg = err.message;
      }
      toast.error(errorMsg);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">Listing Access Fee</h1>
        <span className="rounded-full bg-neutral-200 px-3 py-1 font-navbar text-xs font-medium text-[#5E5E5E]">
          Non-Refundable
        </span>
      </div>
      <p className="mt-2 max-w-2xl font-navbar text-sm text-[#5E5E5E] sm:text-base">
        This $4.95 Listing Access Fee gives you direct access to publish your vehicle to verified dealers across our platform.
      </p>

      <div className="mx-auto mt-8 w-full max-w-lg space-y-6 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8">
        <p className="font-hero-heading text-3xl font-bold text-[#FFA51F]">$4.95</p>

        <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
          <p className="font-navbar text-sm font-semibold text-violet-900">What you&apos;ll get:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 font-navbar text-sm text-violet-900">
            <li>Multiple offers from verified dealers</li>
            <li>Direct chat with winning dealer</li>
            <li>Free 24h re-list window if no initial offers are accepted</li>
          </ul>
        </div>

        <div>
          <p className="font-navbar text-sm font-medium text-[#1E1E1E]">Payment by card</p>
          <div className="mt-3 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#FFA51F]">
                  <CreditCard className="size-5 text-white" aria-hidden />
                </div>
                <div>
                  <p className="font-navbar text-sm font-bold text-[#1E1E1E]">Debit Card</p>
                  <p className="font-navbar text-xs text-[#5E5E5E]">Visa</p>
                  <p className="mt-1 font-mono text-xs text-[#1E1E1E]">**** **** **** 4245</p>
                </div>
              </div>
              <p className="font-navbar text-sm font-bold text-emerald-600">$5,666</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="cursor-pointer rounded-full bg-[#FFA51F] px-6 py-2 font-navbar text-sm font-semibold text-black hover:opacity-90"
              >
                Edit
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-full border border-red-300 bg-white p-2 text-red-600 hover:bg-red-50"
                aria-label="Remove card"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className={cn(
              "cursor-pointer rounded-xl border-2 border-[#FFA51F] px-6 py-3 font-navbar text-base font-semibold text-[#FFA51F]",
              "hover:bg-[#FFA51F]/10",
              isLoading && "cursor-not-allowed opacity-50"
            )}
          >
            Back
          </button>
          <button
            type="button"
            onClick={pay}
            disabled={isLoading}
            className={cn(
              "cursor-pointer rounded-xl bg-[#FFA51F] px-6 py-3 font-navbar text-base font-semibold text-white sm:min-w-[200px]",
              "hover:opacity-90",
              isLoading && "cursor-not-allowed opacity-60"
            )}
          >
            {isLoading ? "Publishing…" : "Pay & Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

