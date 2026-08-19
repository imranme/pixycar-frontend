import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { AddCardForm } from "@/components/seller/payment/add-card-form";

export default function AddPaymentCardPage() {
  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link
        href={ROUTES.seller.settingsPaymentMethods}
        className="inline-flex items-center gap-1 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:text-[#1E1E1E]"
      >
        <span aria-hidden>←</span>
        Back to Payment Methods
      </Link>

      <h1 className="mt-6 font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">Add Debit Card</h1>

      <AddCardForm />
    </div>
  );
}
