'use client'

import Link from 'next/link'
import { ArrowLeftIcon, ComputerDesktopIcon, WifiIcon, ShieldCheckIcon, ServerIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'

export default function TechnicalSupportPage() {
  const lscgServices = [
    {
      icon: ComputerDesktopIcon,
      title: 'Desktop Support',
      description: 'Help with computer hardware, software, and troubleshooting',
      services: [
        'Computer setup and configuration',
        'Software installation and updates',
        'Hardware troubleshooting and repairs',
        'Printer setup and support',
        'Peripheral device configuration',
        'Desktop OS support (Windows, Mac, Linux)'
      ]
    },
    {
      icon: WifiIcon,
      title: 'Network Access',
      description: 'Network connectivity and access management',
      services: [
        'Wired network connections',
        'WiFi configuration and troubleshooting',
        'VPN setup for remote access',
        'Network drive mapping',
        'Firewall exception requests',
        'Network performance issues'
      ]
    },
    {
      icon: ShieldCheckIcon,
      title: 'Account Management',
      description: 'User accounts and authentication services',
      services: [
        'EEMB user account creation',
        'Password resets and recovery',
        'Multi-factor authentication (MFA)',
        'Email account setup',
        'Group membership management',
        'Account deactivation/reactivation'
      ]
    },
    {
      icon: ServerIcon,
      title: 'Server & Storage',
      description: 'File storage and server access',
      services: [
        'Network file storage allocation',
        'Backup solutions',
        'Server access permissions',
        'Data migration assistance',
        'Storage quota management',
        'Archive and long-term storage'
      ]
    }
  ]

  const softwareResources = {
    title: 'Software & Licenses',
    categories: [
      {
        name: 'Research Software',
        items: [
          'MATLAB (campus license)',
          'R and RStudio',
          'Python and Jupyter',
          'Statistical packages (SPSS, SAS, Stata)',
          'GIS software (ArcGIS, QGIS)',
          'Bioinformatics tools'
        ]
      },
      {
        name: 'Productivity Software',
        items: [
          'Microsoft Office 365',
          'Google Workspace',
          'Reference management (EndNote, Zotero, Mendeley)',
          'Adobe Creative Cloud (department licenses)',
          'LaTeX editors',
          'Collaboration tools (Slack, Teams, Zoom)'
        ]
      },
      {
        name: 'Specialized Tools',
        items: [
          'Molecular modeling software',
          'Phylogenetic analysis tools',
          'Ecological modeling packages',
          'Image analysis software',
          'Data visualization tools',
          'Version control (Git, GitHub)'
        ]
      }
    ]
  }

  const commonIssues = [
    {
      issue: 'Can\'t connect to network',
      solutions: [
        'Check physical cable connection or WiFi status',
        'Restart your computer',
        'Verify network settings',
        'Try different network port/WiFi network',
        'Contact LSCG if issue persists'
      ]
    },
    {
      issue: 'Forgot password',
      solutions: [
        'Use self-service password reset portal',
        'Contact LSCG for manual reset',
        'Have UCSB ID ready for verification',
        'Update password on all devices after reset'
      ]
    },
    {
      issue: 'Printer not working',
      solutions: [
        'Check printer power and paper',
        'Verify correct printer selected',
        'Restart print spooler service',
        'Reinstall printer driver',
        'Contact LSCG for printer configuration'
      ]
    },
    {
      issue: 'Software not working',
      solutions: [
        'Restart the application',
        'Check for software updates',
        'Verify license is active',
        'Review error messages',
        'Contact LSCG for software support'
      ]
    }
  ]

  const security = {
    title: 'Security & Best Practices',
    practices: [
      {
        category: 'Password Security',
        tips: [
          'Use strong, unique passwords (12+ characters)',
          'Enable multi-factor authentication (MFA)',
          'Never share passwords with others',
          'Change passwords if compromised',
          'Use a password manager'
        ]
      },
      {
        category: 'Data Protection',
        tips: [
          'Back up important files regularly',
          'Store sensitive data on secure network drives',
          'Encrypt confidential information',
          'Use UCSB-approved cloud storage',
          'Follow data retention policies'
        ]
      },
      {
        category: 'Device Security',
        tips: [
          'Keep operating system updated',
          'Install security patches promptly',
          'Use antivirus software',
          'Lock computer when away',
          'Report lost/stolen devices immediately'
        ]
      },
      {
        category: 'Email Safety',
        tips: [
          'Be cautious of phishing emails',
          'Verify sender before clicking links',
          'Don\'t open suspicious attachments',
          'Report spam and phishing attempts',
          'Use caution with email forwarding'
        ]
      }
    ]
  }

  const remoteAccess = {
    title: 'Remote Access & VPN',
    description: 'Access EEMB resources from off-campus',
    steps: [
      {
        title: 'UCSB VPN',
        description: 'Secure connection to campus network',
        instructions: [
          'Download UCSB VPN client from IT website',
          'Install and configure VPN software',
          'Connect using UCSB NetID credentials',
          'Access network resources as if on campus',
          'Disconnect when finished'
        ],
        link: 'https://www.it.ucsb.edu/vpn'
      },
      {
        title: 'Remote Desktop',
        description: 'Access your office computer remotely',
        instructions: [
          'Ensure office computer is powered on',
          'Connect to UCSB VPN first',
          'Use Remote Desktop software',
          'Enter computer name or IP address',
          'Login with UCSB credentials'
        ],
        note: 'Must be set up by LSCG before first use'
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/support" className="flex items-center gap-2 text-ocean-blue hover:text-ocean-teal transition">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Support Services
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <ComputerDesktopIcon className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Technical Support</h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl mb-8">
            IT support, user accounts, network access, and desktop help provided by Life Sciences Computing Group (LSCG).
          </p>

          {/* Quick Contact */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl border border-white/20">
            <h3 className="text-xl font-bold mb-4">Contact LSCG for Support</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-white/80 mb-1">Email:</p>
                <a href="mailto:help@lscg.ucsb.edu" className="text-lg font-semibold hover:text-ucsb-gold transition">
                  help@lscg.ucsb.edu
                </a>
              </div>
              <div>
                <p className="text-sm text-white/80 mb-1">Help Desk:</p>
                <p className="text-lg font-semibold">Life Sciences Building</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LSCG Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">LSCG Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lscgServices.map((service, index) => {
              const Icon = service.icon
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition border-l-4 border-ocean-blue">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-ocean-blue to-ocean-teal rounded-xl flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-ucsb-navy mb-2">{service.title}</h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {service.services.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-ocean-blue mt-1 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Software & Licenses */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">{softwareResources.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {softwareResources.categories.map((category, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-md border-t-4 border-purple-500">
                <h3 className="text-xl font-bold text-ucsb-navy mb-4">{category.name}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 rounded-lg p-6 border-l-4 border-ocean-blue">
            <h3 className="font-bold text-ocean-deep mb-2">Software Requests</h3>
            <p className="text-sm text-gray-700">
              For software installation or license requests, contact LSCG at <a href="mailto:help@lscg.ucsb.edu" className="text-ocean-blue hover:text-ocean-teal font-semibold">help@lscg.ucsb.edu</a>.
              Include the software name, version, and your specific research/teaching needs.
            </p>
          </div>
        </div>
      </section>

      {/* Common Issues */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Common Issues & Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commonIssues.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border-l-4 border-ucsb-gold">
                <h3 className="text-lg font-bold text-ucsb-navy mb-4">{item.issue}</h3>
                <ol className="space-y-2">
                  {item.solutions.map((solution, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="flex-shrink-0 w-5 h-5 bg-ucsb-gold/20 text-ucsb-navy rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                      <span>{solution}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Remote Access */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <DevicePhoneMobileIcon className="w-8 h-8 text-ocean-blue" />
            <h2 className="text-3xl font-bold text-ucsb-navy">{remoteAccess.title}</h2>
          </div>
          <p className="text-gray-700 mb-8">{remoteAccess.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {remoteAccess.steps.map((step, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-md">
                <h3 className="text-xl font-bold text-ucsb-navy mb-3">{step.title}</h3>
                <p className="text-sm text-gray-600 mb-6">{step.description}</p>

                <h4 className="font-semibold text-gray-700 mb-3">Setup Instructions:</h4>
                <ol className="space-y-2 mb-4">
                  {step.instructions.map((instruction, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 bg-ocean-blue text-white rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>

                {step.link && (
                  <a href={step.link} target="_blank" rel="noopener noreferrer" className="text-sm text-ocean-blue hover:text-ocean-teal font-semibold">
                    More Information →
                  </a>
                )}

                {step.note && (
                  <div className="mt-4 bg-yellow-50 rounded-lg p-3 border-l-4 border-yellow-500">
                    <p className="text-xs text-gray-700">
                      <strong className="text-yellow-900">Note:</strong> {step.note}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Best Practices */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheckIcon className="w-8 h-8 text-ocean-blue" />
            <h2 className="text-3xl font-bold text-ucsb-navy">{security.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {security.practices.map((practice, index) => (
              <div key={index} className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 shadow-md border-l-4 border-red-500">
                <h3 className="text-lg font-bold text-ucsb-navy mb-4">{practice.category}</h3>
                <ul className="space-y-2">
                  {practice.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-red-500 mt-1 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-red-50 rounded-lg p-6 border-l-4 border-red-600">
            <h3 className="font-bold text-red-900 mb-2">Security Incidents</h3>
            <p className="text-sm text-gray-700 mb-3">
              If you suspect a security breach, virus infection, or receive suspicious emails:
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">LSCG Help Desk:</p>
                <a href="mailto:help@lscg.ucsb.edu" className="text-ocean-blue hover:text-ocean-teal font-semibold">
                  help@lscg.ucsb.edu
                </a>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">UCSB IT Security:</p>
                <a href="mailto:security@ucsb.edu" className="text-ocean-blue hover:text-ocean-teal font-semibold">
                  security@ucsb.edu
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Additional IT Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href="https://www.it.ucsb.edu" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition group">
              <h3 className="font-bold text-ucsb-navy mb-2 group-hover:text-ocean-teal transition">UCSB IT Services</h3>
              <p className="text-sm text-gray-600 mb-3">Campus-wide IT support and resources</p>
              <span className="text-sm text-ocean-blue font-semibold">it.ucsb.edu →</span>
            </a>

            <a href="https://status.ucsb.edu" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition group">
              <h3 className="font-bold text-ucsb-navy mb-2 group-hover:text-ocean-teal transition">IT Status</h3>
              <p className="text-sm text-gray-600 mb-3">System status and service interruptions</p>
              <span className="text-sm text-ocean-blue font-semibold">status.ucsb.edu →</span>
            </a>

            <a href="https://www.security.ucsb.edu" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition group">
              <h3 className="font-bold text-ucsb-navy mb-2 group-hover:text-ocean-teal transition">IT Security</h3>
              <p className="text-sm text-gray-600 mb-3">Security alerts and best practices</p>
              <span className="text-sm text-ocean-blue font-semibold">security.ucsb.edu →</span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-ocean-deep to-ocean-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Technical Support?</h2>
          <p className="text-xl text-white/90 mb-8">
            Contact LSCG for IT assistance and troubleshooting
          </p>
          <a
            href="mailto:help@lscg.ucsb.edu?subject=Technical Support Request"
            className="inline-flex items-center gap-2 bg-white text-ocean-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Email LSCG Help Desk
          </a>
        </div>
      </section>
    </div>
  )
}
