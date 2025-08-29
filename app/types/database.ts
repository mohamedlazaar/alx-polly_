// Database types that match the Supabase schema exactly
export type PollStatus = 'active' | 'inactive' | 'expired'

export interface Database {
  public: {
    Tables: {
      polls: {
        Row: {
          id: string
          title: string
          description: string | null
          created_by: string
          created_at: string
          expires_at: string | null
          is_active: boolean
          allow_multiple_votes: boolean
          is_public: boolean
          status: PollStatus
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          created_by: string
          created_at?: string
          expires_at?: string | null
          is_active?: boolean
          allow_multiple_votes?: boolean
          is_public?: boolean
          status?: PollStatus
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          created_by?: string
          created_at?: string
          expires_at?: string | null
          is_active?: boolean
          allow_multiple_votes?: boolean
          is_public?: boolean
          status?: PollStatus
          updated_at?: string
        }
      }
      poll_options: {
        Row: {
          id: string
          poll_id: string
          text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          text: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          text?: string
          created_at?: string
          updated_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          poll_id: string
          option_id: string
          user_id: string | null
          voter_email: string | null
          voter_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          option_id: string
          user_id?: string | null
          voter_email?: string | null
          voter_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          option_id?: string
          user_id?: string | null
          voter_email?: string | null
          voter_name?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      poll_stats: {
        Row: {
          poll_id: string
          title: string
          description: string | null
          created_by: string
          created_at: string
          expires_at: string | null
          is_active: boolean
          allow_multiple_votes: boolean
          is_public: boolean
          status: PollStatus
          total_options: number
          total_votes: number
          unique_voters: number
        }
      }
    }
    Functions: {
      get_poll_option_vote_count: {
        Args: {
          option_uuid: string
        }
        Returns: number
      }
      get_poll_total_votes: {
        Args: {
          poll_uuid: string
        }
        Returns: number
      }
    }
  }
}

// Convenience types for working with the database
export type Poll = Database['public']['Tables']['polls']['Row']
export type PollInsert = Database['public']['Tables']['polls']['Insert']
export type PollUpdate = Database['public']['Tables']['polls']['Update']

export type PollOption = Database['public']['Tables']['poll_options']['Row']
export type PollOptionInsert = Database['public']['Tables']['poll_options']['Insert']
export type PollOptionUpdate = Database['public']['Tables']['poll_options']['Update']

export type Vote = Database['public']['Tables']['votes']['Row']
export type VoteInsert = Database['public']['Tables']['votes']['Insert']
export type VoteUpdate = Database['public']['Tables']['votes']['Update']

export type PollStats = Database['public']['Views']['poll_stats']['Row']

// Extended types for frontend use
export interface PollWithOptions extends Poll {
  options: (PollOption & { vote_count: number })[]
  stats?: PollStats
}

export interface CreatePollData {
  title: string
  description?: string
  options: string[]
  expires_at?: string
  allow_multiple_votes: boolean
  is_public: boolean
}

export interface VoteData {
  poll_id: string
  option_id: string
  user_id?: string
  voter_email?: string
  voter_name?: string
}
