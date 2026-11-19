import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { aceptarOfertaEntrega, getMisPedidos } from '../services/comprasService'

export const useMisPedidos = () =>
  useQuery({
    queryKey: ['mis-pedidos'],
    queryFn: getMisPedidos,
    refetchInterval: 15000, // RF-13: refresca ofertas y ubicación en ruta
  })

export const useAceptarOferta = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: aceptarOfertaEntrega,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mis-pedidos'] }),
  })
}