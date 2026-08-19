"use client";

import { useState } from "react";
import { ConditionDetails } from "@/components/seller/list-car/condition-details";
import { ListingFee, type FullListingPayload } from "@/components/seller/list-car/listing-fee";
import { ReviewPublish } from "@/components/seller/list-car/review-publish";
import { StepIndicator } from "@/components/seller/list-car/step-indicator";
import type { ConditionDetailsValues } from "@/components/seller/list-car/schemas";
import type { PhotosFormValues } from "@/components/seller/list-car/schemas";
import type { VehicleInfoValues } from "@/components/seller/list-car/schemas";
import { UploadPhotos } from "@/components/seller/list-car/upload-photos";
import { VehicleInfo } from "@/components/seller/list-car/vehicle-info";

const emptyPhotos: PhotosFormValues = { slots: {}, extras: [], video: null };

type Step = 1 | 2 | 3 | 4 | 5;

export default function ListCarPage() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<{
    vehicle: VehicleInfoValues | null;
    condition: ConditionDetailsValues | null;
    photos: PhotosFormValues | null;
  }>({
    vehicle: null,
    condition: null,
    photos: null,
  });

  const fullPayload: FullListingPayload | null =
    formData.vehicle && formData.condition && formData.photos
      ? { vehicle: formData.vehicle, condition: formData.condition, photos: formData.photos }
      : null;

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <StepIndicator appStep={step} />

      <div className="mt-8">
        {step === 1 && (
          <VehicleInfo
            defaultValues={formData.vehicle}
            onContinue={(data) => {
              setFormData((p) => ({ ...p, vehicle: data }));
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <ConditionDetails
            defaultValues={formData.condition}
            onBack={() => setStep(1)}
            onContinue={(data) => {
              setFormData((p) => ({ ...p, condition: data }));
              setStep(3);
            }}
          />
        )}

        {step === 3 && (
          <UploadPhotos
            initial={formData.photos ?? emptyPhotos}
            onBack={() => setStep(2)}
            onContinue={(data) => {
              setFormData((p) => ({ ...p, photos: data }));
              setStep(4);
            }}
          />
        )}

        {step === 4 && fullPayload && (
          <ReviewPublish
            vehicle={fullPayload.vehicle}
            condition={fullPayload.condition}
            photos={fullPayload.photos}
            onBack={() => setStep(3)}
            onEditVehicle={() => setStep(1)}
            onPublish={() => setStep(5)}
          />
        )}

        {step === 5 && fullPayload && <ListingFee formData={fullPayload} onBack={() => setStep(4)} />}
      </div>
    </div>
  );
}
