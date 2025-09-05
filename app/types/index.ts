// Re-export database types for convenience
export * from './database'

/**
 * Legacy poll interface for backward compatibility
 * @deprecated Use database types instead
 */
export interface LegacyPoll {
  /** Unique identifier for the poll */
  id: string
  /** Poll title/question */
  title: string
  /** Optional detailed description */
  description?: string
  /** Array of poll options */
  options: LegacyPollOption[]
  /** ID of the user who created the poll */
  createdBy: string
  /** When the poll was created */
  createdAt: Date
  /** When the poll expires (optional) */
  expiresAt?: Date
  /** Whether the poll is currently active */
  isActive: boolean
  /** Whether users can vote on multiple options */
  allowMultipleVotes: boolean
  /** Whether the poll is visible to all users */
  isPublic: boolean
}

/**
 * Legacy poll option interface
 * @deprecated Use database types instead
 */
export interface LegacyPollOption {
  /** Unique identifier for the option */
  id: string
  /** Option text content */
  text: string
  /** Number of votes for this option */
  votes: number
}

/**
 * Legacy vote interface
 * @deprecated Use database types instead
 */
export interface LegacyVote {
  /** Unique identifier for the vote */
  id: string
  /** ID of the poll being voted on */
  pollId: string
  /** ID of the option being voted for */
  optionId: string
  /** ID of the user who voted */
  userId: string
  /** When the vote was cast */
  createdAt: Date
}

/**
 * Legacy poll creation data interface
 * @deprecated Use database types instead
 */
export interface LegacyCreatePollData {
  /** Poll title/question */
  title: string
  /** Optional detailed description */
  description?: string
  /** Array of option texts */
  options: string[]
  /** When the poll should expire */
  expiresAt?: Date
  /** Whether users can vote on multiple options */
  allowMultipleVotes: boolean
  /** Whether the poll should be public */
  isPublic: boolean
}

/**
 * Generic API response wrapper
 * Used for all API operations to provide consistent error handling
 * @template T - Type of data being returned
 */
export interface ApiResponse<T = any> {
  /** Success response data */
  data?: T
  /** Error information if operation failed */
  error?: {
    /** Human-readable error message */
    message: string
    /** Optional error code for programmatic handling */
    code?: string
  }
}

/**
 * Paginated response wrapper for list endpoints
 * Provides pagination metadata along with data
 * @template T - Type of items in the data array
 */
export interface PaginatedResponse<T> {
  /** Array of items for current page */
  data: T[]
  /** Total number of items across all pages */
  count: number
  /** Current page number (1-based) */
  page: number
  /** Number of items per page */
  limit: number
  /** Total number of pages */
  totalPages: number
}

/**
 * Form validation error mapping
 * Maps field names to their validation error messages
 */
export interface FormErrors {
  [key: string]: string
}

/**
 * Form validation result
 * Contains validation status and error messages
 */
export interface ValidationResult {
  /** Whether the form data is valid */
  isValid: boolean
  /** Object containing field-specific error messages */
  errors: FormErrors
}
