import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as service from '../services/productorService'

const K = 'productor'

// ---------- Consultas ----------
export const usePerfilProductor = () =>
  useQuery({ queryKey: [K, 'perfil'], queryFn: service.getPerfilProductor, retry: false, staleTime: 1000 * 60 * 5 })

export const useCultivos = () =>
  useQuery({ queryKey: [K, 'cultivos'], queryFn: service.getCultivos, staleTime: 1000 * 60 * 10 })

export const useSiembras = () => useQuery({ queryKey: [K, 'siembras'], queryFn: service.getSiembras })

export const useInformacion = () =>
  useQuery({ queryKey: [K, 'informacion'], queryFn: service.getInformacion, staleTime: 1000 * 60 * 10 })

export const useCosechas = () => useQuery({ queryKey: [K, 'cosechas'], queryFn: service.getCosechas })

export const useVentas = () => useQuery({ queryKey: [K, 'ventas'], queryFn: service.getVentas })

// ---------- Mutaciones ----------
const useMutacion = (mutationFn, queryKeys) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => queryKeys.forEach((queryKey) => queryClient.invalidateQueries({ queryKey })),
  })
}

export const useCrearSiembra = () => useMutacion(service.crearSiembra, [[K, 'siembras']])

export const useActualizarFase = () => useMutacion(service.actualizarFase, [[K, 'siembras']])

export const useCrearCosecha = () => useMutacion(service.crearCosecha, [[K, 'cosechas']])

// 'lotes-disponibles' es la caché de la tienda del comprador
export const useCrearLote = () => useMutacion(service.crearLote, [[K, 'cosechas'], ['lotes-disponibles']])

export const useGuardarRemate = () =>
  useMutacion(service.guardarRemate, [[K, 'cosechas'], ['lotes-disponibles']])

export const useCambiarEstadoRemate = () =>
  useMutacion(service.cambiarEstadoRemate, [[K, 'cosechas'], ['lotes-disponibles']])