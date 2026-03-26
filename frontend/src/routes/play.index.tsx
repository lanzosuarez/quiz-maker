import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ApiError } from '@/api/client'
import { useStartAttempt } from '@/hooks/use-attempts'
import { persistAttemptSnapshot } from '@/lib/session'

export const Route = createFileRoute('/play/')({
  component: PlayEntryPage,
})

function PlayEntryPage() {
  const navigate = useNavigate()
  const start = useStartAttempt()
  const [quizIdInput, setQuizIdInput] = useState('')

  return (
    <div className="mx-auto max-w-md space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Take a quiz</h1>
        <p className="mt-1 text-muted-foreground">
          Enter the numeric quiz ID you received from the author.
        </p>
      </div>
      <form
        className="space-y-6"
        onSubmit={async (e) => {
          e.preventDefault()
          const raw = quizIdInput.trim()
          if (!raw || Number.isNaN(Number(raw))) {
            toast.error('Enter a valid quiz ID')
            return
          }
          try {
            const attempt = await start.mutateAsync(raw)
            // Survive refresh / direct URL open: router state alone is lost on reload.
            persistAttemptSnapshot(attempt.id, attempt)
            await navigate({
              to: '/play/$attemptId',
              params: { attemptId: String(attempt.id) },
              state: { attempt } as unknown as Record<string, unknown>,
            })
          } catch (err) {
            const msg =
              err instanceof ApiError
                ? err.message
                : 'Could not start quiz. Is it published?'
            toast.error(msg)
          }
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="quiz-id">Quiz ID</Label>
          <Input
            id="quiz-id"
            inputMode="numeric"
            value={quizIdInput}
            onChange={(e) => setQuizIdInput(e.target.value)}
            placeholder="e.g. 1"
            autoComplete="off"
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={start.isPending}
        >
          {start.isPending ? 'Starting…' : 'Start quiz'}
        </Button>
      </form>
    </div>
  )
}
