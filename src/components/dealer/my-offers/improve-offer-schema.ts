import { z } from "zod";

function parseMoneyInput(value: string): number {
  const raw = value.replace(/[$,\s]/g, "").trim();
  const n = Number(raw);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function createImproveOfferSchema(currentOffer: number, minIncrement: number) {
  const minAllowed = currentOffer + minIncrement;
  return z.object({
    amount: z.string().min(1, "Enter an amount"),
  }).superRefine((data, ctx) => {
    const n = parseMoneyInput(data.amount);
    if (Number.isNaN(n)) {
      ctx.addIssue({ code: "custom", message: "Enter a valid number", path: ["amount"] });
      return;
    }
    if (n < minAllowed) {
      ctx.addIssue({
        code: "custom",
        message: `Amount must be at least $${minAllowed.toLocaleString("en-US")} (minimum increment $${minIncrement.toLocaleString("en-US")})`,
        path: ["amount"],
      });
    }
  });
}

export type ImproveOfferFormValues = z.infer<ReturnType<typeof createImproveOfferSchema>>;
