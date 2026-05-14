import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import { store } from './store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

type ProvidersProps = {
  children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={4000}
      >
        <BrowserRouter>{children}</BrowserRouter>
      </SnackbarProvider>
    </QueryClientProvider>
  </Provider>
)
