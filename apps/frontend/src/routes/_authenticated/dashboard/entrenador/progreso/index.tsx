import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/entrenador/progreso/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/entrenador/progreso/"!</div>
}
