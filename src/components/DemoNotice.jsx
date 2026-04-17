import { USE_DEMO_DATA, APPS_SCRIPT_URL } from '../config/api'

export default function DemoNotice() {
  if (!USE_DEMO_DATA && APPS_SCRIPT_URL !== 'YOUR_APPS_SCRIPT_URL_HERE') return null
  return (
    <div className="mx-6 mt-4 px-4 py-3 rounded-xl bg-brand/10 border border-brand/30 flex items-start gap-3">
      <svg className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <p className="text-brand text-sm font-semibold">Demo mode — changes won't be saved</p>
        <p className="text-slate-400 text-xs mt-0.5">
          Set up your Google Sheet and paste the Apps Script URL in <code className="text-brand/80 font-mono">src/config/api.js</code> to go live.
        </p>
      </div>
    </div>
  )
}
