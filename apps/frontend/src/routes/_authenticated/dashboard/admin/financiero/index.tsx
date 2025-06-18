import FinancialDashboard from '@/components/FinancialDashboard'
import type { VWAnalisisFinanciero } from '@/core/types/vw_AnalisisFinanciero';
import { createFileRoute, useLoaderData, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/admin/financiero/')({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.isAuthenticated) {
      throw redirect({ to: '/auth/login', search: { redirect: location.pathname, error: 'not_authenticated' } });
    }
  },
  loader: async ({ context }) => {


    // Verificar que el usuario sea administrador
    if (context.auth?.user?.tipo_usuario !== 'administrativo') {
      throw new Error('Acceso denegado: Se requieren permisos de administrador');
    }

    // Verificar que tenga el cargo de Gerente General (id=1)
    // Nota: Esto asume que el contexto incluye información del cargo del usuario
    // En un sistema real, podrías necesitar hacer una llamada adicional para verificar el cargo
    try {
      // Llamada para verificar el cargo del administrador
      const userResponse = await fetch(`http://localhost:3000/api/administrativos/${context.auth.user.cedula}`);
      if (!userResponse.ok) {
        throw new Error('No se pudo verificar el cargo del usuario');
      }

      const { data: userData } = await userResponse.json();
      if (userData.id_cargo !== 1) { // 1 = Gerente General
        throw new Error('Acceso denegado: Se requiere cargo de Gerente General para acceder a datos financieros');
      }

      // Cargar datos financieros
      const response = await fetch(`http://localhost:3000/api/administrativos/${context.auth.user.cedula}/financiero`);
      if (!response.ok) {
        throw new Error('Failed to load financial data');
      }

      const membershipTypeResponse = await fetch(`http://localhost:3000/api/membresias/tipos/usuarios`);
      if (!membershipTypeResponse.ok) {
        throw new Error('Failed to load membership type data');
      }

      const data = (await response.json()).recordset as VWAnalisisFinanciero[];
      const membershipTypeData = await membershipTypeResponse.json();

      return {
        financialData: data,
        membershipTypeData,
        userInfo: userData
      };

    } catch (error) {
      console.error('Error loading financial dashboard:', error);
      throw new Error('No se pudieron cargar los datos financieros');
    }
  },
  // Configuración de error boundary
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold text-danger mb-4">Error de Acceso</h1>
        <p className="text-default-600 mb-6">
          {error.message || 'No tienes permisos para acceder a esta sección'}
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Volver
        </button>
      </div>
    </div>
  )
})

function RouteComponent() {

  const { financialData, userInfo, membershipTypeData } = useLoaderData({
    from: Route.id
  });

  return (
    <div>
      {/* Header opcional con información del usuario */}
      <div className="bg-content1 border-b border-divider px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Panel Administrativo</h2>
            <p className="text-sm text-default-500">
              {userInfo.nombre} - {userInfo.cargo_nombre}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-default-500">Última actualización</p>
            <p className="text-sm font-medium">
              {new Date().toLocaleDateString('es-CR', {
                dateStyle: 'medium',

              })}
            </p>
          </div>
        </div>
      </div>

      <FinancialDashboard financialData={financialData} datosPorTipoMembresia={membershipTypeData} />
    </div>
  );
}