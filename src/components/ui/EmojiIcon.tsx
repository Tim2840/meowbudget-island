"use client";

import { useState } from "react";

interface EmojiIconProps {
  emoji: string;
  size?: number;
  className?: string;
}

function toTwemojiUrl(emoji: string): string {
  const cps = [...emoji]
    .map(c => c.codePointAt(0))
    .filter((cp): cp is number => cp !== undefined && cp !== 0xFE0F)
    .map(cp => cp.toString(16));
  return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/${cps.join("-")}.svg`;
}

export function EmojiIcon({ emoji, size = 20, className }: EmojiIconProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span style={{ fontSize: size, lineHeight: 1 }} className={className}>
        {emoji}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={toTwemojiUrl(emoji)}
      alt={emoji}
      width={size}
      height={size}
      draggable={false}
      onError={() => setFailed(true)}
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
      className={className}
    />
  );
}
