import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

const INITIALS_COLORS = [
  'bg-orange-500', 'bg-blue-500', 'bg-emerald-500', 'bg-violet-500',
  'bg-rose-500', 'bg-amber-500', 'bg-cyan-500', 'bg-pink-500',
]

function getColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return INITIALS_COLORS[Math.abs(hash) % INITIALS_COLORS.length]
}

function initials(name) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

export default function StaffCard({ person, isDragOverlay }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: person.name,
    data: { person },
  })

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      style={isDragOverlay ? undefined : style}
      {...(isDragOverlay ? {} : { ...listeners, ...attributes })}
      className={[
        'flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-grab active:cursor-grabbing',
        'bg-surface-raised border border-surface-border select-none',
        'transition-all duration-150',
        isDragOverlay
          ? 'shadow-2xl shadow-black/50 ring-2 ring-brand scale-105 rotate-1'
          : isDragging
            ? 'opacity-30 ring-1 ring-brand/50'
            : 'hover:border-slate-600 hover:bg-[#21262d]',
      ].join(' ')}
    >
      <div className={`w-7 h-7 rounded-lg ${getColor(person.name)} flex items-center justify-center flex-shrink-0`}>
        <span className="text-white text-[10px] font-bold">{initials(person.name)}</span>
      </div>
      <div className="min-w-0">
        <p className="text-white text-sm font-medium leading-tight truncate">{person.name}</p>
        <p className="text-slate-500 text-xs leading-tight truncate">{person.role}</p>
      </div>
    </div>
  )
}
