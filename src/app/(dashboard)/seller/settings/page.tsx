import { SettingsMenu } from "@/components/seller/settings/settings-menu";

export default function SellerSettingsPage() {
  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <h1 className="font-hero-heading text-[28px] font-bold leading-tight text-[#1E1E1E]">Settings</h1>
      <div className="mt-8">
        <SettingsMenu />
      </div>
    </div>
  );
}
