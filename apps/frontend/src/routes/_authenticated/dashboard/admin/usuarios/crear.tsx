import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/admin/usuarios/crear')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/usuarios/crear"!</div>
}
