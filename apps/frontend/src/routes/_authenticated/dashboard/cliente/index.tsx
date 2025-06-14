import PowerFitnessDashboard from '@/components/Dashboard'
import type { VWDashboardCliente } from '@/core/types/vw_DashboardCliente';
import { createFileRoute, useLoaderData } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/cliente/')({
  component: RouteComponent,
  loader: async ({ context }) => {

    if (context.auth?.user?.cedula === undefined) throw new Error('User cedula is not defined in context');

    const response = await fetch(`http://localhost:3000/api/clientes/dashboard/${context.auth?.user?.cedula}`)
    if (!response.ok) {
      throw new Error('Failed to load dashboard data')
    }

    const data = await response.json() as VWDashboardCliente

    return { clientDashboardInfo: data }
  }
})

function RouteComponent() {

  const { clientDashboardInfo } = useLoaderData({
    from: Route.id
  })

  return <PowerFitnessDashboard clientData={clientDashboardInfo} />
}
