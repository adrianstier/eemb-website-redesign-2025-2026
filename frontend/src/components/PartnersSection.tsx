export default function PartnersSection() {
  const partners = [
    { name: 'Marine Science Institute', url: 'https://msi.ucsb.edu' },
    { name: 'NCEAS', url: 'https://www.nceas.ucsb.edu' },
    { name: 'SB Coastal LTER', url: 'https://sbclter.msi.ucsb.edu' },
    { name: 'Moorea Coral Reef LTER', url: 'https://mcr.lternet.edu' },
    { name: 'Bren School', url: 'https://bren.ucsb.edu' },
    { name: 'Channel Islands NMS', url: 'https://channelislands.noaa.gov' },
  ]

  return (
    <section className="py-10 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <p className="text-gray-500 font-medium text-sm">
            Affiliated with:
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {partners.map((partner, index) => (
              <a
                key={index}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-ocean-blue transition-colors text-sm whitespace-nowrap"
              >
                {partner.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
