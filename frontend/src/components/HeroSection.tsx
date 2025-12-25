'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Rotating headlines that showcase the breadth of the department
const headlines = [
  { text: "Kelp forests", color: "text-bioluminescent" },
  { text: "Coral reefs", color: "text-sunset-400" },
  { text: "Evolutionary origins", color: "text-ucsb-gold" },
  { text: "Ecosystem dynamics", color: "text-kelp-400" },
  { text: "Climate adaptation", color: "text-ocean-light" },
]

// Floating organic shapes for visual interest
function FloatingOrb({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-30 animate-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  )
}

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [scrollY, setScrollY] = useState(0)

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Rotating text
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % headlines.length)
        setIsVisible(true)
      }, 400)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-ocean-midnight">
      {/* Parallax Background Image */}
      <div
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <Image
          src="/images/about/kelp-banner.jpg"
          alt="Giant kelp forest in the Santa Barbara Channel"
          fill
          className="object-cover scale-110"
          priority
        />
      </div>

      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ocean-midnight via-ocean-midnight/70 to-ocean-midnight/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-ocean-midnight/80 via-transparent to-transparent" />

      {/* Animated organic shapes - bioluminescent accents */}
      <FloatingOrb className="w-[600px] h-[600px] bg-bioluminescent/20 -top-40 -right-40" delay={0} />
      <FloatingOrb className="w-[400px] h-[400px] bg-ocean-teal/30 bottom-20 -left-32" delay={2} />
      <FloatingOrb className="w-[300px] h-[300px] bg-ucsb-gold/20 top-1/3 right-1/4" delay={4} />

      {/* Topographic pattern overlay */}
      <div className="absolute inset-0 topo-pattern opacity-20" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-5 sm:px-6 lg:px-8 py-24 md:py-32 max-w-7xl">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-8 animate-fade-in">
            <div className="h-px w-12 bg-gradient-to-r from-bioluminescent to-transparent" />
            <p className="text-bioluminescent font-medium text-sm tracking-[0.2em] uppercase">
              UC Santa Barbara
            </p>
          </div>

          {/* Main headline with rotating element */}
          <h1 className="font-heading text-display-xl font-bold mb-6 text-white tracking-tight animate-fade-in-up">
            <span className="block">We study</span>
            <span
              className={`inline-block min-h-[1.2em] transition-all duration-500 ease-spring ${headlines[currentIndex].color} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
            >
              {headlines[currentIndex].text}
            </span>
          </h1>

          {/* Department name */}
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-medium text-white/70 mb-8 animate-fade-in-up delay-100">
            Department of Ecology, Evolution
            <br className="hidden sm:block" />
            <span className="text-white/50">&</span> Marine Biology
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-12 text-white/60 leading-relaxed max-w-2xl animate-fade-in-up delay-200">
            Where the Santa Ynez Mountains meet the Pacific, we ask questions that matter—about life's origins, ecosystem health, and the future of our planet.
          </p>

          {/* Stats - horizontal, glowing */}
          <div className="flex flex-wrap gap-8 md:gap-12 mb-12 pb-12 border-b border-white/10 animate-fade-in-up delay-300">
            <div className="group">
              <span className="block text-4xl md:text-5xl font-heading font-bold text-white group-hover:text-bioluminescent transition-colors">
                25
              </span>
              <span className="text-white/40 text-sm tracking-wide">Faculty</span>
            </div>
            <div className="group">
              <span className="block text-4xl md:text-5xl font-heading font-bold text-white group-hover:text-bioluminescent transition-colors">
                100+
              </span>
              <span className="text-white/40 text-sm tracking-wide">Graduate Students</span>
            </div>
            <div className="group">
              <span className="block text-4xl md:text-5xl font-heading font-bold text-white group-hover:text-bioluminescent transition-colors">
                2
              </span>
              <span className="text-white/40 text-sm tracking-wide">NSF LTER Sites</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-4 flex-wrap animate-fade-in-up delay-400">
            <Link
              href="/research"
              className="group relative bg-ucsb-gold text-ocean-deep px-8 py-4 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-500 hover:shadow-glow-gold focus:ring-2 focus:ring-ucsb-gold focus:ring-offset-2 focus:ring-offset-ocean-midnight focus:outline-none"
            >
              <span className="relative z-10 flex items-center gap-3">
                Explore Our Research
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-ucsb-gold to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link
              href="/people"
              className="group text-white px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-white/30 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ocean-midnight focus:outline-none"
            >
              <span className="flex items-center gap-3">
                Meet Our Faculty
                <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Photo credit - subtle */}
      <p className="absolute bottom-6 right-6 text-white/20 text-xs font-light z-10">
        <span className="italic">Macrocystis pyrifera</span> · Santa Barbara Channel
      </p>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Wave transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
          <path d="M0 120V60C240 20 480 0 720 20C960 40 1200 80 1440 60V120H0Z" className="fill-warm-50" />
        </svg>
      </div>
    </section>
  )
}
