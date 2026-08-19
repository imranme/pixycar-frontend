import { DealerNavbar } from "@/components/layout/dealer-navbar";

export default function DealerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DealerNavbar />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
