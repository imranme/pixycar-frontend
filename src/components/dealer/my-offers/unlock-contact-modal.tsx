"use client";

type UnlockContactModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function UnlockContactModal({ open, onClose, onConfirm }: UnlockContactModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-pointer bg-black/50"
        onClick={() => {
          console.log("unlock contact modal: cancel (backdrop)");
          onClose();
        }}
      />
      <div className="relative z-[121] w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-center font-hero-heading text-lg font-bold text-[#1E1E1E] sm:text-xl">
          Unlock to Contact Seller
        </h2>

        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <ul className="list-inside list-disc space-y-1 font-navbar text-sm text-green-700 sm:text-base">
            <li>Direct Messaging</li>
            <li>Contact Information</li>
            <li>Location Details</li>
          </ul>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => {
              console.log("unlock contact modal: cancel");
              onClose();
            }}
            className="flex-1 cursor-pointer rounded-xl border-2 border-[#FFA51F] py-3 font-navbar text-sm font-bold text-[#FFA51F] transition hover:bg-amber-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              console.log("unlock contact modal: confirm");
              onConfirm();
            }}
            className="flex-1 cursor-pointer rounded-xl bg-[#FFA51F] py-3 font-navbar text-sm font-bold text-[#1E1E1E] transition hover:bg-[#e8940f]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
