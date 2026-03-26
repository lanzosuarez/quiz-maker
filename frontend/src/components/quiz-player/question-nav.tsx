import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuestionNavProps {
  canPrev: boolean
  isLast: boolean
  onPrev: () => void
  onNext: () => void
  onSubmitClick: () => void
  progressPercent: number
}

export function QuestionNav({
  canPrev,
  isLast,
  onPrev,
  onNext,
  onSubmitClick,
  progressPercent,
}: QuestionNavProps) {
  return (
    <div className="sticky bottom-0 z-10 border-t border-border bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          disabled={!canPrev}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
        {isLast ? (
          <Button type="button" onClick={onSubmitClick}>
            Submit quiz
          </Button>
        ) : (
          <Button type="button" onClick={onNext}>
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
