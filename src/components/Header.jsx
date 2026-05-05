export default function Header({ saveState, onReload, totalStaff, assignedCount, isAdmin, onLoginClick, onLogout }) {
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const saveLabel = { idle: null, saving: 'Saving…', saved: 'Saved ✓', error: 'Save failed' }[saveState]
  const saveColor = { idle: '', saving: 'text-slate-400', saved: 'text-pool', error: 'text-red-400' }[saveState]

  return (
    <header className="sticky top-0 z-30 bg-surface-deep/95 backdrop-blur border-b border-surface-border px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">LGH Job Board</h1>
            <p className="text-slate-500 text-xs">{today}</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-surface-border">
          <span className="text-xs text-slate-400">{assignedCount} of {totalStaff} allocated</span>
          <div className="w-24 h-1.5 bg-surface-border rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: totalStaff ? `${(assignedCount / totalStaff) * 100}%` : '0%' }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {isAdmin && saveLabel && (
          <span className={`text-xs font-medium ${saveColor} animate-fade-in`}>{saveLabel}</span>
        )}
        <button
          onClick={onReload}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-raised transition-colors"
          title="Refresh data"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {isAdmin ? (
          <div className="flex items-center gap-2 pl-3 border-l border-surface-border">
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-brand/20 text-brand border border-brand/30">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Admin
            </span>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-raised transition-colors"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-1.5 pl-3 border-l border-surface-border text-slate-500 hover:text-slate-300 transition-colors text-xs"
            title="Admin login"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="hidden sm:inline">Login</span>
          </button>
        )}
      </div>
    </header>
  )
}
