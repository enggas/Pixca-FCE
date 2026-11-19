import { useCallback, useEffect, useMemo, useState } from 'react'
import { CarritoContext } from './CarritoContextValue'

const STORAGE_KEY = 'pixca-carrito'

const leerCarrito = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

export const CarritoProvider = ({ children }) => {
  const [items, setItems] = useState(leerCarrito)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // almacenamiento no disponible: el carrito sigue funcionando en memoria
    }
  }, [items])

  const agregar = useCallback((producto, cantidad) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.loteId === producto.id)
      const nuevaCantidad = Math.min((existente?.cantidad || 0) + cantidad, producto.stock)
      const item = {
        loteId: producto.id,
        nombre: producto.nombre,
        calidad: producto.calidad,
        productorNombre: producto.productorNombre,
        unidad: producto.unidad,
        precioUnitario: producto.precioUnitario,
        stock: producto.stock,
        cantidad: nuevaCantidad,
      }
      return existente ? prev.map((i) => (i.loteId === producto.id ? item : i)) : [...prev, item]
    })
  }, [])

  const actualizar = useCallback((loteId, cantidad) => {
    setItems((prev) =>
      prev.map((i) =>
        i.loteId === loteId ? { ...i, cantidad: Math.min(Math.max(Number(cantidad) || 1, 1), i.stock) } : i,
      ),
    )
  }, [])

  const quitar = useCallback((loteId) => {
    setItems((prev) => prev.filter((i) => i.loteId !== loteId))
  }, [])

  const vaciar = useCallback(() => setItems([]), [])

  const total = useMemo(() => items.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0), [items])

  const value = useMemo(
    () => ({ items, total, cantidadItems: items.length, agregar, actualizar, quitar, vaciar }),
    [items, total, agregar, actualizar, quitar, vaciar],
  )

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>
}