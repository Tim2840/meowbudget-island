"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LottiePlayerProps {
  animationData?: object;
  src?: string;
  loop?: boolean;
  autoplay?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onComplete?: () => void;
}

export default function LottiePlayer({
  animationData,
  src,
  loop = false,
  autoplay = true,
  style,
  className,
  onComplete,
}: LottiePlayerProps) {
  const [data, setData] = useState<object | null>(animationData ?? null);

  useEffect(() => {
    if (src && !animationData) {
      fetch(src)
        .then((r) => r.json())
        .then(setData)
        .catch(() => null);
    }
  }, [src, animationData]);

  if (!data) return null;

  return (
    <Lottie
      animationData={data}
      loop={loop}
      autoplay={autoplay}
      style={style}
      className={className}
      onComplete={onComplete}
    />
  );
}
