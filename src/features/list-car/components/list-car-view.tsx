import { CarDetailsStep } from "./car-details-step";
import { CarImagesStep } from "./car-images-step";
import { PricingStep } from "./pricing-step";
import { StepIndicator } from "./step-indicator";

export function ListCarView() {
  return (
    <>
      <StepIndicator />
      <CarDetailsStep />
      <CarImagesStep />
      <PricingStep />
    </>
  );
}
