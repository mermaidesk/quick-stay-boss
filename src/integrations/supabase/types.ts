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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          check_in_date: string
          check_out_date: string
          created_at: string
          guest_name: string
          id: string
          notes: string | null
          property_id: string
          source: string | null
          total_revenue: number | null
          updated_at: string
        }
        Insert: {
          check_in_date: string
          check_out_date: string
          created_at?: string
          guest_name: string
          id?: string
          notes?: string | null
          property_id: string
          source?: string | null
          total_revenue?: number | null
          updated_at?: string
        }
        Update: {
          check_in_date?: string
          check_out_date?: string
          created_at?: string
          guest_name?: string
          id?: string
          notes?: string | null
          property_id?: string
          source?: string | null
          total_revenue?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          property_id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          property_id: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          property_id?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      documentation: {
        Row: {
          content: string | null
          created_at: string
          id: string
          property_id: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          property_id: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          property_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentation_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string | null
          expense_date: string
          id: string
          notes: string | null
          property_id: string
          receipt_link: string | null
          updated_at: string
          vendor: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description?: string | null
          expense_date: string
          id?: string
          notes?: string | null
          property_id: string
          receipt_link?: string | null
          updated_at?: string
          vendor: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          expense_date?: string
          id?: string
          notes?: string | null
          property_id?: string
          receipt_link?: string | null
          updated_at?: string
          vendor?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      income: {
        Row: {
          booking_date: string
          check_in_date: string
          check_out_date: string
          created_at: string
          fees: number | null
          gross_income: number
          guest_name: string | null
          id: string
          net_income: number
          nights: number
          property_id: string
          source: string | null
          updated_at: string
        }
        Insert: {
          booking_date: string
          check_in_date: string
          check_out_date: string
          created_at?: string
          fees?: number | null
          gross_income: number
          guest_name?: string | null
          id?: string
          net_income: number
          nights: number
          property_id: string
          source?: string | null
          updated_at?: string
        }
        Update: {
          booking_date?: string
          check_in_date?: string
          check_out_date?: string
          created_at?: string
          fees?: number | null
          gross_income?: number
          guest_name?: string | null
          id?: string
          net_income?: number
          nights?: number
          property_id?: string
          source?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "income_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_log: {
        Row: {
          assigned_to: string | null
          completion_date: string | null
          cost: number | null
          created_at: string
          date_reported: string
          id: string
          issue_description: string
          notes: string | null
          property_id: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completion_date?: string | null
          cost?: number | null
          created_at?: string
          date_reported: string
          id?: string
          issue_description: string
          notes?: string | null
          property_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completion_date?: string | null
          cost?: number | null
          created_at?: string
          date_reported?: string
          id?: string
          issue_description?: string
          notes?: string | null
          property_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_log_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          created_at: string
          google_calendar_id: string | null
          google_form_id: string | null
          google_sheets_id: string | null
          id: string
          property_address: string | null
          property_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          google_calendar_id?: string | null
          google_form_id?: string | null
          google_sheets_id?: string | null
          id?: string
          property_address?: string | null
          property_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          google_calendar_id?: string | null
          google_form_id?: string | null
          google_sheets_id?: string | null
          id?: string
          property_address?: string | null
          property_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      regulation_log: {
        Row: {
          created_at: string
          document_name: string
          file_link: string | null
          id: string
          issuing_authority: string
          notes: string | null
          property_id: string
          renewal_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_name: string
          file_link?: string | null
          id?: string
          issuing_authority: string
          notes?: string | null
          property_id: string
          renewal_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_name?: string
          file_link?: string | null
          id?: string
          issuing_authority?: string
          notes?: string | null
          property_id?: string
          renewal_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "regulation_log_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          bookings_sheet_url: string | null
          calendar_id: string | null
          contacts_sheet_url: string | null
          created_at: string | null
          documentation_sheet_url: string | null
          expense_form_url: string | null
          expense_sheet_url: string | null
          id: string
          income_sheet_url: string | null
          maintenance_sheet_url: string | null
          regulatory_sheet_url: string | null
          updated_at: string | null
        }
        Insert: {
          bookings_sheet_url?: string | null
          calendar_id?: string | null
          contacts_sheet_url?: string | null
          created_at?: string | null
          documentation_sheet_url?: string | null
          expense_form_url?: string | null
          expense_sheet_url?: string | null
          id: string
          income_sheet_url?: string | null
          maintenance_sheet_url?: string | null
          regulatory_sheet_url?: string | null
          updated_at?: string | null
        }
        Update: {
          bookings_sheet_url?: string | null
          calendar_id?: string | null
          contacts_sheet_url?: string | null
          created_at?: string | null
          documentation_sheet_url?: string | null
          expense_form_url?: string | null
          expense_sheet_url?: string | null
          id?: string
          income_sheet_url?: string | null
          maintenance_sheet_url?: string | null
          regulatory_sheet_url?: string | null
          updated_at?: string | null
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
