import { useDroppable } from '@dnd-kit/core'
import StaffCard from './StaffCard'

const TYPE_COLORS = {
  groundworks: 'bg-orange-500/20 text-orange-300',
  drainage: 'bg-blue-500/20 text-blue-300',
  civils: 'bg-emerald-500/20 text-emerald-300',
  maintenance: 'bg-amber-500/20 text-amber-300',
  default: 'bg-slate-500/20 text-slate-300',
}

function typeChipClass(type) {
  const key = type?.toLowerCase() || ''
  return TYPE_COLORS[key] || TYPE_COLORS.default
}

export default function Column({ id, label, accentColor, job, staffList, isAdmin }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  const borderColor = {
    brand: 'border-brand/60',
    leave: 'border-leave/60',
    other: 'border-other/60',
  }[accentColor] || 'border-surface-border'

  const headerBg = {
    brand: 'bg-brand/10',
    leave: 'bg-leave/10',
    other: 'bg-other/10',
  }[accentColor] || 'bg-surface-raised'

  const accentText = {
    brand: 'text-brand',
    leave: 'text-leave',
    other: 'text-other',
  }[accentColor] || 'text-slate-400'

  const dotColor = {
    brand: 'bg-brand',
    leave: 'bg-leave',
    other: 'bg-other',
  }[accentColor] || 'bg-slate-500'

  return (
    <div className="flex flex-col flex-shrink-0 w-64 max-h-full">
      {/* Column header */}
      <div className={`rounded-t-2xl border ${borderColor} ${headerBg} px-4 py-3`}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
            {job ? (
              <span className={`text-xs font-bold tracking-wider uppercase ${accentText}`}>{job.ref}</span>
            ) : (
              <span className={`text-xs font-bold tracking-wider uppercase ${accentText}`}>{label}</span>
            )}
          </div>
          <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${headerBg} border ${borderColor} ${accentText}`}>
            {staffList.length}
          </span>
        </div>
        {job && (
          <>
            <h3 className="text-white font-semibold text-sm leading-tight">{job.site}</h3>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {job.type && (
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeChipClass(job.type)}`}>
                  {job.type}
                </span>
              )}
              {job.foreman && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300">
                  👷 {job.foreman}
                </span>
              )}
            </div>
          </>
        )}
        {!job && label && (
          <p className="text-slate-400 text-xs mt-0.5">
            {label === 'On Leave' ? 'Staff currently on leave' : 'Other / not on site'}
          </p>
        )}
      </div>

      {/* Droppable zone */}
      <div
        ref={setNodeRef}
        className={[
          'flex-1 min-h-24 rounded-b-2xl border-x border-b p-3 flex flex-col gap-2 transition-colors duration-150 overflow-y-auto scrollbar-hide',
          borderColor,
          isOver ? 'bg-surface-raised/80' : 'bg-surface/50',
        ].join(' ')}
      >
        {staffList.map(person => (
          <StaffCard key={person.name} person={person} isDraggable={isAdmin} />
        ))}
        {isOver && staffList.length === 0 && (
          <div className={`rounded-xl border-2 border-dashed ${borderColor} h-16 flex items-center justify-center`}>
            <span className={`text-xs ${accentText}`}>Drop here</span>
          </div>
        )}
        {!isOver && staffList.length === 0 && (
          <div className="rounded-xl border border-dashed border-surface-border h-16 flex items-center justify-center">
            <span className="text-xs text-slate-600">Empty</span>
          </div>
        )}
      </div>
    </div>
  )
}
