import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/entrenador/reportes/clientes')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/dashboard/entrenador/reportes/clientes"!</div>
}
