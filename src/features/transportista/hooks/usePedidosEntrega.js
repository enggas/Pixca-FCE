import { useQuery } from '@tanstack/react-query'
import {
  getPedidosEntrega,
  getHistorialTraslados,
  getPedidoDetalle,
  getPerfilActual,
} from '../services/transportistaService'

export const usePedidosEntrega = () =>
  useQuery({
    queryKey: ['pedidos-pendientes-transportista'],
    queryFn: getPedidosEntrega,
    staleTime: 1000 * 60 * 5,
  })

export const useHistorialTraslados = () =>
  useQuery({
    queryKey: ['historial-transportista'],
    queryFn: getHistorialTraslados,
    staleTime: 1000 * 60 * 5,
  })

export const usePedidoDetalle = (id) =>
  useQuery({
    queryKey: ['pedido-detalle', id],
    queryFn: () => getPedidoDetalle(id),
    enabled: Boolean(id),
  })

export const usePerfilActual = () =>
  useQuery({
    queryKey: ['perfil-actual'],
    queryFn: getPerfilActual,
  })