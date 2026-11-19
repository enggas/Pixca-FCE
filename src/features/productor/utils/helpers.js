import { FASES } from './constantes'

// PostgREST devuelve objeto o arreglo según la relación; esto lo normaliza
export const unwrap = (relacion) => (Array.isArray(relacion) ? relacion[0] ?? null : relacion ?? null)

export const formatCordobas = (monto) =>
  `C$ ${Number(monto || 0).toLocaleString('es-NI', { maximumFractionDigits: 2 })}`

export const formatFecha = (valor) => {
  if (!valor) return '—'
  const fecha = new Date(valor.length === 10 ? `${valor}T00:00:00` : valor)
  return fecha.toLocaleDateString('es-NI', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Fecha local en formato YYYY-MM-DD (evita el desfase de toISOString con UTC)
export const hoy = () => new Date().toLocaleDateString('en-CA')

export const unidadCorta = (unidad) => (unidad === 'libras' ? 'lb' : 'u')

export const diasHasta = (fecha) =>
  Math.ceil((new Date(`${fecha}T00:00:00`) - new Date()) / 86400000)

export const remateVigente = (remate) =>
  Boolean(remate?.esta_activa && new Date(remate.fecha_fin) > new Date())

// ---- Cronograma / semáforo ----
// Índice de la última fase completada (-1 si todas están inactivas)
export const getFaseActivaIndex = (estado) => {
  let idx = -1
  FASES.forEach((fase, i) => {
    if (estado?.[fase.key]) idx = i
  })
  return idx
}

// Índice de la primera fase pendiente (-1 si todas están completadas)
export const getSiguienteFaseIndex = (estado) => FASES.findIndex((fase) => !estado?.[fase.key])

const BADGES_FASE = [
  'bg-gray-100 text-gray-600',
  'bg-teal-100 text-teal-800',
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-800',
  'bg-amber-100 text-amber-700',
  'bg-purple-100 text-purple-700',
]

export const getFaseBadge = (estado) => {
  const idx = getFaseActivaIndex(estado)
  if (idx < 0) return { label: 'Inactiva', clase: 'bg-gray-100 text-gray-600' }
  return { label: FASES[idx].label, clase: BADGES_FASE[idx] }
}

// ---- Consulta fitosanitaria (RF-04) ----
// Semilla → Floración usan el consejo de crecimiento; Maduración → Listo para cosecha el de maduración
export const getEtapaConsejo = (faseIdx) => (faseIdx <= 3 ? 'crecimiento' : 'maduración')

export const getConsejoPorFase = (informacion, faseIdx) => {
  if (faseIdx < 0) return null
  return faseIdx <= 3 ? informacion.consejo_fase_crecimiento : informacion.consejo_fase_maduracion
}