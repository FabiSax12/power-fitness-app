import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/cliente/pagos/realizar-pago')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/cliente/pagos/realizar-pago"!</div>
}
