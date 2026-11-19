export const FASES = [
  { key: 'fase_semilla', label: 'Semilla' },
  { key: 'fase_germinacion', label: 'Germinación' },
  { key: 'fase_crecimiento', label: 'Crecimiento' },
  { key: 'fase_floracion', label: 'Floración' },
  { key: 'fase_maduracion', label: 'Maduración' },
  { key: 'fase_lista_cosecha', label: 'Listo para cosecha' },
]

// siembras.tipo_suelo es texto libre en la BD
export const TIPOS_SUELO = [
  { value: 'Franco', descripcion: 'Equilibrado y rico en nutrientes' },
  { value: 'Arcilloso', descripcion: 'Retención alta de agua' },
  { value: 'Arenoso', descripcion: 'Gran drenaje y poroso' },
  { value: 'Limoso', descripcion: 'Fértil, óptimo para hortalizas' },
]

// enum measurement_unit
export const UNIDADES = [
  { value: 'libras', label: 'Libras (lb)' },
  { value: 'unidades', label: 'Unidades (u)' },
]

export const CALIDADES = ['Pequeña', 'Mediana', 'Grande', 'Extra']

export const MOTIVO_REMATE_DEFAULT = 'Cercanía a fecha de caducidad'