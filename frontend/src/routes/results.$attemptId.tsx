import { createFileRoute, Link, useRouterState } from '@tanstack/react-router'
import { useMemo } from 'react'
import { AntiCheatSummary } from '@/components/results/anti-cheat-summary'
import { QuestionResults } from '@/components/results/question-results'
import { ScoreSummary } from '@/components/results/score-summary'
import { Button } from '@/components/ui/button'
import { loadResultPayload, type StoredResultPayload } from '@/lib/session'

export const Route = createFileRoute('/results/$attemptId')({
  component: ResultsPage,
})

function ResultsPage() {
  const { attemptId } = Route.useParams()

  const fromRouter = useRouterState({
    select: (s) =>
      s.location.state as unknown as StoredResultPayload | undefined,
  })

  const data = useMemo(() => {
    // Same navigation from /play passes full payload; refresh or opening /results directly needs sessionStorage.
    if (
      fromRouter?.result &&
      fromRouter.quizTitle !== undefined &&
      fromRouter.questionPrompts
    ) {
      return fromRouter
    }
    return loadResultPayload(attemptId)
  }, [attemptId, fromRouter])

  const promptsById = useMemo(() => {
    const prompts = data?.questionPrompts
    if (!prompts) return new Map<number, string>()
    return new Map(
      Object.entries(prompts).map(([k, v]) => [Number(k), v]),
    )
  }, [data?.questionPrompts])

  if (!data) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <p className="text-muted-foreground">
          Results are not available. Submit a quiz from the player, or refresh
          may have cleared this session.
        </p>
        <Button asChild>
          <Link to="/play">Take a quiz</Link>
        </Button>
      </div>
    )
  }

  const { result, quizTitle, antiCheat } = data
  const totalGraded = result.details.length

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{quizTitle}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Results</h1>
      </div>

      <ScoreSummary score={result.score} totalGraded={totalGraded} />

      <QuestionResults details={result.details} promptsById={promptsById} />

      <AntiCheatSummary
        tabSwitches={antiCheat.tabSwitches}
        pastes={antiCheat.pastes}
        events={antiCheat.events}
      />

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link to="/play">Take another quiz</Link>
        </Button>
        <Button asChild>
          <Link to="/builder">Create a quiz</Link>
        </Button>
      </div>
    </div>
  )
}
