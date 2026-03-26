import { apiFetch } from './client'
import type { Question, Quiz, QuizWithQuestions } from '@/types/quiz'

export interface CreateQuizBody {
  title: string
  description: string
  timeLimitSeconds?: number | null
  isPublished?: boolean
}

export interface UpdateQuizBody {
  title?: string
  description?: string
  timeLimitSeconds?: number | null
  isPublished?: boolean
}

export interface CreateQuestionBody {
  type: 'mcq' | 'short' | 'code'
  prompt: string
  codeSnippet?: string | null
  options?: string[]
  correctAnswer?: string | number | null
  position?: number
}

export interface UpdateQuestionBody {
  type?: 'mcq' | 'short' | 'code'
  prompt?: string
  codeSnippet?: string | null
  options?: string[] | null
  correctAnswer?: string | number | null
  position?: number
}

export function listQuizzes(): Promise<Quiz[]> {
  return apiFetch<Quiz[]>('/quizzes')
}

export function createQuiz(body: CreateQuizBody): Promise<Quiz> {
  return apiFetch<Quiz>('/quizzes', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function getQuiz(id: number | string): Promise<QuizWithQuestions> {
  return apiFetch<QuizWithQuestions>(`/quizzes/${id}`)
}

export function updateQuiz(
  id: number | string,
  body: UpdateQuizBody,
): Promise<Quiz> {
  return apiFetch<Quiz>(`/quizzes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function createQuestion(
  quizId: number | string,
  body: CreateQuestionBody,
): Promise<Question> {
  return apiFetch<Question>(`/quizzes/${quizId}/questions`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function updateQuestion(
  questionId: number | string,
  body: UpdateQuestionBody,
): Promise<Question> {
  return apiFetch<Question>(`/questions/${questionId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function deleteQuestion(questionId: number | string): Promise<void> {
  return apiFetch<void>(`/questions/${questionId}`, { method: 'DELETE' })
}
