import { useState, useEffect, useCallback, useRef } from 'react'
import { APPS_SCRIPT_URL, USE_DEMO_DATA } from '../config/api'

// The Apps Script web app cold-starts slowly (often 10-15s) and occasionally
// throws a transient 404/5xx on the first hit before it warms up. A single
// fetch therefore fails "a lot of the time". Retry a few times with backoff and
// a generous per-attempt timeout so one cold start recovers instead of showing
// "can't load data". Returns the ok Response, or throws after exhausting tries.
async function fetchWithRetry(url, options = {}, { attempts = 4, timeoutMs = 30000, backoffMs = 1000 } = {}) {
  let lastError
  for (let i = 0; i < attempts; i++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(url, { ...options, signal: controller.signal })
      clearTimeout(timer)
      if (res.ok) return res
      lastError = new Error(`the data feed returned ${res.status}`)
    } catch (err) {
      clearTimeout(timer)
      lastError = err?.name === 'AbortError' ? new Error('the data feed timed out') : err
    }
    if (i < attempts - 1) await new Promise(r => setTimeout(r, backoffMs * (i + 1)))
  }
  throw lastError
}

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
  const [loadError, setLoadError] = useState(null) // null | string
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved | error
  const saveTimerRef = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      if (USE_DEMO_DATA || APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
        await new Promise(r => setTimeout(r, 600))
        const allocMap = {}
        DEMO_DATA.allocations.forEach(a => { allocMap[a.name] = a.bucket })
        setStaff(DEMO_DATA.staff)
        setJobs(DEMO_DATA.jobs.filter(j => j.active?.toLowerCase() === 'yes'))
        setAllocations(allocMap)
      } else {
        let res
        try {
          res = await fetchWithRetry(APPS_SCRIPT_URL)
        } catch (err) {
          throw new Error(`Couldn't reach the data feed after several tries (${err.message}). The Google Apps Script web app may be slow to wake or need re-deploying — press Reload to try again.`)
        }
        let data
        try {
          data = await res.json()
        } catch {
          throw new Error('The data feed did not return valid data (got an HTML error page instead of JSON). The Google Apps Script web app likely needs re-deploying.')
        }
        const allocMap = {}
        ;(data.allocations || []).forEach(a => { allocMap[a.name] = a.bucket })
        setStaff(data.staff || [])
        setJobs((data.jobs || []).filter(j => j.active?.toLowerCase() === 'yes'))
        setAllocations(allocMap)
      }
    } catch (err) {
      setLoadError(err.message || 'Could not load data from the Google Sheet.')
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
        const password = sessionStorage.getItem('lgh_admin_pw') || ''
        await fetchWithRetry(APPS_SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify({ allocations: body, password }),
        }, { attempts: 3 })
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

  return { staff, jobs, allocations, loading, loadError, saveState, handleMove, reload: load }
}
