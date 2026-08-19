import { OfferFeePage } from "@/components/dealer/offer/offer-fee-page";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DealerOfferFeePage({ params }: PageProps) {
  const { id } = await params;
  return <OfferFeePage listingId={id} />;
}
