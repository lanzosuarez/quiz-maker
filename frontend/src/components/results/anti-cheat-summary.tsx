import { Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AntiCheatEventEntry } from '@/types/quiz'

interface AntiCheatSummaryProps {
  tabSwitches: number
  pastes: number
  events: AntiCheatEventEntry[]
}

export function AntiCheatSummary({
  tabSwitches,
  pastes,
  events,
}: AntiCheatSummaryProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Eye className="h-4 w-4 text-muted-foreground" />
          Session signals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          <span className="font-semibold text-foreground">{tabSwitches}</span>{' '}
          tab switches
          {', '}
          <span className="font-semibold text-foreground">{pastes}</span> paste
          events
        </p>
        {events.length > 0 && (
          <ul className="max-h-40 overflow-auto rounded-md bg-muted/50 p-3 font-mono text-xs">
            {events.map((e, i) => (
              <li key={i}>
                {e.timestamp} — {e.event}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
