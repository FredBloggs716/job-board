import { useDroppable } from '@dnd-kit/core'
import StaffCard from './StaffCard'

// White pills with coloured text — read cleanly on the solid crimson header.
const TYPE_COLORS = {
  groundworks: 'bg-white text-[#9c3f1e]',
  drainage: 'bg-white text-[#1f5488]',
  civils: 'bg-white text-[#2c7a4f]',
  maintenance: 'bg-white text-[#856618]',
  default: 'bg-white text-slate-600',
}

function typeChipClass(type) {
  const key = type?.toLowerCase() || ''
  return TYPE_COLORS[key] || TYPE_COLORS.default
}

export default function Column({ id, label, accentColor, job, staffList, isAdmin, search }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  // Solid header fill per column type.
  const headerBg = {
    brand: 'bg-brand',
    leave: 'bg-leave',
    other: 'bg-other',
  }[accentColor] || 'bg-slate-500'

  // White text sits on top of every solid header.
  const headerText = 'text-white'
  const badgeBg = 'bg-white/20 border-white/30'

  // Accent used on the light body (drop hints).
  const accentText = {
    brand: 'text-brand',
    leave: 'text-[#8a5e12]',
    other: 'text-[#5b6570]',
  }[accentColor] || 'text-slate-400'

  const accentBorder = {
    brand: 'border-brand/40',
    leave: 'border-leave/50',
    other: 'border-other/50',
  }[accentColor] || 'border-surface-border'

  return (
    <div className="flex flex-col flex-shrink-0 w-64 max-h-full">
      {/* Column header */}
      <div className={`rounded-t-brand ${headerBg} px-4 py-3 shadow-card`}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`eyebrow text-[11px] font-bold ${headerText}`}>{job ? job.ref : label}</span>
          </div>
          <span className={`flex-shrink-0 eyebrow text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badgeBg} ${headerText}`}>
            {staffList.length}
          </span>
        </div>
        {job && (
          <>
            <h3 className="text-white font-display font-semibold text-sm leading-tight">{job.site}</h3>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {job.type && (
                <span className={`eyebrow text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeChipClass(job.type)}`}>
                  {job.type}
                </span>
              )}
              {job.foreman && (
                <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/20 border border-white/25 text-white">
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a4 4 0 100 8 4 4 0 000-8zM4 21a8 8 0 0116 0" />
                  </svg>
                  {job.foreman}
                </span>
              )}
            </div>
          </>
        )}
        {!job && label && (
          <p className={`text-xs mt-0.5 ${headerText} opacity-80`}>
            {label === 'On Leave' ? 'Staff currently on leave' : 'Other / not on site'}
          </p>
        )}
      </div>

      {/* Droppable zone */}
      <div
        ref={setNodeRef}
        className={[
          'flex-1 min-h-24 rounded-b-brand border border-t-0 border-surface-border p-3 flex flex-col gap-2 transition-colors duration-150 overflow-y-auto scrollbar-hide',
          isOver ? 'bg-surface-raised' : 'bg-surface/60',
        ].join(' ')}
      >
        {staffList.map(person => (
          <StaffCard key={person.name} person={person} isDraggable={isAdmin} search={search} />
        ))}
        {isOver && staffList.length === 0 && (
          <div className={`rounded-brand border-2 border-dashed ${accentBorder} h-16 flex items-center justify-center`}>
            <span className={`eyebrow text-[10px] ${accentText}`}>Drop here</span>
          </div>
        )}
        {!isOver && staffList.length === 0 && (
          <div className="rounded-brand border border-dashed border-surface-border h-16 flex items-center justify-center">
            <span className="eyebrow text-[10px] text-slate-400">Empty</span>
          </div>
        )}
      </div>
    </div>
  )
}
