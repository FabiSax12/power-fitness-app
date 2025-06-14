import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/cliente/perfil')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/cliente/perfil"!</div>
}
