import Link from "next/link";
import { CreditCard, Trash2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export type SavedPaymentCard = {
  id: number;
  type: string;
  brand: string;
  last4: string;
  balance: string;
};

type PaymentCardProps = {
  card: SavedPaymentCard;
  onDelete: (id: number) => void;
  editHref?: string;
  onEditClick?: () => void;
};

export function PaymentCard({ card, onDelete, editHref, onEditClick }: PaymentCardProps) {
  const href = editHref ?? ROUTES.seller.settingsAddPaymentCard;
  return (
    <div className="w-full max-w-sm rounded-2xl border-2 border-green-400 bg-green-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FFA51F]">
          <CreditCard className="size-5 text-white" strokeWidth={2} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-navbar text-base font-bold text-[#1E1E1E]">{card.type}</p>
          <p className="mt-0.5 font-navbar text-sm text-[#5E5E5E]">{card.brand}</p>
          <p className="font-navbar text-sm text-[#5E5E5E]">**** **** **** {card.last4}</p>
        </div>
        <p className="shrink-0 font-navbar text-base font-bold text-emerald-600">{card.balance}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          href={href}
          onClick={() => {
            console.log("edit payment card", card.id);
            onEditClick?.();
          }}
          className="flex flex-1 cursor-pointer items-center justify-center rounded-xl bg-[#FFA51F] py-2 text-center font-navbar text-sm font-bold text-[#1E1E1E] transition hover:bg-[#e8940f]"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={() => {
            console.log("delete card", card.id);
            onDelete(card.id);
          }}
          className="flex shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-[#FFA51F] bg-white px-3 py-2 text-red-600 transition hover:bg-amber-50"
          aria-label="Delete card"
        >
          <Trash2 className="size-5 text-red-500" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
