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

// Last successful server response, kept in localStorage so the board can paint
// instantly on the next visit (stale-while-revalidate) and survive a slow or
// failed refresh instead of showing a blank "can't load data" screen.
const CACHE_KEY = 'lgh_board_cache'
function readBoardCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
function writeBoardCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // storage full / disabled — caching is best-effort, ignore.
  }
}

export function useAllocationData() {
  const [staff, setStaff] = useState([])
  const [jobs, setJobs] = useState([])
  const [allocations, setAllocations] = useState({}) // { staffName: bucketId }
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null) // null | string
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved | error
  const saveTimerRef = useRef(null)

  // Push a server-shaped payload ({ staff, jobs, allocations:[...] }) into state.
  const applyData = useCallback((data) => {
    const allocMap = {}
    ;(data.allocations || []).forEach(a => { allocMap[a.name] = a.bucket })
    setStaff(data.staff || [])
    setJobs((data.jobs || []).filter(j => j.active?.toLowerCase() === 'yes'))
    setAllocations(allocMap)
  }, [])

  const load = useCallback(async () => {
    setLoadError(null)

    if (USE_DEMO_DATA || APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
      setLoading(true)
      await new Promise(r => setTimeout(r, 600))
      applyData(DEMO_DATA)
      setLoading(false)
      return
    }

    // Stale-while-revalidate: paint the last good data instantly so a slow or
    // failing refresh never shows a blank board. Only block with the skeleton
    // when there is nothing cached to show.
    const cached = readBoardCache()
    if (cached) {
      applyData(cached)
      setLoading(false)
    } else {
      setLoading(true)
    }

    try {
      const res = await fetchWithRetry(APPS_SCRIPT_URL)
      let data
      try {
        data = await res.json()
      } catch {
        throw new Error('The data feed did not return valid data (got an HTML error page instead of JSON). The Google Apps Script web app likely needs re-deploying.')
      }
      applyData(data)
      writeBoardCache({ staff: data.staff || [], jobs: data.jobs || [], allocations: data.allocations || [] })
      setLoadError(null)
    } catch (err) {
      // If we already painted cached data, keep it on screen and stay quiet —
      // a failed background refresh shouldn't alarm the user. Only surface the
      // error when there was no cache to fall back on.
      if (!cached) {
        setLoadError(`Couldn't reach the data feed after several tries (${err.message}). The Google Apps Script web app may be slow to wake or need re-deploying — press Reload to try again.`)
        setSaveState('error')
      }
    } finally {
      setLoading(false)
    }
  }, [applyData])

  useEffect(() => { load() }, [load])

  const persistAllocations = useCallback((allocs) => {
    if (USE_DEMO_DATA || APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') return
    // Keep the local cache in step with the optimistic edit so the next visit
    // paints the just-moved state instantly, even before the server confirms.
    const cached = readBoardCache()
    if (cached) {
      cached.allocations = Object.entries(allocs).map(([name, bucket]) => ({ name, bucket }))
      writeBoardCache(cached)
    }
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
