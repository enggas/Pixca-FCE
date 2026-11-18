import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getVehiculos, crearVehiculo, getSolicitudes, enviarOferta,
  getViajes, iniciarViaje, enviarUbicacion, cerrarEntrega, getHistorial,
} from '../services/transportistaService'

const INTERVALO_TELEMETRIA_MS = 15000

export const useVehiculos = () => useQuery({ queryKey: ['transp-vehiculos'], queryFn: getVehiculos })
export const useSolicitudes = () => useQuery({ queryKey: ['transp-solicitudes'], queryFn: getSolicitudes })
export const useViajes = () => useQuery({ queryKey: ['transp-viajes'], queryFn: getViajes })
export const useHistorial = () => useQuery({ queryKey: ['transp-historial'], queryFn: getHistorial })

const useMutacion = (mutationFn, keys) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => keys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] })),
  })
}

export const useCrearVehiculo = () => useMutacion(crearVehiculo, ['transp-vehiculos'])
export const useEnviarOferta = () => useMutacion(enviarOferta, ['transp-solicitudes', 'transp-viajes'])
export const useIniciarViaje = () => useMutacion(iniciarViaje, ['transp-viajes'])
export const useCerrarEntrega = () =>
  useMutacion(cerrarEntrega, ['transp-viajes', 'transp-historial'])

export const useTelemetria = (detEntregaId) => {
  const [estado, setEstado] = useState(() =>
    typeof navigator !== 'undefined' && navigator.geolocation ? 'buscando' : 'no-soportado'
  )
  const [ultimoEnvio, setUltimoEnvio] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) return

    let posicion = null
    let enviando = false

    const enviar = async () => {
      if (!posicion || enviando) return
      enviando = true
      try {
        await enviarUbicacion({ detEntregaId, latitud: posicion.lat, longitud: posicion.lng })
        setUltimoEnvio(new Date())
        setEstado('activo')
      } catch {
        setEstado('error')
      } finally {
        enviando = false
      }
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const esPrimera = !posicion
        posicion = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        if (esPrimera) enviar()
      },
      () => setEstado('sin-permiso'),
      { enableHighAccuracy: true, maximumAge: 5000 }
    )
    const timer = setInterval(enviar, INTERVALO_TELEMETRIA_MS)

    return () => {
      navigator.geolocation.clearWatch(watchId)
      clearInterval(timer)
    }
  }, [detEntregaId])

  return { estado, ultimoEnvio }
}