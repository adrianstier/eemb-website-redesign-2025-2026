export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: number
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          record_id: number | null
          table_name: string
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: number
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: number | null
          table_name: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: number
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: number | null
          table_name?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: number
          ip_address: unknown
          message: string
          name: string
          responded_at: string | null
          responded_by: string | null
          status: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          ip_address?: unknown
          message: string
          name: string
          responded_at?: string | null
          responded_by?: string | null
          status?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          ip_address?: unknown
          message?: string
          name?: string
          responded_at?: string | null
          responded_by?: string | null
          status?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          all_day: boolean | null
          canceled: boolean | null
          cancellation_reason: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          event_type: Database["public"]["Enums"]["event_type"] | null
          featured: boolean | null
          google_calendar_id: string | null
          host_faculty_id: number | null
          id: number
          location: string | null
          max_attendees: number | null
          registration_link: string | null
          registration_required: boolean | null
          short_description: string | null
          slug: string | null
          speaker: string | null
          speaker_affiliation: string | null
          speaker_bio: string | null
          speaker_image_url: string | null
          speaker_title: string | null
          start_date: string
          title: string
          updated_at: string | null
          virtual_link: string | null
        }
        Insert: {
          all_day?: boolean | null
          canceled?: boolean | null
          cancellation_reason?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          featured?: boolean | null
          google_calendar_id?: string | null
          host_faculty_id?: number | null
          id?: number
          location?: string | null
          max_attendees?: number | null
          registration_link?: string | null
          registration_required?: boolean | null
          short_description?: string | null
          slug?: string | null
          speaker?: string | null
          speaker_affiliation?: string | null
          speaker_bio?: string | null
          speaker_image_url?: string | null
          speaker_title?: string | null
          start_date: string
          title: string
          updated_at?: string | null
          virtual_link?: string | null
        }
        Update: {
          all_day?: boolean | null
          canceled?: boolean | null
          cancellation_reason?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          featured?: boolean | null
          google_calendar_id?: string | null
          host_faculty_id?: number | null
          id?: number
          location?: string | null
          max_attendees?: number | null
          registration_link?: string | null
          registration_required?: boolean | null
          short_description?: string | null
          slug?: string | null
          speaker?: string | null
          speaker_affiliation?: string | null
          speaker_bio?: string | null
          speaker_image_url?: string | null
          speaker_title?: string | null
          start_date?: string
          title?: string
          updated_at?: string | null
          virtual_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_host_faculty_id_fkey"
            columns: ["host_faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty: {
        Row: {
          accepting_students: boolean | null
          accepting_students_note: string | null
          active: boolean
          bio: string | null
          created_at: string | null
          department: Database["public"]["Enums"]["department"] | null
          email: string
          first_name: string
          full_name: string | null
          google_scholar: string | null
          id: number
          joined_year: number | null
          lab_website: string | null
          last_name: string
          office: string | null
          office_hours: string | null
          orcid: string | null
          phone: string | null
          photo_url: string | null
          research_interests: Json | null
          short_bio: string | null
          slug: string | null
          title: Database["public"]["Enums"]["faculty_title"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          accepting_students?: boolean | null
          accepting_students_note?: string | null
          active?: boolean
          bio?: string | null
          created_at?: string | null
          department?: Database["public"]["Enums"]["department"] | null
          email: string
          first_name: string
          full_name?: string | null
          google_scholar?: string | null
          id?: number
          joined_year?: number | null
          lab_website?: string | null
          last_name: string
          office?: string | null
          office_hours?: string | null
          orcid?: string | null
          phone?: string | null
          photo_url?: string | null
          research_interests?: Json | null
          short_bio?: string | null
          slug?: string | null
          title?: Database["public"]["Enums"]["faculty_title"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          accepting_students?: boolean | null
          accepting_students_note?: string | null
          active?: boolean
          bio?: string | null
          created_at?: string | null
          department?: Database["public"]["Enums"]["department"] | null
          email?: string
          first_name?: string
          full_name?: string | null
          google_scholar?: string | null
          id?: number
          joined_year?: number | null
          lab_website?: string | null
          last_name?: string
          office?: string | null
          office_hours?: string | null
          orcid?: string | null
          phone?: string | null
          photo_url?: string | null
          research_interests?: Json | null
          short_bio?: string | null
          slug?: string | null
          title?: Database["public"]["Enums"]["faculty_title"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      faculty_research_areas: {
        Row: {
          faculty_id: number
          research_area_id: number
        }
        Insert: {
          faculty_id: number
          research_area_id: number
        }
        Update: {
          faculty_id?: number
          research_area_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "faculty_research_areas_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_research_areas_research_area_id_fkey"
            columns: ["research_area_id"]
            isOneToOne: false
            referencedRelation: "research_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      memorials: {
        Row: {
          id: number
          name: string
          title: string | null
          birth_year: number | null
          death_year: number | null
          photo_url: string | null
          bio: string | null
          legacy: string | null
          research_areas: string[] | null
          external_links: Json | null
          slug: string
          display_order: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          name: string
          title?: string | null
          birth_year?: number | null
          death_year?: number | null
          photo_url?: string | null
          bio?: string | null
          legacy?: string | null
          research_areas?: string[] | null
          external_links?: Json | null
          slug: string
          display_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          title?: string | null
          birth_year?: number | null
          death_year?: number | null
          photo_url?: string | null
          bio?: string | null
          legacy?: string | null
          research_areas?: string[] | null
          external_links?: Json | null
          slug?: string
          display_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      graduate_students: {
        Row: {
          active: boolean
          advisor_id: number | null
          bio: string | null
          created_at: string | null
          degree_program: Database["public"]["Enums"]["degree_program"] | null
          email: string
          expected_graduation: number | null
          first_name: string
          full_name: string | null
          google_scholar: string | null
          id: number
          lab_website: string | null
          last_name: string
          linkedin: string | null
          office: string | null
          orcid: string | null
          personal_website: string | null
          phone: string | null
          photo_url: string | null
          research_interests: Json | null
          short_bio: string | null
          slug: string | null
          twitter: string | null
          updated_at: string | null
          user_id: string | null
          year_entered: number | null
        }
        Insert: {
          active?: boolean
          advisor_id?: number | null
          bio?: string | null
          created_at?: string | null
          degree_program?: Database["public"]["Enums"]["degree_program"] | null
          email: string
          expected_graduation?: number | null
          first_name: string
          full_name?: string | null
          google_scholar?: string | null
          id?: number
          lab_website?: string | null
          last_name: string
          linkedin?: string | null
          office?: string | null
          orcid?: string | null
          personal_website?: string | null
          phone?: string | null
          photo_url?: string | null
          research_interests?: Json | null
          short_bio?: string | null
          slug?: string | null
          twitter?: string | null
          updated_at?: string | null
          user_id?: string | null
          year_entered?: number | null
        }
        Update: {
          active?: boolean
          advisor_id?: number | null
          bio?: string | null
          created_at?: string | null
          degree_program?: Database["public"]["Enums"]["degree_program"] | null
          email?: string
          expected_graduation?: number | null
          first_name?: string
          full_name?: string | null
          google_scholar?: string | null
          id?: number
          lab_website?: string | null
          last_name?: string
          linkedin?: string | null
          office?: string | null
          orcid?: string | null
          personal_website?: string | null
          phone?: string | null
          photo_url?: string | null
          research_interests?: Json | null
          short_bio?: string | null
          slug?: string | null
          twitter?: string | null
          updated_at?: string | null
          user_id?: string | null
          year_entered?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "graduate_students_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
        ]
      }
      news_articles: {
        Row: {
          author: string | null
          category: Database["public"]["Enums"]["news_category"] | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          featured: boolean | null
          id: number
          image_url: string | null
          original_url: string | null
          pinned: boolean | null
          publish_date: string | null
          published: boolean | null
          slug: string | null
          subtitle: string | null
          tags: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          category?: Database["public"]["Enums"]["news_category"] | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured?: boolean | null
          id?: number
          image_url?: string | null
          original_url?: string | null
          pinned?: boolean | null
          publish_date?: string | null
          published?: boolean | null
          slug?: string | null
          subtitle?: string | null
          tags?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          category?: Database["public"]["Enums"]["news_category"] | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured?: boolean | null
          id?: number
          image_url?: string | null
          original_url?: string | null
          pinned?: boolean | null
          publish_date?: string | null
          published?: boolean | null
          slug?: string | null
          subtitle?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      news_faculty: {
        Row: {
          faculty_id: number
          news_id: number
        }
        Insert: {
          faculty_id: number
          news_id: number
        }
        Update: {
          faculty_id?: number
          news_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "news_faculty_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_faculty_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_versions: {
        Row: {
          change_reason: string | null
          changed_at: string | null
          changed_by: string | null
          data: Json
          entity_id: number
          entity_type: string
          id: number
        }
        Insert: {
          change_reason?: string | null
          changed_at?: string | null
          changed_by?: string | null
          data: Json
          entity_id: number
          entity_type: string
          id?: number
        }
        Update: {
          change_reason?: string | null
          changed_at?: string | null
          changed_by?: string | null
          data?: Json
          entity_id?: number
          entity_type?: string
          id?: number
        }
        Relationships: []
      }
      research_areas: {
        Row: {
          category: Database["public"]["Enums"]["research_category"] | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          icon_url: string | null
          id: number
          name: string
          order_index: number | null
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["research_category"] | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          icon_url?: string | null
          id?: number
          name: string
          order_index?: number | null
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["research_category"] | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          icon_url?: string | null
          id?: number
          name?: string
          order_index?: number | null
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          active: boolean
          bio: string | null
          created_at: string | null
          department: Database["public"]["Enums"]["department"] | null
          email: string
          first_name: string
          full_name: string | null
          id: number
          joined_year: number | null
          last_name: string
          linkedin: string | null
          office: string | null
          phone: string | null
          photo_url: string | null
          responsibilities: Json | null
          short_bio: string | null
          slug: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean
          bio?: string | null
          created_at?: string | null
          department?: Database["public"]["Enums"]["department"] | null
          email: string
          first_name: string
          full_name?: string | null
          id?: number
          joined_year?: number | null
          last_name: string
          linkedin?: string | null
          office?: string | null
          phone?: string | null
          photo_url?: string | null
          responsibilities?: Json | null
          short_bio?: string | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean
          bio?: string | null
          created_at?: string | null
          department?: Database["public"]["Enums"]["department"] | null
          email?: string
          first_name?: string
          full_name?: string | null
          id?: number
          joined_year?: number | null
          last_name?: string
          linkedin?: string | null
          office?: string | null
          phone?: string | null
          photo_url?: string | null
          responsibilities?: Json | null
          short_bio?: string | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      student_research_areas: {
        Row: {
          research_area_id: number
          student_id: number
        }
        Insert: {
          research_area_id: number
          student_id: number
        }
        Update: {
          research_area_id?: number
          student_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_research_areas_research_area_id_fkey"
            columns: ["research_area_id"]
            isOneToOne: false
            referencedRelation: "research_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_research_areas_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "graduate_students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_testimonials: {
        Row: {
          created_at: string | null
          display_order: number | null
          featured: boolean | null
          id: number
          quote: string
          student_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          featured?: boolean | null
          id?: number
          quote: string
          student_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          featured?: boolean | null
          id?: number
          quote?: string
          student_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_testimonials_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "graduate_students"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          person_id: number | null
          person_type: Database["public"]["Enums"]["person_type"] | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          person_id?: number | null
          person_type?: Database["public"]["Enums"]["person_type"] | null
          role: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          person_id?: number | null
          person_type?: Database["public"]["Enums"]["person_type"] | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_faculty_by_research_area: {
        Args: { p_area_slug: string }
        Returns: {
          accepting_students: boolean
          accepting_students_note: string
          bio: string
          first_name: string
          id: number
          last_name: string
          photo_url: string
          slug: string
          title: Database["public"]["Enums"]["faculty_title"]
        }[]
      }
      get_featured_testimonials: {
        Args: { p_limit?: number }
        Returns: {
          advisor_name: string
          degree_program: Database["public"]["Enums"]["degree_program"]
          id: number
          photo_url: string
          quote: string
          student_name: string
          year_entered: number
        }[]
      }
      get_recent_news: {
        Args: {
          p_category?: Database["public"]["Enums"]["news_category"]
          p_limit?: number
        }
        Returns: {
          category: Database["public"]["Enums"]["news_category"]
          excerpt: string
          faculty_names: string
          featured: boolean
          id: number
          image_url: string
          publish_date: string
          slug: string
          subtitle: string
          title: string
        }[]
      }
      get_upcoming_events: {
        Args: {
          p_event_type?: Database["public"]["Enums"]["event_type"]
          p_limit?: number
        }
        Returns: {
          end_date: string
          event_type: Database["public"]["Enums"]["event_type"]
          featured: boolean
          host_faculty_name: string
          id: number
          location: string
          short_description: string
          slug: string
          speaker: string
          speaker_affiliation: string
          start_date: string
          title: string
        }[]
      }
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
      log_audit: {
        Args: {
          p_action: string
          p_ip_address?: unknown
          p_new_data?: Json
          p_old_data?: Json
          p_record_id: number
          p_table_name: string
          p_user_agent?: string
          p_user_email: string
          p_user_id: string
        }
        Returns: undefined
      }
      save_profile_version: {
        Args: {
          p_change_reason?: string
          p_changed_by?: string
          p_data: Json
          p_entity_id: number
          p_entity_type: string
        }
        Returns: number
      }
    }
    Enums: {
      degree_program: "PhD" | "MS" | "Combined BS-MS"
      department:
        | "EEMB"
        | "MCDB"
        | "Joint Appointment"
        | "Administration"
        | "Shared"
      event_type:
        | "Seminar"
        | "Workshop"
        | "Conference"
        | "Lecture"
        | "Social"
        | "Recruitment"
        | "Defense"
        | "Meeting"
        | "Alumni Event"
        | "Field Trip"
        | "Other"
      faculty_title:
        | "Professor"
        | "Associate Professor"
        | "Assistant Professor"
        | "Professor Emeritus"
        | "Distinguished Professor"
        | "Research Professor"
        | "Adjunct Professor"
        | "Postdoctoral Researcher"
        | "Lecturer"
        | "Teaching Professor"
      news_category:
        | "Faculty Achievement"
        | "Student Achievement"
        | "Alumni Success"
        | "Research Breakthrough"
        | "Grant Award"
        | "Department News"
        | "Event"
        | "Publication"
        | "Media Coverage"
        | "Partnership"
      person_type: "faculty" | "staff" | "graduate_student"
      research_category:
        | "Ecology"
        | "Evolution"
        | "Marine Biology"
        | "Molecular Biology"
        | "Conservation"
        | "Climate Science"
        | "Microbiology"
        | "Genomics"
        | "Physiology"
        | "Biodiversity"
        | "Other"
      user_role: "admin" | "faculty" | "staff" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

// Helper types for convenience
export type Faculty = Tables<"faculty">
export type Staff = Tables<"staff">
export type GraduateStudent = Tables<"graduate_students">
export type NewsArticle = Tables<"news_articles">
export type Event = Tables<"events">
export type ResearchArea = Tables<"research_areas">
export type UserRole = Tables<"user_roles">
export type StudentTestimonial = Tables<"student_testimonials">
export type ContactSubmission = Tables<"contact_submissions">
export type AuditLog = Tables<"audit_log">
export type ProfileVersion = Tables<"profile_versions">
export type MemorialRow = Tables<"memorials">
