"use client";

import { use } from "react";
import { PayUnlockPageClient } from "@/components/dealer/my-offers/pay-unlock-page-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function DealerPayUnlockPage({ params }: PageProps) {
  const { id } = use(params);
  return <PayUnlockPageClient listingId={id} />;
}
