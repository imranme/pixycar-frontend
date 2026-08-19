"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { PaymentCard, type SavedPaymentCard } from "@/components/seller/payment/payment-card";

const INITIAL_CARDS: SavedPaymentCard[] = [
  { id: 1, type: "Debit Card", brand: "Visa", last4: "4245", balance: "$5,666" },
];

export default function DealerPaymentMethodsPage() {
  const [cards, setCards] = useState<SavedPaymentCard[]>(INITIAL_CARDS);

  return (
    <div className="mx-auto w-full max-w-sm flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Link
        href={ROUTES.dealer.settings}
        className="inline-flex items-center gap-1 font-navbar text-sm font-medium text-[#5E5E5E] transition hover:text-[#1E1E1E]"
      >
        <span aria-hidden>←</span>
        Back to Settings
      </Link>

      <h1 className="mt-6 font-hero-heading text-2xl font-bold text-[#1E1E1E] sm:text-3xl">Payment Methods</h1>

      <div className="mt-8 flex flex-col gap-4">
        {cards.map((card) => (
          <PaymentCard
            key={card.id}
            card={card}
            editHref={ROUTES.dealer.settingsAddPaymentCard}
            onDelete={(id) => {
              console.log("delete payment card", id);
              setCards((c) => c.filter((x) => x.id !== id));
            }}
          />
        ))}
      </div>

      <Link
        href={ROUTES.dealer.settingsAddPaymentCard}
        onClick={() => console.log("add more payment methods")}
        className="mt-6 flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#FFA51F] py-3 font-navbar text-base font-bold text-[#1E1E1E] transition hover:bg-[#e8940f]"
      >
        Add More
      </Link>
    </div>
  );
}
