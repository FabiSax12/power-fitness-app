import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/admin/gimnasio/equipamiento/')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/dashboard/admin/gimnasio/equipamiento/"!</div>
}
