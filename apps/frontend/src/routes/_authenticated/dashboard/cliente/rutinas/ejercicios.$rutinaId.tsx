import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/dashboard/cliente/rutinas/ejercicios/$rutinaId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/cliente/rutinas/ejercicios/$rutinaId"!</div>
}
