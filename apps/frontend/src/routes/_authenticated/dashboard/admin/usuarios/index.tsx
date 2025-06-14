import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/admin/usuarios/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/usuarios/"!</div>
}
