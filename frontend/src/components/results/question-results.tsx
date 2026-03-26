import { Check, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SubmitDetail } from '@/types/quiz'
import { cn } from '@/lib/utils'

interface QuestionResultsProps {
  details: SubmitDetail[]
  promptsById: Map<number, string>
}

export function QuestionResults({ details, promptsById }: QuestionResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Per-question results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {details.map((d) => (
          <div
            key={d.questionId}
            className={cn(
              'flex gap-3 rounded-lg border p-4',
              d.correct
                ? 'border-success/40 bg-success/5'
                : 'border-border bg-muted/30',
            )}
          >
            <div className="mt-0.5 shrink-0">
              {d.correct ? (
                <Check className="h-5 w-5 text-success" aria-hidden />
              ) : (
                <X className="h-5 w-5 text-destructive" aria-hidden />
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm font-medium">
                {promptsById.get(d.questionId) ?? `Question #${d.questionId}`}
              </p>
              {!d.correct && d.expected !== undefined && (
                <p className="text-sm text-muted-foreground">
                  Expected: <span className="font-mono">{d.expected}</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
