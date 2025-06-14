import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/admin/configuracion/cargos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/configuracion/cargos"!</div>
}
