import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/admin/membresias/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/membresias/"!</div>
}
