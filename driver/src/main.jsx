import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import App from './App.jsx'
import './index.css'

const qc = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1C1009',
            color: '#fff',
            border: '1px solid #2E1A00',
            borderRadius: 16,
            fontFamily: 'Cairo, sans-serif',
            direction: 'rtl',
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
)
