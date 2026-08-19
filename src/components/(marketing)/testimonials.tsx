import { FaStar } from "react-icons/fa";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  review: string;
};

const DUMMY_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Maruf M",
    role: "Private Seller",
    review:
      "Got 6 offers in under an hour. Sold my BMW for $2,000 above what I expected. The process was seamless.",
  },
  {
    id: "2",
    name: "Maruf M",
    role: "Private Seller",
    review:
      "Got 6 offers in under an hour. Sold my BMW for $2,000 above what I expected. The process was seamless.",
  },
  {
    id: "3",
    name: "Maruf M",
    role: "Private Seller",
    review:
      "Got 6 offers in under an hour. Sold my BMW for $2,000 above what I expected. The process was seamless.",
  },
];

function StarRow() {
  return (
    <div className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar key={i} className="size-5 shrink-0 text-[#FDC700]" />
      ))}
    </div>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-6">
      <StarRow />
      <blockquote className="mt-4 font-navbar text-base font-normal leading-relaxed text-[#5E5E5E]">
        &ldquo;{item.review}&rdquo;
      </blockquote>
      <footer className="mt-6">
        <p className="font-navbar text-base font-bold text-[#1E1E1E]">
          {item.name}
        </p>
        <p className="mt-0.5 font-navbar text-base font-normal text-[#5E5E5E]">
          {item.role}
        </p>
      </footer>
    </article>
  );
}

export interface TestimonialsProps {
  id?: string;
}

export function Testimonials({ id }: TestimonialsProps) {
  return (
    <section id={id} className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-screen-2xl px-3 sm:px-4 lg:px-6">
        <h2 className="text-center font-hero-heading text-[32px] font-semibold leading-tight tracking-tight text-[#1E1E1E]">
          Trusted by Thousands
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {DUMMY_TESTIMONIALS.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
