import React from "react";

interface WaveProps {
  className?: string;
  fill?: string;
  style?: React.CSSProperties;
}

export default function Wave({ className, fill = "#1f2937", style }: WaveProps) {
  return (
    <svg
      className={`w-full h-40 ${className}`}
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      style={style}
    >
      <path
        fill={fill}
        d="M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,208C672,203,768,213,864,202.7C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      ></path>
    </svg>
  );
}
