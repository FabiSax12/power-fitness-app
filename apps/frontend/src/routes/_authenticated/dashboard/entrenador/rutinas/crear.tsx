import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { motion, type Variants } from 'framer-motion';
import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Checkbox } from '@heroui/checkbox';
import { Chip } from '@heroui/chip';
import { Spinner } from '@heroui/spinner';
import {
  ArrowLeft,
  Plus,
  Target,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  Users
} from 'lucide-react';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import type { Person } from '@/core/entities/User';

// Tipos de datos
interface Cliente {
  cedula_cliente: string
  id_nivel_fitness: number[]
  estado: boolean
  peso: number
  cedula: string
  nombre: string
  apellido1: string
  apellido2: string
  genero: number
  contraseña: string
  correo: string
  fecha_registro: string
  fecha_nacimiento: string
  nivel: string
}


interface CrearRutinaRequest {
  cedula_cliente: string;
  cedula_entrenador: string;
  tipo_rutina: string;
  descripcion?: string;
  dias?: string; // 'Lunes,Miércoles,Viernes'
}

interface CrearRutinaResponse {
  id_rutina: number;
  mensaje: string;
}

export const Route = createFileRoute('/_authenticated/dashboard/entrenador/rutinas/crear')({
  component: RouteComponent,
});

// API functions
const fetchClientesEntrenador = async (cedulaEntrenador: string): Promise<Cliente[]> => {
  const response = await fetch(`/api/clientes`);

  if (!response.ok) {
    throw new Error('Error al cargar clientes');
  }

  return response.json();
};

const crearRutina = async (data: CrearRutinaRequest): Promise<CrearRutinaResponse> => {
  const response = await fetch('/api/rutinas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Error al crear la rutina');
  }

  return response.json();
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
  { value: 'Fuerza', label: 'Fuerza', color: 'secondary' },
  { value: 'Cardio', label: 'Cardio', color: 'warning' },
  { value: 'Mixta', label: 'Mixta', color: 'primary' },
  { value: 'Funcional', label: 'Funcional', color: 'success' },
  { value: 'Rehabilitación', label: 'Rehabilitación', color: 'default' }
];

const diasSemana = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
];

function RouteComponent() {
  const navigate = Route.useNavigate();
  const cedula = useAuthStore((state) => state.user?.cedula);
  const queryClient = useQueryClient();
  const [selectedDias, setSelectedDias] = useState<string[]>([]);

  // Query para obtener clientes del entrenador
  const clientesQuery = useQuery({
    queryKey: ['clientes-entrenador', cedula],
    queryFn: () => fetchClientesEntrenador(cedula!),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // Mutation para crear rutina
  const crearRutinaMutation = useMutation({
    mutationFn: crearRutina,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rutinas-entrenador'] });
      navigate({
        to: `/dashboard/entrenador/rutinas`,
      });
    },
    onError: (error) => {
      console.error('Error al crear rutina:', error);
    }
  });

  // Form setup
  const form = useForm({
    defaultValues: {
      cedula_cliente: '',
      tipo_rutina: '',
      descripcion: '',
    },
    onSubmit: async ({ value }) => {
      const diasString = selectedDias.length > 0 ? selectedDias.join(',') : undefined;

      crearRutinaMutation.mutate({
        cedula_cliente: value.cedula_cliente,
        cedula_entrenador: cedula!,
        tipo_rutina: value.tipo_rutina,
        descripcion: value.descripcion || undefined,
        dias: diasString
      });
    },
  });

  const handleDiaToggle = (dia: string) => {
    setSelectedDias(prev =>
      prev.includes(dia)
        ? prev.filter(d => d !== dia)
        : [...prev, dia]
    );
  };

  const clienteSeleccionado = clientesQuery.data?.find(
    c => c.cedula === form.state.values.cedula_cliente
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
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
            Crear Nueva Rutina
          </h1>
          <p className="text-default-500 mt-1">
            Diseña una rutina personalizada para tu cliente
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
            color="success"
            variant="bordered"
            startContent={<Users className="h-4 w-4" />}
            as={Link}
            to="/dashboard/entrenador/clientes"
          >
            Mis Clientes
          </Button>
        </div>
      </motion.div>

      {/* Formulario */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Información básica */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Básica
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {/* Cliente */}
              <form.Field
                name="cedula_cliente"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'Debes seleccionar un cliente' : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <Select
                      label="Cliente"
                      placeholder="Selecciona un cliente"
                      isRequired
                      selectedKeys={field.state.value ? [field.state.value] : []}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        field.handleChange(selected);
                      }}
                      isLoading={clientesQuery.isLoading}
                      errorMessage={field.state.meta.errors[0]}
                      isInvalid={field.state.meta.errors.length > 0}
                      classNames={{
                        trigger: "bg-default-100/50"
                      }}
                    >
                      {clientesQuery.data?.map((cliente) => (
                        <SelectItem
                          key={cliente.cedula}
                          textValue={cliente.nombre + ' ' + cliente.apellido1}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{cliente.nombre + ' ' + cliente.apellido1}</span>
                            <span className="text-xs text-default-500">
                              {cliente.cedula} • {cliente.nivel}
                            </span>
                          </div>
                        </SelectItem>
                      )) ?? []}
                    </Select>

                    {clienteSeleccionado && (
                      <div className="mt-2 p-3 bg-primary-50 dark:bg-primary-50/20 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{clienteSeleccionado.nombre + ' ' + clienteSeleccionado.apellido1}</span>
                          <Chip size="sm" color="primary" variant="flat">
                            {clienteSeleccionado.nivel}
                          </Chip>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Tipo de rutina */}
              <form.Field
                name="tipo_rutina"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'Debes seleccionar un tipo de rutina' : undefined,
                }}
              >
                {(field) => (
                  <Select
                    label="Tipo de Rutina"
                    placeholder="Selecciona el tipo de rutina"
                    isRequired
                    selectedKeys={field.state.value ? [field.state.value] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      field.handleChange(selected);
                    }}
                    errorMessage={field.state.meta.errors[0]}
                    isInvalid={field.state.meta.errors.length > 0}
                    classNames={{
                      trigger: "bg-default-100/50"
                    }}
                  >
                    {tiposRutina.map((tipo) => (
                      <SelectItem key={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              </form.Field>

              {/* Descripción */}
              <form.Field name="descripcion">
                {(field) => (
                  <Input
                    label="Descripción"
                    placeholder="Describe los objetivos y características de esta rutina..."
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    classNames={{
                      inputWrapper: "bg-default-100/50"
                    }}
                  />
                )}
              </form.Field>
            </CardBody>
          </Card>
        </motion.div>

        {/* Programación */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Programación Semanal
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <p className="text-sm text-default-600">
                  Selecciona los días de la semana para esta rutina
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {diasSemana.map((dia) => (
                    <div key={dia} className="relative">
                      <Checkbox
                        isSelected={selectedDias.includes(dia)}
                        onValueChange={() => handleDiaToggle(dia)}
                        classNames={{
                          base: "w-full max-w-none p-3 rounded-lg border border-default-200 bg-default-50 hover:bg-default-100 transition-colors",
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

        {/* Información adicional */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg border border-warning-200 bg-warning-50 dark:bg-warning-50/10">
            <CardBody>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                <div className="text-sm text-warning">
                  <p className="font-medium mb-1">Información importante:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Una vez creada la rutina, podrás agregar ejercicios específicos</li>
                    <li>Los días de entrenamiento pueden modificarse posteriormente</li>
                    <li>El cliente recibirá una notificación sobre su nueva rutina</li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Acciones */}
        <motion.div
          variants={itemVariants}
          className="flex gap-3 justify-end pt-4"
        >
          <Button
            variant="bordered"
            onPress={() => navigate({ to: '/dashboard/entrenador/rutinas' })}
          >
            Cancelar
          </Button>
          <Button
            color="primary"
            startContent={<Plus className="h-4 w-4" />}
            isLoading={crearRutinaMutation.isPending}
            isDisabled={
              !form.state.values.cedula_cliente ||
              !form.state.values.tipo_rutina ||
              crearRutinaMutation.isPending
            }
            onPress={() => form.handleSubmit()}
          >
            {crearRutinaMutation.isPending ? 'Creando...' : 'Crear Rutina'}
          </Button>
        </motion.div>

        {/* Error state */}
        {crearRutinaMutation.isError && (
          <motion.div variants={itemVariants}>
            <Card className="border border-danger-200 bg-danger-50 dark:bg-danger-50/10">
              <CardBody className="text-center py-6">
                <div className="text-danger mb-2">
                  Error al crear la rutina: {crearRutinaMutation.error.message}
                </div>
                <Button
                  color="danger"
                  variant="bordered"
                  size="sm"
                  onPress={() => crearRutinaMutation.reset()}
                >
                  Intentar de nuevo
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Loading state para clientes */}
        {clientesQuery.isLoading && (
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg">
              <CardBody className="text-center py-8">
                <Spinner size="lg" color="primary" />
                <p className="text-default-500 mt-2">Cargando clientes...</p>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Error al cargar clientes */}
        {clientesQuery.isError && (
          <motion.div variants={itemVariants}>
            <Card className="border border-danger-200 bg-danger-50 dark:bg-danger-50/10">
              <CardBody className="text-center py-8">
                <div className="text-danger mb-2">
                  Error al cargar clientes: {clientesQuery.error.message}
                </div>
                <Button
                  color="danger"
                  variant="bordered"
                  onPress={() => clientesQuery.refetch()}
                >
                  Reintentar
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}