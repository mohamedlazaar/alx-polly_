// Re-export database types for convenience
export * from './database'

// Legacy types for backward compatibility
// These will be deprecated in favor of the database types
export interface LegacyPoll {
  id: string
  title: string
  description?: string
  options: LegacyPollOption[]
  createdBy: string
  createdAt: Date
  expiresAt?: Date
  isActive: boolean
  allowMultipleVotes: boolean
  isPublic: boolean
}

export interface LegacyPollOption {
  id: string
  text: string
  votes: number
}

export interface LegacyVote {
  id: string
  pollId: string
  optionId: string
  userId: string
  createdAt: Date
}

export interface LegacyCreatePollData {
  title: string
  description?: string
  options: string[]
  expiresAt?: Date
  allowMultipleVotes: boolean
  isPublic: boolean
}

// Utility types for API responses
export interface ApiResponse<T = any> {
  data?: T
  error?: {
    message: string
    code?: string
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  totalPages: number
}

// Form validation types
export interface FormErrors {
  [key: string]: string
}

export interface ValidationResult {
  isValid: boolean
  errors: FormErrors
}
