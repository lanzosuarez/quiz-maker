import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import type { Question } from '@/types/quiz'
import { cn } from '@/lib/utils'

interface QuestionDisplayProps {
  question: Omit<Question, 'correctAnswer'>
  value: string
  onChange: (value: string) => void
  onPaste?: () => void
  questionNumber: number
  total: number
}

export function QuestionDisplay({
  question,
  value,
  onChange,
  onPaste,
  questionNumber,
  total,
}: QuestionDisplayProps) {
  return (
    <article className="space-y-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {questionNumber} of {total}
        </span>
      </div>
      <div className="space-y-3">
        <h2 className="text-xl font-semibold leading-snug md:text-2xl">
          {question.prompt}
        </h2>
        {question.codeSnippet && (
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted px-4 py-3 font-mono text-sm leading-relaxed">
            <code>{question.codeSnippet}</code>
          </pre>
        )}
      </div>

      {question.type === 'mcq' && question.options && question.options.length > 0 ? (
        <RadioGroup
          value={value}
          onValueChange={onChange}
          className="gap-3"
        >
          {question.options.map((opt, i) => (
            <label
              key={i}
              htmlFor={`mcq-${question.id}-${i}`}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent/50',
                value === String(i) && 'border-primary bg-primary/5 ring-1 ring-primary/20',
              )}
            >
              <RadioGroupItem value={String(i)} id={`mcq-${question.id}-${i}`} />
              <span className="flex-1 text-sm leading-relaxed">{opt}</span>
            </label>
          ))}
        </RadioGroup>
      ) : (
        <div className="space-y-2">
          {question.type === 'code' && (
            <p className="text-sm text-muted-foreground">
              Free-form response (not auto-graded by the server).
            </p>
          )}
          <Label htmlFor={`short-${question.id}`}>Your answer</Label>
          <Textarea
            id={`short-${question.id}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onPaste={() => onPaste?.()}
            placeholder="Type your answer"
            rows={5}
            className="resize-y font-mono text-sm"
          />
        </div>
      )}
    </article>
  )
}
