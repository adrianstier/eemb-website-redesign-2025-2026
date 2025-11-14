/**
 * Centralized icon system for the EEMB website
 * Uses Heroicons v2 for consistency
 *
 * To install: npm install @heroicons/react
 */

// Common icons from Heroicons (outline variants for UI)
export {
  // Communication
  EnvelopeIcon as MailIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon as ChatIcon,
  MegaphoneIcon,

  // Location
  MapPinIcon as LocationIcon,
  GlobeAltIcon,
  MapIcon,

  // Calendar & Time
  CalendarIcon,
  CalendarDaysIcon,
  ClockIcon,

  // Academic
  AcademicCapIcon,
  BookOpenIcon,
  DocumentTextIcon,
  NewspaperIcon,

  // Science
  BeakerIcon,
  SparklesIcon,
  MagnifyingGlassIcon as SearchIcon,

  // People
  UserIcon,
  UserGroupIcon,
  UsersIcon,
  UserPlusIcon,

  // Buildings
  BuildingOfficeIcon,
  BuildingLibraryIcon,
  HomeIcon,

  // Navigation
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  Bars3Icon as MenuIcon,
  XMarkIcon as CloseIcon,

  // Actions
  PlusIcon,
  MinusIcon,
  PencilIcon as EditIcon,
  TrashIcon,
  ShareIcon,
  LinkIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
  ArrowDownTrayIcon as DownloadIcon,

  // Status
  CheckIcon,
  ExclamationTriangleIcon as WarningIcon,
  InformationCircleIcon as InfoIcon,
  ExclamationCircleIcon as ErrorIcon,
  CheckCircleIcon as SuccessIcon,

  // Media
  PhotoIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  PlayIcon,
  PauseIcon,

  // Social (you might need custom icons for some)
  // These are not in Heroicons, see custom icons below
} from '@heroicons/react/24/outline'

// Solid variants for emphasis
export {
  EnvelopeIcon as MailIconSolid,
  PhoneIcon as PhoneIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  CalendarIcon as CalendarIconSolid,
  MapPinIcon as LocationIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  BeakerIcon as BeakerIconSolid,
  StarIcon as StarIconSolid,
} from '@heroicons/react/24/solid'

// Custom icons for specific needs
import React from 'react'

interface IconProps {
  className?: string
  'aria-hidden'?: boolean
}

// Wave icon for marine biology
export const WaveIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', 'aria-hidden': ariaHidden = true }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden={ariaHidden}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 12h14M5 12c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3-3-1.5-3-3zm14 0c0-1.5-1.5-3-3-3s-3 1.5-3 3 1.5 3 3 3 3-1.5 3-3z"
    />
  </svg>
)

// Fish icon for marine biology
export const FishIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', 'aria-hidden': ariaHidden = true }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden={ariaHidden}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6c-3.5 0-6 2.5-6 6s2.5 6 6 6c1.5 0 3-0.5 4-1.5L20 20V12l-4-3.5C15 7.5 13.5 6 12 6zm-2 6h.01"
    />
  </svg>
)

// Microscope icon for research
export const MicroscopeIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', 'aria-hidden': ariaHidden = true }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden={ariaHidden}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-3-3v6m8 5H4m4-10l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
    />
  </svg>
)

// DNA icon for biology
export const DNAIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', 'aria-hidden': ariaHidden = true }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden={ariaHidden}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v18m0-18c-2.5 0-4.5 1.5-4.5 3.5S9.5 10 12 10s4.5-1.5 4.5-3.5S14.5 3 12 3zm0 18c2.5 0 4.5-1.5 4.5-3.5S14.5 14 12 14s-4.5 1.5-4.5 3.5S9.5 21 12 21z"
    />
  </svg>
)

// Tree icon for ecology
export const TreeIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', 'aria-hidden': ariaHidden = true }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden={ariaHidden}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 2L7 7h3v4H8l-4 4h7v6h2v-6h7l-4-4h-2V7h3L12 2z"
    />
  </svg>
)

// Social Media Icons (simplified versions)
export const TwitterIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', 'aria-hidden': ariaHidden = true }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden={ariaHidden}>
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
)

export const FacebookIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', 'aria-hidden': ariaHidden = true }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden={ariaHidden}>
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
)

export const InstagramIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', 'aria-hidden': ariaHidden = true }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden={ariaHidden}>
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
  </svg>
)

export const LinkedInIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', 'aria-hidden': ariaHidden = true }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden={ariaHidden}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

export const YouTubeIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', 'aria-hidden': ariaHidden = true }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden={ariaHidden}>
    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
  </svg>
)

// Utility function to get icon by name (useful for dynamic rendering)
export const getIcon = (name: string, props?: IconProps) => {
  const icons: Record<string, React.FC<IconProps>> = {
    wave: WaveIcon,
    fish: FishIcon,
    microscope: MicroscopeIcon,
    dna: DNAIcon,
    tree: TreeIcon,
    twitter: TwitterIcon,
    facebook: FacebookIcon,
    instagram: InstagramIcon,
    linkedin: LinkedInIcon,
    youtube: YouTubeIcon,
  }

  const Icon = icons[name.toLowerCase()]
  return Icon ? <Icon {...props} /> : null
}