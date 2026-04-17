export default function LoadingSkeleton() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex gap-5 p-6 overflow-x-auto">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex-shrink-0 w-64 flex flex-col gap-2">
            <div className="shimmer h-24 rounded-t-2xl" />
            <div className="shimmer h-40 rounded-b-2xl" />
          </div>
        ))}
      </div>
      <div className="border-t border-surface-border p-6">
        <div className="shimmer h-8 w-48 rounded-lg mb-3" />
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="shimmer h-12 w-40 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
