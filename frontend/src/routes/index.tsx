import { createFileRoute, Link } from '@tanstack/react-router'
import { ClipboardList, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="space-y-10">
      <div className="space-y-3 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Coding quizzes, built fast
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Create quizzes with multiple-choice and short-answer questions, share
          the quiz ID, and review scores with lightweight session signals.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ClipboardList className="h-5 w-5" />
            </div>
            <CardTitle>Create a quiz</CardTitle>
            <CardDescription>
              Add a title, description, and questions. Publish when ready and
              copy the quiz ID to share.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/builder">Start building</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PlayCircle className="h-5 w-5" />
            </div>
            <CardTitle>Take a quiz</CardTitle>
            <CardDescription>
              Enter a quiz ID to start an attempt. Answer each question and
              submit to see your score.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/play">Take a quiz</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
