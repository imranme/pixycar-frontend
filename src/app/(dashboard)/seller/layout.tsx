import { SellerNavbar } from "@/components/layout/dashboard-topbar/seller-navbar";

export default function SellerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SellerNavbar />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
