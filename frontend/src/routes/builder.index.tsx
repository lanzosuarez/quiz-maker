import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { QuizForm } from '@/components/quiz-builder/quiz-form'
import { ApiError } from '@/api/client'
import { useCreateQuiz } from '@/hooks/use-quizzes'

export const Route = createFileRoute('/builder/')({
  component: BuilderNewPage,
})

function BuilderNewPage() {
  const navigate = useNavigate()
  const createQuiz = useCreateQuiz()

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New quiz</h1>
        <p className="mt-1 text-muted-foreground">
          You will add questions on the next step.
        </p>
      </div>
      <QuizForm
        submitLabel="Create quiz"
        isPending={createQuiz.isPending}
        onSubmit={async (values) => {
          try {
            const quiz = await createQuiz.mutateAsync({
              title: values.title.trim(),
              description: values.description.trim(),
              isPublished: true,
            })
            await navigate({
              to: '/builder/$quizId',
              params: { quizId: String(quiz.id) },
              search: { created: true },
            })
          } catch (e) {
            const msg =
              e instanceof ApiError ? e.message : 'Could not create quiz'
            toast.error(msg)
          }
        }}
      />
    </div>
  )
}
