import { motion } from 'framer-motion';
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Repeat,
  UserPlus
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import type { VWAnalisisFinanciero } from '@/core/types/vw_AnalisisFinanciero';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

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
};

interface Props {
  financialData: VWAnalisisFinanciero[];
}

const FinancialDashboard = ({ financialData }: Props) => {

  console.log('Financial Data:', financialData);

  // Calcular totales y métricas generales
  const totales = financialData.reduce((acc, item) => ({
    ingresosTotales: acc.ingresosTotales + item.ingresos_totales,
    clientesUnicos: acc.clientesUnicos + item.clientes_unicos,
    cantidadPagos: acc.cantidadPagos + item.cantidad_pagos,
    clientesNuevos: acc.clientesNuevos + item.clientes_nuevos,
    clientesRenovacion: acc.clientesRenovacion + item.clientes_renovacion,
    proyeccionIngresos: acc.proyeccionIngresos + item.ingresos_proyectados_proximo_periodo
  }), {
    ingresosTotales: 0,
    clientesUnicos: 0,
    cantidadPagos: 0,
    clientesNuevos: 0,
    clientesRenovacion: 0,
    proyeccionIngresos: 0
  });

  const ticketPromedio = totales.cantidadPagos > 0 ? totales.ingresosTotales / totales.cantidadPagos : 0;
  const tasaRetencionGeneral = totales.clientesUnicos > 0 ? (totales.clientesRenovacion / totales.clientesUnicos) * 100 : 0;

  // Preparar datos para gráficos
  const datosIngresosPorMes = financialData
    .sort((a, b) => a.periodo_yyyymm - b.periodo_yyyymm)
    .reduce((acc, item) => {
      const existing = acc.find(x => x.periodo === item.periodo_yyyymm);
      if (existing) {
        existing.ingresos += item.ingresos_totales;
        existing.clientes += item.clientes_unicos;
      } else {
        acc.push({
          periodo: item.periodo_yyyymm,
          mes: item.nombre_mes,
          año: item.año,
          ingresos: item.ingresos_totales,
          clientes: item.clientes_unicos,
          proyeccion: item.ingresos_proyectados_proximo_periodo
        });
      }
      return acc;
    }, [] as any[]);

  const datosPorTipoMembresia = financialData
    .reduce((acc, item) => {
      const existing = acc.find(x => x.tipo === item.tipo_membresia);
      if (existing) {
        existing.ingresos += item.ingresos_totales;
        existing.clientes += item.clientes_unicos;
      } else {
        acc.push({
          tipo: item.tipo_membresia,
          ingresos: item.ingresos_totales,
          clientes: item.clientes_unicos,
          precio: item.precio_base
        });
      }
      return acc;
    }, [] as any[]);

  const coloresPieChart = ['#0070f3', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  const calcularCrecimiento = () => {
    if (datosIngresosPorMes.length < 2) return 0;
    const mesActual = datosIngresosPorMes[datosIngresosPorMes.length - 1];
    const mesAnterior = datosIngresosPorMes[datosIngresosPorMes.length - 2];
    return ((mesActual.ingresos - mesAnterior.ingresos) / mesAnterior.ingresos) * 100;
  };

  const crecimientoMensual = calcularCrecimiento();

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
                Dashboard Financiero
              </h1>
              <p className="text-default-500">
                Análisis completo de ingresos y métricas financieras del gimnasio
              </p>
            </div>
            <div className="flex gap-3">
              <Button color="secondary" variant="bordered" startContent={<Filter size={16} />}>
                Filtros
              </Button>
              <Button color="primary" startContent={<Download size={16} />}>
                Exportar Reporte
              </Button>
            </div>
          </div>
        </motion.div>

        {/* KPIs Principales */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Ingresos Totales */}
            <Card className="shadow-lg bg-gradient-to-br from-success-50 to-success-100 dark:from-success-50 dark:to-success-100">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-success-600 dark:text-success-400 mb-1">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-success">
                      ₡{totales.ingresosTotales.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      {crecimientoMensual >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-success mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-danger mr-1" />
                      )}
                      <span className={`text-sm ${crecimientoMensual >= 0 ? 'text-success' : 'text-danger'}`}>
                        {Math.abs(crecimientoMensual).toFixed(1)}% vs mes anterior
                      </span>
                    </div>
                  </div>
                  <DollarSign className="h-12 w-12 text-success-400" />
                </div>
              </CardBody>
            </Card>

            {/* Clientes Únicos */}
            <Card className="shadow-lg bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-50 dark:to-primary-100">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary-600 dark:text-primary-400 mb-1">Clientes Únicos</p>
                    <p className="text-2xl font-bold text-primary">
                      {totales.clientesUnicos.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <UserPlus className="h-4 w-4 text-primary mr-1" />
                      <span className="text-sm text-primary">
                        {totales.clientesNuevos} nuevos este período
                      </span>
                    </div>
                  </div>
                  <Users className="h-12 w-12 text-primary-400" />
                </div>
              </CardBody>
            </Card>

            {/* Ticket Promedio */}
            <Card className="shadow-lg bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-50 dark:to-secondary-100">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">Ticket Promedio</p>
                    <p className="text-2xl font-bold text-secondary">
                      ₡{ticketPromedio.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <CreditCard className="h-4 w-4 text-secondary mr-1" />
                      <span className="text-sm text-secondary">
                        {totales.cantidadPagos} pagos totales
                      </span>
                    </div>
                  </div>
                  <BarChart3 className="h-12 w-12 text-secondary-400" />
                </div>
              </CardBody>
            </Card>

            {/* Tasa de Retención */}
            <Card className="shadow-lg bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-50 dark:to-warning-100">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-warning-600 dark:text-warning-400 mb-1">Tasa de Retención</p>
                    <p className="text-2xl font-bold text-warning">
                      {tasaRetencionGeneral.toFixed(1)}%
                    </p>
                    <div className="flex items-center mt-2">
                      <Repeat className="h-4 w-4 text-warning mr-1" />
                      <span className="text-sm text-warning">
                        {totales.clientesRenovacion} renovaciones
                      </span>
                    </div>
                  </div>
                  <Target className="h-12 w-12 text-warning-400" />
                </div>
              </CardBody>
            </Card>
          </div>
        </motion.div>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Tendencia de Ingresos */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Tendencia de Ingresos Mensuales
                </h2>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={datosIngresosPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(value) => `₡${(value / 1000)}K`} />
                    <Tooltip
                      formatter={(value: any) => [`₡${value.toLocaleString()}`, 'Ingresos']}
                      labelStyle={{ color: 'var(--foreground)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="ingresos"
                      stroke="#0070f3"
                      fill="#0070f3"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </motion.div>

          {/* Distribución por Tipo de Membresía */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <PieChart className="h-6 w-6" />
                  Ingresos por Tipo de Membresía
                </h2>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <PieChart
                      data={datosPorTipoMembresia}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="ingresos"
                      nameKey="tipo"
                    >
                      {datosPorTipoMembresia.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={coloresPieChart[index % coloresPieChart.length]} />
                      ))}
                    </PieChart>
                    <Tooltip
                      formatter={(value: any) => [`₡${value.toLocaleString()}`, 'Ingresos']}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* Análisis detallado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Proyecciones */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  Proyecciones
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="p-4 bg-primary-50 dark:bg-primary-50 rounded-lg">
                    <div className="text-sm text-primary-600 dark:text-primary-400 mb-1">
                      Ingresos Proyectados
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      ₡{totales.proyeccionIngresos.toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {datosIngresosPorMes.slice(-3).map((mes, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border border-divider rounded">
                        <span className="text-sm">{mes.mes} {mes.año}</span>
                        <span className="font-semibold">₡{mes.proyeccion.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Top Membresías */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <h2 className="text-xl font-semibold">Top Membresías</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {datosPorTipoMembresia
                    .sort((a, b) => b.ingresos - a.ingresos)
                    .slice(0, 5)
                    .map((membresia, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-content2 rounded-lg">
                        <div>
                          <div className="font-semibold">{membresia.tipo}</div>
                          <div className="text-sm text-default-500">
                            {membresia.clientes} clientes
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-success">
                            ₡{membresia.ingresos.toLocaleString()}
                          </div>
                          <div className="text-sm text-default-500">
                            ₡{membresia.precio.toLocaleString()}/mes
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Métricas de Rendimiento */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg">
              <CardHeader className="pb-2">
                <h2 className="text-xl font-semibold">Métricas Clave</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border border-divider rounded-lg">
                    <span className="text-sm font-medium">Clientes Nuevos</span>
                    <Chip color="success" variant="flat">
                      {totales.clientesNuevos}
                    </Chip>
                  </div>

                  <div className="flex justify-between items-center p-3 border border-divider rounded-lg">
                    <span className="text-sm font-medium">Renovaciones</span>
                    <Chip color="primary" variant="flat">
                      {totales.clientesRenovacion}
                    </Chip>
                  </div>

                  <div className="flex justify-between items-center p-3 border border-divider rounded-lg">
                    <span className="text-sm font-medium">Tasa Retención</span>
                    <Chip
                      color={tasaRetencionGeneral >= 70 ? "success" : tasaRetencionGeneral >= 50 ? "warning" : "danger"}
                      variant="flat"
                    >
                      {tasaRetencionGeneral.toFixed(1)}%
                    </Chip>
                  </div>

                  <div className="flex justify-between items-center p-3 border border-divider rounded-lg">
                    <span className="text-sm font-medium">Crecimiento</span>
                    <Chip
                      color={crecimientoMensual >= 0 ? "success" : "danger"}
                      variant="flat"
                      startContent={crecimientoMensual >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    >
                      {Math.abs(crecimientoMensual).toFixed(1)}%
                    </Chip>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* Resumen ejecutivo */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <CardBody className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Resumen Ejecutivo</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-3xl font-bold">₡{totales.ingresosTotales.toLocaleString()}</div>
                    <div className="text-sm opacity-90">Ingresos Totales</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{totales.clientesUnicos}</div>
                    <div className="text-sm opacity-90">Clientes Activos</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{tasaRetencionGeneral.toFixed(0)}%</div>
                    <div className="text-sm opacity-90">Tasa de Retención</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">₡{ticketPromedio.toLocaleString()}</div>
                    <div className="text-sm opacity-90">Ticket Promedio</div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FinancialDashboard;