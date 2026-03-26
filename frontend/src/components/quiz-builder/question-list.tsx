import { CheckCircle2, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Question } from '@/types/quiz'

interface QuestionListProps {
  questions: Question[]
  editingId: number | null
  onEdit: (q: Question) => void
  onDelete: (q: Question) => void
}

export function QuestionList({
  questions,
  editingId,
  onEdit,
  onDelete,
}: QuestionListProps) {
  const sorted = [...questions].sort((a, b) => a.position - b.position)

  if (sorted.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-muted-foreground">
        No questions yet. Add questions below.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {sorted.map((q, idx) => (
        <li key={q.id}>
          <Card
            className={
              editingId === q.id ? 'ring-2 ring-ring' : ''
            }
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-base">
                  Question {idx + 1}
                  <span className="ml-2 font-normal text-muted-foreground">
                    ({q.type === 'mcq' ? 'Multiple choice' : 'Short answer'})
                  </span>
                </CardTitle>
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(q)}
                  aria-label="Edit question"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(q)}
                  aria-label="Delete question"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="whitespace-pre-wrap text-sm">{q.prompt}</p>
              {q.codeSnippet && (
                <pre className="overflow-x-auto rounded-md bg-muted px-3 py-2 font-mono text-xs leading-relaxed text-muted-foreground">
                  <code>{q.codeSnippet}</code>
                </pre>
              )}
              {q.type === 'mcq' && q.options && (
                <ol className="space-y-1 text-sm">
                  {q.options.map((o, i) => {
                    const isCorrect = String(q.correctAnswer) === String(i)
                    return (
                      <li
                        key={i}
                        className={`flex items-center gap-2 ${isCorrect ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                      >
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                          {isCorrect
                            ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            : <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />}
                        </span>
                        <span>{o}</span>
                        {isCorrect && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">correct</Badge>}
                      </li>
                    )
                  })}
                </ol>
              )}
              {q.type === 'short' && q.correctAnswer && (
                <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span className="text-muted-foreground">Answer:</span>
                  <span className="font-medium">{q.correctAnswer}</span>
                </div>
              )}
            </CardContent>
          </Card>
          {idx < sorted.length - 1 && <Separator className="my-1" />}
        </li>
      ))}
    </ul>
  )
}
