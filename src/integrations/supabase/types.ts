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
      audits: {
        Row: {
          completed_at: string | null
          content_score: number | null
          crawl_health_score: number | null
          created_at: string
          error_message: string | null
          follow_sitemap: boolean
          id: string
          max_depth: number
          max_pages: number
          onpage_score: number | null
          overall_score: number | null
          pages_crawled: number
          pages_total: number
          respect_robots: boolean
          schema_score: number | null
          status: string
          technical_score: number | null
          updated_at: string
          url: string
        }
        Insert: {
          completed_at?: string | null
          content_score?: number | null
          crawl_health_score?: number | null
          created_at?: string
          error_message?: string | null
          follow_sitemap?: boolean
          id?: string
          max_depth?: number
          max_pages?: number
          onpage_score?: number | null
          overall_score?: number | null
          pages_crawled?: number
          pages_total?: number
          respect_robots?: boolean
          schema_score?: number | null
          status?: string
          technical_score?: number | null
          updated_at?: string
          url: string
        }
        Update: {
          completed_at?: string | null
          content_score?: number | null
          crawl_health_score?: number | null
          created_at?: string
          error_message?: string | null
          follow_sitemap?: boolean
          id?: string
          max_depth?: number
          max_pages?: number
          onpage_score?: number | null
          overall_score?: number | null
          pages_crawled?: number
          pages_total?: number
          respect_robots?: boolean
          schema_score?: number | null
          status?: string
          technical_score?: number | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      issues: {
        Row: {
          affected_pages: number | null
          audit_id: string
          category: string
          created_at: string
          description: string
          effort: string | null
          evidence: string | null
          fix_plan: string | null
          id: string
          impact_score: number | null
          page_id: string | null
          severity: string
          title: string
        }
        Insert: {
          affected_pages?: number | null
          audit_id: string
          category: string
          created_at?: string
          description: string
          effort?: string | null
          evidence?: string | null
          fix_plan?: string | null
          id?: string
          impact_score?: number | null
          page_id?: string | null
          severity: string
          title: string
        }
        Update: {
          affected_pages?: number | null
          audit_id?: string
          category?: string
          created_at?: string
          description?: string
          effort?: string | null
          evidence?: string | null
          fix_plan?: string | null
          id?: string
          impact_score?: number | null
          page_id?: string | null
          severity?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "issues_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          audit_id: string
          canonical_url: string | null
          created_at: string
          h1: string | null
          has_schema: boolean
          html_size: number | null
          id: string
          is_indexable: boolean | null
          load_time_ms: number | null
          meta_description: string | null
          page_score: number | null
          robots_meta: string | null
          schema_types: string[] | null
          status_code: number | null
          title: string | null
          url: string
          word_count: number | null
        }
        Insert: {
          audit_id: string
          canonical_url?: string | null
          created_at?: string
          h1?: string | null
          has_schema?: boolean
          html_size?: number | null
          id?: string
          is_indexable?: boolean | null
          load_time_ms?: number | null
          meta_description?: string | null
          page_score?: number | null
          robots_meta?: string | null
          schema_types?: string[] | null
          status_code?: number | null
          title?: string | null
          url: string
          word_count?: number | null
        }
        Update: {
          audit_id?: string
          canonical_url?: string | null
          created_at?: string
          h1?: string | null
          has_schema?: boolean
          html_size?: number | null
          id?: string
          is_indexable?: boolean | null
          load_time_ms?: number | null
          meta_description?: string | null
          page_score?: number | null
          robots_meta?: string | null
          schema_types?: string[] | null
          status_code?: number | null
          title?: string | null
          url?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
        ]
      }
      schema_entities: {
        Row: {
          audit_id: string
          created_at: string
          errors: Json | null
          has_required_fields: boolean | null
          id: string
          is_valid: boolean
          page_id: string
          properties_count: number | null
          raw_json: Json
          schema_type: string
          source_format: string
          warnings: Json | null
        }
        Insert: {
          audit_id: string
          created_at?: string
          errors?: Json | null
          has_required_fields?: boolean | null
          id?: string
          is_valid?: boolean
          page_id: string
          properties_count?: number | null
          raw_json: Json
          schema_type: string
          source_format: string
          warnings?: Json | null
        }
        Update: {
          audit_id?: string
          created_at?: string
          errors?: Json | null
          has_required_fields?: boolean | null
          id?: string
          is_valid?: boolean
          page_id?: string
          properties_count?: number | null
          raw_json?: Json
          schema_type?: string
          source_format?: string
          warnings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "schema_entities_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schema_entities_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
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
