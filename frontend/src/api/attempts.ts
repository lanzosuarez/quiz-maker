import { apiFetch } from './client'
import type { AttemptStart, SubmitResult } from '@/types/quiz'

export function startAttempt(quizId: number | string): Promise<AttemptStart> {
  return apiFetch<AttemptStart>('/attempts', {
    method: 'POST',
    body: JSON.stringify({ quizId: Number(quizId) }),
  })
}

export function submitAnswer(
  attemptId: number | string,
  questionId: number,
  value: string,
): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`/attempts/${attemptId}/answer`, {
    method: 'POST',
    body: JSON.stringify({ questionId, value }),
  })
}

export function submitAttempt(
  attemptId: number | string,
): Promise<SubmitResult> {
  return apiFetch<SubmitResult>(`/attempts/${attemptId}/submit`, {
    method: 'POST',
  })
}

export function recordEvent(
  attemptId: number | string,
  event: string,
): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`/attempts/${attemptId}/events`, {
    method: 'POST',
    body: JSON.stringify({ event }),
  })
}
