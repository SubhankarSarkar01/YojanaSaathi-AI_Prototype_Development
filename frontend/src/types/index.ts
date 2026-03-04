// User Types
export interface User {
  userId: string
  mobileNumber: string
  mobileVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  profileId: string
  userId: string
  personalInfo: {
    name: string
    dateOfBirth?: string
    gender?: 'male' | 'female' | 'other'
    maritalStatus?: 'single' | 'married' | 'widowed' | 'divorced'
  }
  location: {
    state: string
    district: string
    block?: string
    village?: string
    pinCode: string
  }
  demographics: {
    category: 'general' | 'sc' | 'st' | 'obc' | 'ews'
    religion?: string
    minority?: boolean
  }
  economic: {
    occupation: string
    annualIncome: number
    bplCard?: boolean
    rationCardType?: 'apl' | 'bpl' | 'aay'
  }
  family: {
    familySize: number
    dependents: number
  }
  education: {
    qualification: string
    currentlyStudying?: boolean
  }
  disability?: {
    hasDisability: boolean
    disabilityType?: string
    disabilityPercentage?: number
  }
  preferences: {
    language: string
    notificationSms: boolean
    notificationEmail: boolean
  }
  metadata: {
    profileCompleteness: number
    createdAt: string
    updatedAt: string
  }
}

// Scheme Types
export interface Scheme {
  schemeId: string
  schemeCode: string
  name: Record<string, string>
  description: Record<string, string>
  category: 'agriculture' | 'education' | 'health' | 'employment' | 'housing' | 'social_welfare'
  level: 'central' | 'state'
  state?: string
  department: string
  benefits: {
    type: 'financial' | 'subsidy' | 'service' | 'training'
    amount?: number
    description: Record<string, string>
  }
  eligibility: {
    rules: EligibilityRule[]
    requiredDocuments: DocumentRequirement[]
  }
  applicationProcess: {
    steps: Array<{
      stepNumber: number
      description: Record<string, string>
    }>
    estimatedTime: string
  }
  timeline: {
    startDate?: string
    endDate?: string
    isOngoing: boolean
  }
  metadata: {
    popularity: number
    successRate: number
    averageProcessingDays: number
  }
}

export interface EligibilityRule {
  ruleId: string
  fieldName: string
  operator: 'eq' | 'lt' | 'lte' | 'gt' | 'gte' | 'in' | 'contains'
  value: any
  weight: number
}

export interface DocumentRequirement {
  requirementId: string
  documentType: string
  mandatory: boolean
  description: Record<string, string>
  sampleUrl?: string
}

// Recommendation Types
export interface RecommendedScheme {
  scheme: Scheme
  matchScore: number
  eligibilityStatus: 'eligible' | 'partially_eligible' | 'not_eligible'
  priority: 'high' | 'medium' | 'low'
  reasoning: {
    matchedAttributes: string[]
    benefitValue: number
    deadlineProximity?: number
    popularityScore: number
  }
}

// Application Types
export interface Application {
  applicationId: string
  userId: string
  schemeId: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
  submittedAt?: string
  documents: ApplicationDocument[]
  checklist: DocumentChecklist
  timeline: ApplicationTimeline[]
  metadata: {
    createdAt: string
    updatedAt: string
    completionPercentage: number
  }
}

export interface ApplicationDocument {
  documentId: string
  documentType: string
  uploadedAt: string
  verified: boolean
}

export interface DocumentChecklist {
  schemeId: string
  items: ChecklistItem[]
  completionPercentage: number
}

export interface ChecklistItem {
  documentType: string
  mandatory: boolean
  description: string
  uploaded: boolean
  documentId?: string
  status: 'pending' | 'uploaded' | 'verified' | 'rejected'
}

export interface ApplicationTimeline {
  timelineId: string
  status: string
  timestamp: string
  notes?: string
}

// Chat Types
export interface ChatMessage {
  messageId: string
  conversationId: string
  sender: 'user' | 'bot'
  text: string
  timestamp: string
  intent?: {
    name: string
    confidence: number
  }
  suggestedActions?: Array<{
    label: string
    action: string
    data?: any
  }>
}

// OCR Types
export interface OCRResult {
  documentType: string
  confidence: number
  fields: Record<string, {
    value: string
    confidence: number
  }>
  rawText: string
}
