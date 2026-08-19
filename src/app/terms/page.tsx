export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 font-navbar sm:px-6 lg:px-8">
      <h1 className="font-hero-heading text-3xl font-bold text-[#1E1E1E]">Terms of Service</h1>
      <p className="mt-4 text-sm text-[#5E5E5E]">
        Welcome to PixyCar. By using our services, you agree to these terms and conditions.
      </p>
      <div className="mt-8 space-y-6 text-sm text-[#1E1E1E]">
        <section>
          <h2 className="font-bold text-base text-[#1E1E1E]">1. Acceptance of Terms</h2>
          <p className="mt-2 text-[#5E5E5E]">
            By accessing or using our marketplace platform, you agree to comply with and be bound by these terms.
          </p>
        </section>
        <section>
          <h2 className="font-bold text-base text-[#1E1E1E]">2. Vehicle Listings & Bidding</h2>
          <p className="mt-2 text-[#5E5E5E]">
            Sellers are responsible for providing accurate vehicle information. Bids and offers placed by dealers are subject to seller approval.
          </p>
        </section>
      </div>
    </div>
  );
}
