"use client"

export function MandalaPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.15">
        {/* Outer circles */}
        <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="160" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="80" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="200" cy="200" r="60" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="40" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="200" cy="200" r="20" stroke="currentColor" strokeWidth="1" />
        
        {/* Radial lines */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 22.5 * Math.PI) / 180;
          const x2 = 200 + 180 * Math.cos(angle);
          const y2 = 200 + 180 * Math.sin(angle);
          return (
            <line
              key={i}
              x1="200"
              y1="200"
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="0.5"
            />
          );
        })}
        
        {/* Petal shapes */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = i * 45;
          return (
            <g key={`petal-${i}`} transform={`rotate(${angle} 200 200)`}>
              <path
                d="M200 80 Q240 140 200 200 Q160 140 200 80"
                stroke="currentColor"
                strokeWidth="0.75"
                fill="none"
              />
            </g>
          );
        })}
        
        {/* Inner decorative circles */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const cx = 200 + 100 * Math.cos(angle);
          const cy = 200 + 100 * Math.sin(angle);
          return (
            <circle
              key={`inner-${i}`}
              cx={cx}
              cy={cy}
              r="12"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          );
        })}
        
        {/* Outer decorative elements */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = ((i * 22.5 + 11.25) * Math.PI) / 180;
          const cx = 200 + 150 * Math.cos(angle);
          const cy = 200 + 150 * Math.sin(angle);
          return (
            <circle
              key={`outer-${i}`}
              cx={cx}
              cy={cy}
              r="6"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          );
        })}
      </g>
    </svg>
  );
}
