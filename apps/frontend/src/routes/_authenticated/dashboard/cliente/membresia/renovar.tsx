import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/cliente/membresia/renovar')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/cliente/membresia/renovar"!</div>
}
