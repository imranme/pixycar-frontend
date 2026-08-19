import type { Metadata } from "next";
import { ListingDetailView } from "@/features/listings/components/listing-detail-view";

export const metadata: Metadata = {
  title: "Listing Details",
  description: "View full details of this marketplace listing on Pixycar.",
};

export default function BrowseListingDetailPage() {
  return <ListingDetailView />;
}
