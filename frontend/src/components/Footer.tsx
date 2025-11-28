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

  const socialLinks = [
    {
      label: 'Facebook',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      label: 'Twitter',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
  ]

  return (
    <footer className="bg-ocean-deep text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">EEMB</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Department of Ecology, Evolution and Marine Biology at UC Santa Barbara.
            </p>
            <p className="text-white/70 text-sm leading-relaxed">
              University of California, Santa Barbara<br />
              Santa Barbara, CA 93106-9620
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-ucsb-gold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-ucsb-gold mb-4">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-ucsb-gold mb-4">Connect</h4>
            <div className="flex gap-4 mb-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-white/60 hover:text-white transition"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="text-white/70 text-sm">
              <a
                href="mailto:eemb@lifesci.ucsb.edu"
                className="hover:text-white transition"
              >
                eemb@lifesci.ucsb.edu
              </a>
              <br />
              (805) 893-3511
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            &copy; {new Date().getFullYear()} The Regents of the University of California. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-white/60 hover:text-white transition text-sm">
              Privacy Policy
            </Link>
            <Link href="/accessibility" className="text-white/60 hover:text-white transition text-sm">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
