export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
      >
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.75 0.1 300)" />
            <stop offset="100%" stopColor="oklch(0.7 0.18 140)" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="42" height="42" rx="12" fill="url(#g)" />
        <path
          d="M14 30c3 3 7 3 10 0l10-10"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="34" cy="20" r="3" fill="white" />
      </svg>
      <span className="text-lg font-semibold tracking-tight">vibe-resume</span>
    </div>
  )
}

