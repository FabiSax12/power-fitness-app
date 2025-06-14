import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/entrenador/clases/calendario')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/dashboard/entrenador/clases/calendario"!</div>
}
