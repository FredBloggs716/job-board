import { useState } from 'react'
import { useAllocationData } from './hooks/useAllocationData'
import { useAuth } from './hooks/useAuth'
import Header from './components/Header'
import Board from './components/Board'
import LoadingSkeleton from './components/LoadingSkeleton'
import DemoNotice from './components/DemoNotice'
import LoginModal from './components/LoginModal'

export default function App() {
  const { staff, jobs, allocations, loading, saveState, handleMove, reload } = useAllocationData()
  const { isAdmin, login, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

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
      />
      <DemoNotice />
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <Board
          staff={staff}
          jobs={jobs}
          allocations={allocations}
          onMove={handleMove}
          isAdmin={isAdmin}
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
