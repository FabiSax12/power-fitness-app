import { motion, type Variants } from 'framer-motion';
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
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie
} from 'recharts';

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

interface VWAnalisisFinanciero {
  año: number;
  mes: number;
  nombre_mes: string;
  periodo_yyyymm: number;
  tipo_membresia: string;
  precio_base: number;
  frecuencia_pago: string;
  cantidad_pagos: number;
  clientes_unicos: number;
  ingresos_totales: number;
  ticket_promedio: number;
  pago_minimo: number;
  pago_maximo: number;
  metodos_pago_usados: number;
  pagos_renovacion: number;
  pagos_clientes_nuevos: number;
  clientes_renovacion: number;
  clientes_nuevos: number;
  membresías_activas_fin_periodo: number;
  ingresos_proyectados_proximo_periodo: number;
  tasa_renovacion_pagos_porcentaje: number;
  tasa_renovacion_clientes_porcentaje: number;
  promedio_pagos_por_cliente: number;
  ingresos_promedio_por_cliente: number;
  metodo_pago_preferido: string;
}

interface Props {
  financialData: VWAnalisisFinanciero[];
  datosPorTipoMembresia: any[];
}

const FinancialDashboard = ({ financialData, datosPorTipoMembresia }: Props) => {
  console.log('Financial Data:', financialData);

  // ✅ NUEVA LÓGICA: Agregación correcta por mes
  const datosPorMes = financialData.reduce((acc, item) => {
    const periodo = item.periodo_yyyymm;

    if (!acc[periodo]) {
      acc[periodo] = {
        periodo: periodo,
        año: item.año,
        mes: item.mes,
        nombre_mes: item.nombre_mes,
        ingresos_totales: 0,
        cantidad_pagos: 0,
        clientes_unicos: 0, // Sumamos todos los clientes únicos del mes
        clientes_nuevos: 0,
        clientes_renovacion: 0,
        proyeccion_ingresos: 0,
        tipos_membresia: []
      };
    }

    // Agregamos todos los datos del mes
    acc[periodo].ingresos_totales += item.ingresos_totales;
    acc[periodo].cantidad_pagos += item.cantidad_pagos;
    acc[periodo].clientes_unicos += item.clientes_unicos;
    acc[periodo].clientes_nuevos += item.clientes_nuevos;
    acc[periodo].clientes_renovacion += item.clientes_renovacion;
    acc[periodo].proyeccion_ingresos += item.ingresos_proyectados_proximo_periodo;

    // Guardamos los tipos de membresía para referencia
    acc[periodo].tipos_membresia.push({
      tipo: item.tipo_membresia,
      clientes: item.clientes_unicos,
      ingresos: item.ingresos_totales
    });

    return acc;
  }, {} as Record<number, any>);

  // Convertir a array y ordenar
  const datosIngresosPorMes = Object.values(datosPorMes)
    .sort((a: any, b: any) => a.periodo - b.periodo);

  // ✅ NUEVA LÓGICA: Totales generales
  const totales = datosIngresosPorMes.reduce((acc, mes: any) => ({
    ingresosTotales: acc.ingresosTotales + mes.ingresos_totales,
    clientesUnicos: acc.clientesUnicos + mes.clientes_unicos,
    cantidadPagos: acc.cantidadPagos + mes.cantidad_pagos,
    clientesNuevos: acc.clientesNuevos + mes.clientes_nuevos,
    clientesRenovacion: acc.clientesRenovacion + mes.clientes_renovacion,
    proyeccionIngresos: acc.proyeccionIngresos + mes.proyeccion_ingresos
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

  // ✅ NUEVA LÓGICA: Datos por tipo de membresía (agregados)
  // const datosPorTipoMembresia = financialData
  //   .reduce((acc, item) => {
  //     const existing = acc.find(x => x.tipo === item.tipo_membresia);
  //     if (existing) {
  //       existing.ingresos += item.ingresos_totales;
  //       existing.clientes += item.clientes_unicos;
  //       existing.cantidad_pagos += item.cantidad_pagos;
  //     } else {
  //       acc.push({
  //         tipo: item.tipo_membresia,
  //         ingresos: item.ingresos_totales,
  //         clientes: item.clientes_unicos,
  //         cantidad_pagos: item.cantidad_pagos,
  //         precio: item.precio_base,
  //         frecuencia: item.frecuencia_pago
  //       });
  //     }
  //     return acc;
  //   }, [] as any[]);

  const coloresPieChart = ['#0070f3', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#06b6d4'];

  // ✅ NUEVA LÓGICA: Cálculo de crecimiento
  const calcularCrecimiento = () => {
    if (datosIngresosPorMes.length < 2) return 0;
    const mesActual = datosIngresosPorMes[datosIngresosPorMes.length - 1];
    const mesAnterior = datosIngresosPorMes[datosIngresosPorMes.length - 2];

    console.log('Cálculo de crecimiento:', {
      mesActual: mesActual.nombre_mes,
      ingresoActual: mesActual.ingresos_totales,
      mesAnterior: mesAnterior.nombre_mes,
      ingresoAnterior: mesAnterior.ingresos_totales
    });

    if (mesAnterior.ingresos_totales === 0) return 0;
    return ((mesActual.ingresos_totales - mesAnterior.ingresos_totales) / mesAnterior.ingresos_totales) * 100;
  };

  const crecimientoMensual = calcularCrecimiento();

  // Preparar datos para el gráfico de tendencia
  const datosGraficoTendencia = datosIngresosPorMes.map(mes => ({
    mes: mes.nombre_mes,
    año: mes.año,
    ingresos: mes.ingresos_totales,
    clientes: mes.clientes_unicos,
    proyeccion: mes.proyeccion_ingresos
  }));

  // ✅ NUEVA MÉTRICA: Análisis de métodos de pago preferidos
  const metodosPagoPreferidos = financialData
    .reduce((acc, item) => {
      if (!acc[item.metodo_pago_preferido]) {
        acc[item.metodo_pago_preferido] = {
          metodo: item.metodo_pago_preferido,
          usos: 0,
          ingresos: 0
        };
      }
      acc[item.metodo_pago_preferido].usos += 1;
      acc[item.metodo_pago_preferido].ingresos += item.ingresos_totales;
      return acc;
    }, {} as Record<string, any>);

  const metodosOrdenados = Object.values(metodosPagoPreferidos)
    .sort((a: any, b: any) => b.ingresos - a.ingresos);

  return (
    <div className="min-h-screen p-6 bg-background">
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
            <Card className="shadow-lg bg-gradient-to-br from-success-50 to-success-100">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-success-600 mb-1">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-success">
                      ₡{totales.ingresosTotales.toLocaleString()}
                    </p>
                    <span className='text-md text-success'>
                      {datosIngresosPorMes[datosIngresosPorMes.length - 1].ingresos_totales.toLocaleString('es-CR', { currency: 'CRC', style: 'currency' })} este mes
                    </span>
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
            <Card className="shadow-lg bg-gradient-to-br from-primary-50 to-primary-100">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary-600 mb-1">Clientes Activos</p>
                    <p className="text-2xl font-bold text-primary">
                      {totales.clientesNuevos.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2">
                      <UserPlus className="h-4 w-4 text-primary mr-1" />
                      <span className="text-sm text-primary">
                        {datosIngresosPorMes.at(-1).clientes_nuevos} nuevos este mes
                      </span>
                    </div>
                  </div>
                  <Users className="h-12 w-12 text-primary-400" />
                </div>
              </CardBody>
            </Card>

            {/* Ticket Promedio */}
            <Card className="shadow-lg bg-gradient-to-br from-secondary-50 to-secondary-100">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-600 mb-1">Pago Promedio</p>
                    <p className="text-2xl font-bold text-secondary">
                      {ticketPromedio.toLocaleString('es-CR', { currency: 'CRC', style: 'currency' })}
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
            <Card className="shadow-lg bg-gradient-to-br from-warning-50 to-warning-100">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-warning-600 mb-1">Tasa de Retención</p>
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
                  <AreaChart data={datosGraficoTendencia}>
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
                    <Pie
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
                    </Pie>
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
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <div className="text-sm text-primary-600 mb-1">
                      Ingresos Proyectados proximo mes
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      ₡{datosGraficoTendencia.at(-1)?.proyeccion.toLocaleString()}
                    </div>
                  </div>

                  {/* <div className="space-y-2">

                    <div className="flex justify-between items-center p-2 border border-divider rounded">
                      <span className="text-sm">Proximo mes {datosGraficoTendencia.at(-1)?.año}</span>
                      <span className="font-semibold">₡{datosGraficoTendencia.at(-1)?.proyeccion.toLocaleString()}</span>
                    </div>

                  </div> */}
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
                            {membresia.clientes} clientes • {membresia.frecuencia}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-success">
                            ₡{membresia.ingresos.toLocaleString()}
                          </div>
                          <div className="text-sm text-default-500">
                            ₡{membresia.precio.toLocaleString()}/{membresia.frecuencia.toLowerCase()}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Métricas de Rendimiento y Métodos de Pago */}
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

                  {/* Top método de pago */}
                  {metodosOrdenados.length > 0 && (
                    <div className="flex justify-between items-center p-3 border border-divider rounded-lg">
                      <span className="text-sm font-medium">Método Preferido</span>
                      <Chip color="secondary" variant="flat">
                        {metodosOrdenados[0].metodo}
                      </Chip>
                    </div>
                  )}
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