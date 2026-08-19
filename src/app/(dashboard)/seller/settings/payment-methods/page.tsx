"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { PaymentCard, type SavedPaymentCard } from "@/components/seller/payment/payment-card";

const INITIAL_CARDS: SavedPaymentCard[] = [
  { id: 1, type: "Debit Card", brand: "Visa", last4: "4245", balance: "$5,666" },
];

export default function PaymentMethodsPage() {
  const [cards, setCards] = useState<SavedPaymentCard[]>(INITIAL_CARDS);

  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link
        href={ROUTES.seller.settings}
        className="inline-flex items-center gap-1 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:text-[#1E1E1E]"
      >
        <span aria-hidden>←</span>
        Back to Settings
      </Link>

      <h1 className="mt-6 font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">Payment Methods</h1>

      <div className="mt-8 flex flex-col gap-4">
        {cards.map((card) => (
          <PaymentCard key={card.id} card={card} onDelete={(id) => setCards((c) => c.filter((x) => x.id !== id))} />
        ))}
      </div>

      <Link
        href={ROUTES.seller.settingsAddPaymentCard}
        className="mt-6 flex w-full max-w-sm cursor-pointer items-center justify-center rounded-xl bg-[#FFA51F] py-3 font-navbar text-base font-bold text-[#1E1E1E] transition hover:bg-[#e8940f]"
      >
        Add More
      </Link>
    </div>
  );
}
