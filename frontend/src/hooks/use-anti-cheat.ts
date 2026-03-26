import { useCallback, useEffect, useRef } from 'react'
import type { AntiCheatEventEntry } from '@/types/quiz'

/** Tracks window blur/focus (tab/visibility changes) and paste; mirrors each signal to the API and keeps a local log for the results screen. */
export function useAntiCheat(
  attemptId: number | string | undefined,
  onServerEvent: (eventName: string) => void,
) {
  const eventsRef = useRef<AntiCheatEventEntry[]>([])

  useEffect(() => {
    if (attemptId == null) return

    const push = (event: string) => {
      const entry: AntiCheatEventEntry = {
        event,
        timestamp: new Date().toISOString(),
      }
      eventsRef.current = [...eventsRef.current, entry]
    }

    const onBlur = () => {
      push('tab-blur')
      onServerEvent('tab-blur')
    }
    const onFocus = () => {
      push('tab-focus')
      onServerEvent('tab-focus')
    }

    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
    }
  }, [attemptId, onServerEvent])

  const onPaste = useCallback(() => {
    if (attemptId == null) return
    const entry: AntiCheatEventEntry = {
      event: 'text-pasted',
      timestamp: new Date().toISOString(),
    }
    eventsRef.current = [...eventsRef.current, entry]
    onServerEvent('text-pasted')
  }, [attemptId, onServerEvent])

  return { eventsRef, onPaste }
}

/** Blur count approximates how often the user left the quiz tab (each blur = one switch away). */
export function summarizeAntiCheat(events: AntiCheatEventEntry[]) {
  let tabSwitches = 0
  let pastes = 0
  for (const e of events) {
    if (e.event === 'tab-blur') tabSwitches += 1
    if (e.event === 'text-pasted') pastes += 1
  }
  return { tabSwitches, pastes, events }
}
