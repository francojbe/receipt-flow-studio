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
      dish_ratings: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          menu_item_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          menu_item_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          menu_item_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dish_ratings_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      gastos: {
        Row: {
          created_at: string | null
          fecha_gasto: string | null
          id: number
          medio_pago: string | null
          monto_total: number | null
          nombre_comercio: string
          rut_emisor: string | null
        }
        Insert: {
          created_at?: string | null
          fecha_gasto?: string | null
          id?: number
          medio_pago?: string | null
          monto_total?: number | null
          nombre_comercio: string
          rut_emisor?: string | null
        }
        Update: {
          created_at?: string | null
          fecha_gasto?: string | null
          id?: number
          medio_pago?: string | null
          monto_total?: number | null
          nombre_comercio?: string
          rut_emisor?: string | null
        }
        Relationships: []
      }
      gastos_tdc: {
        Row: {
          comercio: string | null
          creado_en: string | null
          fecha_hora: string | null
          fuente: string | null
          id: string
          medio: string | null
          monto: number | null
          nombre: string | null
          tarjeta: string | null
          texto_original: string | null
        }
        Insert: {
          comercio?: string | null
          creado_en?: string | null
          fecha_hora?: string | null
          fuente?: string | null
          id?: string
          medio?: string | null
          monto?: number | null
          nombre?: string | null
          tarjeta?: string | null
          texto_original?: string | null
        }
        Update: {
          comercio?: string | null
          creado_en?: string | null
          fecha_hora?: string | null
          fuente?: string | null
          id?: string
          medio?: string | null
          monto?: number | null
          nombre?: string | null
          tarjeta?: string | null
          texto_original?: string | null
        }
        Relationships: []
      }
      import_sessions: {
        Row: {
          city: string
          created_at: string
          current_page: number
          current_term_index: number
          id: string
          last_place_ids: string[]
          metadata: Json | null
          processed_terms: string[]
          status: string
          total_found: number
          updated_at: string
        }
        Insert: {
          city: string
          created_at?: string
          current_page?: number
          current_term_index?: number
          id?: string
          last_place_ids?: string[]
          metadata?: Json | null
          processed_terms?: string[]
          status?: string
          total_found?: number
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          current_page?: number
          current_term_index?: number
          id?: string
          last_place_ids?: string[]
          metadata?: Json | null
          processed_terms?: string[]
          status?: string
          total_found?: number
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          categoria: string
          created_at: string
          descripcion: string | null
          disponible: boolean
          id: string
          imagen_url: string | null
          nombre: string
          popular: boolean | null
          precio: number
          restaurante_id: string
          updated_at: string
        }
        Insert: {
          categoria?: string
          created_at?: string
          descripcion?: string | null
          disponible?: boolean
          id?: string
          imagen_url?: string | null
          nombre: string
          popular?: boolean | null
          precio?: number
          restaurante_id: string
          updated_at?: string
        }
        Update: {
          categoria?: string
          created_at?: string
          descripcion?: string | null
          disponible?: boolean
          id?: string
          imagen_url?: string | null
          nombre?: string
          popular?: boolean | null
          precio?: number
          restaurante_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_restaurante_id_fkey"
            columns: ["restaurante_id"]
            isOneToOne: false
            referencedRelation: "restaurantes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          nombre: string
          tipo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          metadata?: Json | null
          nombre: string
          tipo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          nombre?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      restaurant_ratings: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          restaurant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          restaurant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          restaurant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_ratings_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurantes"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurantes: {
        Row: {
          comuna: string | null
          descripcion: string | null
          direccion: string | null
          geoapify_place_id: string | null
          horario: Json | null
          id: string
          imagen_url: string | null
          logo_url: string | null
          rango_precios: string | null
          redes_sociales: Json | null
          servicios: Json | null
          telefono: string | null
          ubicacion_lat: number | null
          ubicacion_lng: number | null
        }
        Insert: {
          comuna?: string | null
          descripcion?: string | null
          direccion?: string | null
          geoapify_place_id?: string | null
          horario?: Json | null
          id: string
          imagen_url?: string | null
          logo_url?: string | null
          rango_precios?: string | null
          redes_sociales?: Json | null
          servicios?: Json | null
          telefono?: string | null
          ubicacion_lat?: number | null
          ubicacion_lng?: number | null
        }
        Update: {
          comuna?: string | null
          descripcion?: string | null
          direccion?: string | null
          geoapify_place_id?: string | null
          horario?: Json | null
          id?: string
          imagen_url?: string | null
          logo_url?: string | null
          rango_precios?: string | null
          redes_sociales?: Json | null
          servicios?: Json | null
          telefono?: string | null
          ubicacion_lat?: number | null
          ubicacion_lng?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurantes_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          comuna: string | null
          correo: string
          fecha_registro: string | null
          id: string
          nombre: string | null
          plato_favorito: string | null
          tipo_usuario: string
        }
        Insert: {
          comuna?: string | null
          correo: string
          fecha_registro?: string | null
          id: string
          nombre?: string | null
          plato_favorito?: string | null
          tipo_usuario: string
        }
        Update: {
          comuna?: string | null
          correo?: string
          fecha_registro?: string | null
          id?: string
          nombre?: string | null
          plato_favorito?: string | null
          tipo_usuario?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_average_rating: { Args: { item_id: string }; Returns: number }
      get_rating_count: { Args: { item_id: string }; Returns: number }
      get_restaurant_average_rating: {
        Args: { rest_id: string }
        Returns: number
      }
      get_restaurant_rating_count: {
        Args: { rest_id: string }
        Returns: number
      }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      match_documents_clinica: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
    }
    Enums: {
      user_type: "usuario" | "restaurante" | "admin"
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
      user_type: ["usuario", "restaurante", "admin"],
    },
  },
} as const
