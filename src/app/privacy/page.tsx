export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 font-navbar sm:px-6 lg:px-8">
      <h1 className="font-hero-heading text-3xl font-bold text-[#1E1E1E]">Privacy Policy</h1>
      <p className="mt-4 text-sm text-[#5E5E5E]">
        Your privacy is important to us. This policy explains how we collect and protect your information.
      </p>
      <div className="mt-8 space-y-6 text-sm text-[#1E1E1E]">
        <section>
          <h2 className="font-bold text-base text-[#1E1E1E]">1. Information Collection</h2>
          <p className="mt-2 text-[#5E5E5E]">
            We collect information you provide when creating an account, placing offers, or listing vehicles.
          </p>
        </section>
        <section>
          <h2 className="font-bold text-base text-[#1E1E1E]">2. Data Protection</h2>
          <p className="mt-2 text-[#5E5E5E]">
            We implement industry-standard security measures to safeguard your personal data.
          </p>
        </section>
      </div>
    </div>
  );
}
