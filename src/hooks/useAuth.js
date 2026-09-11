import { useState, useCallback } from 'react'
import { APPS_SCRIPT_URL, USE_DEMO_DATA } from '../config/api'

const PW_KEY = 'lgh_admin_pw'

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(() => !!sessionStorage.getItem(PW_KEY))

  // Verifies the password against the Apps Script backend (server-side check).
  // The password is never stored in source — only held in this browser session
  // after a successful login, and sent with each write request.
  const login = useCallback(async (password) => {
    if (!password) return false

    if (USE_DEMO_DATA) {
      sessionStorage.setItem(PW_KEY, password)
      setIsAdmin(true)
      return true
    }

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'login', password }),
      })
      const data = await res.json()
      if (data && data.ok) {
        sessionStorage.setItem(PW_KEY, password)
        setIsAdmin(true)
        return true
      }
    } catch {
      // fall through to failure
    }
    return false
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(PW_KEY)
    setIsAdmin(false)
  }, [])

  return { isAdmin, login, logout }
}
