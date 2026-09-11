import { useState } from 'react'
import { useAllocationData } from './hooks/useAllocationData'
import { useAuth } from './hooks/useAuth'
import Header from './components/Header'
import Board from './components/Board'
import LoadingSkeleton from './components/LoadingSkeleton'
import DemoNotice from './components/DemoNotice'
import LoginModal from './components/LoginModal'

export default function App() {
  const { staff, jobs, allocations, loading, loadError, saveState, handleMove, reload } = useAllocationData()
  const { isAdmin, login, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [search, setSearch] = useState('')

  const assignedCount = staff.filter(p => {
    const b = allocations[p.name] ?? 'unassigned'
    return b !== 'unassigned'
  }).length

  return (
    <div className="h-screen flex flex-col bg-surface-deep overflow-hidden">
      <Header
        saveState={saveState}
        onReload={reload}
        totalStaff={staff.length}
        assignedCount={assignedCount}
        isAdmin={isAdmin}
        onLoginClick={() => setShowLogin(true)}
        onLogout={logout}
        search={search}
        onSearch={setSearch}
      />
      <DemoNotice />
      {loadError && !loading && (
        <div className="mx-6 mt-4 rounded-brand border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-4">
          <span>
            <strong className="font-semibold text-red-800">Can’t load the live data.</strong>{' '}
            {loadError}
          </span>
          <button
            onClick={reload}
            className="shrink-0 rounded-md bg-red-100 px-3 py-1.5 font-medium text-red-800 hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <Board
          staff={staff}
          jobs={jobs}
          allocations={allocations}
          onMove={handleMove}
          isAdmin={isAdmin}
          search={search}
        />
      )}
      {showLogin && (
        <LoginModal
          onLogin={login}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  )
}
