import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/admin/reportes/operacional')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/reportes/operacional"!</div>
}
