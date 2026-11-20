// src/features/tienda/utils/whatsapp.js

export const generarEnlaceWhatsApp = (telefono, mensaje) => {
  if (!telefono) return null

  // Eliminar espacios, guiones, paréntesis y cualquier otro carácter
  const numeroLimpio = String(telefono).replace(/\D/g, '')

  let numero = numeroLimpio

  // Si el número tiene 8 dígitos, asumimos que es de Nicaragua
  // y agregamos el código de país 505.
  if (numero.length === 8) {
    numero = `505${numero}`
  }

  // Si tiene el prefijo internacional 00, quitarlo.
  if (numero.startsWith('00')) {
    numero = numero.slice(2)
  }

  // Validación básica del número
  if (numero.length < 8) {
    return null
  }

  const texto = encodeURIComponent(mensaje)

  return `https://wa.me/${numero}?text=${texto}`
}