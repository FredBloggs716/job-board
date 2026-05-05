import { useState, useCallback } from 'react'
import { ADMIN_PASSWORD } from '../config/api'

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('lgh_admin') === '1')

  const login = useCallback((password) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('lgh_admin', '1')
      setIsAdmin(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('lgh_admin')
    setIsAdmin(false)
  }, [])

  return { isAdmin, login, logout }
}
