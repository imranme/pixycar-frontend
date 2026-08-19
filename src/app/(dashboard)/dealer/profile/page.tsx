import { Suspense } from "react";
import { DealerProfilePageClient } from "@/components/dealer/profile/dealer-profile-page-client";

export default function DealerProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl flex-1 px-4 py-10 font-navbar text-sm text-[#5E5E5E]">Loading…</div>
      }
    >
      <DealerProfilePageClient />
    </Suspense>
  );
}
