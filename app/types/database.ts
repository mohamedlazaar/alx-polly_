/**
 * Database types that match the Supabase schema exactly
 * These types are generated from the actual database schema and provide
 * full type safety for all database operations.
 */

/**
 * Poll status enumeration
 * Represents the current state of a poll
 */
export type PollStatus = 'active' | 'inactive' | 'expired'

/**
 * Main database interface
 * Defines the complete structure of the Supabase database
 * Used by the Supabase client for type safety
 */
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

/**
 * Convenience types for working with the database
 * These provide easy access to commonly used database types
 */

/** Poll table row type - represents a complete poll record */
export type Poll = Database['public']['Tables']['polls']['Row']
/** Poll table insert type - used when creating new polls */
export type PollInsert = Database['public']['Tables']['polls']['Insert']
/** Poll table update type - used when updating existing polls */
export type PollUpdate = Database['public']['Tables']['polls']['Update']

/** Poll option table row type - represents a complete option record */
export type PollOption = Database['public']['Tables']['poll_options']['Row']
/** Poll option table insert type - used when creating new options */
export type PollOptionInsert = Database['public']['Tables']['poll_options']['Insert']
/** Poll option table update type - used when updating existing options */
export type PollOptionUpdate = Database['public']['Tables']['poll_options']['Update']

/** Vote table row type - represents a complete vote record */
export type Vote = Database['public']['Tables']['votes']['Row']
/** Vote table insert type - used when creating new votes */
export type VoteInsert = Database['public']['Tables']['votes']['Insert']
/** Vote table update type - used when updating existing votes */
export type VoteUpdate = Database['public']['Tables']['votes']['Update']

/** Poll statistics view type - aggregated poll data */
export type PollStats = Database['public']['Views']['poll_stats']['Row']

/**
 * Extended types for frontend use
 * These combine database types with additional computed fields
 */

/**
 * Poll with options and vote counts
 * Extends the base Poll type with options array and vote statistics
 */
export interface PollWithOptions extends Poll {
  /** Array of poll options with their vote counts */
  options: (PollOption & { vote_count: number })[]
  /** Optional aggregated statistics for the poll */
  stats?: PollStats
}

/**
 * Poll creation data
 * Simplified interface for creating new polls
 * Used in forms and API calls
 */
export interface CreatePollData {
  /** Poll title/question */
  title: string
  /** Optional detailed description */
  description?: string
  /** Array of option texts */
  options: string[]
  /** ISO string of expiration date */
  expires_at?: string
  /** Whether users can vote on multiple options */
  allow_multiple_votes: boolean
  /** Whether the poll should be public */
  is_public: boolean
}

/**
 * Vote submission data
 * Used when submitting votes for polls
 * Supports both authenticated and anonymous voting
 */
export interface VoteData {
  /** ID of the poll being voted on */
  poll_id: string
  /** ID of the option being voted for */
  option_id: string
  /** User ID for authenticated voting (optional) */
  user_id?: string
  /** Email for anonymous voting (optional) */
  voter_email?: string
  /** Name for anonymous voting (optional) */
  voter_name?: string
}
