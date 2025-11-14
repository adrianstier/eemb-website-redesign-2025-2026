export default function QuickLinks() {
  const links = [
    {
      title: 'Faculty Directory',
      description: 'Meet our world-class researchers and educators',
      icon: '👥',
      href: '/faculty'
    },
    {
      title: 'Graduate Programs',
      description: 'Explore our PhD and Masters programs',
      icon: '🎓',
      href: '/academics'
    },
    {
      title: 'Research Areas',
      description: 'Discover our cutting-edge research',
      icon: '🔬',
      href: '/research'
    },
    {
      title: 'Alumni Network',
      description: 'Connect with our global community',
      icon: '🌍',
      href: '/alumni'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{link.icon}</div>
              <h3 className="text-xl font-semibold text-ucsb-navy mb-2">
                {link.title}
              </h3>
              <p className="text-gray-600">{link.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}