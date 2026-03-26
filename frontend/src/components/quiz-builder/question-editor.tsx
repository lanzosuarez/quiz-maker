import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import type { Question } from '@/types/quiz'
import { cn } from '@/lib/utils'

type QuestionKind = 'mcq' | 'short'

interface QuestionEditorProps {
  position: number
  initial?: Question | null
  isPending?: boolean
  onSubmit: (payload: {
    type: QuestionKind
    prompt: string
    codeSnippet?: string
    options?: string[]
    correctAnswer: string
  }) => void
  onCancel?: () => void
}

export function QuestionEditor({
  position,
  initial,
  isPending,
  onSubmit,
  onCancel,
}: QuestionEditorProps) {
  const isEdit = initial != null
  const [kind, setKind] = useState<QuestionKind>(
    initial?.type === 'short' ? 'short' : 'mcq',
  )
  const [prompt, setPrompt] = useState(initial?.prompt ?? '')
  const [codeSnippet, setCodeSnippet] = useState(initial?.codeSnippet ?? '')
  const [options, setOptions] = useState<string[]>(() => {
    if (initial?.type === 'mcq' && initial.options?.length)
      return [...initial.options]
    return ['', '']
  })
  const [correctIndex, setCorrectIndex] = useState(() => {
    if (initial?.type === 'mcq' && initial.correctAnswer != null) {
      const n = Number(initial.correctAnswer)
      if (!Number.isNaN(n)) return String(n)
    }
    return '0'
  })
  const [shortAnswer, setShortAnswer] = useState(() => {
    if (initial?.type === 'short' && initial.correctAnswer != null) {
      return String(initial.correctAnswer)
    }
    return ''
  })

  function handleOptionChange(i: number, value: string) {
    setOptions((prev) => {
      const next = [...prev]
      next[i] = value
      return next
    })
  }

  function addOption() {
    setOptions((prev) => [...prev, ''])
  }

  function removeOption(i: number) {
    if (options.length <= 2) return
    setOptions((prev) => prev.filter((_, j) => j !== i))
    setCorrectIndex((cur) => {
      const n = Number(cur)
      if (n === i) return '0'
      if (n > i) return String(n - 1)
      return cur
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const snippet = codeSnippet.trim() || undefined
    if (kind === 'mcq') {
      const trimmed = options.map((o) => o.trim()).filter(Boolean)
      if (trimmed.length < 2) return
      const idx = Number(correctIndex)
      if (idx < 0 || idx >= trimmed.length) return
      onSubmit({
        type: 'mcq',
        prompt: prompt.trim(),
        codeSnippet: snippet,
        options: trimmed,
        correctAnswer: String(idx),
      })
    } else {
      onSubmit({
        type: 'short',
        prompt: prompt.trim(),
        codeSnippet: snippet,
        correctAnswer: shortAnswer.trim(),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">
          {isEdit ? 'Edit question' : 'Add question'}
        </h3>
        <span className="text-sm text-muted-foreground">Position {position}</span>
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <div className="relative max-w-xs">
          <select
            className={cn(
              'peer h-10 w-full cursor-pointer appearance-none rounded-md border border-input bg-background py-2 pl-3 pr-10 text-sm shadow-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
            value={kind}
            onChange={(e) => setKind(e.target.value as QuestionKind)}
            disabled={isEdit}
          >
            <option value="mcq">Multiple choice</option>
            <option value="short">Short answer</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground peer-disabled:opacity-50"
            aria-hidden
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="q-prompt">Prompt</Label>
        <Textarea
          id="q-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Question text"
          required
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="q-snippet">
          Code snippet{' '}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="q-snippet"
          value={codeSnippet}
          onChange={(e) => setCodeSnippet(e.target.value)}
          placeholder="Paste a code snippet to display alongside the question"
          rows={4}
          className="font-mono text-sm"
        />
      </div>

      {kind === 'mcq' ? (
        <div className="space-y-4">
          <Label>Choices</Label>
          <RadioGroup
            value={correctIndex}
            onValueChange={setCorrectIndex}
            className="gap-4"
          >
            {options.map((opt, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 sm:flex-row sm:items-center"
              >
                <div className="flex flex-1 items-center gap-2">
                  <RadioGroupItem value={String(i)} id={`opt-${i}`} />
                  <Label htmlFor={`opt-${i}`} className="sr-only">
                    Mark option {i + 1} as correct
                  </Label>
                  <Input
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1"
                    required
                  />
                </div>
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(i)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </RadioGroup>
          <Button type="button" variant="outline" size="sm" onClick={addOption}>
            Add option
          </Button>
          <p className="text-sm text-muted-foreground">
            Select the radio next to the correct answer.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="short-correct">Correct answer</Label>
          <Input
            id="short-correct"
            value={shortAnswer}
            onChange={(e) => setShortAnswer(e.target.value)}
            placeholder="Matched case-insensitively after trimming"
            required
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : isEdit ? 'Update question' : 'Add question'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
