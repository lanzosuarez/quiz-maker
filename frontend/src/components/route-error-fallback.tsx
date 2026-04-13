import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unexpected error occurred'
}

type RouteErrorFallbackProps = {
  title?: string
  error: unknown
  onRetry?: () => void
}

export function RouteErrorFallback({
  title = 'Something went wrong',
  error,
  onRetry,
}: RouteErrorFallbackProps) {
  return (
    <div className="mx-auto max-w-lg rounded-lg border border-destructive/50 bg-destructive/5 px-6 py-10 text-center">
      <h1 className="text-lg font-semibold text-destructive">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{errorMessage(error)}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onRetry ? (
          <Button type="button" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
        <Button variant="outline" asChild>
          <Link to="/">Home</Link>
        </Button>
      </div>
    </div>
  )
}
