import { motion, type Variants } from 'framer-motion';
import { Avatar } from "@heroui/avatar";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import {
  CreditCard,
  User,
  DollarSign,
  TrendingUp,
  Dumbbell,
  Zap,
  AlertTriangle,
  Calendar,
  MessageCircle,
  Activity,
  Clock,
  Target
} from 'lucide-react';
import type { VWDashboardCliente } from '@/core/types/vw_DashboardCliente';
import { useNavigate } from '@tanstack/react-router';

const containerVariants: Variants = {
  inactive: { opacity: 0 },
  active: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  inactive: { y: 20, opacity: 0 },
  active: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

interface Props {
  clientData: VWDashboardCliente;
}

const PowerFitnessDashboard = ({ clientData }: Props) => {

  const navigate = useNavigate();

  const getSituacionColor = (situacion: string) => {
    switch (situacion) {
      case 'VIGENTE': return 'success';
      case 'PRÓXIMA A VENCER': return 'warning';
      case 'POR VENCER': return 'danger';
      case 'VENCIDA': return 'danger';
      default: return 'default';
    }
  };

  const getRiesgoColor = (riesgo: string) => {
    switch (riesgo) {
      case 'BAJO': return 'success';
      case 'MEDIO': return 'warning';
      case 'ALTO': return 'danger';
      default: return 'default';
    }
  };

  const calcularProgresoMes = () => {
    const diasEnMes = 30;
    const diasTranscurridos = diasEnMes - (clientData.dias_restantes ?? 0);
    return Math.min((diasTranscurridos / diasEnMes) * 100, 100);
  };

  return (
    <div className="min-h-screen p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">

              <h1 className="text-3xl font-bold text-foreground">
                ¡Hola, {clientData.nombre_completo.split(' ')[0]}!
              </h1>
              <p className="text-default-500">
                Miembro desde el {clientData.membresia_inicio ? new Date(clientData.membresia_inicio).toLocaleDateString('es-CR', { dateStyle: 'medium' }) : 'Fecha desconocida'}.
              </p>

            </div>
            <Chip
              color={getRiesgoColor(clientData.riesgo_abandono)}
              variant="solid"
              size="lg"
              startContent={<AlertTriangle size={16} />}
            >
              Riesgo: {clientData.riesgo_abandono}
            </Chip>
          </div>
        </motion.div>

        {/* Alertas importantes */}
        {clientData.situacion_membresia === 'POR VENCER' && (
          <motion.div variants={itemVariants} className="mb-6">
            <Card className="border-l-4 border-l-danger bg-danger-50 dark:bg-danger-50/10">
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="text-danger h-6 w-6" />
                    <div>
                      <h3 className="font-semibold text-danger">
                        Membresía por vencer
                      </h3>
                      <p className="text-danger-600 dark:text-danger-400">
                        Tu membresía vence en {clientData.dias_restantes} días. ¡Renueva ahora!
                      </p>
                    </div>
                  </div>
                  <Button color="danger" variant="solid">
                    Renovar Ahora
                  </Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Columna izquierda - Información personal y membresía */}
          <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">

            {/* Estado de Membresía */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg bg-content1">
                <CardHeader className="pb-2">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <CreditCard className="h-6 w-6" />
                    Estado de Membresía
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">{clientData.tipo_membresia_actual}</span>
                      <Chip color={getSituacionColor(clientData.situacion_membresia)} variant="solid">
                        {clientData.situacion_membresia}
                      </Chip>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-default-500">Precio mensual</p>
                        <p className="text-xl font-bold text-success">
                          ₡{clientData.precio_membresia?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-default-500">Vence el</p>
                        <p className="text-lg font-semibold">
                          {clientData.membresia_vencimiento ? new Date(clientData.membresia_vencimiento).toLocaleDateString('es-CR', { dateStyle: 'medium' }) : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progreso del mes</span>
                        <span>{Math.round(calcularProgresoMes())}%</span>
                      </div>
                      <Progress
                        value={calcularProgresoMes()}
                        color={calcularProgresoMes() > 80 ? "success" : "primary"}
                        className="h-2"
                      />
                    </div> */}
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Información Personal */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg">
                <CardHeader className="pb-2">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <User className="h-6 w-6" />
                    Perfil Personal
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-primary-50 dark:bg-primary-50/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{clientData.edad}</div>
                      <div className="text-sm text-default-500">Años</div>
                    </div>
                    <div className="text-center p-4 bg-success-50 dark:bg-success-50/10 rounded-lg">
                      <div className="text-2xl font-bold text-success">{clientData.peso_actual}kg</div>
                      <div className="text-sm text-default-500">Peso Actual</div>
                    </div>
                    <div className="text-center p-4 bg-secondary-50 dark:bg-secondary-50/10 rounded-lg">
                      <div className="text-lg font-bold text-secondary">{clientData.nivel_fitness}</div>
                      <div className="text-sm text-default-500">Nivel</div>
                    </div>
                    <div className="text-center p-4 bg-warning-50 dark:bg-warning-50/10 rounded-lg">
                      <div className="text-2xl font-bold text-warning">{clientData.rutinas_activas || 0}</div>
                      <div className="text-sm text-default-500">Rutinas Activas</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Resumen Financiero */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg">
                <CardHeader className="pb-2">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <DollarSign className="h-6 w-6" />
                    Resumen Financiero
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border border-divider rounded-lg">
                      <div className="text-2xl font-bold text-success">
                        ₡{clientData.total_pagado?.toLocaleString() || 0}
                      </div>
                      <div className="text-sm text-default-500">Total Pagado</div>
                    </div>
                    <div className="text-center p-4 border border-divider rounded-lg">
                      <div className="text-2xl font-bold text-primary">{clientData.cantidad_pagos ?? 0}</div>
                      <div className="text-sm text-default-500">Pagos Realizados</div>
                    </div>
                    <div className="text-center p-4 border border-divider rounded-lg">
                      <div className="text-lg font-bold text-foreground">
                        {clientData.ultimo_pago ? new Date(clientData.ultimo_pago).toLocaleDateString('es-CR', { dateStyle: 'medium' }) : 'N/A'}
                      </div>
                      <div className="text-sm text-default-500">Último Pago</div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>

          {/* Columna derecha - Progreso y acciones */}
          <div className="space-y-6">

            {/* Progreso Reciente */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg">
                <CardHeader className="pb-2">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    Mi Progreso
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-success-50 dark:bg-success-50/10 rounded-lg">
                      <div>
                        <div className="font-semibold text-success">Registros de Progreso</div>
                        <div className="text-sm text-success-600 dark:text-success-400">
                          Total: {clientData.total_registros_progreso || 0}
                        </div>
                      </div>
                      <Activity className="h-8 w-8 text-success" />
                    </div>

                    <div className="p-3 border border-divider rounded-lg">
                      <div className="text-sm text-default-500 mb-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Último registro
                      </div>
                      <div className="font-semibold">
                        {
                          clientData.ultimo_progreso
                            ? new Date(clientData.ultimo_progreso).toLocaleDateString()
                            : 'No hay registros recientes'
                        }
                      </div>
                    </div>

                    <Button color="primary" className="w-full" startContent={<TrendingUp className="h-4 w-4" />} onPress={() => navigate({ to: '/dashboard/cliente/progreso' })}>
                      Ver Progreso Completo
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Mi Entrenador */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg" isDisabled={!clientData.ultimo_entrenador}>
                <CardHeader className="pb-2">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Dumbbell className="h-6 w-6" />
                    Mi Entrenador
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="text-center space-y-3">
                    <Avatar
                      src="/api/placeholder/60/60"
                      size="lg"
                      className="mx-auto"
                    />
                    <div>
                      <div className="font-semibold text-lg">{clientData.ultimo_entrenador}</div>
                      <div className="text-sm text-default-500">Entrenador Personal</div>
                    </div>
                    <div className="space-y-2">
                      <Button
                        isDisabled={!clientData.ultimo_entrenador}
                        color="secondary"
                        variant="bordered"
                        className="w-full"
                        startContent={<MessageCircle className="h-4 w-4" />}
                      >
                        Enviar Mensaje
                      </Button>
                      <Button
                        isDisabled={!clientData.ultimo_entrenador}
                        color="primary"
                        className="w-full"
                        startContent={<Target className="h-4 w-4" />}
                        onPress={() => navigate({ to: '/dashboard/cliente/rutinas' })}
                      >
                        Ver Rutinas
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Acciones Rápidas */}
            {/* <motion.div variants={itemVariants}>
              <Card className="shadow-lg">
                <CardHeader className="pb-2">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Zap className="h-6 w-6" />
                    Acciones Rápidas
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    <Button
                      color="success"
                      className="w-full"
                      startContent={<TrendingUp className="h-4 w-4" />}
                    >
                      Registrar Progreso
                    </Button>
                    <Button
                      color="primary"
                      variant="bordered"
                      className="w-full"
                      startContent={<Calendar className="h-4 w-4" />}
                    >
                      Agendar Clase
                    </Button>
                    <Button
                      color="secondary"
                      variant="bordered"
                      className="w-full"
                      startContent={<Clock className="h-4 w-4" />}
                    >
                      Historial de Pagos
                    </Button>
                    <Button
                      color="warning"
                      variant="bordered"
                      className="w-full"
                      startContent={<User className="h-4 w-4" />}
                    >
                      Actualizar Perfil
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div> */}
          </div>
        </div>

        {/* Footer con estadísticas */}
        <motion.div variants={itemVariants} className="mt-8">
          <Card className="shadow-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">₡{clientData.valor_total_cliente?.toLocaleString() ?? 0}</div>
                  <div className="text-sm opacity-90">Valor Total Como Cliente</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{clientData.dias_restantes ?? 0}</div>
                  <div className="text-sm opacity-90">Días Restantes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{clientData.rutinas_activas || 0}</div>
                  <div className="text-sm opacity-90">Rutinas Activas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{clientData.total_registros_progreso || 0}</div>
                  <div className="text-sm opacity-90">Registros de Progreso</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PowerFitnessDashboard;