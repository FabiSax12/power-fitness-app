import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/admin/gimnasio/maquinas/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/gimnasio/maquinas/$id"!</div>
}
