import { useAllocationData } from './hooks/useAllocationData'
import Header from './components/Header'
import Board from './components/Board'
import LoadingSkeleton from './components/LoadingSkeleton'
import DemoNotice from './components/DemoNotice'

export default function App() {
  const { staff, jobs, allocations, loading, saveState, handleMove, reload } = useAllocationData()

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
        />
      )}
    </div>
  )
}
