export default function Header({ saveState, onReload, totalStaff, assignedCount, isAdmin, onLoginClick, onLogout, search, onSearch }) {
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const saveLabel = { idle: null, saving: 'Saving…', saved: 'Saved ✓', error: 'Save failed' }[saveState]
  const saveColor = { idle: '', saving: 'text-slate-400', saved: 'text-pool', error: 'text-red-400' }[saveState]

  const pct = totalStaff ? Math.round((assignedCount / totalStaff) * 100) : 0

  return (
    <header className="sticky top-0 z-30 bg-surface-deep/95 backdrop-blur border-b border-surface-border px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-brand bg-brand flex items-center justify-center flex-shrink-0 shadow-card p-1.5">
            <img
              src={`${import.meta.env.BASE_URL}logo-mark-white.png`}
              alt="LG Howson"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-white font-display font-extrabold text-lg leading-none tracking-tight uppercase">LGH Job Board</h1>
            <p className="text-slate-500 text-[11px] mt-1">{today}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2.5 pl-4 border-l border-surface-border">
          <span className="eyebrow text-[10px] text-slate-400">{assignedCount}/{totalStaff} allocated</span>
          <div className="w-24 h-1.5 bg-surface-border rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 order-3 md:order-2 w-full md:w-auto">
        {/* Staff search */}
        <div className="relative flex-1 md:flex-none md:w-56">
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Find a person…"
            className="w-full bg-surface-raised border border-surface-border rounded-brand pl-9 pr-8 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-brand transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-500 hover:text-white"
              title="Clear"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 order-2 md:order-3">
        {isAdmin && saveLabel && (
          <span className={`eyebrow text-[10px] font-medium ${saveColor} animate-fade-in`}>{saveLabel}</span>
        )}
        <button
          onClick={onReload}
          className="p-2 rounded-brand text-slate-400 hover:text-white hover:bg-surface-raised transition-colors"
          title="Refresh data"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {isAdmin ? (
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-surface-border">
            <span className="hidden sm:flex items-center gap-1.5 eyebrow text-[10px] font-medium px-2.5 py-1 rounded-full bg-brand/15 text-brand border border-brand/30">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Admin
            </span>
            <button
              onClick={onLogout}
              className="p-2 rounded-brand text-slate-400 hover:text-white hover:bg-surface-raised transition-colors"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-1.5 pl-2 sm:pl-3 border-l border-surface-border text-slate-500 hover:text-slate-200 transition-colors eyebrow text-[10px]"
            title="Admin login"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="hidden sm:inline">Login</span>
          </button>
        )}
      </div>
    </header>
  )
}
