import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/dashboard/admin/ejercicios/grupos-musculares',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/ejercicios/grupos-musculares"!</div>
}
