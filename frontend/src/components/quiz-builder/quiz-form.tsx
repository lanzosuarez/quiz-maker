import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export interface QuizFormValues {
  title: string
  description: string
}

interface QuizFormProps {
  initial?: Partial<QuizFormValues>
  submitLabel: string
  isPending?: boolean
  onSubmit: (values: QuizFormValues) => void
}

export function QuizForm({
  initial,
  submitLabel,
  isPending,
  onSubmit,
}: QuizFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ title, description })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. JavaScript fundamentals"
          required
          maxLength={200}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What this quiz covers"
          required
          rows={4}
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? 'Saving…' : submitLabel}
      </Button>
    </form>
  )
}
