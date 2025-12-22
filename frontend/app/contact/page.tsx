'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Building2,
  GraduationCap,
  BookOpen,
  Microscope,
  Mail,
  Rainbow,
  MapPin,
  Clock,
  LucideIcon
} from 'lucide-react'

interface ContactInfo {
  title: string
  description: string
  icon: LucideIcon
  details: string[]
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  })

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('loading')

    try {
      // Simulated form submission
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      })
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } catch (error) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    }
  }

  const contactInfo: ContactInfo[] = [
    {
      title: 'Main Office',
      description: 'General inquiries and department information',
      icon: Building2,
      details: [
        'Life Sciences Building, Room 2001',
        'University of California, Santa Barbara',
        'Santa Barbara, CA 93106',
        'Phone: (805) 893-2100'
      ]
    },
    {
      title: 'Graduate Program',
      description: 'Information about graduate applications and programs',
      icon: GraduationCap,
      details: [
        'Phone: (805) 893-2200',
        'Email: gradinfo@eemb.ucsb.edu',
        'Office Hours: Mon-Fri, 9am-5pm'
      ]
    },
    {
      title: 'Undergraduate Program',
      description: 'Undergraduate majors, minors, and courses',
      icon: BookOpen,
      details: [
        'Phone: (805) 893-2300',
        'Email: undergradinfo@eemb.ucsb.edu',
        'Office Hours: Mon-Fri, 10am-4pm'
      ]
    },
    {
      title: 'Research Office',
      description: 'Research opportunities and collaborations',
      icon: Microscope,
      details: [
        'Phone: (805) 893-2400',
        'Email: research@eemb.ucsb.edu',
        'Location: Marine Science Institute'
      ]
    },
    {
      title: 'Admissions',
      description: 'Application questions and admissions support',
      icon: Mail,
      details: [
        'Email: admissions@eemb.ucsb.edu',
        'Phone: (805) 893-2500',
        'Website: ucsb.edu/admissions'
      ]
    },
    {
      title: 'Diversity & Inclusion',
      description: 'DEI initiatives and community support',
      icon: Rainbow,
      details: [
        'Email: dei@eemb.ucsb.edu',
        'Phone: (805) 893-2600',
        'Office: Life Sciences Building, Room 3005'
      ]
    }
  ]

  const locations = [
    {
      name: 'Life Sciences Building',
      purpose: 'Department offices, classrooms, and research labs',
      address: 'UC Santa Barbara Campus',
      hours: 'Open during regular hours'
    },
    {
      name: 'Marine Science Institute',
      purpose: 'Marine research facilities and laboratories',
      address: 'Santa Barbara Waterfront',
      hours: 'Open for authorized researchers'
    },
    {
      name: 'Field Research Stations',
      purpose: 'Field research and ecological studies',
      address: 'Various locations in California',
      hours: 'Seasonal operation'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-lg md:text-xl text-white/90">
              Have questions about our programs, research, or department? We're here to help. Reach out to us using any of the methods below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-12 text-center">How to Reach Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contactInfo.map((info, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-8 border-t-4 border-ucsb-coral">
                <div className="mb-4">
                  <info.icon className="w-10 h-10 text-ucsb-coral" />
                </div>
                <h3 className="text-xl font-bold text-ucsb-navy mb-2">{info.title}</h3>
                <p className="text-gray-600 mb-6">{info.description}</p>
                <div className="space-y-2 text-sm text-gray-700">
                  {info.details.map((detail, i) => (
                    <p key={i} className="flex items-start gap-2">
                      <span className="text-ucsb-coral mt-1">•</span>
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ucsb-coral focus:border-transparent transition"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ucsb-coral focus:border-transparent transition"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ucsb-coral focus:border-transparent transition"
                      placeholder="(805) 555-0123"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Inquiry Type *
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ucsb-coral focus:border-transparent transition bg-white"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="graduate">Graduate Program</option>
                    <option value="undergraduate">Undergraduate Program</option>
                    <option value="research">Research Opportunities</option>
                    <option value="faculty">Faculty/Staff</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ucsb-coral focus:border-transparent transition"
                    placeholder="What is this about?"
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ucsb-coral focus:border-transparent transition resize-none"
                    placeholder="Your message here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    submitStatus === 'loading'
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : submitStatus === 'success'
                      ? 'bg-green-500 text-white'
                      : 'bg-ucsb-coral text-white hover:bg-red-600'
                  }`}
                >
                  {submitStatus === 'loading'
                    ? 'Sending...'
                    : submitStatus === 'success'
                    ? 'Message Sent!'
                    : submitStatus === 'error'
                    ? 'Error - Please Try Again'
                    : 'Send Message'}
                </button>

                {submitStatus === 'success' && (
                  <p className="mt-4 text-green-600 font-semibold text-center">
                    Thank you for your message! We'll get back to you soon.
                  </p>
                )}
              </form>
            </div>

            {/* Locations & Additional Info */}
            <div>
              <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Department Locations</h2>
              <div className="space-y-6">
                {locations.map((location, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-ucsb-coral hover:shadow-lg transition">
                    <h3 className="text-xl font-bold text-ucsb-navy mb-2">{location.name}</h3>
                    <p className="text-gray-600 mb-3">{location.purpose}</p>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-ucsb-coral" />
                        {location.address}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-ucsb-coral" />
                        {location.hours}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-8 bg-gradient-to-br from-ucsb-navy to-blue-800 text-white rounded-lg p-8">
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <Link href="/academics" className="flex items-center gap-2 hover:text-ucsb-gold transition">
                    <span>→</span> Academic Programs
                  </Link>
                  <Link href="/research" className="flex items-center gap-2 hover:text-ucsb-gold transition">
                    <span>→</span> Research Areas
                  </Link>
                  <Link href="/faculty" className="flex items-center gap-2 hover:text-ucsb-gold transition">
                    <span>→</span> Faculty Directory
                  </Link>
                  <Link href="/dei" className="flex items-center gap-2 hover:text-ucsb-gold transition">
                    <span>→</span> Diversity & Inclusion
                  </Link>
                  <a href="https://www.ucsb.edu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-ucsb-gold transition">
                    <span>→</span> UCSB Main Website
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Hours */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8 text-center">Office Hours & Availability</h2>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-ucsb-navy mb-4">Regular Office Hours</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Monday - Friday:</strong> 9:00 AM - 5:00 PM</p>
                <p><strong>Saturday:</strong> Closed</p>
                <p><strong>Sunday:</strong> Closed</p>
                <p className="text-sm text-gray-600 mt-4">
                  Please note: Hours may vary during holidays and breaks.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-8 border-2 border-orange-200">
              <h3 className="text-xl font-bold text-ucsb-navy mb-4">Appointment Scheduling</h3>
              <p className="text-gray-700 mb-4">
                For a formal meeting with faculty or staff, please schedule an appointment in advance.
              </p>
              <button className="w-full bg-ucsb-coral text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition">
                Schedule an Appointment
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-ocean-deep to-ocean-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">We're Looking Forward to Hearing From You</h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Whether you're interested in joining our community, collaborating on research, or simply learning more about our department, don't hesitate to reach out.
          </p>
        </div>
      </section>
    </div>
  )
}
