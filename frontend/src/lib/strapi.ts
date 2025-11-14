import axios from 'axios';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_URL = `${STRAPI_URL}/api`;

export const strapiApi = axios.create({
  baseURL: STRAPI_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types for Strapi responses
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiAttributes {
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Faculty type
export interface Faculty extends StrapiAttributes {
  firstName: string;
  lastName: string;
  fullName: string;
  title?: string;
  department?: string;
  email?: string;
  phone?: string;
  office?: string;
  officeHours?: string;
  bio?: string;
  researchInterests?: string[];
  education?: any[];
  publications?: any[];
  website?: string;
  profileImage?: any;
  slug: string;
}

// Alumni Profile type
export interface AlumniProfile extends StrapiAttributes {
  firstName: string;
  lastName: string;
  fullName: string;
  graduationYear?: number;
  degree?: string;
  major?: string;
  currentPosition?: string;
  currentEmployer?: string;
  location?: string;
  bio?: string;
  achievements?: any[];
  linkedin?: string;
  email?: string;
  privacySettings?: any;
  profileImage?: any;
  slug: string;
}

// News Article type
export interface NewsArticle extends StrapiAttributes {
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  publishDate: string;
  category?: string;
  tags?: string[];
  featuredImage?: any;
  slug: string;
  featured?: boolean;
}

// Event type
export interface Event extends StrapiAttributes {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  eventType?: string;
  registrationUrl?: string;
  speaker?: string;
  organizer?: string;
  capacity?: number;
  isOnline?: boolean;
  slug: string;
}

// API endpoints
export const api = {
  faculty: {
    getAll: async () => {
      const response = await strapiApi.get<StrapiResponse<Faculty[]>>('/faculties?populate=*');
      return response.data;
    },
    getBySlug: async (slug: string) => {
      const response = await strapiApi.get<StrapiResponse<Faculty[]>>(
        `/faculties?filters[slug][$eq]=${slug}&populate=*`
      );
      return response.data.data[0];
    },
  },
  alumniProfiles: {
    getAll: async () => {
      const response = await strapiApi.get<StrapiResponse<AlumniProfile[]>>(
        '/alumni-profiles?populate=*'
      );
      return response.data;
    },
    getBySlug: async (slug: string) => {
      const response = await strapiApi.get<StrapiResponse<AlumniProfile[]>>(
        `/alumni-profiles?filters[slug][$eq]=${slug}&populate=*`
      );
      return response.data.data[0];
    },
  },
  news: {
    getAll: async () => {
      const response = await strapiApi.get<StrapiResponse<NewsArticle[]>>(
        '/news-articles?populate=*&sort=publishDate:desc'
      );
      return response.data;
    },
    getFeatured: async () => {
      const response = await strapiApi.get<StrapiResponse<NewsArticle[]>>(
        '/news-articles?filters[featured][$eq]=true&populate=*&sort=publishDate:desc&pagination[limit]=3'
      );
      return response.data;
    },
    getBySlug: async (slug: string) => {
      const response = await strapiApi.get<StrapiResponse<NewsArticle[]>>(
        `/news-articles?filters[slug][$eq]=${slug}&populate=*`
      );
      return response.data.data[0];
    },
  },
  events: {
    getUpcoming: async () => {
      const now = new Date().toISOString();
      const response = await strapiApi.get<StrapiResponse<Event[]>>(
        `/events?filters[startDate][$gte]=${now}&populate=*&sort=startDate:asc&pagination[limit]=5`
      );
      return response.data;
    },
    getAll: async () => {
      const response = await strapiApi.get<StrapiResponse<Event[]>>(
        '/events?populate=*&sort=startDate:desc'
      );
      return response.data;
    },
    getBySlug: async (slug: string) => {
      const response = await strapiApi.get<StrapiResponse<Event[]>>(
        `/events?filters[slug][$eq]=${slug}&populate=*`
      );
      return response.data.data[0];
    },
  },
};

export const getImageUrl = (image: any): string => {
  if (!image) return '/placeholder.png';
  if (image.data?.attributes?.url) {
    return image.data.attributes.url.startsWith('http')
      ? image.data.attributes.url
      : `${STRAPI_URL}${image.data.attributes.url}`;
  }
  return '/placeholder.png';
};