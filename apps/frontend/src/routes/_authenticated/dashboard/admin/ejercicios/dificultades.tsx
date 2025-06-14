import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/dashboard/admin/ejercicios/dificultades',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/ejercicios/dificultades"!</div>
}
