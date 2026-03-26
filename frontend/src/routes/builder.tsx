import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/builder')({
  component: BuilderLayout,
})

function BuilderLayout() {
  return <Outlet />
}
