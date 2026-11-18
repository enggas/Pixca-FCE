export const formatCordobas = (monto) =>
  `C$ ${Number(monto).toLocaleString('es-NI', { maximumFractionDigits: 2 })}`

export const formatFecha = (iso) =>
  new Date(iso).toLocaleDateString('es-NI', { day: 'numeric', month: 'short', year: 'numeric' })

export const formatFechaHora = (iso) =>
  new Date(iso).toLocaleString('es-NI', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })