import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import reportWebVitals from './reportWebVitals.ts'
import './styles.css'
import { useAuthStore } from './modules/auth/stores/authStore.ts'
import { HeroUIProvider } from '@heroui/system'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProvider.getContext(),
    auth: undefined,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const App = () => {
  const auth = useAuthStore()

  return (
    <HeroUIProvider locale='es-CR'>
      <RouterProvider router={router} context={{ auth }} />
    </HeroUIProvider>
  )
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider>
        <App />
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
