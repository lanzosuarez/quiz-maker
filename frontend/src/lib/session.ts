import type { AttemptStart, SubmitResult } from '@/types/quiz'
import type { AntiCheatEventEntry } from '@/types/quiz'

/**
 * In-progress attempt data lives in sessionStorage so a refresh mid-quiz can
 * recover state. Keys are namespaced per attemptId. Final results use a
 * separate key so they survive after we clear the in-progress keys on submit.
 */
const ATTEMPT_KEY = 'quiz-attempt-'
const ANSWERS_KEY = 'quiz-answers-'
const RESULT_KEY = 'quiz-result-'

export function persistAttemptSnapshot(attemptId: number | string, data: AttemptStart) {
  sessionStorage.setItem(`${ATTEMPT_KEY}${attemptId}`, JSON.stringify(data))
}

export function loadAttemptSnapshot(
  attemptId: number | string,
): AttemptStart | null {
  const raw = sessionStorage.getItem(`${ATTEMPT_KEY}${attemptId}`)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AttemptStart
  } catch {
    return null
  }
}

export function persistAnswerMap(
  attemptId: number | string,
  map: Record<number, string>,
) {
  // JSON object keys are always strings; normalize so round-trip matches our number-keyed map.
  const plain: Record<string, string> = {}
  for (const [k, v] of Object.entries(map)) {
    plain[String(k)] = v
  }
  sessionStorage.setItem(`${ANSWERS_KEY}${attemptId}`, JSON.stringify(plain))
}

export function loadAnswerMap(attemptId: number | string): Record<number, string> {
  const raw = sessionStorage.getItem(`${ANSWERS_KEY}${attemptId}`)
  if (!raw) return {}
  try {
    const o = JSON.parse(raw) as Record<string, string>
    return Object.fromEntries(
      Object.entries(o).map(([k, v]) => [Number(k), v]),
    )
  } catch {
    return {}
  }
}

export interface StoredResultPayload {
  result: SubmitResult
  quizTitle: string
  /** questionId -> prompt text for results breakdown */
  questionPrompts: Record<number, string>
  antiCheat: {
    tabSwitches: number
    pastes: number
    events: AntiCheatEventEntry[]
  }
}

export function persistResultPayload(
  attemptId: number | string,
  payload: StoredResultPayload,
) {
  sessionStorage.setItem(`${RESULT_KEY}${attemptId}`, JSON.stringify(payload))
}

export function loadResultPayload(
  attemptId: number | string,
): StoredResultPayload | null {
  const raw = sessionStorage.getItem(`${RESULT_KEY}${attemptId}`)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredResultPayload
  } catch {
    return null
  }
}

/** Drops in-progress snapshot + draft answers after a successful submit (result payload stays). */
export function clearAttemptSession(attemptId: number | string) {
  sessionStorage.removeItem(`${ATTEMPT_KEY}${attemptId}`)
  sessionStorage.removeItem(`${ANSWERS_KEY}${attemptId}`)
}
