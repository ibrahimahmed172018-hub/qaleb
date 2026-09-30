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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      addons: {
        Row: {
          created_at: string
          description: string
          id: string
          is_active: boolean | null
          price: number
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_active?: boolean | null
          price: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean | null
          price?: number
          title?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string | null
          hashed_password: string
          id: number
          username: string
        }
        Insert: {
          created_at?: string | null
          hashed_password: string
          id?: number
          username: string
        }
        Update: {
          created_at?: string | null
          hashed_password?: string
          id?: number
          username?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string | null
          display_order: number
          id: number
          image_url: string | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          display_order: number
          id?: number
          image_url?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: number
          image_url?: string | null
          name?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          parent_id: number | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          parent_id?: number | null
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          parent_id?: number | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string | null
          id: number
          message: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          message: string
          name: string
          phone: string
        }
        Update: {
          created_at?: string | null
          id?: number
          message?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          display_order: number | null
          id: string
          question: string
        }
        Insert: {
          answer: string
          created_at?: string
          display_order?: number | null
          id?: string
          question: string
        }
        Update: {
          answer?: string
          created_at?: string
          display_order?: number | null
          id?: string
          question?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          button_link: string | null
          button_text: string | null
          created_at: string | null
          display_order: number
          id: number
          image_url: string | null
          is_active: boolean
          price: number | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string | null
          display_order: number
          id?: number
          image_url?: string | null
          is_active: boolean
          price?: number | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string | null
          display_order?: number
          id?: number
          image_url?: string | null
          is_active?: boolean
          price?: number | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string
          clinic_name: string | null
          created_at: string | null
          customer_name: string
          id: number
          items_json: string
          phone_number: string
          status: string | null
          total_price: number
        }
        Insert: {
          address: string
          clinic_name?: string | null
          created_at?: string | null
          customer_name: string
          id?: number
          items_json: string
          phone_number: string
          status?: string | null
          total_price: number
        }
        Update: {
          address?: string
          clinic_name?: string | null
          created_at?: string | null
          customer_name?: string
          id?: number
          items_json?: string
          phone_number?: string
          status?: string | null
          total_price?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          additional_images: string | null
          category_id: number
          country_of_origin: string | null
          created_at: string | null
          description: string | null
          id: number
          image_url: string | null
          is_available: boolean
          name: string
          original_price: number | null
          price: number
          updated_at: string | null
        }
        Insert: {
          additional_images?: string | null
          category_id: number
          country_of_origin?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_available: boolean
          name: string
          original_price?: number | null
          price: number
          updated_at?: string | null
        }
        Update: {
          additional_images?: string | null
          category_id?: number
          country_of_origin?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_available?: boolean
          name?: string
          original_price?: number | null
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      qaleb_products: {
        Row: {
          badge: string | null
          created_at: string
          description: string
          discounted_price: number
          features: string[]
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          live_demo_url: string
          original_price: number
          title: string
          whatsapp_message: string
        }
        Insert: {
          badge?: string | null
          created_at?: string
          description: string
          discounted_price: number
          features?: string[]
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          live_demo_url: string
          original_price: number
          title: string
          whatsapp_message: string
        }
        Update: {
          badge?: string | null
          created_at?: string
          description?: string
          discounted_price?: number
          features?: string[]
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          live_demo_url?: string
          original_price?: number
          title?: string
          whatsapp_message?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          clinic_name: string | null
          comment: string
          created_at: string | null
          doctor_name: string
          id: number
          rating: number
        }
        Insert: {
          clinic_name?: string | null
          comment: string
          created_at?: string | null
          doctor_name: string
          id?: number
          rating: number
        }
        Update: {
          clinic_name?: string | null
          comment?: string
          created_at?: string | null
          doctor_name?: string
          id?: number
          rating?: number
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          contact_address_ar: string | null
          contact_address_en: string | null
          contact_email: string | null
          contact_phone: string | null
          facebook_link: string | null
          id: number
          logo_url: string | null
          messenger_link: string | null
          show_messenger_button: boolean
          store_name: string | null
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          contact_address_ar?: string | null
          contact_address_en?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          facebook_link?: string | null
          id: number
          logo_url?: string | null
          messenger_link?: string | null
          show_messenger_button: boolean
          store_name?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          contact_address_ar?: string | null
          contact_address_en?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          facebook_link?: string | null
          id?: number
          logo_url?: string | null
          messenger_link?: string | null
          show_messenger_button?: boolean
          store_name?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
