import { getFeaturedTestimonials } from '@/lib/data'
import TestimonialCarousel from './TestimonialCarousel'

export default async function TestimonialSection() {
  const testimonials = await getFeaturedTestimonials(5)

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-warm-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-ocean-deep mb-4">
            What Our Students Say
          </h2>
          <p className="text-warm-600 max-w-2xl mx-auto">
            Hear from current graduate students about their experiences in EEMB.
          </p>
        </div>
        <TestimonialCarousel testimonials={testimonials} />
      </div>
    </section>
  )
}
