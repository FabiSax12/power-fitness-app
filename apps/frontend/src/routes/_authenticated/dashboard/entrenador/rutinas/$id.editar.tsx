import React, { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { motion, type Variants } from 'framer-motion';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Checkbox } from '@heroui/checkbox';
import { Chip } from '@heroui/chip';
import { Spinner } from '@heroui/spinner';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown';
import {
  ArrowLeft,
  Save,
  Plus,
  Edit,
  Calendar,
  Dumbbell,
  Target,
  Activity,
  Clock,
  Hash,
  Trash2,
  CheckCircle,
  MoreVertical
} from 'lucide-react';

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
}

interface Ejercicio {
  id_ejercicio: number;
  nombre: string;
  dificultad: string;
  grupos_musculares: string;
}

interface EjercicioRutina {
  id_ejercicio_rutina: number;
  id_ejercicio: number;
  nombre_ejercicio: string;
  repeticiones: number;
  tiempo_descanso?: string;
  dificultad: string;
}

interface ActualizarRutinaRequest {
  id_rutina: number;
  tipo_rutina?: string;
  descripcion?: string;
  dias?: string;
  motivo_cambio?: string;
}

interface AgregarEjercicioRequest {
  id_rutina: number;
  nombre_ejercicio: string;
  repeticiones: number;
  tiempo_descanso?: string;
}

export const Route = createFileRoute('/_authenticated/dashboard/entrenador/rutinas/$id/editar')({
  component: RouteComponent,
});

// API functions
const fetchRutina = async (id: string): Promise<Rutina> => {
  const response = await fetch(`/api/rutinas/${id}`);
  if (!response.ok) {
    throw new Error('Error al cargar la rutina');
  }
  return response.json();
};

const fetchEjercicios = async (): Promise<Ejercicio[]> => {
  const response = await fetch('/api/ejercicios');
  if (!response.ok) {
    throw new Error('Error al cargar ejercicios');
  }
  return response.json();
};

const fetchEjerciciosRutina = async (id: string): Promise<EjercicioRutina[]> => {
  const response = await fetch(`/api/rutinas/${id}/ejercicios`);
  if (!response.ok) {
    throw new Error('Error al cargar ejercicios de la rutina');
  }
  return response.json();
};

const actualizarRutina = async (data: ActualizarRutinaRequest): Promise<void> => {
  const response = await fetch(`/api/rutinas/${data.id_rutina}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la rutina');
  }
};

const agregarEjercicio = async (data: AgregarEjercicioRequest): Promise<void> => {
  const response = await fetch(`/api/rutinas/${data.id_rutina}/ejercicios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Error al agregar ejercicio');
  }
};

const eliminarEjercicioRutina = async (idEjercicio: number | string, idRutina: number | string): Promise<void> => {
  const response = await fetch(`/api/rutinas/${idRutina}/ejercicios/${idEjercicio}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar ejercicio');
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

const tiposRutina = [
  'Fuerza', 'Cardio', 'Mixta', 'Funcional', 'Rehabilitación'
];

const diasSemana = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
];

function RouteComponent() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const [selectedDias, setSelectedDias] = useState<string[]>([]);
  const [showAgregarEjercicio, setShowAgregarEjercicio] = useState(false);

  // Queries
  const rutinaQuery = useQuery({
    queryKey: ['rutina', id],
    queryFn: () => fetchRutina(id),
    staleTime: 5 * 60 * 1000
  });

  const ejerciciosQuery = useQuery({
    queryKey: ['ejercicios'],
    queryFn: fetchEjercicios,
    staleTime: 10 * 60 * 1000,
  });

  const ejerciciosRutinaQuery = useQuery({
    queryKey: ['rutina-ejercicios', id],
    queryFn: () => fetchEjerciciosRutina(id),
    staleTime: 2 * 60 * 1000,
  });

  // Mutations
  const actualizarMutation = useMutation({
    mutationFn: actualizarRutina,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rutina', id] });
      queryClient.invalidateQueries({ queryKey: ['rutinas-entrenador'] });
    }
  });

  const agregarEjercicioMutation = useMutation({
    mutationFn: agregarEjercicio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rutina-ejercicios', id] });
      setShowAgregarEjercicio(false);
      ejercicioForm.reset();
    }
  });

  const eliminarEjercicioMutation = useMutation({
    mutationFn: (idEjercicio: string | number) => eliminarEjercicioRutina(idEjercicio, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rutina-ejercicios', id] });
    }
  });

  // Inicializar dias seleccionados cuando carga la rutina
  React.useEffect(() => {
    if (rutinaQuery.data?.dias) {
      const dias = rutinaQuery.data.dias.split(', ').map(d => d.trim());
      setSelectedDias(dias);
    }
  }, [rutinaQuery.data]);

  // Form para editar rutina
  const rutinaForm = useForm({
    defaultValues: {
      tipo_rutina: rutinaQuery.data?.tipo_rutina || '',
      descripcion: rutinaQuery.data?.descripcion || '',
    },
    onSubmit: async ({ value }) => {
      const diasString = selectedDias.length > 0 ? selectedDias.join(',') : undefined;

      actualizarMutation.mutate({
        id_rutina: parseInt(id),
        tipo_rutina: value.tipo_rutina !== rutinaQuery.data?.tipo_rutina ? value.tipo_rutina : undefined,
        descripcion: value.descripcion !== rutinaQuery.data?.descripcion ? value.descripcion : undefined,
        dias: diasString,
        motivo_cambio: 'Actualización desde interfaz de entrenador'
      });
    },
  });

  // Form para agregar ejercicio
  const ejercicioForm = useForm({
    defaultValues: {
      id_ejercicio: '',
      repeticiones: 10,
      tiempo_descanso: ''
    },
    onSubmit: async ({ value }) => {
      const ejercicioSeleccionado = ejerciciosQuery.data?.find(
        e => e.id_ejercicio.toString() === value.id_ejercicio
      );

      if (!ejercicioSeleccionado) return;

      agregarEjercicioMutation.mutate({
        id_rutina: parseInt(id),
        nombre_ejercicio: ejercicioSeleccionado.nombre,
        repeticiones: value.repeticiones,
        tiempo_descanso: value.tiempo_descanso || undefined,
      });
    },
  });

  // Actualizar form cuando cambian los datos
  React.useEffect(() => {
    if (rutinaQuery.data) {
      rutinaForm.setFieldValue('tipo_rutina', rutinaQuery.data.tipo_rutina);
      rutinaForm.setFieldValue('descripcion', rutinaQuery.data.descripcion);
    }
  }, [rutinaQuery.data]);

  const handleDiaToggle = (dia: string) => {
    setSelectedDias(prev =>
      prev.includes(dia)
        ? prev.filter(d => d !== dia)
        : [...prev, dia]
    );
  };

  const getDificultadColor = (dificultad: string) => {
    switch (dificultad.toLowerCase()) {
      case 'principiante': return 'success';
      case 'intermedio': return 'warning';
      case 'avanzado': return 'danger';
      case 'experto': return 'secondary';
      default: return 'default';
    }
  };

  if (rutinaQuery.isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center py-12">
          <Spinner size="lg" color="primary" />
        </div>
      </div>
    );
  }

  if (rutinaQuery.isError || !rutinaQuery.data) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border border-danger-200 bg-danger-50 dark:bg-danger-50/10">
          <CardBody className="text-center py-8">
            <div className="text-danger mb-2">
              Error al cargar la rutina
            </div>
            <Button
              color="danger"
              variant="bordered"
              onPress={() => rutinaQuery.refetch()}
            >
              Reintentar
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Edit className="h-8 w-8 text-primary" />
            Editar Rutina #{id}
          </h1>
          <p className="text-default-500 mt-1">
            Cliente: {rutinaQuery.data.cliente}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="bordered"
            startContent={<ArrowLeft className="h-4 w-4" />}
            as={Link}
            to="/dashboard/entrenador/rutinas"
          >
            Volver
          </Button>
          <Button
            color="primary"
            startContent={<Save className="h-4 w-4" />}
            onPress={() => rutinaForm.handleSubmit()}
            isLoading={actualizarMutation.isPending}
          >
            Guardar Cambios
          </Button>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Información de la Rutina */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Información básica */}
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5" />
                Información Básica
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {/* Tipo de rutina */}
              <rutinaForm.Field name="tipo_rutina">
                {(field) => (
                  <Select
                    label="Tipo de Rutina"
                    selectedKeys={field.state.value ? [field.state.value] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      field.handleChange(selected);
                    }}
                    classNames={{
                      trigger: "bg-default-100/50"
                    }}
                  >
                    {tiposRutina.map((tipo) => (
                      <SelectItem key={tipo} >
                        {tipo}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              </rutinaForm.Field>

              {/* Descripción */}
              <rutinaForm.Field name="descripcion">
                {(field) => (
                  <Input
                    label="Descripción"
                    placeholder="Describe los objetivos y características..."
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    classNames={{
                      inputWrapper: "bg-default-100/50"
                    }}
                  />
                )}
              </rutinaForm.Field>
            </CardBody>
          </Card>

          {/* Programación */}
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Programación Semanal
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {diasSemana.map((dia) => (
                    <div key={dia}>
                      <Checkbox
                        isSelected={selectedDias.includes(dia)}
                        onValueChange={() => handleDiaToggle(dia)}
                        classNames={{
                          base: "w-full max-w-none p-2 rounded-lg border border-default-200 bg-default-50 hover:bg-default-100 transition-colors",
                          label: "text-sm font-medium"
                        }}
                      >
                        {dia}
                      </Checkbox>
                    </div>
                  ))}
                </div>

                {selectedDias.length > 0 && (
                  <div className="mt-4 p-3 bg-success-50 dark:bg-success-50/20 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-success">
                      <CheckCircle className="h-4 w-4" />
                      <span>Días seleccionados: {selectedDias.join(', ')}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Ejercicios de la Rutina */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Lista de ejercicios actuales */}
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Ejercicios ({ejerciciosRutinaQuery.data?.length || 0})
                </h2>
                <Button
                  color="primary"
                  size="sm"
                  startContent={<Plus className="h-4 w-4" />}
                  onPress={() => setShowAgregarEjercicio(true)}
                >
                  Agregar
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              {ejerciciosRutinaQuery.isLoading ? (
                <div className="flex justify-center py-4">
                  <Spinner size="md" color="primary" />
                </div>
              ) : ejerciciosRutinaQuery.data?.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-default-300 mx-auto mb-2" />
                  <p className="text-default-500 mb-4">No hay ejercicios en esta rutina</p>
                  <Button
                    color="primary"
                    variant="bordered"
                    startContent={<Plus className="h-4 w-4" />}
                    onPress={() => setShowAgregarEjercicio(true)}
                  >
                    Agregar Primer Ejercicio
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {ejerciciosRutinaQuery.data?.map((ejercicio) => (
                    <div
                      key={ejercicio.id_ejercicio_rutina}
                      className="p-3 border border-default-200 rounded-lg bg-default-50 dark:bg-default-100/20"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">
                            {ejercicio.nombre_ejercicio}
                          </h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-default-600">
                            <div className="flex items-center gap-1">
                              <Hash className="h-3 w-3" />
                              <span>{ejercicio.repeticiones} reps</span>
                            </div>
                            {ejercicio.tiempo_descanso && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {ejercicio.tiempo_descanso
                                    ? new Date(ejercicio.tiempo_descanso).toLocaleTimeString('es-CR', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit',
                                      hour12: false,
                                      timeZone: 'UTC'
                                    })
                                    : ''}
                                </span>
                              </div>
                            )}
                            <Chip
                              size="sm"
                              color={getDificultadColor(ejercicio.dificultad)}
                              variant="flat"
                            >
                              {ejercicio.dificultad}
                            </Chip>
                          </div>
                        </div>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              isLoading={eliminarEjercicioMutation.isPending}
                            >
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu>
                            <DropdownItem
                              key="delete"
                              className="text-danger"
                              color="danger"
                              startContent={<Trash2 size={16} />}
                              onPress={() => eliminarEjercicioMutation.mutate(ejercicio.id_ejercicio)}
                            >
                              Eliminar
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Formulario agregar ejercicio */}
          {showAgregarEjercicio && (
            <Card className="shadow-lg border-2 border-primary-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Agregar Ejercicio
                  </h2>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => setShowAgregarEjercicio(false)}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                {/* Ejercicio */}
                <ejercicioForm.Field name="id_ejercicio">
                  {(field) => (
                    <Select
                      label="Ejercicio"
                      placeholder="Selecciona un ejercicio"
                      selectedKeys={field.state.value ? [field.state.value] : []}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        field.handleChange(selected);
                      }}
                      isLoading={ejerciciosQuery.isLoading}
                      classNames={{
                        trigger: "bg-default-100/50"
                      }}
                    >
                      {ejerciciosQuery.data?.map((ejercicio) => (
                        <SelectItem
                          key={ejercicio.id_ejercicio.toString()}
                          textValue={ejercicio.nombre}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{ejercicio.nombre}</span>
                            <span className="text-xs text-default-500">
                              {ejercicio.grupos_musculares} • {ejercicio.dificultad}
                            </span>
                          </div>
                        </SelectItem>
                      )) ?? []}
                    </Select>
                  )}
                </ejercicioForm.Field>

                <div className="grid grid-cols-2 gap-4">
                  {/* Repeticiones */}
                  <ejercicioForm.Field name="repeticiones">
                    {(field) => (
                      <Input
                        type="number"
                        label="Repeticiones"
                        min={1}
                        max={100}
                        value={field.state.value.toString()}
                        onValueChange={(value) => field.handleChange(parseInt(value) || 1)}
                        classNames={{
                          inputWrapper: "bg-default-100/50"
                        }}
                      />
                    )}
                  </ejercicioForm.Field>

                  {/* Tiempo descanso */}
                  <ejercicioForm.Field name="tiempo_descanso">
                    {(field) => (
                      <Input
                        label="Descanso (ej: 00:02:00)"
                        placeholder="00:01:30"
                        value={field.state.value}
                        onValueChange={field.handleChange}
                        classNames={{
                          inputWrapper: "bg-default-100/50"
                        }}
                      />
                    )}
                  </ejercicioForm.Field>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="bordered"
                    onPress={() => setShowAgregarEjercicio(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <ejercicioForm.Subscribe selector={state => [state.values.id_ejercicio, state.isValid]}>
                    {
                      () => <Button
                        color="primary"
                        startContent={<Plus className="h-4 w-4" />}
                        onPress={() => ejercicioForm.handleSubmit()}
                        isLoading={agregarEjercicioMutation.isPending}
                        isDisabled={!ejercicioForm.state.values.id_ejercicio}
                        className="flex-1"
                      >
                        Agregar
                      </Button>
                    }
                  </ejercicioForm.Subscribe>

                </div>
              </CardBody>
            </Card>
          )}
        </motion.div>
      </motion.div>

      {/* Estados de error */}
      {(actualizarMutation.isError || agregarEjercicioMutation.isError) && (
        <motion.div variants={itemVariants}>
          <Card className="border border-danger-200 bg-danger-50 dark:bg-danger-50/10">
            <CardBody className="text-center py-6">
              <div className="text-danger mb-2">
                Error: {actualizarMutation.error?.message || agregarEjercicioMutation.error?.message}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </div>
  );
}