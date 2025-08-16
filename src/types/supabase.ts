export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4";
  };
  public: {
    Tables: {
      business_logos: {
        Row: {
          business_id: string;
          created_at: string | null;
          crop_data: Json | null;
          file_size: number;
          id: string;
          mime_type: string;
          original_filename: string;
          storage_path: string;
          updated_at: string | null;
        };
        Insert: {
          business_id: string;
          created_at?: string | null;
          crop_data?: Json | null;
          file_size: number;
          id?: string;
          mime_type: string;
          original_filename: string;
          storage_path: string;
          updated_at?: string | null;
        };
        Update: {
          business_id?: string;
          created_at?: string | null;
          crop_data?: Json | null;
          file_size?: number;
          id?: string;
          mime_type?: string;
          original_filename?: string;
          storage_path?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "business_logos_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      businesses: {
        Row: {
          abn: string | null;
          acn: string | null;
          address: string;
          business_name: string;
          business_type: string;
          created_at: string | null;
          description: string | null;
          id: string;
          logo_url: string | null;
          phone: string | null;
          plan_type: string;
          postcode: string;
          primary_contact_email: string | null;
          primary_contact_name: string | null;
          primary_contact_phone: string | null;
          secondary_contact_email: string | null;
          secondary_contact_name: string | null;
          secondary_contact_phone: string | null;
          state: string;
          suburb: string;
          trial_ends_at: string | null;
          updated_at: string | null;
          user_id: string;
          website: string | null;
        };
        Insert: {
          abn?: string | null;
          acn?: string | null;
          address: string;
          business_name: string;
          business_type: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          logo_url?: string | null;
          phone?: string | null;
          plan_type?: string;
          postcode: string;
          primary_contact_email?: string | null;
          primary_contact_name?: string | null;
          primary_contact_phone?: string | null;
          secondary_contact_email?: string | null;
          secondary_contact_name?: string | null;
          secondary_contact_phone?: string | null;
          state: string;
          suburb: string;
          trial_ends_at?: string | null;
          updated_at?: string | null;
          user_id: string;
          website?: string | null;
        };
        Update: {
          abn?: string | null;
          acn?: string | null;
          address?: string;
          business_name?: string;
          business_type?: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          logo_url?: string | null;
          phone?: string | null;
          plan_type?: string;
          postcode?: string;
          primary_contact_email?: string | null;
          primary_contact_name?: string | null;
          primary_contact_phone?: string | null;
          secondary_contact_email?: string | null;
          secondary_contact_name?: string | null;
          secondary_contact_phone?: string | null;
          state?: string;
          suburb?: string;
          trial_ends_at?: string | null;
          updated_at?: string | null;
          user_id?: string;
          website?: string | null;
        };
        Relationships: [];
      };
      customer_stamps: {
        Row: {
          created_at: string | null;
          customer_id: string;
          id: string;
          last_stamp_at: string | null;
          stamp_card_id: string;
          stamps_earned: number | null;
          stamps_redeemed: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          customer_id: string;
          id?: string;
          last_stamp_at?: string | null;
          stamp_card_id: string;
          stamps_earned?: number | null;
          stamps_redeemed?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          customer_id?: string;
          id?: string;
          last_stamp_at?: string | null;
          stamp_card_id?: string;
          stamps_earned?: number | null;
          stamps_redeemed?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "customer_stamps_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "customer_stamps_stamp_card_id_fkey";
            columns: ["stamp_card_id"];
            isOneToOne: false;
            referencedRelation: "stamp_cards";
            referencedColumns: ["id"];
          },
        ];
      };
      customers: {
        Row: {
          avatar_url: string | null;
          business_id: string;
          created_at: string | null;
          email: string | null;
          id: string;
          name: string;
          phone: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          business_id: string;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          name: string;
          phone?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          business_id?: string;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          name?: string;
          phone?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "customers_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      stamp_cards: {
        Row: {
          accent_color: string | null;
          background_color: string | null;
          business_id: string;
          created_at: string | null;
          custom_stamp_image: string | null;
          description: string | null;
          font_size: string | null;
          id: string;
          is_active: boolean | null;
          layout: string | null;
          name: string;
          qr_code_data: Json | null;
          reward_description: string;
          selected_emoji: string | null;
          show_logo: boolean | null;
          show_progress: boolean | null;
          stamp_base_shape: string | null;
          stamp_shape: string | null;
          stamps_required: number;
          text_color: string | null;
          updated_at: string | null;
        };
        Insert: {
          accent_color?: string | null;
          background_color?: string | null;
          business_id: string;
          created_at?: string | null;
          custom_stamp_image?: string | null;
          description?: string | null;
          font_size?: string | null;
          id?: string;
          is_active?: boolean | null;
          layout?: string | null;
          name: string;
          qr_code_data?: Json | null;
          reward_description: string;
          selected_emoji?: string | null;
          show_logo?: boolean | null;
          show_progress?: boolean | null;
          stamp_base_shape?: string | null;
          stamp_shape?: string | null;
          stamps_required?: number;
          text_color?: string | null;
          updated_at?: string | null;
        };
        Update: {
          accent_color?: string | null;
          background_color?: string | null;
          business_id?: string;
          created_at?: string | null;
          custom_stamp_image?: string | null;
          description?: string | null;
          font_size?: string | null;
          id?: string;
          is_active?: boolean | null;
          layout?: string | null;
          name?: string;
          qr_code_data?: Json | null;
          reward_description?: string;
          selected_emoji?: string | null;
          show_logo?: boolean | null;
          show_progress?: boolean | null;
          stamp_base_shape?: string | null;
          stamp_shape?: string | null;
          stamps_required?: number;
          text_color?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "stamp_cards_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      stamp_requests: {
        Row: {
          approved_at: string | null;
          business_id: string;
          created_at: string | null;
          customer_stamp_id: string;
          denied_at: string | null;
          id: string;
          is_new_customer: boolean | null;
          notes: string | null;
          requested_at: string | null;
          snoozed_at: string | null;
          stamp_number: number;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          approved_at?: string | null;
          business_id: string;
          created_at?: string | null;
          customer_stamp_id: string;
          denied_at?: string | null;
          id?: string;
          is_new_customer?: boolean | null;
          notes?: string | null;
          requested_at?: string | null;
          snoozed_at?: string | null;
          stamp_number?: number;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          approved_at?: string | null;
          business_id?: string;
          created_at?: string | null;
          customer_stamp_id?: string;
          denied_at?: string | null;
          id?: string;
          is_new_customer?: boolean | null;
          notes?: string | null;
          requested_at?: string | null;
          snoozed_at?: string | null;
          stamp_number?: number;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "stamp_requests_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "stamp_requests_customer_stamp_id_fkey";
            columns: ["customer_stamp_id"];
            isOneToOne: false;
            referencedRelation: "customer_stamps";
            referencedColumns: ["id"];
          },
        ];
      };
      stamp_transactions: {
        Row: {
          created_at: string | null;
          customer_stamp_id: string;
          id: string;
          notes: string | null;
          stamps_count: number;
          transaction_type: string;
        };
        Insert: {
          created_at?: string | null;
          customer_stamp_id: string;
          id?: string;
          notes?: string | null;
          stamps_count?: number;
          transaction_type: string;
        };
        Update: {
          created_at?: string | null;
          customer_stamp_id?: string;
          id?: string;
          notes?: string | null;
          stamps_count?: number;
          transaction_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "stamp_transactions_customer_stamp_id_fkey";
            columns: ["customer_stamp_id"];
            isOneToOne: false;
            referencedRelation: "customer_stamps";
            referencedColumns: ["id"];
          },
        ];
      };
      loyo_pwa_customers: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          business_id: string;
          stamp_card_id: string;
          registration_source: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          business_id: string;
          stamp_card_id: string;
          registration_source?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          business_id?: string;
          stamp_card_id?: string;
          registration_source?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "loyo_pwa_customers_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "loyo_pwa_customers_stamp_card_id_fkey";
            columns: ["stamp_card_id"];
            isOneToOne: false;
            referencedRelation: "stamp_cards";
            referencedColumns: ["id"];
          },
        ];
      };
      loyo_stamp_requests: {
        Row: {
          id: string;
          customer_id: string;
          stamp_card_id: string;
          business_id: string;
          status: string;
          is_new_customer: boolean | null;
          requested_at: string | null;
          approved_at: string | null;
          denied_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          customer_id: string;
          stamp_card_id: string;
          business_id: string;
          status?: string;
          is_new_customer?: boolean | null;
          requested_at?: string | null;
          approved_at?: string | null;
          denied_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          customer_id?: string;
          stamp_card_id?: string;
          business_id?: string;
          status?: string;
          is_new_customer?: boolean | null;
          requested_at?: string | null;
          approved_at?: string | null;
          denied_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "loyo_stamp_requests_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "loyo_pwa_customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "loyo_stamp_requests_stamp_card_id_fkey";
            columns: ["stamp_card_id"];
            isOneToOne: false;
            referencedRelation: "stamp_cards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "loyo_stamp_requests_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          image: string | null;
          name: string | null;
          token_identifier: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          image?: string | null;
          name?: string | null;
          token_identifier: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          image?: string | null;
          name?: string | null;
          token_identifier?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
