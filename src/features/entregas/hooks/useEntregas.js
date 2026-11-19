import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getEntregasRelacionadas, guardarConfirmacionUbicacion } from '../services/entregasService'

const KEY = ['entregas-relacionadas']

export const useEntregas = () => useQuery({ queryKey: KEY, queryFn: getEntregasRelacionadas })

export const useConfirmarUbicacion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: guardarConfirmacionUbicacion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  })
}