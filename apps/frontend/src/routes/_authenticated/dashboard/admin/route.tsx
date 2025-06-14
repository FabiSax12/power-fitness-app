import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/admin')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.auth?.user?.tipo_usuario !== 'administrativo') {
      throw redirect({ to: '..' })
    }
  },
})

function RouteComponent() {
  return <Outlet />
}
