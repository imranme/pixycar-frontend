"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { TermsModal } from "@/components/auth/terms-modal";
import { DealerForm } from "@/components/auth/sign-up/dealer-form";
import { OtpVerification } from "@/components/auth/sign-up/otp-verification";
import { SuccessSeller } from "@/components/auth/sign-up/success-seller";
import { useRegisterDealer } from "@/features/auth/hooks/use-sign-up";
import { useVerifyOtp } from "@/features/auth/hooks/use-verify-otp";
import { useVerifyDealerInviteQuery } from "@/store/features/auth/authApi";
import type { DealerSignUpInput } from "@/components/auth/sign-up/sign-up-schemas";
import { AlertCircle, Loader2, X } from "lucide-react";

type Step = 1 | 2 | 3;

function DealerInviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const { data: inviteData, isLoading: isVerifyingInvite, isError: isInviteError } =
    useVerifyDealerInviteQuery(token, { skip: !token });

  const [step, setStep] = useState<Step>(1);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const [apiError, setApiError] = useState<string | null>(null);

  const setAgreedRef = useRef<(value: boolean) => void>(() => {});
  const pendingDealerDataRef = useRef<DealerSignUpInput | null>(null);

  const { mutate: registerDealer, isPending: isRegistering } = useRegisterDealer();
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

  const beginDealerSignUpTermsGate = useCallback((data: DealerSignUpInput) => {
    pendingDealerDataRef.current = data;
    setShowPrivacyModal(false);
    setShowTermsModal(true);
    setApiError(null);
  }, []);

  const closeLegalModals = () => {
    setShowTermsModal(false);
    setShowPrivacyModal(false);
  };

  const handleLegalCancel = () => {
    pendingDealerDataRef.current = null;
    setAgreedRef.current(false);
    closeLegalModals();
  };

  const handleLegalConfirm = () => {
    setAgreedRef.current(true);
    closeLegalModals();

    const dealerData = pendingDealerDataRef.current;
    if (dealerData) {
      pendingDealerDataRef.current = null;
      setApiError(null);
      registerDealer(
        {
          invite_token: token || undefined,
          email: inviteData?.email || dealerData.businessEmail,
          password: dealerData.password,
          confirm_password: dealerData.confirmPassword,
          business_name: dealerData.businessName,
          business_email: dealerData.businessEmail,
          business_phone: dealerData.businessPhone,
          business_address: dealerData.address,
          zip_code: dealerData.zip,
          dealer_license_number: dealerData.licenseNumber,
        },
        {
          onSuccess: (response) => {
            setRegisteredEmail(response.user.email);
            setStep(2);
          },
          onError: (error: Error) => setApiError(error.message),
        }
      );
    }
  };

  if (!token) {
    return (
      <AuthLayout>
        <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
          <AlertCircle className="mx-auto size-8 text-red-600" />
          <h2 className="mt-3 font-hero-heading text-lg font-bold text-red-900">Missing Invite Token</h2>
          <p className="mt-1 font-navbar text-sm text-red-700">
            Please use a valid dealer invitation link to register.
          </p>
        </div>
      </AuthLayout>
    );
  }

  if (isVerifyingInvite) {
    return (
      <AuthLayout>
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
          <Loader2 className="size-8 animate-spin text-[#FFA51F]" />
          <p className="font-navbar text-sm text-[#5E5E5E]">Verifying dealer invitation link…</p>
        </div>
      </AuthLayout>
    );
  }

  if (isInviteError || (inviteData && !inviteData.valid)) {
    return (
      <AuthLayout>
        <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
          <AlertCircle className="mx-auto size-8 text-red-600" />
          <h2 className="mt-3 font-hero-heading text-lg font-bold text-red-900">Invalid or Expired Invite</h2>
          <p className="mt-1 font-navbar text-sm text-red-700">
            {(inviteData as any)?.message || "This dealer invitation link is invalid or has expired."}
          </p>
        </div>
      </AuthLayout>
    );
  }

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
        <DealerForm
          initialEmail={inviteData?.email || ""}
          registerAgreementSetter={registerAgreementSetter}
          onOpenTerms={() => {
            setShowPrivacyModal(false);
            setShowTermsModal(true);
          }}
          onOpenPrivacy={() => {
            setShowTermsModal(false);
            setShowPrivacyModal(true);
          }}
          onSignUpComplete={beginDealerSignUpTermsGate}
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

export default function DealerInvitePage() {
  return (
    <Suspense
      fallback={
        <AuthLayout>
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
            <Loader2 className="size-8 animate-spin text-[#FFA51F]" />
            <p className="font-navbar text-sm text-[#5E5E5E]">Loading…</p>
          </div>
        </AuthLayout>
      }
    >
      <DealerInviteContent />
    </Suspense>
  );
}
