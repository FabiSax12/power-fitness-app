import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    if (!context.auth?.isAuthenticated) throw redirect({
      to: '/auth/login',
      search: {
        redirect: '/dashboard',
        error: undefined
      }
    })

    throw redirect({
      to: '/dashboard',
    })
  }
})
