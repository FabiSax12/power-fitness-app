import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/entrenador/reportes/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/entrenador/reportes/"!</div>
}
