import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/admin/reportes/financiero')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/reportes/financiero"!</div>
}
