const DEFAULT_BASE = 'http://localhost:4000'

function getBaseUrl(): string {
  return import.meta.env.VITE_API_URL ?? DEFAULT_BASE
}

function getToken(): string {
  return import.meta.env.VITE_API_TOKEN ?? 'dev-token'
}

export class ApiError extends Error {
  status: number
  body?: unknown

  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

async function parseErrorBody(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string }
    if (data?.error && typeof data.error === 'string') return data.error
  } catch {
    /* ignore */
  }
  return res.statusText || 'Request failed'
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${getBaseUrl().replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
  const headers = new Headers(init?.headers)
  headers.set('Authorization', `Bearer ${getToken()}`)
  if (init?.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(url, { ...init, headers })

  if (!res.ok) {
    const message = await parseErrorBody(res)
    throw new ApiError(message, res.status)
  }

  if (res.status === 204) {
    return undefined as T
  }

  const text = await res.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}
