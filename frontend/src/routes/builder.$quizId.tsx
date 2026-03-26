import { useCallback, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { CheckCircle2, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { QuestionEditor } from '@/components/quiz-builder/question-editor'
import { QuestionList } from '@/components/quiz-builder/question-list'
import { QuizForm } from '@/components/quiz-builder/quiz-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiError } from '@/api/client'
import {
  useCreateQuestion,
  useDeleteQuestion,
  useQuiz,
  useUpdateQuestion,
  useUpdateQuiz,
} from '@/hooks/use-quizzes'
import type { Question } from '@/types/quiz'

export const Route = createFileRoute('/builder/$quizId')({
  component: BuilderEditPage,
  validateSearch: (search: Record<string, unknown>) => ({
    created: search.created === true || search.created === 'true',
  }),
})

function BuilderEditPage() {
  const { quizId } = Route.useParams()
  const { created } = Route.useSearch()
  const id = Number(quizId)
  const nav = useNavigate()
  const [showCreatedBanner, setShowCreatedBanner] = useState(created)
  const { data: quiz, isLoading, isError, error, refetch } = useQuiz(id)
  const updateQuiz = useUpdateQuiz()
  const createQuestion = useCreateQuestion()
  const updateQuestion = useUpdateQuestion()
  const deleteQuestion = useDeleteQuestion()

  const [editing, setEditing] = useState<Question | null>(null)

  const copyId = useCallback(() => {
    void navigator.clipboard.writeText(String(id))
    toast.success('Quiz ID copied')
  }, [id])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (isError || !quiz) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
        <p className="font-medium text-destructive">
          {error instanceof Error ? error.message : 'Quiz not found'}
        </p>
        <Button className="mt-4" variant="outline" asChild>
          <Link to="/builder">Create a new quiz</Link>
        </Button>
      </div>
    )
  }

  const nextPosition =
    quiz.questions.length > 0
      ? Math.max(...quiz.questions.map((q) => q.position)) + 1
      : 0

  return (
    <div className="space-y-10">
      {showCreatedBanner && (
        <div className="flex items-start gap-4 rounded-lg border border-success/40 bg-success/5 p-5">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-success" />
          <div className="flex-1 space-y-2">
            <p className="font-semibold text-foreground">
              Quiz created successfully!
            </p>
            <p className="text-sm text-muted-foreground">
              Your quiz ID is{' '}
              <span className="inline-flex items-center gap-1.5 rounded-md bg-card px-2 py-0.5 font-mono text-base font-bold text-foreground ring-1 ring-border">
                {id}
              </span>
              . Share this with participants so they can take the quiz. Now add
              your questions below.
            </p>
            <div className="flex gap-2 pt-1">
              <Button size="sm" variant="outline" onClick={copyId}>
                <Copy className="mr-2 h-4 w-4" />
                Copy quiz ID
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowCreatedBanner(false)
                  void nav({
                    to: '/builder/$quizId',
                    params: { quizId },
                    search: { created: false },
                    replace: true,
                  })
                }}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button variant="ghost" className="mb-2 -ml-2 h-8 px-2" asChild>
            <Link to="/">← Back</Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Edit quiz</h1>
          <p className="mt-1 text-muted-foreground">
            Quiz ID:{' '}
            <span className="font-mono font-semibold text-foreground">
              {id}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={copyId}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz details</CardTitle>
          <CardDescription>Title, description, and visibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <QuizForm
            key={`${quiz.title}|${quiz.description}`}
            initial={{
              title: quiz.title,
              description: quiz.description,
            }}
            submitLabel="Save changes"
            isPending={updateQuiz.isPending}
            onSubmit={async (values) => {
              try {
                await updateQuiz.mutateAsync({
                  id,
                  body: {
                    title: values.title.trim(),
                    description: values.description.trim(),
                  },
                })
                toast.success('Quiz updated')
                await refetch()
              } catch (e) {
                toast.error(
                  e instanceof ApiError ? e.message : 'Update failed',
                )
              }
            }}
          />
          <Separator />
          <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
            Share quiz ID{' '}
            <span className="font-mono font-semibold text-foreground">{id}</span>{' '}
            with participants so they can take this quiz.
          </p>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Questions</h2>
        <QuestionList
          questions={quiz.questions}
          editingId={editing?.id ?? null}
          onEdit={(q) => setEditing(q)}
          onDelete={async (q) => {
            if (!confirm('Delete this question?')) return
            try {
              await deleteQuestion.mutateAsync({
                questionId: q.id,
                quizId: id,
              })
              toast.success('Question deleted')
              if (editing?.id === q.id) setEditing(null)
              await refetch()
            } catch (e) {
              toast.error(
                e instanceof ApiError ? e.message : 'Delete failed',
              )
            }
          }}
        />
      </section>

      <section>
        {editing ? (
          <QuestionEditor
            key={`edit-${editing.id}`}
            position={editing.position}
            initial={editing}
            isPending={updateQuestion.isPending}
            onCancel={() => setEditing(null)}
            onSubmit={async (payload) => {
              try {
                await updateQuestion.mutateAsync({
                  questionId: editing.id,
                  quizId: id,
                  body:
                    payload.type === 'mcq'
                      ? {
                          type: 'mcq',
                          prompt: payload.prompt,
                          codeSnippet: payload.codeSnippet ?? null,
                          options: payload.options,
                          correctAnswer: payload.correctAnswer,
                        }
                      : {
                          type: 'short',
                          prompt: payload.prompt,
                          codeSnippet: payload.codeSnippet ?? null,
                          correctAnswer: payload.correctAnswer,
                        },
                })
                toast.success('Question updated')
                setEditing(null)
                await refetch()
              } catch (e) {
                toast.error(
                  e instanceof ApiError ? e.message : 'Could not update',
                )
              }
            }}
          />
        ) : (
          <QuestionEditor
            key={`new-${nextPosition}`}
            position={nextPosition}
            isPending={createQuestion.isPending}
            onSubmit={async (payload) => {
              try {
                await createQuestion.mutateAsync({
                  quizId: id,
                  body:
                    payload.type === 'mcq'
                      ? {
                          type: 'mcq',
                          prompt: payload.prompt,
                          codeSnippet: payload.codeSnippet ?? null,
                          options: payload.options,
                          correctAnswer: payload.correctAnswer,
                          position: nextPosition,
                        }
                      : {
                          type: 'short',
                          prompt: payload.prompt,
                          codeSnippet: payload.codeSnippet ?? null,
                          correctAnswer: payload.correctAnswer,
                          position: nextPosition,
                        },
                })
                toast.success('Question added')
                await refetch()
              } catch (e) {
                toast.error(
                  e instanceof ApiError ? e.message : 'Could not add question',
                )
              }
            }}
          />
        )}
      </section>

      <div className="flex justify-end border-t border-border pt-6">
        <Button variant="outline" asChild>
          <Link to="/play">Go to take quiz</Link>
        </Button>
      </div>
    </div>
  )
}
