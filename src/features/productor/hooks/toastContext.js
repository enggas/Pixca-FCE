import { createContext, useContext } from 'react'

export const ToastContext = createContext(() => {})

// Uso: const toast = useToast(); toast('Mensaje', 'success' | 'error' | 'info')
export const useToast = () => useContext(ToastContext)