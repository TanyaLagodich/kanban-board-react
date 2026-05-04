import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Board from './components/board/Board'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60, retry: 1 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Board />
    </QueryClientProvider>
  )
}
