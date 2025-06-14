import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import {
  Award, Ruler, Trophy,
  BarChart3, Eye,
  Plus
} from 'lucide-react'
import { ReseumenTab } from '@/components/progreso-tabs/ResumenTab'
import { MedicionesTab } from '@/components/progreso-tabs/MedicionesTab'
import { LogrosTab } from '@/components/progreso-tabs/LogrosTab'
import type { VW_ProgresoCliente } from '@/core/types/vw_ProgresoCliente'
import { AnalisisTab } from '@/components/progreso-tabs/AnalisisTab'
import { RegistrarProgresoTab } from '@/components/progreso-tabs/RegistrarProgresoTab'

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

      // Procesar datos para las diferentes secciones
      const progresoTemporal = progresoCompleto.map(record => ({
        fecha: record.fecha,
        mes: record.periodo_legible,
        peso_total: record.peso_registrado, // Peso inicial del cliente
        masa_muscular: record.masa_muscular_total,
        grasa_corporal: record.grasa_corporal_promedio,
        edad_metabolica: record.edad_metabolica
      }));

      // Datos para mediciones por grupo muscular (comparando primer vs último registro)
      const primerRegistro = progresoCompleto.find(r => r.es_primer_registro === 1);
      const ultimoRegistro = progresoCompleto.find(r => r.es_ultimo_registro === 1);

      const medicionesPorGrupo = [
        { grupo: 'Bíceps', inicial: primerRegistro?.biceps_kg || 0, actual: ultimoRegistro?.biceps_kg || 0 },
        { grupo: 'Pectorales', inicial: primerRegistro?.pectorales_kg || 0, actual: ultimoRegistro?.pectorales_kg || 0 },
        { grupo: 'Cuádriceps', inicial: primerRegistro?.cuadriceps_kg || 0, actual: ultimoRegistro?.cuadriceps_kg || 0 },
        { grupo: 'Glúteos', inicial: primerRegistro?.gluteos_kg || 0, actual: ultimoRegistro?.gluteos_kg || 0 },
        { grupo: 'Espalda', inicial: primerRegistro?.espalda_kg || 0, actual: ultimoRegistro?.espalda_kg || 0 },
        { grupo: 'Abdominales', inicial: primerRegistro?.abdominales_kg || 0, actual: ultimoRegistro?.abdominales_kg || 0 }
      ].map(grupo => ({
        ...grupo,
        progreso: grupo.inicial > 0 ? ((grupo.actual - grupo.inicial) / grupo.inicial) * 100 : 0
      }));

      // Logros extraídos de los detalles
      const logros = progresoCompleto
        .filter(record => record.logros_count > 0 && record.detalles_completos)
        .map(record => ({
          fecha: record.fecha,
          titulo: 'Logro Registrado',
          descripcion: record.detalles_completos.substring(0, 200) + '...',
          tipo: 'logro'
        }));

      // Datos de análisis físico (usando el último registro)
      const analisisFisico = ultimoRegistro ? [
        { metric: 'Fuerza', value: Math.min(ultimoRegistro.progreso_masa_muscular_pct + 50, 100), fullMark: 100 },
        { metric: 'Resistencia', value: Math.min(ultimoRegistro.mejora_edad_metabolica_pct + 60, 100), fullMark: 100 },
        { metric: 'Composición', value: Math.min(ultimoRegistro.reduccion_grasa_pct + 40, 100), fullMark: 100 },
        { metric: 'Constancia', value: ultimoRegistro.total_registros * 10, fullMark: 100 },
        { metric: 'Progreso', value: Math.min((ultimoRegistro.progreso_masa_muscular_pct + ultimoRegistro.reduccion_grasa_pct) / 2, 100), fullMark: 100 },
        { metric: 'Bienestar', value: Math.min(ultimoRegistro.mejora_edad_metabolica_pct + 30, 100), fullMark: 100 }
      ] : [];

      // Información del cliente desde la vista
      const clienteInfo = ultimoRegistro ? {
        nombre_completo: ultimoRegistro.nombre_completo,
        correo: ultimoRegistro.correo,
        nivel_fitness: ultimoRegistro.nivel_fitness,
        edad: ultimoRegistro.edad_actual,
        entrenador_actual: ultimoRegistro.entrenador_actual,
        evaluacion_constancia: ultimoRegistro.evaluacion_constancia,
        evaluacion_progreso: ultimoRegistro.evaluacion_progreso_muscular,
        dias_seguimiento: ultimoRegistro.dias_total_seguimiento,
        // Estadísticas clave
        cambio_masa_muscular: ultimoRegistro.cambio_masa_muscular,
        reduccion_grasa: ultimoRegistro.reduccion_grasa,
        mejora_edad_metabolica: ultimoRegistro.mejora_edad_metabolica
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
  },
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

  const [vistaActiva, setVistaActiva] = useState('resumen')

  // Calcular estadísticas si hay datos
  const estadisticas = progresoData?.length > 0 ? {
    perdidaPeso: progresoData[0].peso_total - progresoData[progresoData.length - 1].peso_total,
    gananciaMusculo: progresoData[progresoData.length - 1].masa_muscular - progresoData[0].masa_muscular,
    reduccionGrasa: progresoData[0].grasa_corporal - progresoData[progresoData.length - 1].grasa_corporal,
    mejoraEdadMetabolica: progresoData[0].edad_metabolica - progresoData[progresoData.length - 1].edad_metabolica
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
                  new Date(progresoData[progresoData.length - 1].fecha).toLocaleDateString('es-CR', {
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
              { key: 'analisis', label: 'Análisis', icon: Eye },
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
        {vistaActiva === 'analisis' && analisisData && (
          <AnalisisTab
            analisisData={analisisData}
            estadisticas={estadisticas}
            progresoDataLength={progresoData.length}
          />
        )}

        {/* Vista Registrar Progreso */}
        {vistaActiva === 'registrar' && (
          <RegistrarProgresoTab />
        )}
      </div>
    </div>
  )
}