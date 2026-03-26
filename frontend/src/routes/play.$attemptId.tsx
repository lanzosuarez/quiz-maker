import { useCallback, useMemo, useState } from 'react'
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { toast } from 'sonner'
import { QuestionDisplay } from '@/components/quiz-player/question-display'
import { QuestionNav } from '@/components/quiz-player/question-nav'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/api/client'
import {
  useRecordEvent,
  useSubmitAnswer,
  useSubmitAttempt,
} from '@/hooks/use-attempts'
import { summarizeAntiCheat, useAntiCheat } from '@/hooks/use-anti-cheat'
import {
  clearAttemptSession,
  loadAnswerMap,
  loadAttemptSnapshot,
  persistAnswerMap,
  persistResultPayload,
} from '@/lib/session'
import type { AttemptStart } from '@/types/quiz'

export const Route = createFileRoute('/play/$attemptId')({
  component: PlayAttemptPage,
})

function PlayAttemptPage() {
  const { attemptId: attemptIdParam } = Route.useParams()
  const attemptId = attemptIdParam
  const navigate = useNavigate()

  const routeState = useRouterState({
    select: (s) =>
      s.location.state as { attempt?: AttemptStart } | undefined,
  })

  // Prefer navigation state when present; otherwise restore from session (e.g. after refresh).
  const attempt =
    routeState?.attempt ?? loadAttemptSnapshot(attemptId)

  const questions = useMemo(() => {
    if (!attempt) return []
    return [...attempt.quiz.questions].sort((a, b) => a.position - b.position)
  }, [attempt])

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    const fromStorage = loadAnswerMap(attemptId)
    const fromAttempt: Record<number, string> = {}
    // Seed from API snapshot, then overlay anything typed locally (storage wins on overlap).
    if (routeState?.attempt) {
      for (const a of routeState.attempt.answers) {
        fromAttempt[a.questionId] = a.value
      }
    } else {
      const snap = loadAttemptSnapshot(attemptId)
      if (snap) {
        for (const a of snap.answers) {
          fromAttempt[a.questionId] = a.value
        }
      }
    }
    return { ...fromAttempt, ...fromStorage }
  })

  const recordMut = useRecordEvent()
  const submitAnswerMut = useSubmitAnswer()
  const submitAttemptMut = useSubmitAttempt()

  const recordServer = useCallback(
    (event: string) => {
      recordMut.mutate({ attemptId, event })
    },
    [attemptId, recordMut],
  )

  const { eventsRef, onPaste } = useAntiCheat(attemptId, recordServer)

  const [confirmOpen, setConfirmOpen] = useState(false)

  const persistAnswers = useCallback(
    (next: Record<number, string>) => {
      persistAnswerMap(attemptId, next)
    },
    [attemptId],
  )

  const setAnswerForQuestion = useCallback(
    (questionId: number, value: string) => {
      setAnswers((prev) => {
        const next = { ...prev, [questionId]: value }
        persistAnswers(next)
        return next
      })
      void submitAnswerMut.mutateAsync({
        attemptId,
        questionId,
        value,
      })
    },
    [attemptId, persistAnswers, submitAnswerMut],
  )

  const current = questions[index]
  const value = current ? (answers[current.id] ?? '') : ''

  const progressPercent = useMemo(() => {
    if (questions.length === 0) return 0
    return Math.round(((index + 1) / questions.length) * 100)
  }, [index, questions.length])

  if (!attempt || questions.length === 0) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <p className="text-muted-foreground">
          This session could not be loaded. Start again from the take-quiz page.
        </p>
        <Button asChild>
          <Link to="/play">Back to take quiz</Link>
        </Button>
      </div>
    )
  }

  const isLast = index >= questions.length - 1

  async function handleConfirmSubmit() {
    if (!attempt) return
    setConfirmOpen(false)
    try {
      const result = await submitAttemptMut.mutateAsync(attemptId)
      const anti = summarizeAntiCheat(eventsRef.current)
      const questionPrompts = Object.fromEntries(
        attempt.quiz.questions.map((q) => [q.id, q.prompt]),
      )
      const payload = {
        result,
        quizTitle: attempt.quiz.title,
        questionPrompts,
        antiCheat: {
          tabSwitches: anti.tabSwitches,
          pastes: anti.pastes,
          events: eventsRef.current,
        },
      }
      persistResultPayload(attemptId, payload)
      clearAttemptSession(attemptId) // free attempt/answer keys; results page may load from storage if state is gone
      await navigate({
        to: '/results/$attemptId',
        params: { attemptId },
        state: payload as unknown as Record<string, unknown>,
      })
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Submit failed')
    }
  }

  return (
    <div className="flex min-h-[60vh] flex-col">
      <div className="mb-6 flex flex-col gap-1 border-b border-border pb-4">
        <p className="text-sm font-medium text-muted-foreground">
          {attempt.quiz.title}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {attempt.quiz.description}
        </p>
      </div>

      {current && (
        <div className="flex-1 pb-32">
          <QuestionDisplay
            question={current}
            value={value}
            onChange={(v) => setAnswerForQuestion(current.id, v)}
            onPaste={onPaste}
            questionNumber={index + 1}
            total={questions.length}
          />
        </div>
      )}

      <QuestionNav
        canPrev={index > 0}
        isLast={isLast}
        onPrev={() => setIndex((i) => Math.max(0, i - 1))}
        onNext={() =>
          setIndex((i) => Math.min(questions.length - 1, i + 1))
        }
        onSubmitClick={() => setConfirmOpen(true)}
        progressPercent={progressPercent}
      />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit quiz?</DialogTitle>
            <DialogDescription>
              You will not be able to change your answers after submitting.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Keep editing
            </Button>
            <Button
              onClick={() => void handleConfirmSubmit()}
              disabled={submitAttemptMut.isPending}
            >
              {submitAttemptMut.isPending ? 'Submitting…' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
