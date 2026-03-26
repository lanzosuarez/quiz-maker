export type QuestionType = 'mcq' | 'short' | 'code'

export interface Quiz {
  id: number
  title: string
  description: string
  timeLimitSeconds?: number | null
  isPublished: boolean
  createdAt: string
}

export interface Question {
  id: number
  quizId: number
  type: QuestionType
  prompt: string
  codeSnippet?: string
  options?: string[]
  correctAnswer?: string | number | null
  position: number
}

export interface QuizWithQuestions extends Quiz {
  questions: Question[]
}

export interface AttemptAnswer {
  questionId: number
  value: string
}

export interface AttemptStart {
  id: number
  quizId: number
  startedAt: string
  submittedAt: string | null
  answers: AttemptAnswer[]
  quiz: {
    id: number
    title: string
    description: string
    timeLimitSeconds?: number | null
    questions: Omit<Question, 'correctAnswer'>[]
  }
}

export interface SubmitDetail {
  questionId: number
  correct: boolean
  expected?: string
}

export interface SubmitResult {
  score: number
  details: SubmitDetail[]
}

export interface AntiCheatEventEntry {
  event: string
  timestamp: string
}
