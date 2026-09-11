import { useState } from 'react'

export default function LoginModal({ onLogin, onClose }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError(false)
    const ok = await onLogin(password)
    setBusy(false)
    if (ok) {
      onClose()
    } else {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface-raised border border-surface-border rounded-brand p-6 w-full max-w-sm mx-4 shadow-lift"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-brand bg-brand/15 border border-brand/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-slate-900 font-display font-bold text-base leading-tight uppercase tracking-tight">Admin Login</h2>
            <p className="text-slate-500 text-xs">Enter your password to enable editing</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false) }}
            placeholder="Password"
            autoFocus
            disabled={busy}
            className="w-full bg-surface-deep border border-surface-border rounded-brand px-4 py-2.5 text-slate-900 text-sm placeholder-slate-500 focus:outline-none focus:border-brand transition-colors disabled:opacity-60"
          />
          {error && (
            <p className="text-red-400 text-xs flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Incorrect password
            </p>
          )}
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-brand border border-surface-border text-slate-500 text-sm hover:text-slate-900 hover:bg-black/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex-1 py-2.5 rounded-brand bg-brand text-white text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-60"
            >
              {busy ? 'Checking…' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
