'use client'

import { useState, useCallback, useId, FormEvent } from 'react'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<{ success: boolean; error?: string }>
  subjects?: string[]
  className?: string
}

const defaultSubjects = [
  'General Inquiry',
  'Graduate Program',
  'Research Collaboration',
  'Faculty Contact',
  'Event Information',
  'Other',
]

export default function ContactForm({
  onSubmit,
  subjects = defaultSubjects,
  className = '',
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitError, setSubmitError] = useState<string>('')

  const formId = useId()

  const validateField = useCallback((name: keyof ContactFormData, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        return ''
      case 'email':
        if (!value.trim()) return 'Email is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Please enter a valid email address'
        return ''
      case 'subject':
        if (!value.trim()) return 'Please select a subject'
        return ''
      case 'message':
        if (!value.trim()) return 'Message is required'
        if (value.trim().length < 10) return 'Message must be at least 10 characters'
        return ''
      default:
        return ''
    }
  }, [])

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {} as Partial<Record<keyof ContactFormData, string>>

    (Object.keys(formData) as Array<keyof ContactFormData>).forEach((key) => {
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, validateField])

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }, [errors])

  const handleBlur = useCallback((
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    const error = validateField(name as keyof ContactFormData, value)
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }, [validateField])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitError('')

    try {
      if (onSubmit) {
        const result = await onSubmit(formData)
        if (result.success) {
          setSubmitStatus('success')
          setFormData({ name: '', email: '', subject: '', message: '' })
        } else {
          setSubmitStatus('error')
          setSubmitError(result.error || 'An error occurred. Please try again.')
        }
      } else {
        // Default behavior: submit to API route
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        const result = await response.json()

        if (result.success) {
          setSubmitStatus('success')
          setFormData({ name: '', email: '', subject: '', message: '' })
        } else {
          setSubmitStatus('error')
          setSubmitError(result.error || 'An error occurred. Please try again.')
        }
      }
    } catch {
      setSubmitStatus('error')
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === 'success') {
    return (
      <div className={`bg-kelp-50 rounded-2xl p-8 text-center ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 bg-kelp-500 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-bold text-ocean-deep mb-2">
          Message Sent!
        </h3>
        <p className="text-warm-600 mb-6">
          Thank you for reaching out. We&apos;ll get back to you as soon as possible.
        </p>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="text-ocean-teal font-semibold hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      {/* Error banner */}
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl" role="alert">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 text-sm">{submitError}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Name field */}
        <div>
          <label htmlFor={`${formId}-name`} className="block text-sm font-semibold text-ocean-deep mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id={`${formId}-name`}
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.name ? 'border-red-300 focus:ring-red-500/50 focus:border-red-500' : 'border-warm-200 focus:ring-ocean-teal/50 focus:border-ocean-teal'
            } bg-white text-ocean-deep placeholder-warm-400 focus:outline-none focus:ring-2 transition-all`}
            placeholder="Your full name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          />
          {errors.name && (
            <p id={`${formId}-name-error`} className="mt-1.5 text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email field */}
        <div>
          <label htmlFor={`${formId}-email`} className="block text-sm font-semibold text-ocean-deep mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id={`${formId}-email`}
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.email ? 'border-red-300 focus:ring-red-500/50 focus:border-red-500' : 'border-warm-200 focus:ring-ocean-teal/50 focus:border-ocean-teal'
            } bg-white text-ocean-deep placeholder-warm-400 focus:outline-none focus:ring-2 transition-all`}
            placeholder="your.email@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          />
          {errors.email && (
            <p id={`${formId}-email-error`} className="mt-1.5 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        {/* Subject field */}
        <div>
          <label htmlFor={`${formId}-subject`} className="block text-sm font-semibold text-ocean-deep mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id={`${formId}-subject`}
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.subject ? 'border-red-300 focus:ring-red-500/50 focus:border-red-500' : 'border-warm-200 focus:ring-ocean-teal/50 focus:border-ocean-teal'
              } bg-white text-ocean-deep focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                !formData.subject ? 'text-warm-400' : ''
              }`}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? `${formId}-subject-error` : undefined}
            >
              <option value="" disabled>
                Select a subject
              </option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-warm-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.subject && (
            <p id={`${formId}-subject-error`} className="mt-1.5 text-sm text-red-600">
              {errors.subject}
            </p>
          )}
        </div>

        {/* Message field */}
        <div>
          <label htmlFor={`${formId}-message`} className="block text-sm font-semibold text-ocean-deep mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id={`${formId}-message`}
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={5}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.message ? 'border-red-300 focus:ring-red-500/50 focus:border-red-500' : 'border-warm-200 focus:ring-ocean-teal/50 focus:border-ocean-teal'
            } bg-white text-ocean-deep placeholder-warm-400 focus:outline-none focus:ring-2 transition-all resize-none`}
            placeholder="Tell us how we can help..."
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? `${formId}-message-error` : undefined}
          />
          {errors.message && (
            <p id={`${formId}-message-error`} className="mt-1.5 text-sm text-red-600">
              {errors.message}
            </p>
          )}
          <p className="mt-1.5 text-xs text-warm-400">
            {formData.message.length}/1000 characters
          </p>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 w-full py-4 px-6 rounded-xl bg-gradient-to-r from-ucsb-gold to-yellow-500 text-ocean-deep font-bold text-lg shadow-lg hover:shadow-xl hover:from-yellow-400 hover:to-ucsb-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </>
        ) : (
          <>
            Send Message
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>

      {/* Privacy note */}
      <p className="mt-4 text-xs text-warm-400 text-center">
        By submitting this form, you agree to our{' '}
        <a href="/privacy" className="text-ocean-teal hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  )
}
