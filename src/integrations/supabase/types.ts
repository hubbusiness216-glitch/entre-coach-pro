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
      business_inputs: {
        Row: {
          budget: string
          business_interest: string
          created_at: string
          goals: string
          id: string
          location: string
          user_id: string
        }
        Insert: {
          budget: string
          business_interest: string
          created_at?: string
          goals: string
          id?: string
          location: string
          user_id: string
        }
        Update: {
          budget?: string
          business_interest?: string
          created_at?: string
          goals?: string
          id?: string
          location?: string
          user_id?: string
        }
        Relationships: []
      }
      communication_evaluation: {
        Row: {
          created_at: string
          feedback: string | null
          fluency_score: number
          grammar_score: number
          id: string
          input_text: string | null
          listening_score: number
          pronunciation_score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          fluency_score?: number
          grammar_score?: number
          id?: string
          input_text?: string | null
          listening_score?: number
          pronunciation_score?: number
          user_id: string
        }
        Update: {
          created_at?: string
          feedback?: string | null
          fluency_score?: number
          grammar_score?: number
          id?: string
          input_text?: string | null
          listening_score?: number
          pronunciation_score?: number
          user_id?: string
        }
        Relationships: []
      }
      pitch_sessions: {
        Row: {
          ai_feedback: string | null
          created_at: string
          id: string
          scenario_type: string
          score: number | null
          user_id: string
          user_response: string | null
        }
        Insert: {
          ai_feedback?: string | null
          created_at?: string
          id?: string
          scenario_type: string
          score?: number | null
          user_id: string
          user_response?: string | null
        }
        Update: {
          ai_feedback?: string | null
          created_at?: string
          id?: string
          scenario_type?: string
          score?: number | null
          user_id?: string
          user_response?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_reports: {
        Row: {
          created_at: string
          file_path: string
          id: string
          report_name: string
          report_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_path: string
          id?: string
          report_name: string
          report_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_path?: string
          id?: string
          report_name?: string
          report_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_type: Database["public"]["Enums"]["achievement_type"]
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_type: Database["public"]["Enums"]["achievement_type"]
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_type?: Database["public"]["Enums"]["achievement_type"]
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_activity_date: string | null
          level: number
          longest_streak: number
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          level?: number
          longest_streak?: number
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          level?: number
          longest_streak?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      weekly_goals: {
        Row: {
          completed: boolean
          created_at: string
          current_value: number
          goal_type: string
          id: string
          target_value: number
          user_id: string
          week_start: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          current_value?: number
          goal_type: string
          id?: string
          target_value?: number
          user_id: string
          week_start: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          current_value?: number
          goal_type?: string
          id?: string
          target_value?: number
          user_id?: string
          week_start?: string
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
      achievement_type:
        | "first_plan"
        | "first_evaluation"
        | "streak_3"
        | "streak_7"
        | "streak_30"
        | "communication_master"
        | "listener_pro"
        | "pitch_perfect"
        | "goal_achiever"
        | "report_generator"
        | "consistency_king"
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
      achievement_type: [
        "first_plan",
        "first_evaluation",
        "streak_3",
        "streak_7",
        "streak_30",
        "communication_master",
        "listener_pro",
        "pitch_perfect",
        "goal_achiever",
        "report_generator",
        "consistency_king",
      ],
    },
  },
} as const
