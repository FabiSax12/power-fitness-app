import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, type Variants } from 'framer-motion';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Spinner } from '@heroui/spinner';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown';
import { Avatar } from '@heroui/avatar';
import {
  Plus,
  MoreVertical,
  Edit,
  Pause,
  Play,
  CheckCircle,
  XCircle,
  Calendar,
  Dumbbell,
  Target,
  Activity,
  Eye,
  Users,
  Trash
} from 'lucide-react';
import { useAuthStore } from '@/modules/auth/stores/authStore';

// Tipos de datos
interface Rutina {
  id_rutina: number;
  cliente: string;
  cedula_cliente: string;
  entrenador: string;
  tipo_rutina: string;
  descripcion: string;
  fecha_creacion: string;
  fecha_fin?: string;
  estado: string;
  dias: string;
  ejercicios: string;
  total_ejercicios: number;
}

interface RutinasResponse {
  rutinas: Rutina[];
  total: number;
  page: number;
  pageSize: number;
}

interface UpdateEstadoRequest {
  id_rutina: number;
  estado_rutina: string;
  motivo_cambio?: string;
}


export const Route = createFileRoute('/_authenticated/dashboard/entrenador/rutinas/')({
  component: RouteComponent,
});

// API functions
const fetchRutinas = async (
  cedulaEntrenador: string,
): Promise<Rutina[]> => {
  const response = await fetch(`/api/rutinas?cedula_entrenador=${cedulaEntrenador}`);

  if (!response.ok) {
    throw new Error('Error al cargar las rutinas');
  }

  return response.json();
};

const updateRutinaEstado = async (data: UpdateEstadoRequest): Promise<void> => {
  const response = await fetch(`/api/rutinas/${data.id_rutina}/estado`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      estado_rutina: data.estado_rutina,
      motivo_cambio: data.motivo_cambio
    })
  });

  if (!response.ok) {
    throw new Error('Error al actualizar estado de rutina');
  }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

function RouteComponent() {
  const navigate = Route.useNavigate();
  const cedula = useAuthStore((state) => state.user?.cedula);
  const queryClient = useQueryClient();

  // Query para obtener rutinas
  const rutinasQuery = useQuery({
    queryKey: ['rutinas-entrenador', cedula],
    queryFn: () => fetchRutinas(cedula!),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: false,
  });

  // Mutation para actualizar estado
  const estadoMutation = useMutation({
    mutationFn: updateRutinaEstado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rutinas-entrenador'] });
    },
    onError: (error) => {
      console.error('Error al actualizar estado:', error);
    }
  });

  const deleteRoutineMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/rutinas/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la rutina');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rutinas-entrenador'] });
    },
    onError: (error) => {
      console.error('Error al eliminar rutina:', error);
    }
  });

  // Función para obtener color del estado
  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activa': return 'success';
      case 'pausada': return 'warning';
      case 'completada': return 'primary';
      case 'cancelada': return 'danger';
      default: return 'default';
    }
  };

  // Función para obtener icono del estado
  const getEstadoIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activa': return <Play className="h-4 w-4" />;
      case 'pausada': return <Pause className="h-4 w-4" />;
      case 'completada': return <CheckCircle className="h-4 w-4" />;
      case 'cancelada': return <XCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const handleEstadoChange = async (rutinaId: number, nuevoEstado: string) => {
    estadoMutation.mutate({
      id_rutina: rutinaId,
      estado_rutina: nuevoEstado,
      motivo_cambio: `Cambio de estado via interfaz del entrenador`
    });
  };

  const handleNuevaRutina = () => {
    navigate({ to: '/dashboard/entrenador/rutinas/crear' });
  };

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
            <Dumbbell className="h-8 w-8 text-primary" />
            Gestión de Rutinas
          </h1>
          <p className="text-default-500 mt-1">
            Administra las rutinas de entrenamiento de tus clientes asignados
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            color="success"
            variant="bordered"
            startContent={<Users className="h-4 w-4" />}
            as={Link}
            to="/dashboard/entrenador/clientes"
          >
            Mis Clientes
          </Button>
          <Button
            color="primary"
            startContent={<Plus className="h-4 w-4" />}
            onPress={handleNuevaRutina}
          >
            Nueva Rutina
          </Button>
        </div>
      </motion.div>

      {/* Filtros */}
      {/* <motion.div
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

              <Input
                placeholder="Buscar por cliente, descripción..."
                value={searchValue}
                onValueChange={setSearchValue}
                startContent={<Search className="h-4 w-4 text-default-400" />}
                classNames={{
                  inputWrapper: "bg-default-100/50"
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') applyFilters();
                }}
              />


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
                <SelectItem key="completada">Completada</SelectItem>
                <SelectItem key="cancelada">Cancelada</SelectItem>
              </Select>


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
                <SelectItem key="mixta">Mixta</SelectItem>
                <SelectItem key="funcional">Funcional</SelectItem>
                <SelectItem key="rehabilitación">Rehabilitación</SelectItem>
              </Select>


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
      </motion.div> */}

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
            {rutinasQuery.data.length === 0 ? (
              <Card className="shadow-lg">
                <CardBody className="text-center py-12">
                  <Target className="h-16 w-16 text-default-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No hay rutinas disponibles
                  </h3>
                  <div className="flex gap-2 justify-center">
                    <Button
                      color="primary"
                      startContent={<Plus className="h-4 w-4" />}
                      onPress={handleNuevaRutina}
                    >
                      Crear Primera Rutina
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {rutinasQuery.data.map((rutina) => (
                  <motion.div key={rutina.id_rutina} variants={itemVariants}>
                    <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start w-full">
                          <div className="flex items-start gap-3 flex-1">
                            <Avatar
                              size="sm"
                              name={rutina.cliente}
                              classNames={{
                                base: "bg-gradient-to-br from-pink-500 to-yellow-500"
                              }}
                            />
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                {rutina.cliente}
                              </h3>
                              <p className="text-sm text-default-500">
                                {rutina.tipo_rutina} - Rutina #{rutina.id_rutina}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Chip
                              color={getEstadoColor(rutina.estado)}
                              variant="solid"
                              startContent={getEstadoIcon(rutina.estado)}
                              size="sm"
                            >
                              {rutina.estado}
                            </Chip>
                            <Dropdown>
                              <DropdownTrigger>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  isLoading={estadoMutation.isPending}
                                >
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu>
                                <DropdownItem
                                  key="edit"
                                  startContent={<Edit size={16} />}
                                  onClick={() => navigate({
                                    to: `/dashboard/entrenador/rutinas/$id/editar`,
                                    params: {
                                      id: rutina.id_rutina.toString()
                                    }
                                  })}
                                >
                                  Editar Rutina
                                </DropdownItem>
                                {rutina.estado === "Activa" ? (
                                  <DropdownItem
                                    key="pause"
                                    startContent={<Pause size={16} />}
                                    onPress={() => handleEstadoChange(rutina.id_rutina, "Pausada")}
                                  >
                                    Pausar
                                  </DropdownItem>
                                ) : null}
                                {rutina.estado === "Pausada" ? (
                                  <DropdownItem
                                    key="resume"
                                    startContent={<Play size={16} />}
                                    onPress={() => handleEstadoChange(rutina.id_rutina, "Activa")}
                                  >
                                    Reanudar
                                  </DropdownItem>
                                ) : null}
                                <DropdownItem
                                  key="complete"
                                  startContent={<CheckCircle size={16} />}
                                  onPress={() => handleEstadoChange(rutina.id_rutina, "Completada")}
                                >
                                  Marcar Completada
                                </DropdownItem>
                                <DropdownItem
                                  key="delete"
                                  color='danger'
                                  startContent={<Trash size={16} />}
                                  onPress={() => deleteRoutineMutation.mutate(rutina.id_rutina)}
                                >
                                  Eliminar
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </div>
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
                                {new Date(rutina.fecha_fin).toLocaleDateString('es-CR', { timeZone: 'UTC' })}
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
                              to={`/dashboard/entrenador/rutinas/${rutina.id_rutina}`}
                              color="primary"
                              size="sm"
                              className="flex-1"
                              startContent={<Eye className="h-4 w-4" />}
                            >
                              Ver Detalle
                            </Button>

                            <Button
                              as={Link}
                              to={`/dashboard/entrenador/rutinas/${rutina.id_rutina}/editar`}
                              color="secondary"
                              size="sm"
                              variant="bordered"
                              startContent={<Edit className="h-4 w-4" />}
                            >
                              Editar
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Paginación */}
            {/* {rutinasQuery.data.total > 10 && (
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
            )} */}
          </>
        )}
      </motion.div>
    </div>
  );
}