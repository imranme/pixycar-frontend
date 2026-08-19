import { z } from "zod";

export const vehicleInfoSchema = z.object({
  vin: z.string().trim().min(3, "VIN or registration number must be at least 3 characters"),
  year: z.string().trim().regex(/^\d{4}$/, "Enter a valid 4-digit year"),
  make: z.string().trim().min(1, "Make is required"),
  model: z.string().trim().min(1, "Model is required"),
  trim: z.string().trim().min(1, "Trim is required"),
});

export type VehicleInfoValues = z.infer<typeof vehicleInfoSchema>;

export const TRIM_OPTIONS = ["LX", "Sport", "EX-L", "Touring", "F EX Package", "LE", "SE"] as const;

export const conditionDetailsSchema = z.object({
  mileage: z.string().trim().min(1, "Mileage is required"),
  colorPreset: z.enum(["Black", "White", "Pearl White", "Gray", "Silver", "Blue", "Red", "custom"]),
  customColor: z.string().optional(),
  titleStatus: z.string().min(1, "Title status is required"),
  bodyType: z.string().min(1, "Body type is required"),
  drivetrain: z.string().min(1, "Drivetrain is required"),
  features: z.array(z.string()).min(1, "Select at least one option"),
  mechanicalCondition: z.string().min(1, "Mechanical condition is required"),
  ownershipStatus: z.string().min(1, "Ownership status is required"),
  numberOfKeys: z.enum(["1", "2", "3", "4"]),
  tireCondition: z.string().min(1, "Tire condition is required"),
  drivable: z.boolean(),
  accidentHistory: z.boolean(),
  shortDescription: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.colorPreset === "custom" && !data.customColor?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Enter your custom color",
      path: ["customColor"],
    });
  }
});

export type ConditionDetailsValues = z.infer<typeof conditionDetailsSchema>;

export const PHOTO_SLOT_KEYS = [
  "front",
  "rear",
  "driver",
  "passenger",
  "interiorFront",
  "interiorRear",
  "dashboard",
  "engine",
] as const;

export type PhotoSlotKey = (typeof PHOTO_SLOT_KEYS)[number];

export const PHOTO_SLOT_LABELS: Record<PhotoSlotKey, string> = {
  front: "Front View*",
  rear: "Rear View*",
  driver: "Driver Side*",
  passenger: "Passenger Side*",
  interiorFront: "Interior - Front Seats*",
  interiorRear: "Interior - Rear Seats*",
  dashboard: "Dashboard*",
  engine: "Engine Bay*",
};

export type PhotosFormValues = {
  slots: Partial<Record<PhotoSlotKey, File>>;
  extras: File[];
  video: File | null;
};

export const reviewPublishSchema = z
  .object({
    owner: z.boolean(),
    accurate: z.boolean(),
    noGuarantee: z.boolean(),
    dealersContact: z.boolean(),
    terms: z.boolean(),
  })
  .refine((d) => d.owner && d.accurate && d.noGuarantee && d.dealersContact && d.terms, {
    message: "Please confirm all items before publishing",
    path: ["owner"],
  });

export type ReviewPublishValues = z.infer<typeof reviewPublishSchema>;
