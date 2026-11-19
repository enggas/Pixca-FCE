import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMisOfertas, actualizarOfertaAcarreo } from '../services/transportistaService'

export const useMisOfertas = () =>
  useQuery({ queryKey: ['mis-ofertas-transportista'], queryFn: getMisOfertas })

export const useActualizarOferta = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: actualizarOfertaAcarreo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mis-ofertas-transportista'] }),
  })
}