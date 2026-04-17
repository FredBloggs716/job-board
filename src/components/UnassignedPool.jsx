import { useDroppable } from '@dnd-kit/core'
import StaffCard from './StaffCard'

export default function UnassignedPool({ staffList }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'unassigned' })

  return (
    <div className="flex-shrink-0 border-t border-surface-border bg-surface-deep">
      <div className="px-6 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-pool" />
          <span className="text-xs font-bold tracking-wider uppercase text-pool">Unassigned Pool</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pool/10 border border-pool/30 text-pool">
            {staffList.length}
          </span>
        </div>
        <p className="text-slate-600 text-xs">Drag people up to allocate them</p>
      </div>
      <div
        ref={setNodeRef}
        className={[
          'px-6 pb-4 flex flex-wrap gap-2 min-h-14 transition-colors duration-150',
          isOver ? 'bg-pool/5' : '',
        ].join(' ')}
      >
        {staffList.map(person => (
          <StaffCard key={person.name} person={person} />
        ))}
        {staffList.length === 0 && (
          <div className="flex items-center justify-center w-full h-10">
            <span className="text-slate-600 text-xs">All staff allocated</span>
          </div>
        )}
      </div>
    </div>
  )
}
