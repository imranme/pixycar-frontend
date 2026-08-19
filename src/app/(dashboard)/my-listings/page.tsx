import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function LegacyMyListingsRedirect() {
  redirect(ROUTES.seller.myListings);
}
