import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function LegacyListCarRedirect() {
  redirect(ROUTES.seller.listCar);
}
