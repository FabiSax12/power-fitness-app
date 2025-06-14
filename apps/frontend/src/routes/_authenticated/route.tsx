import { createFileRoute, Link, Outlet, redirect, useRouter } from '@tanstack/react-router'
import { useAuthStore } from '@/modules/auth/stores/authStore'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem
} from "@heroui/navbar"
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/dropdown"
import { Avatar } from "@heroui/avatar"
import { Button } from "@heroui/button"
import { Chip } from "@heroui/chip"
import {
  Dumbbell,
  LogOut,
  User,
  Settings,
  Bell,
  Search
} from 'lucide-react'
import type { UserType } from '@/core/entities/User'

// Configuración de navegación por tipo de usuario
const navigationConfig: Record<UserType, Array<{ label: string; href: string; icon?: React.ReactNode }>> = {
  cliente: [
    { label: 'Dashboard', href: '/dashboard/cliente' },
    { label: 'Mis Rutinas', href: '/dashboard/cliente/rutinas' },
    { label: 'Mi Progreso', href: '/dashboard/cliente/progreso' },
    { label: 'Clases', href: '/dashboard/cliente/clases' },
    { label: 'Membresía', href: '/dashboard/cliente/membresia' },
    { label: 'Pagos', href: '/dashboard/cliente/pagos' },
  ],
  entrenador: [
    { label: 'Dashboard', href: '/dashboard/entrenador' },
    { label: 'Mis Clientes', href: '/dashboard/entrenador/clientes' },
    { label: 'Rutinas', href: '/dashboard/entrenador/rutinas' },
    { label: 'Clases', href: '/dashboard/entrenador/clases' },
    { label: 'Progreso', href: '/dashboard/entrenador/progreso' },
    { label: 'Reportes', href: '/dashboard/entrenador/reportes' },
  ],
  administrativo: [
    { label: 'Dashboard', href: '/dashboard/admin' },
    { label: 'Financiero', href: '/dashboard/admin/financiero' },
    { label: 'Usuarios', href: '/dashboard/admin/usuarios' },
    { label: 'Membresías', href: '/dashboard/admin/membresias' },
    { label: 'Gimnasio', href: '/dashboard/admin/gimnasio' },
    { label: 'Ejercicios', href: '/dashboard/admin/ejercicios' },
    { label: 'Reportes', href: '/dashboard/admin/reportes' },
    { label: 'Configuración', href: '/dashboard/admin/configuracion' },
  ],
}

// Mapeo de colores por tipo de usuario
const userTypeConfig: Record<UserType, { color: string; label: string }> = {
  cliente: { color: 'primary', label: 'Cliente' },
  entrenador: { color: 'success', label: 'Entrenador' },
  administrativo: { color: 'warning', label: 'Administrador' },
}

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: ({ context }) => {
    if (!context.auth?.isAuthenticated) {
      throw redirect({ to: '/auth/login', search: { redirect: location.href, error: 'not_authenticated' } })
    }
  }
})

function AuthenticatedLayout() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Obtener configuración del usuario actual
  const userConfig = user ? userTypeConfig[user.tipo_usuario] : null
  const navigationItems = user ? navigationConfig[user.tipo_usuario] : []

  const handleLogout = () => {
    logout()
    router.navigate({ to: '/auth/login', search: { redirect: '/dashboard', error: 'logout' } })
  }

  const handleProfileAction = (key: string) => {
    switch (key) {
      case 'profile':
        // Navegar al perfil según tipo de usuario
        if (user) {
          const profileRoutes: Record<UserType, string> = {
            cliente: '/dashboard/cliente/perfil',
            entrenador: '/dashboard/entrenador/perfil',
            administrativo: '/dashboard/admin/perfil',
          }
          router.navigate({ to: profileRoutes[user.tipo_usuario] })
        }
        break
      case 'logout':
        handleLogout()
        break
    }
  }

  if (!user) {
    return null // Esto no debería ocurrir debido al beforeLoad
  }

  return (
    <div>
      {/* Header/Navbar */}
      <Navbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        maxWidth="full"
        className="border-b border-divider"
        classNames={{
          wrapper: "px-4 sm:px-6 lg:px-8",
        }}
      >
        {/* Brand */}
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="p-2 bg-primary rounded-lg">
                <Dumbbell className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-xl text-foreground">Power Fitness</p>
                <p className="text-xs text-default-500 -mt-1">
                  {userConfig?.label}
                </p>
              </div>
            </motion.div>
          </NavbarBrand>
        </NavbarContent>

        {/* Desktop Navigation */}
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {navigationItems.slice(0, 6).map((item) => (
            <NavbarItem key={item.href}>
              <Link
                to={item.href}
                className="text-default-600 hover:text-foreground flex items-center gap-2"
                activeOptions={{ exact: true, includeSearch: false, includeHash: true }}
                activeProps={{
                  className: 'text-primary-600 dark:text-primary-400 font-semibold'
                }}
              >
                {item.icon && <span className="inline-block">{item.icon}</span>}
                {item.label}
              </Link>

            </NavbarItem>
          ))}
        </NavbarContent>

        {/* Right side - User menu */}
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Button
              isIconOnly
              variant="light"
              aria-label="Notificaciones"
              className="text-default-600"
            >
              <Bell className="h-5 w-5" />
            </Button>
          </NavbarItem>

          <NavbarItem className="hidden lg:flex">
            <Button
              isIconOnly
              variant="light"
              aria-label="Búsqueda"
              className="text-default-600"
            >
              <Search className="h-5 w-5" />
            </Button>
          </NavbarItem>

          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {user.nombre} {user.apellido1}
                    </p>
                    <div className="flex items-center justify-end gap-1">
                      <Chip
                        size="sm"
                        color={userConfig?.color as any}
                        variant="flat"
                        className="text-xs"
                      >
                        {userConfig?.label}
                      </Chip>
                    </div>
                  </div>
                  <Avatar
                    size="sm"
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.cedula}`}
                    name={`${user.nombre} ${user.apellido1}`}
                    className="border-2 border-primary/20"
                  />
                </div>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Profile Actions"
                onAction={(key) => handleProfileAction(key as string)}
              >
                <DropdownItem
                  key="user-info"
                  className="h-14 gap-2 opacity-100"
                  textValue="User info"
                >
                  <div className="flex flex-col">
                    <p className="font-semibold">{user.nombre} {user.apellido1}</p>
                    <p className="text-sm text-default-500">{user.correo}</p>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="profile"
                  startContent={<User className="h-4 w-4" />}
                >
                  Mi Perfil
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  startContent={<Settings className="h-4 w-4" />}
                >
                  Configuración
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-danger"
                  color="danger"
                  startContent={<LogOut className="h-4 w-4" />}
                >
                  Cerrar Sesión
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>

        {/* Mobile Navigation Menu */}
        <NavbarMenu className="pt-6">
          <div className="flex flex-col gap-4">
            {/* User info en mobile */}
            <div className="flex items-center gap-3 p-4 bg-default-50 dark:bg-default-100/20 rounded-lg">
              <Avatar
                size="md"
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.cedula}`}
                name={`${user.nombre} ${user.apellido1}`}
              />
              <div>
                <p className="font-semibold text-foreground">
                  {user.nombre} {user.apellido1}
                </p>
                <Chip
                  size="sm"
                  color={userConfig?.color as any}
                  variant="flat"
                >
                  {userConfig?.label}
                </Chip>
              </div>
            </div>

            {/* Navigation items */}
            {navigationItems.map((item) => (
              <NavbarMenuItem key={item.href}>
                <Button
                  as="a"
                  href={item.href}
                  variant="light"
                  className="w-full justify-start text-foreground"
                  onPress={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Button>
              </NavbarMenuItem>
            ))}

            {/* Logout button en mobile */}
            <div className="pt-4 border-t border-divider">
              <Button
                color="danger"
                variant="light"
                className="w-full justify-start"
                startContent={<LogOut className="h-4 w-4" />}
                onPress={handleLogout}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </NavbarMenu>
      </Navbar>

      {/* Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}