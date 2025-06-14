import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/entrenador/clientes/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/entrenador/clientes/"!</div>
}
