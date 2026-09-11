import { useDroppable } from '@dnd-kit/core'
import StaffCard from './StaffCard'

const TYPE_COLORS = {
  groundworks: 'bg-[#C0562F]/15 text-[#9c3f1e]',
  drainage: 'bg-[#2F6FB0]/15 text-[#1f5488]',
  civils: 'bg-[#3F9E6A]/15 text-[#2c7a4f]',
  maintenance: 'bg-[#B08A2E]/15 text-[#856618]',
  default: 'bg-slate-500/15 text-slate-600',
}

function typeChipClass(type) {
  const key = type?.toLowerCase() || ''
  return TYPE_COLORS[key] || TYPE_COLORS.default
}

export default function Column({ id, label, accentColor, job, staffList, isAdmin, search }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  const borderColor = {
    brand: 'border-brand/50',
    leave: 'border-leave/50',
    other: 'border-other/50',
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
      <div className={`rounded-t-brand border ${borderColor} ${headerBg} px-4 py-3`}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
            <span className={`eyebrow text-[11px] font-semibold ${accentText}`}>{job ? job.ref : label}</span>
          </div>
          <span className={`flex-shrink-0 eyebrow text-[11px] font-semibold px-2 py-0.5 rounded-full ${headerBg} border ${borderColor} ${accentText}`}>
            {staffList.length}
          </span>
        </div>
        {job && (
          <>
            <h3 className="text-slate-900 font-display font-semibold text-sm leading-tight">{job.site}</h3>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {job.type && (
                <span className={`eyebrow text-[10px] font-medium px-2 py-0.5 rounded-full ${typeChipClass(job.type)}`}>
                  {job.type}
                </span>
              )}
              {job.foreman && (
                <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
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
          <p className="text-slate-400 text-xs mt-0.5">
            {label === 'On Leave' ? 'Staff currently on leave' : 'Other / not on site'}
          </p>
        )}
      </div>

      {/* Droppable zone */}
      <div
        ref={setNodeRef}
        className={[
          'flex-1 min-h-24 rounded-b-brand border-x border-b p-3 flex flex-col gap-2 transition-colors duration-150 overflow-y-auto scrollbar-hide',
          borderColor,
          isOver ? 'bg-surface-raised/80' : 'bg-surface/50',
        ].join(' ')}
      >
        {staffList.map(person => (
          <StaffCard key={person.name} person={person} isDraggable={isAdmin} search={search} />
        ))}
        {isOver && staffList.length === 0 && (
          <div className={`rounded-brand border-2 border-dashed ${borderColor} h-16 flex items-center justify-center`}>
            <span className={`eyebrow text-[10px] ${accentText}`}>Drop here</span>
          </div>
        )}
        {!isOver && staffList.length === 0 && (
          <div className="rounded-brand border border-dashed border-surface-border h-16 flex items-center justify-center">
            <span className="eyebrow text-[10px] text-slate-600">Empty</span>
          </div>
        )}
      </div>
    </div>
  )
}
