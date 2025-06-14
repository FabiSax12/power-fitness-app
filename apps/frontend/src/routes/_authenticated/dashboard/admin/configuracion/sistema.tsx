import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/admin/configuracion/sistema')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/configuracion/sistema"!</div>
}
