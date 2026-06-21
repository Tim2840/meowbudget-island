"use client";

import { Icon } from "@iconify/react";

interface GameIconProps {
  icon: string;
  size?: number;
  color?: string;
  className?: string;
}

export default function GameIcon({ icon, size = 24, color, className }: GameIconProps) {
  return (
    <Icon icon={icon} width={size} height={size} color={color} className={className} />
  );
}
