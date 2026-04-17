import { useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core'
import Column from './Column'
import UnassignedPool from './UnassignedPool'
import StaffCard from './StaffCard'

export default function Board({ staff, jobs, allocations, onMove }) {
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  )

  function getStaffForBucket(bucketId) {
    return staff.filter(p => (allocations[p.name] ?? 'unassigned') === bucketId)
  }

  const activePerson = activeId ? staff.find(p => p.name === activeId) : null

  const jobColumns = jobs.map(job => ({
    id: job.ref,
    label: job.ref,
    accentColor: 'brand',
    job,
    staffList: getStaffForBucket(job.ref),
  }))

  const specialColumns = [
    { id: 'leave', label: 'On Leave', accentColor: 'leave', job: null, staffList: getStaffForBucket('leave') },
    { id: 'other', label: 'Other', accentColor: 'other', job: null, staffList: getStaffForBucket('other') },
  ]

  const allColumns = [...jobColumns, ...specialColumns]
  const unassigned = getStaffForBucket('unassigned')

  function handleDragStart({ active }) {
    setActiveId(active.id)
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null)
    if (!over || active.id === over.id) return
    const targetBucket = over.id
    const validBuckets = [...jobs.map(j => j.ref), 'leave', 'other', 'unassigned']
    if (validBuckets.includes(targetBucket)) {
      onMove(active.id, targetBucket)
    }
  }

  const assignedCount = staff.filter(p => {
    const b = allocations[p.name] ?? 'unassigned'
    return b !== 'unassigned'
  }).length

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Kanban scroll area */}
        <div className="flex-1 flex gap-5 p-6 overflow-x-auto scrollbar-hide min-h-0 pb-4">
          {allColumns.map(col => (
            <Column
              key={col.id}
              id={col.id}
              label={col.label}
              accentColor={col.accentColor}
              job={col.job}
              staffList={col.staffList}
            />
          ))}
        </div>

        {/* Unassigned pool */}
        <UnassignedPool staffList={unassigned} />
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'ease-out' }}>
        {activePerson ? <StaffCard person={activePerson} isDragOverlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}
