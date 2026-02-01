export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "member" | "admin";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          account_number?: string | null;
          twitter_handle?: string | null;
          discord_tag?: string | null;
          community_score?: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          account_number?: string | null;
          twitter_handle?: string | null;
          discord_tag?: string | null;
          community_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          account_number?: string | null;
          twitter_handle?: string | null;
          discord_tag?: string | null;
          community_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      modules: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          order_index: number;
          duration_estimate: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          order_index: number;
          duration_estimate?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          order_index?: number;
          duration_estimate?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      episodes: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          duration: string | null;
          order_index: number;
          video_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          title: string;
          duration?: string | null;
          order_index: number;
          video_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          title?: string;
          duration?: string | null;
          order_index?: number;
          video_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      progress: {
        Row: {
          user_id: string;
          episode_id: string;
          completed_at: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          episode_id: string;
          completed_at?: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          episode_id?: string;
          completed_at?: string;
          created_at?: string;
        };
      };
      resources: {
        Row: {
          id: string;
          category: string;
          title: string;
          type: string;
          url: string;
          preview_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category: string;
          title: string;
          type: string;
          url: string;
          preview_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category?: string;
          title?: string;
          type?: string;
          url?: string;
          preview_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          created_at: string;
          is_important: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          created_at?: string;
          is_important?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          created_at?: string;
          is_important?: boolean;
          updated_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          item_type: "episode" | "resource";
          episode_id: string | null;
          resource_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_type: "episode" | "resource";
          episode_id?: string | null;
          resource_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_type?: "episode" | "resource";
          episode_id?: string | null;
          resource_id?: string | null;
          created_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          episode_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          episode_id: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          episode_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type UsersUpdate = Database["public"]["Tables"]["users"]["Update"];
export type ModuleRow = Database["public"]["Tables"]["modules"]["Row"];
export type EpisodeRow = Database["public"]["Tables"]["episodes"]["Row"];
export type ProgressRow = Database["public"]["Tables"]["progress"]["Row"];
export type ResourceRow = Database["public"]["Tables"]["resources"]["Row"];
export type AnnouncementRow = Database["public"]["Tables"]["announcements"]["Row"];
export type FavoriteRow = Database["public"]["Tables"]["favorites"]["Row"];
export type NoteRow = Database["public"]["Tables"]["notes"]["Row"];
