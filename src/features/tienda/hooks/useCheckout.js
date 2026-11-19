import { useMutation, useQueryClient } from '@tanstack/react-query'
import { procesarCompra } from '../services/comprasService'

export const useCheckout = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: procesarCompra,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotes-disponibles'] })
      queryClient.invalidateQueries({ queryKey: ['mis-pedidos'] })
    },
  })
}