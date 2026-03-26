import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ScoreSummaryProps {
  score: number
  totalGraded: number
}

export function ScoreSummary({ score, totalGraded }: ScoreSummaryProps) {
  const pct =
    totalGraded > 0 ? Math.round((score / totalGraded) * 100) : 0
  const passed = pct >= 70

  return (
    <Card className="overflow-hidden border-2">
      <CardContent className="p-8 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Your score
        </p>
        <p
          className={cn(
            'mt-2 text-5xl font-bold tabular-nums tracking-tight md:text-6xl',
            passed ? 'text-success' : 'text-foreground',
          )}
        >
          {score}
          <span className="text-2xl font-normal text-muted-foreground">
            {' '}
            / {totalGraded}
          </span>
        </p>
        <p className="mt-2 text-lg text-muted-foreground">{pct}% correct</p>
      </CardContent>
    </Card>
  )
}
