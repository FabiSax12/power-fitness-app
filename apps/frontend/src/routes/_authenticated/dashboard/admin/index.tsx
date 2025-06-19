import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/admin/')({
  component: RouteComponent,
  beforeLoad: () => {
    throw redirect({
      to: '/dashboard/admin/financiero'
    })
  }
})

function RouteComponent() {
  return <div>Hello "/dashboard/admin/"!</div>
}
