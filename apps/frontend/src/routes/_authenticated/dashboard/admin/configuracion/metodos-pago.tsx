import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/dashboard/admin/configuracion/metodos-pago',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/configuracion/metodos-pago"!</div>
}
