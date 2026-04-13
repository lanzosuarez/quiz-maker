import type { ErrorComponentProps } from '@tanstack/react-router'
import { RouteErrorFallback } from '@/components/route-error-fallback'

export function DefaultRouteError({ error, reset }: ErrorComponentProps) {
  return (
    <RouteErrorFallback
      title="Could not load this page"
      error={error}
      onRetry={reset}
    />
  )
}
