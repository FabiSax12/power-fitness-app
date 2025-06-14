import { createFileRoute, redirect } from '@tanstack/react-router'
import type { UserType } from '@/core/entities/User'

const userRoutes: Record<UserType, string> = {
  cliente: '/dashboard/cliente',
  entrenador: '/dashboard/entrenador',
  administrativo: '/dashboard/admin'
}

export const Route = createFileRoute('/_authenticated/dashboard/')({
  beforeLoad: async ({ context, location }) => {
    // Ahora el context tiene el estado actualizado
    console.log("Context de carga:", context)
    const { isAuthenticated, user } = context.auth || {}

    if (!isAuthenticated || !user) {
      throw redirect({
        to: '/auth/login',
        search: { redirect: location.href, error: 'not_authenticated' },
      })
    }

    const targetRoute = userRoutes[user.tipo_usuario]

    console.log('Redirigiendo a:', targetRoute)

    throw redirect({ to: targetRoute, replace: true })
  },
  component: DashboardRedirect,
})

// Componente fallback (no debería renderizarse nunca)
function DashboardRedirect() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Redirigiendo...
        </h1>
        <p className="text-default-500">
          Si ves este mensaje, algo salió mal con la redirección automática.
        </p>
      </div>
    </div>
  )
}