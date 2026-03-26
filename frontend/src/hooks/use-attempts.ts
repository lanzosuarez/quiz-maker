import { useMutation } from '@tanstack/react-query'
import {
  recordEvent,
  startAttempt,
  submitAnswer,
  submitAttempt,
} from '@/api/attempts'

export function useStartAttempt() {
  return useMutation({
    mutationFn: (quizId: number | string) => startAttempt(quizId),
  })
}

export function useSubmitAnswer() {
  return useMutation({
    mutationFn: ({
      attemptId,
      questionId,
      value,
    }: {
      attemptId: number | string
      questionId: number
      value: string
    }) => submitAnswer(attemptId, questionId, value),
  })
}

export function useSubmitAttempt() {
  return useMutation({
    mutationFn: (attemptId: number | string) => submitAttempt(attemptId),
  })
}

export function useRecordEvent() {
  return useMutation({
    mutationFn: ({
      attemptId,
      event,
    }: {
      attemptId: number | string
      event: string
    }) => recordEvent(attemptId, event),
  })
}
