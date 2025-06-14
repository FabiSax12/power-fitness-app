import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/admin/membresias/tipos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/membresias/tipos"!</div>
}
