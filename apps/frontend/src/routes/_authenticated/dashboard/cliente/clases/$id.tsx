import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/cliente/clases/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/cliente/clases/$id"!</div>
}
