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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          company_name: string
          created_at: string
          email: string
          id: string
          industry_type: Database["public"]["Enums"]["industry_type"]
          location: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name: string
          created_at?: string
          email: string
          id?: string
          industry_type?: Database["public"]["Enums"]["industry_type"]
          location?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string
          created_at?: string
          email?: string
          id?: string
          industry_type?: Database["public"]["Enums"]["industry_type"]
          location?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      operational_data: {
        Row: {
          annual_revenue: number | null
          carbon_emissions: number | null
          company_id: string
          created_at: string
          current_challenges: string | null
          energy_consumption: number | null
          energy_unit: string | null
          id: string
          production_capacity: string | null
          resource_usage: string | null
          supply_chain_info: string | null
          updated_at: string
          waste_generated: number | null
          water_usage: number | null
          workforce_count: number | null
        }
        Insert: {
          annual_revenue?: number | null
          carbon_emissions?: number | null
          company_id: string
          created_at?: string
          current_challenges?: string | null
          energy_consumption?: number | null
          energy_unit?: string | null
          id?: string
          production_capacity?: string | null
          resource_usage?: string | null
          supply_chain_info?: string | null
          updated_at?: string
          waste_generated?: number | null
          water_usage?: number | null
          workforce_count?: number | null
        }
        Update: {
          annual_revenue?: number | null
          carbon_emissions?: number | null
          company_id?: string
          created_at?: string
          current_challenges?: string | null
          energy_consumption?: number | null
          energy_unit?: string | null
          id?: string
          production_capacity?: string | null
          resource_usage?: string | null
          supply_chain_info?: string | null
          updated_at?: string
          waste_generated?: number | null
          water_usage?: number | null
          workforce_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "operational_data_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      optimization_results: {
        Row: {
          category: string
          company_id: string
          created_at: string
          description: string
          id: string
          impact_level: string | null
          operational_data_id: string
          potential_savings: string | null
          status: string | null
          title: string
        }
        Insert: {
          category: string
          company_id: string
          created_at?: string
          description: string
          id?: string
          impact_level?: string | null
          operational_data_id: string
          potential_savings?: string | null
          status?: string | null
          title: string
        }
        Update: {
          category?: string
          company_id?: string
          created_at?: string
          description?: string
          id?: string
          impact_level?: string | null
          operational_data_id?: string
          potential_savings?: string | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "optimization_results_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "optimization_results_operational_data_id_fkey"
            columns: ["operational_data_id"]
            isOneToOne: false
            referencedRelation: "operational_data"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_uploads: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "industry"
        | "admin"
        | "procurement"
        | "sustainability"
        | "supplier"
      industry_type:
        | "manufacturing"
        | "energy"
        | "oil_gas"
        | "construction"
        | "aviation"
        | "agriculture"
        | "chemicals"
        | "real_estate"
        | "technology"
        | "healthcare"
        | "transportation"
        | "mining"
        | "textiles"
        | "food_processing"
        | "other"
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
    Enums: {
      app_role: [
        "industry",
        "admin",
        "procurement",
        "sustainability",
        "supplier",
      ],
      industry_type: [
        "manufacturing",
        "energy",
        "oil_gas",
        "construction",
        "aviation",
        "agriculture",
        "chemicals",
        "real_estate",
        "technology",
        "healthcare",
        "transportation",
        "mining",
        "textiles",
        "food_processing",
        "other",
      ],
    },
  },
} as const
