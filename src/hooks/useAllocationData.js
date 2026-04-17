import { useState, useEffect, useCallback, useRef } from 'react'
import { APPS_SCRIPT_URL, USE_DEMO_DATA } from '../config/api'

const DEMO_DATA = {
  staff: [
    { name: 'Tom Briggs', role: 'Groundworker' },
    { name: 'James Hollis', role: 'Groundworker' },
    { name: 'Sarah Kent', role: 'Supervisor' },
    { name: 'Mike Shaw', role: 'Plant Operator' },
    { name: 'Dave Cooper', role: 'Drainage' },
    { name: 'Lisa Parr', role: 'Civils' },
    { name: 'Ryan Hall', role: 'Groundworker' },
    { name: 'Emma West', role: 'Admin' },
    { name: 'Chris Ford', role: 'Drainage' },
    { name: 'Nat Simmons', role: 'Plant Operator' },
  ],
  jobs: [
    { ref: 'JOB-001', site: 'Forest Valley Court', type: 'Groundworks', foreman: 'Sarah Kent', active: 'yes' },
    { ref: 'JOB-002', site: 'Mill Lane Industrial', type: 'Drainage', foreman: 'Dave Cooper', active: 'yes' },
    { ref: 'JOB-003', site: 'Brook Street Retail', type: 'Civils', foreman: 'Mike Shaw', active: 'yes' },
  ],
  allocations: [
    { name: 'Tom Briggs', bucket: 'JOB-001' },
    { name: 'James Hollis', bucket: 'JOB-001' },
    { name: 'Sarah Kent', bucket: 'JOB-001' },
    { name: 'Mike Shaw', bucket: 'JOB-002' },
    { name: 'Dave Cooper', bucket: 'JOB-002' },
    { name: 'Lisa Parr', bucket: 'JOB-003' },
    { name: 'Ryan Hall', bucket: 'leave' },
    { name: 'Emma West', bucket: 'other' },
    { name: 'Chris Ford', bucket: 'unassigned' },
    { name: 'Nat Simmons', bucket: 'unassigned' },
  ],
}

export function useAllocationData() {
  const [staff, setStaff] = useState([])
  const [jobs, setJobs] = useState([])
  const [allocations, setAllocations] = useState({}) // { staffName: bucketId }
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved | error
  const saveTimerRef = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      if (USE_DEMO_DATA || APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
        await new Promise(r => setTimeout(r, 600))
        const allocMap = {}
        DEMO_DATA.allocations.forEach(a => { allocMap[a.name] = a.bucket })
        setStaff(DEMO_DATA.staff)
        setJobs(DEMO_DATA.jobs.filter(j => j.active?.toLowerCase() === 'yes'))
        setAllocations(allocMap)
      } else {
        const res = await fetch(APPS_SCRIPT_URL)
        const data = await res.json()
        const allocMap = {}
        data.allocations.forEach(a => { allocMap[a.name] = a.bucket })
        setStaff(data.staff)
        setJobs(data.jobs.filter(j => j.active?.toLowerCase() === 'yes'))
        setAllocations(allocMap)
      }
    } catch {
      setSaveState('error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const persistAllocations = useCallback((allocs) => {
    if (USE_DEMO_DATA || APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') return
    clearTimeout(saveTimerRef.current)
    setSaveState('saving')
    saveTimerRef.current = setTimeout(async () => {
      try {
        const body = Object.entries(allocs).map(([name, bucket]) => ({ name, bucket }))
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify({ allocations: body }),
        })
        setSaveState('saved')
        setTimeout(() => setSaveState('idle'), 2000)
      } catch {
        setSaveState('error')
      }
    }, 300)
  }, [])

  const handleMove = useCallback((staffName, newBucket) => {
    setAllocations(prev => {
      const next = { ...prev, [staffName]: newBucket }
      persistAllocations(next)
      return next
    })
  }, [persistAllocations])

  return { staff, jobs, allocations, loading, saveState, handleMove, reload: load }
}
