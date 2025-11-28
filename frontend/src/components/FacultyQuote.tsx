import Image from 'next/image'

export default function FacultyQuote() {
  return (
    <section className="py-16 bg-ocean-deep text-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Quote */}
          <div className="flex-1">
            <svg className="w-10 h-10 text-ocean-coral/60 mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
            <blockquote className="text-xl md:text-2xl font-light leading-relaxed mb-6">
              EEMB gave me the freedom to follow my curiosity wherever it led—from the lab to the field, from local tide pools to remote Pacific atolls. The collaborative spirit here is genuine.
            </blockquote>
            <div>
              <p className="font-bold text-lg">Dr. Holly Moeller</p>
              <p className="text-white/70">Associate Professor · Microbial Ecology</p>
            </div>
          </div>

          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white/20">
              <Image
                src="/uploads/faculty/holly-moeller-976.jpg"
                alt="Dr. Holly Moeller"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
