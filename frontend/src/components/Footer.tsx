import Link from 'next/link'

export default function Footer() {
  const quickLinks = [
    { href: '/people', label: 'Faculty Directory' },
    { href: '/research', label: 'Research Areas' },
    { href: '/academics', label: 'Graduate Program' },
    { href: '/dei', label: 'Diversity & Inclusion' },
    { href: '/memoriam', label: 'In Memoriam' },
  ]

  const resourceLinks = [
    { href: '/academics', label: 'Apply' },
    { href: '/calendar', label: 'Events Calendar' },
    { href: '/news', label: 'News & Updates' },
    { href: '/good-news', label: 'Good News' },
    { href: '/contact', label: 'Contact Us' },
  ]

  // TODO: Update with actual EEMB social media URLs when available
  const socialLinks = [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/uaboreal',  // Placeholder - update with EEMB Facebook
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      label: 'X (Twitter)',
      href: 'https://twitter.com/UCSB',  // Placeholder - update with EEMB Twitter
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/school/uc-santa-barbara/',  // Placeholder - update with EEMB LinkedIn
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@UCSantaBarbara',  // Placeholder - update with EEMB YouTube
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
  ]

  return (
    <footer className="relative bg-ocean-midnight text-white overflow-hidden">
      {/* Decorative wave transition */}
      <div className="absolute -top-px left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
          <path d="M0 80V40C240 60 480 80 720 60C960 40 1200 20 1440 40V80H0Z" className="fill-ocean-midnight" />
        </svg>
      </div>

      {/* Background elements */}
      <div className="absolute inset-0 topo-pattern opacity-[0.03]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-bioluminescent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-7xl py-20 md:py-24 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <span className="font-heading text-xl font-bold text-white">E</span>
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold tracking-tight">EEMB</h3>
                <p className="text-[10px] text-white/40 tracking-wider uppercase">UC Santa Barbara</p>
              </div>
            </div>

            <p className="text-white/60 text-sm leading-relaxed mb-2">
              Department of Ecology, Evolution & Marine Biology
            </p>
            <p className="text-bioluminescent/80 text-sm font-medium italic mb-6">
              Research that matters for the future of life on Earth.
            </p>

            <div className="text-white/40 text-sm space-y-1">
              <p>University of California, Santa Barbara</p>
              <p>Santa Barbara, CA 93106-9620</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-bioluminescent mb-6 text-sm tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-ocean-teal/40 rounded-full group-hover:bg-bioluminescent transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading font-semibold text-bioluminescent mb-6 text-sm tracking-wider uppercase">
              Resources
            </h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-ocean-teal/40 rounded-full group-hover:bg-bioluminescent transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-heading font-semibold text-bioluminescent mb-6 text-sm tracking-wider uppercase">
              Connect
            </h4>

            {/* Social links */}
            <div className="flex gap-3 mb-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 text-white/50 hover:bg-bioluminescent/20 hover:text-bioluminescent transition-all duration-300 border border-white/10 hover:border-bioluminescent/30"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Contact info */}
            <div className="space-y-3">
              <a
                href="mailto:eemb@lifesci.ucsb.edu"
                className="text-white/60 hover:text-white transition-colors duration-300 text-sm flex items-center gap-3 group"
              >
                <svg className="w-5 h-5 text-ocean-teal/60 group-hover:text-bioluminescent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                eemb@lifesci.ucsb.edu
              </a>
              <a
                href="tel:+18058933511"
                className="text-white/60 hover:text-white transition-colors duration-300 text-sm flex items-center gap-3 group"
              >
                <svg className="w-5 h-5 text-ocean-teal/60 group-hover:text-bioluminescent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (805) 893-3511
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} The Regents of the University of California. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="https://www.policy.ucsb.edu/terms-of-use/privacy-notification" className="text-white/40 hover:text-white/70 transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="https://www.ucsb.edu/accessibility" className="text-white/40 hover:text-white/70 transition-colors text-sm">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
