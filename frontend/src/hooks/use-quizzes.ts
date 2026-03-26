import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createQuestion,
  createQuiz,
  deleteQuestion,
  getQuiz,
  listQuizzes,
  updateQuestion,
  updateQuiz,
  type CreateQuestionBody,
  type CreateQuizBody,
  type UpdateQuestionBody,
  type UpdateQuizBody,
} from '@/api/quizzes'

export const quizKeys = {
  all: ['quizzes'] as const,
  detail: (id: number | string) => ['quizzes', id] as const,
}

export function useQuizList() {
  return useQuery({
    queryKey: quizKeys.all,
    queryFn: listQuizzes,
  })
}

export function useQuiz(id: number | string | undefined) {
  return useQuery({
    queryKey: id != null ? quizKeys.detail(id) : ['quizzes', 'none'],
    queryFn: () => getQuiz(id!),
    enabled: id != null,
  })
}

export function useCreateQuiz() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateQuizBody) => createQuiz(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: quizKeys.all }),
  })
}

export function useUpdateQuiz() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number | string
      body: UpdateQuizBody
    }) => updateQuiz(id, body),
    onSuccess: (_data, { id }) => {
      void qc.invalidateQueries({ queryKey: quizKeys.all })
      void qc.invalidateQueries({ queryKey: quizKeys.detail(id) })
    },
  })
}

export function useCreateQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      quizId,
      body,
    }: {
      quizId: number | string
      body: CreateQuestionBody
    }) => createQuestion(quizId, body),
    onSuccess: (_data, { quizId }) => {
      void qc.invalidateQueries({ queryKey: quizKeys.detail(quizId) })
      void qc.invalidateQueries({ queryKey: quizKeys.all })
    },
  })
}

export function useUpdateQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      questionId,
      body,
    }: {
      questionId: number | string
      quizId: number | string
      body: UpdateQuestionBody
    }) => updateQuestion(questionId, body),
    onSuccess: (_data, { quizId }) => {
      void qc.invalidateQueries({ queryKey: quizKeys.detail(quizId) })
    },
  })
}

export function useDeleteQuestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      questionId,
    }: {
      questionId: number | string
      quizId: number | string
    }) => deleteQuestion(questionId),
    onSuccess: (_data, { quizId }) => {
      void qc.invalidateQueries({ queryKey: quizKeys.detail(quizId) })
    },
  })
}
