import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/entrenador/clientes/$cedula')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/entrenador/clientes/$cedula"!</div>
}
