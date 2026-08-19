"use client";

import { useCallback, useRef, useState } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { TermsModal } from "@/components/auth/terms-modal";
import { SellerForm } from "@/components/auth/sign-up/seller-form";
import { OtpVerification } from "@/components/auth/sign-up/otp-verification";
import { SuccessSeller } from "@/components/auth/sign-up/success-seller";
import { useRegisterSeller } from "@/features/auth/hooks/use-sign-up";
import { useVerifyOtp } from "@/features/auth/hooks/use-verify-otp";
import type { SellerSignUpInput } from "@/components/auth/sign-up/sign-up-schemas";
import { AlertCircle, X } from "lucide-react";

// Step 1 = Seller form, Step 2 = OTP verification, Step 3 = Success
type Step = 1 | 2 | 3;

export default function SignUpPage() {
  const [step, setStep] = useState<Step>(1);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const [apiError, setApiError] = useState<string | null>(null);

  const setAgreedRef = useRef<(value: boolean) => void>(() => {});
  const pendingSellerDataRef = useRef<SellerSignUpInput | null>(null);
  const pendingAdvanceRef = useRef<(() => void) | null>(null);

  const { mutate: registerSeller, isPending: isRegistering } = useRegisterSeller();
  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();

  const handleOtpVerify = useCallback(
    (code: string) => {
      setApiError(null);
      verifyOtp(
        { email: registeredEmail, otp: code },
        {
          onSuccess: () => setStep(3),
          onError: (error: Error) => setApiError(error.message),
        }
      );
    },
    [verifyOtp, registeredEmail]
  );

  const registerAgreementSetter = useCallback((setter: (value: boolean) => void) => {
    setAgreedRef.current = setter;
  }, []);

  const beginSellerSignUpTermsGate = useCallback((data: SellerSignUpInput) => {
    pendingSellerDataRef.current = data;
    pendingAdvanceRef.current = null;
    setShowPrivacyModal(false);
    setShowTermsModal(true);
    setApiError(null);
  }, []);

  const closeLegalModals = () => {
    setShowTermsModal(false);
    setShowPrivacyModal(false);
  };

  const handleLegalCancel = () => {
    pendingAdvanceRef.current = null;
    pendingSellerDataRef.current = null;
    setAgreedRef.current(false);
    closeLegalModals();
  };

  const handleLegalConfirm = () => {
    setAgreedRef.current(true);
    closeLegalModals();

    const sellerData = pendingSellerDataRef.current;
    if (sellerData) {
      pendingSellerDataRef.current = null;
      setApiError(null);
      registerSeller(
        {
          email: sellerData.email,
          password: sellerData.password,
          confirm_password: sellerData.confirmPassword,
          name: sellerData.fullName,
          phone: sellerData.phone,
          address: sellerData.address,
          zip_code: sellerData.zip,
        },
        {
          onSuccess: (response) => {
            setRegisteredEmail(response.user.email);
            setStep(2);
          },
          onError: (error: Error) => setApiError(error.message),
        }
      );
      return;
    }

    const run = pendingAdvanceRef.current;
    pendingAdvanceRef.current = null;
    run?.();
  };

  const legalModalOpen = showTermsModal || showPrivacyModal;
  const legalModalTitle = showPrivacyModal ? "Privacy Policy" : "Terms of Use";

  return (
    <AuthLayout>
      <TermsModal
        open={legalModalOpen}
        title={legalModalTitle}
        onCancel={handleLegalCancel}
        onConfirm={handleLegalConfirm}
      />

      {apiError && (
        <div className="mb-4 flex w-full max-w-lg items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
          <span className="flex-1 font-navbar leading-relaxed">{apiError}</span>
          <button
            type="button"
            onClick={() => setApiError(null)}
            className="shrink-0 rounded p-0.5 hover:bg-red-100"
            aria-label="Dismiss error"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {step === 1 && (
        <SellerForm
          registerAgreementSetter={registerAgreementSetter}
          onOpenTerms={() => {
            pendingAdvanceRef.current = null;
            setShowPrivacyModal(false);
            setShowTermsModal(true);
          }}
          onOpenPrivacy={() => {
            pendingAdvanceRef.current = null;
            setShowTermsModal(false);
            setShowPrivacyModal(true);
          }}
          onRequestTermsBeforeComplete={beginSellerSignUpTermsGate}
          isLoading={isRegistering}
        />
      )}

      {step === 2 && (
        <OtpVerification
          email={registeredEmail}
          onContinue={handleOtpVerify}
          isLoading={isVerifying}
        />
      )}

      {step === 3 && <SuccessSeller />}
    </AuthLayout>
  );
}

