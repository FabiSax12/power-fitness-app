import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import {
  Award, Ruler, Trophy,
  BarChart3, Eye,
  Plus,
  Settings
} from 'lucide-react'
import { ReseumenTab } from '@/components/progreso-tabs/ResumenTab'
import { MedicionesTab } from '@/components/progreso-tabs/MedicionesTab'
import { LogrosTab } from '@/components/progreso-tabs/LogrosTab'
import type { VW_ProgresoCliente } from '@/core/types/vw_ProgresoCliente'
import { AnalisisTab } from '@/components/progreso-tabs/AnalisisTab'
import { RegistrarProgresoTab } from '@/components/progreso-tabs/RegistrarProgresoTab'
import { GestionarProgresoTab } from '@/components/progreso-tabs/GestionarProgresoTab'
import { useAuthStore } from '@/modules/auth/stores/authStore'

export const Route = createFileRoute('/_authenticated/dashboard/cliente/progreso/')({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.isAuthenticated) {
      throw redirect({ to: '/auth/login', search: { redirect: location.pathname, error: 'not_authenticated' } });
    }
  },
  loader: async ({ context }) => {
    // Verificar que el usuario sea cliente
    if (context.auth?.user?.tipo_usuario !== 'cliente') {
      throw new Error('Acceso denegado: Solo los clientes pueden ver su progreso');
    }

    try {
      const cedula = context.auth.user.cedula;

      const response = await fetch(`http://localhost:3000/api/clientes/${cedula}/progreso-completo`);

      if (!response.ok) {
        throw new Error('No se pudo cargar el progreso');
      }

      const { data: progresoCompleto } = await response.json() as { data: VW_ProgresoCliente[] };

      // Procesar datos para las diferentes secciones - ACTUALIZADO
      const progresoTemporal = progresoCompleto.map(record => ({
        fecha: record.fecha,
        mes: record.periodo_legible,
        peso_total: record.peso_progreso || record.peso_registrado_cliente, // Nuevo campo peso_progreso
        grasa_corporal: record.porcentaje_grasa, // Nuevo campo
        edad_metabolica: record.edad_metabolica, // Ya existe
        medida_promedio: record.medida_promedio_cm // Nuevo campo
      }));

      // Datos para mediciones por grupo muscular - ACTUALIZADO para medidas corporales
      const primerRegistro = progresoCompleto.find(r => r.es_primer_registro === 1);
      const ultimoRegistro = progresoCompleto.find(r => r.es_ultimo_registro === 1);

      const medicionesPorGrupo = [
        { grupo: 'Bíceps', inicial: primerRegistro?.biceps_cm || 0, actual: ultimoRegistro?.biceps_cm || 0 },
        { grupo: 'Pectorales', inicial: primerRegistro?.pectorales_cm || 0, actual: ultimoRegistro?.pectorales_cm || 0 },
        { grupo: 'Cuádriceps', inicial: primerRegistro?.cuadriceps_cm || 0, actual: ultimoRegistro?.cuadriceps_cm || 0 },
        { grupo: 'Glúteos', inicial: primerRegistro?.gluteos_cm || 0, actual: ultimoRegistro?.gluteos_cm || 0 },
        { grupo: 'Espalda', inicial: primerRegistro?.espalda_cm || 0, actual: ultimoRegistro?.espalda_cm || 0 },
        { grupo: 'Abdominales', inicial: primerRegistro?.abdominales_cm || 0, actual: ultimoRegistro?.abdominales_cm || 0 },
        { grupo: 'Cintura', inicial: primerRegistro?.cintura_cm || 0, actual: ultimoRegistro?.cintura_cm || 0 },
        { grupo: 'Cadera', inicial: primerRegistro?.cadera_cm || 0, actual: ultimoRegistro?.cadera_cm || 0 },
        { grupo: 'Brazo', inicial: primerRegistro?.brazo_cm || 0, actual: ultimoRegistro?.brazo_cm || 0 },
        { grupo: 'Muslo', inicial: primerRegistro?.muslo_cm || 0, actual: ultimoRegistro?.muslo_cm || 0 }
      ].filter(grupo => grupo.inicial > 0 || grupo.actual > 0) // Solo incluir grupos con datos
        .map(grupo => ({
          ...grupo,
          progreso: grupo.inicial > 0 ? ((grupo.actual - grupo.inicial) / grupo.inicial) * 100 : 0
        }));

      // Logros extraídos de los detalles - SIN CAMBIOS
      const logros = progresoCompleto
        .filter(record => record.logros_count > 0 && record.detalles_completos)
        .map(record => ({
          fecha: record.fecha,
          titulo: 'Logro Registrado',
          descripcion: record.detalles_completos.substring(0, 200) + '...',
          tipo: 'logro'
        }));

      // Datos de análisis físico - ACTUALIZADO
      const analisisFisico = ultimoRegistro ? [
        { metric: 'Composición', value: Math.min(Math.abs(ultimoRegistro.reduccion_grasa_pct || 0), 100), fullMark: 100 },
        { metric: 'Peso', value: Math.min(Math.abs(ultimoRegistro.cambio_peso_pct || 0), 100), fullMark: 100 },
        { metric: 'Edad Metabólica', value: Math.min(Math.abs(ultimoRegistro.mejora_edad_metabolica_pct || 0), 100), fullMark: 100 },
        { metric: 'Medidas', value: Math.min(Math.abs(ultimoRegistro.cambio_medidas_pct || 0), 100), fullMark: 100 },
        { metric: 'Constancia', value: Math.min((ultimoRegistro.total_registros || 0) * 10, 100), fullMark: 100 },
        {
          metric: 'Progreso General', value: Math.min(
            (Math.abs(ultimoRegistro.reduccion_grasa_pct || 0) +
              Math.abs(ultimoRegistro.mejora_edad_metabolica_pct || 0)) / 2, 100), fullMark: 100
        }
      ] : [];

      // Información del cliente - ACTUALIZADA
      const clienteInfo = ultimoRegistro ? {
        nombre_completo: ultimoRegistro.nombre_completo,
        correo: ultimoRegistro.correo,
        nivel_fitness: ultimoRegistro.nivel_fitness,
        edad: ultimoRegistro.edad_actual,
        entrenador_actual: ultimoRegistro.entrenador_actual,
        evaluacion_constancia: ultimoRegistro.evaluacion_constancia,
        evaluacion_progreso: ultimoRegistro.evaluacion_progreso_general, // Campo actualizado
        dias_seguimiento: ultimoRegistro.dias_total_seguimiento,
        // Estadísticas clave - ACTUALIZADAS
        cambio_peso: ultimoRegistro.cambio_peso,
        reduccion_grasa: ultimoRegistro.reduccion_grasa_porcentaje,
        mejora_edad_metabolica: ultimoRegistro.mejora_edad_metabolica,
        cambio_medidas: ultimoRegistro.cambio_medidas_promedio
      } : null;

      return {
        progresoData: progresoTemporal,
        medicionesData: medicionesPorGrupo,
        logrosData: logros,
        analisisData: analisisFisico,
        clienteInfo,
        rawData: progresoCompleto // Para debugging o usos avanzados
      };

    } catch (error) {
      console.error('Error loading progress data:', error);
      throw new Error('No se pudieron cargar los datos de progreso');
    }
  }
  ,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold text-danger mb-4">Error al Cargar Progreso</h1>
        <p className="text-default-600 mb-6">
          {error.message || 'No se pudieron cargar tus datos de progreso'}
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
  const { progresoData, medicionesData, logrosData, analisisData, clienteInfo } = Route.useLoaderData();
  const cedulaUser = useAuthStore(state => state.user?.cedula)
  const [vistaActiva, setVistaActiva] = useState('resumen')

  // Calcular estadísticas - ACTUALIZADO para nuevos campos
  const estadisticas = progresoData?.length > 0 ? {
    cambioPeso: progresoData[progresoData.length - 1].peso_total - progresoData[0].peso_total,
    reduccionGrasa: progresoData[0].grasa_corporal - progresoData[progresoData.length - 1].grasa_corporal,
    mejoraEdadMetabolica: progresoData[0].edad_metabolica - progresoData[progresoData.length - 1].edad_metabolica,
    cambioMedidas: progresoData[progresoData.length - 1].medida_promedio
      ? (progresoData[progresoData.length - 1].medida_promedio - (progresoData[0].medida_promedio || 0))
      : 0
  } : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-content1 border-b border-divider px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mi Progreso</h1>
            <p className="text-default-500 mt-1">
              {clienteInfo?.nombre_completo} • Seguimiento de transformación
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Chip
              color="secondary"
              variant="flat"
              startContent={<Trophy className="w-4 h-4" />}
            >
              {progresoData?.length || 0} registros
            </Chip>
            <div className="text-right">
              <p className="text-sm text-default-500">Último registro</p>
              <p className="text-sm font-medium">
                {progresoData?.length > 0 ?
                  new Date(progresoData[0].fecha).toLocaleDateString('es-CR', {
                    dateStyle: 'medium',
                  }) : 'Sin datos'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navegación de vistas */}
        <div className="flex gap-2 mb-8 overflow-x-auto justify-between">
          <div className='flex gap-2'>
            {[
              { key: 'resumen', label: 'Resumen', icon: BarChart3 },
              { key: 'mediciones', label: 'Mediciones', icon: Ruler },
              { key: 'logros', label: 'Logros', icon: Award },
              // { key: 'analisis', label: 'Análisis', icon: Eye },
              { key: 'gestionar', label: 'Gestionar', icon: Settings },
              { key: 'registrar', label: 'Nuevo Progreso', icon: Plus }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                color={vistaActiva === key ? 'primary' : 'default'}
                variant={vistaActiva === key ? 'solid' : 'bordered'}
                startContent={<Icon className="w-4 h-4" />}
                onPress={() => setVistaActiva(key)}
                className="flex-shrink-0"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Vista Resumen */}
        {vistaActiva === 'resumen' && estadisticas && (
          <ReseumenTab
            progresoData={progresoData}
            estadisticas={estadisticas}
            medicionesData={medicionesData}
          />
        )}

        {/* Vista Mediciones */}
        {vistaActiva === 'mediciones' && medicionesData && (
          <MedicionesTab
            medicionesData={medicionesData}
            progresoData={progresoData}
          />
        )}

        {/* Vista Logros */}
        {vistaActiva === 'logros' && logrosData && (
          <LogrosTab logrosData={logrosData} />
        )}

        {/* Vista Análisis */}
        {/* {vistaActiva === 'analisis' && analisisData && (
          <AnalisisTab
            analisisData={analisisData}
            estadisticas={estadisticas}
            progresoDataLength={progresoData.length}
          />
        )} */}

        {/* Vista Registrar Progreso */}
        {vistaActiva === 'registrar' && (
          <RegistrarProgresoTab />
        )}

        {/* Vista Gestionar Progreso */}
        {vistaActiva === 'gestionar' && cedulaUser && (
          <GestionarProgresoTab cedula={cedulaUser} />
        )}
      </div>
    </div>
  )
}