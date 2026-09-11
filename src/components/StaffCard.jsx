import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

const INITIALS_COLORS = [
  'bg-brand', 'bg-[#2F6FB0]', 'bg-[#3F9E6A]', 'bg-[#7C6BC4]',
  'bg-[#C0562F]', 'bg-[#B08A2E]', 'bg-[#2E8C97]', 'bg-[#B04A7A]',
]

function getColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return INITIALS_COLORS[Math.abs(hash) % INITIALS_COLORS.length]
}

function initials(name) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

export default function StaffCard({ person, isDragOverlay, isDraggable = true, search = '' }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: person.name,
    data: { person },
  })

  const style = transform && isDraggable ? { transform: CSS.Translate.toString(transform) } : undefined

  const q = search.trim().toLowerCase()
  const matches = !q || person.name.toLowerCase().includes(q) || (person.role || '').toLowerCase().includes(q)
  const dimmed = !matches && !isDragOverlay

  return (
    <div
      ref={isDragOverlay || !isDraggable ? undefined : setNodeRef}
      style={isDragOverlay ? undefined : style}
      {...(isDragOverlay || !isDraggable ? {} : { ...listeners, ...attributes })}
      className={[
        'flex items-center gap-2.5 px-3 py-2.5 rounded-brand',
        isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default',
        'bg-surface-raised border border-surface-border select-none shadow-card',
        'transition-all duration-150',
        dimmed ? 'opacity-30 saturate-50' : '',
        isDragOverlay
          ? 'shadow-lift ring-2 ring-brand scale-105 rotate-1'
          : isDragging && isDraggable
            ? 'opacity-30 ring-1 ring-brand/50'
            : isDraggable
              ? 'hover:border-slate-300 hover:bg-slate-50'
              : '',
      ].join(' ')}
    >
      <div className={`w-7 h-7 rounded-md ${getColor(person.name)} flex items-center justify-center flex-shrink-0`}>
        <span className="text-white text-[10px] font-bold font-display">{initials(person.name)}</span>
      </div>
      <div className="min-w-0">
        <p className="text-slate-900 text-sm font-medium leading-tight truncate">{person.name}</p>
        <p className="text-slate-500 text-[11px] leading-tight truncate">{person.role}</p>
      </div>
    </div>
  )
}
