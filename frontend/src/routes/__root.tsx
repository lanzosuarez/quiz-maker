import { QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { AppErrorBoundary } from '@/components/app-error-boundary'
import { queryClient } from '@/lib/query-client'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
            <Link
              to="/"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              Quiz Maker
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link
                to="/builder"
                className="text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
                activeProps={{ className: 'active' }}
              >
                Create
              </Link>
              <Link
                to="/play"
                className="text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
                activeProps={{ className: 'active' }}
              >
                Take quiz
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:py-10">
          <AppErrorBoundary>
            <Outlet />
          </AppErrorBoundary>
        </main>
      </div>
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  )
}
