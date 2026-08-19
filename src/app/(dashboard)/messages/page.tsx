import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function LegacyMessagesRedirect() {
  redirect(ROUTES.seller.messages);
}
