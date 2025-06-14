import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardBody, CardHeader } from "@heroui/card"
import { Button } from "@heroui/button"
import { Chip } from "@heroui/chip"
import { Spinner } from "@heroui/spinner"
import { Input } from "@heroui/input"
import { Select, SelectItem } from "@heroui/select"
import { Pagination } from "@heroui/pagination"
import {
  Target,
  Calendar,
  Clock,
  User,
  PlayCircle,
  PauseCircle,
  CheckCircle,
  Search,
  Filter,
  Eye,
  Activity,
  Dumbbell
} from 'lucide-react'
import { useAuthStore } from '@/modules/auth/stores/authStore'

// Tipos basados en tu BD
interface Rutina {
  id_rutina: number
  fecha_creacion: string
  fecha_fin: string | null
  tipo_rutina: string
  descripcion: string
  estado: string
  entrenador: string
  dias: string
  ejercicios: string
  total_ejercicios: number
}

interface RutinasResponse {
  rutinas: Rutina[]
  total: number
  page: number
  pageSize: number
}

// Search params para filtros
const rutinasSearchSchema = {
  page: 1,
  estado: undefined as string | undefined,
  tipo: undefined as string | undefined,
  search: undefined as string | undefined,
}

export const Route = createFileRoute('/_authenticated/dashboard/cliente/rutinas/')({
  validateSearch: (search): typeof rutinasSearchSchema => ({
    page: Number(search.page) || 1,
    estado: search.estado as string | undefined,
    tipo: search.tipo as string | undefined,
    search: search.search as string | undefined,
  }),
  component: ClienteRutinasPage,
})

// Función para obtener rutinas del cliente
const fetchRutinasCliente = async (
  cedula: string,
  params: {
    page: number
    estado?: string
    tipo?: string
    search?: string
  }
): Promise<RutinasResponse> => {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    ...(params.estado && { estado: params.estado }),
    ...(params.tipo && { tipo: params.tipo }),
    ...(params.search && { search: params.search }),
  })

  const response = await fetch(`/api/clientes/${cedula}/rutinas?${searchParams}`)

  if (response.status === 404) {
    return {
      rutinas: [],
      total: 0,
      page: params.page,
      pageSize: 10,
    }
  }

  if (!response.ok) {
    throw new Error('Error al cargar las rutinas')
  }

  return response.json()
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

function ClienteRutinasPage() {
  const { page, estado, tipo, search } = Route.useSearch()
  const navigate = Route.useNavigate()
  const cedula = useAuthStore((state) => state.user?.cedula)



  // Estado local para filtros
  const [searchValue, setSearchValue] = useState(search || '')
  const [estadoFilter, setEstadoFilter] = useState(estado || '')
  const [tipoFilter, setTipoFilter] = useState(tipo || '')

  // Obtener cédula del usuario actual (desde context o store)

  // Query para obtener rutinas
  const rutinasQuery = useQuery({
    queryKey: ['rutinas-cliente', cedula, page, estado, tipo, search],
    queryFn: () => fetchRutinasCliente(cedula!, { page, estado, tipo, search }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: false,
  })

  // Función para aplicar filtros
  const applyFilters = () => {
    navigate({
      search: {
        page: 1,
        estado: estadoFilter || undefined,
        tipo: tipoFilter || undefined,
        search: searchValue || undefined,
      }
    })
  }

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchValue('')
    setEstadoFilter('')
    setTipoFilter('')
    navigate({ search: { page: 1, estado: undefined, tipo: undefined, search: undefined } })
  }

  // Función para cambiar página
  const handlePageChange = (newPage: number) => {
    const currentSearch = Route.useSearch()
    navigate({
      search: {
        page: newPage,
        estado: currentSearch.estado,
        tipo: currentSearch.tipo,
        search: currentSearch.search,
      }
    })
  }

  // Función para obtener color del estado
  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activa': return 'success'
      case 'pausada': return 'warning'
      case 'finalizada': return 'default'
      case 'pendiente': return 'primary'
      default: return 'default'
    }
  }

  // Función para obtener icono del estado
  const getEstadoIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activa': return <PlayCircle className="h-4 w-4" />
      case 'pausada': return <PauseCircle className="h-4 w-4" />
      case 'finalizada': return <CheckCircle className="h-4 w-4" />
      case 'pendiente': return <Clock className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const hasActiveFilters = estadoFilter || tipoFilter || searchValue

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Target className="h-8 w-8 text-primary" />
            Mis Rutinas
          </h1>
          <p className="text-default-500 mt-1">
            Gestiona y sigue tus rutinas de entrenamiento personalizadas
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            color="primary"
            startContent={<Eye className="h-4 w-4" />}
            as={Link}
            to="/dashboard/cliente/progreso"
          >
            Ver Progreso
          </Button>
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Búsqueda */}
              <Input
                placeholder="Buscar rutinas..."
                value={searchValue}
                onValueChange={setSearchValue}
                startContent={<Search className="h-4 w-4 text-default-400" />}
                classNames={{
                  inputWrapper: "bg-default-100/50"
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') applyFilters()
                }}
              />

              {/* Estado */}
              <Select
                placeholder="Estado"
                selectedKeys={estadoFilter ? [estadoFilter] : []}
                onSelectionChange={(keys) => setEstadoFilter(Array.from(keys)[0] as string || '')}
                classNames={{
                  trigger: "bg-default-100/50"
                }}
              >
                <SelectItem key="activa">Activa</SelectItem>
                <SelectItem key="pausada">Pausada</SelectItem>
                <SelectItem key="finalizada">Finalizada</SelectItem>
                <SelectItem key="pendiente">Pendiente</SelectItem>
              </Select>

              {/* Tipo */}
              <Select
                placeholder="Tipo de rutina"
                selectedKeys={tipoFilter ? [tipoFilter] : []}
                onSelectionChange={(keys) => setTipoFilter(Array.from(keys)[0] as string || '')}
                classNames={{
                  trigger: "bg-default-100/50"
                }}
              >
                <SelectItem key="fuerza">Fuerza</SelectItem>
                <SelectItem key="cardio">Cardio</SelectItem>
                <SelectItem key="hipertrofia">Hipertrofia</SelectItem>
                <SelectItem key="funcional">Funcional</SelectItem>
                <SelectItem key="mixta">Mixta</SelectItem>
              </Select>

              {/* Botones */}
              <div className="flex gap-2">
                <Button
                  color="primary"
                  className="flex-1"
                  onPress={applyFilters}
                >
                  Aplicar
                </Button>
                {hasActiveFilters && (
                  <Button
                    variant="bordered"
                    onPress={clearFilters}
                  >
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Contenido */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Loading */}
        {rutinasQuery.isLoading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" color="primary" />
          </div>
        )}

        {/* Error */}
        {rutinasQuery.isError && (
          <Card className="border border-danger-200 bg-danger-50 dark:bg-danger-50/10">
            <CardBody className="text-center py-8">
              <div className="text-danger mb-2">
                {rutinasQuery.error.message}
              </div>
              <Button
                color="danger"
                variant="bordered"
                onPress={() => rutinasQuery.refetch()}
              >
                Reintentar
              </Button>
            </CardBody>
          </Card>
        )}

        {/* Lista de rutinas */}
        {rutinasQuery.data && (
          <>
            {rutinasQuery.data.rutinas.length === 0 ? (
              <Card className="shadow-lg">
                <CardBody className="text-center py-12">
                  <Dumbbell className="h-16 w-16 text-default-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No hay rutinas disponibles
                  </h3>
                  <p className="text-default-500 mb-4">
                    {hasActiveFilters
                      ? 'No se encontraron rutinas que coincidan con los filtros aplicados'
                      : 'Aún no tienes rutinas asignadas. Contacta a tu entrenador para crear una rutina personalizada.'
                    }
                  </p>
                  {hasActiveFilters && (
                    <Button
                      color="primary"
                      variant="bordered"
                      onPress={clearFilters}
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </CardBody>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {rutinasQuery.data.rutinas.map((rutina) => (
                  <motion.div key={rutina.id_rutina} variants={itemVariants}>
                    <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start w-full">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                              {rutina.tipo_rutina}
                            </h3>
                            <p className="text-sm text-default-500">
                              Rutina #{rutina.id_rutina}
                            </p>
                          </div>
                          <Chip
                            color={getEstadoColor(rutina.estado)}
                            variant="solid"
                            startContent={getEstadoIcon(rutina.estado)}
                            size="sm"
                          >
                            {rutina.estado}
                          </Chip>
                        </div>
                      </CardHeader>

                      <CardBody>
                        <div className="space-y-4">
                          {/* Descripción */}
                          {rutina.descripcion && (
                            <p className="text-default-600 text-sm">
                              {rutina.descripcion}
                            </p>
                          )}

                          {/* Información del entrenador */}
                          <div className="flex items-center gap-2 text-sm text-default-500">
                            <User className="h-4 w-4" />
                            <span>Entrenador: {rutina.entrenador}</span>
                          </div>

                          {/* Días de entrenamiento */}
                          <div className="flex items-center gap-2 text-sm text-default-500">
                            <Calendar className="h-4 w-4" />
                            <span>Días: {rutina.dias}</span>
                          </div>

                          {/* Fechas */}
                          <div className="grid grid-cols-2 gap-4 text-xs text-default-400">
                            <div>
                              <span className="font-medium">Creada:</span><br />
                              {new Date(rutina.fecha_creacion).toLocaleDateString()}
                            </div>
                            {rutina.fecha_fin && (
                              <div>
                                <span className="font-medium">Finalizada:</span><br />
                                {new Date(rutina.fecha_fin).toLocaleDateString()}
                              </div>
                            )}
                          </div>

                          {/* Ejercicios */}
                          <div className="bg-default-50 dark:bg-default-100/20 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-default-700">
                                Ejercicios ({rutina.total_ejercicios})
                              </span>
                              <Activity className="h-4 w-4 text-default-500" />
                            </div>
                            <p className="text-xs text-default-600 line-clamp-2">
                              {rutina.ejercicios}
                            </p>
                          </div>

                          {/* Acciones */}
                          <div className="flex gap-2 pt-2">
                            <Button
                              as={Link}
                              to={`/dashboard/cliente/rutinas/${rutina.id_rutina}`}
                              color="primary"
                              size="sm"
                              className="flex-1"
                              startContent={<Eye className="h-4 w-4" />}
                            >
                              Ver Detalle
                            </Button>

                            {rutina.estado.toLowerCase() === 'activa' && (
                              <Button
                                as={Link}
                                to={`/dashboard/cliente/rutinas/ejercicios/${rutina.id_rutina}`}
                                color="success"
                                size="sm"
                                variant="bordered"
                                startContent={<PlayCircle className="h-4 w-4" />}
                              >
                                Entrenar
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Paginación */}
            {rutinasQuery.data.total > 10 && (
              <div className="flex justify-center">
                <Pagination
                  total={Math.ceil(rutinasQuery.data.total / 10)}
                  page={page}
                  onChange={handlePageChange}
                  showControls
                  showShadow
                  color="primary"
                />
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}