import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/admin/reportes/entrenadores')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/reportes/entrenadores"!</div>
}
