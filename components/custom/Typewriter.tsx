"use client";

import React, { useEffect, useMemo, useState } from "react";

export type TypewriterProps = {
  texts: string[];
  className?: string;
  speed?: number; // words per minute
  delayMs?: number; // delay between phrases when fully typed
};

export function Typewriter({
  texts,
  className,
  speed = 60,
  delayMs = 1000,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const effectiveSpeed = Number.isFinite(speed) && speed > 0 ? speed : 60;

  // Convert WPM (assuming 5 chars per word) to ms per character
  const typeDelayMs = useMemo(() => {
    const charsPerSecond = (effectiveSpeed * 5) / 60;
    const perChar = 1000 / Math.max(charsPerSecond, 1);
    return Math.max(10, Math.round(perChar));
  }, [effectiveSpeed]);

  useEffect(() => {
    if (!texts || texts.length === 0) return;

    const target = texts[textIndex % texts.length] ?? "";

    // Determine next step and delay
    let nextText = displayText;
    let nextDeleting = isDeleting;
    let nextIndex = textIndex;
    let delay = typeDelayMs;

    if (!isDeleting) {
      // Typing forward
      if (displayText === target) {
        // Finished typing; wait, then start deleting
        nextDeleting = true;
        delay = Math.max(0, delayMs);
      } else {
        nextText = target.slice(0, displayText.length + 1);
      }
    } else {
      // Deleting backward
      if (displayText.length === 0) {
        // Finished deleting; move to next phrase
        nextDeleting = false;
        nextIndex = (textIndex + 1) % texts.length;
        delay = Math.round(typeDelayMs * 1.2);
      } else {
        nextText = displayText.slice(0, displayText.length - 1);
        // Slightly faster deleting feel
        delay = Math.round(typeDelayMs * 0.7);
      }
    }

    const t = setTimeout(() => {
      setDisplayText(nextText);
      setIsDeleting(nextDeleting);
      setTextIndex(nextIndex);
    }, delay);

    return () => clearTimeout(t);
  }, [displayText, isDeleting, textIndex, texts, typeDelayMs, delayMs]);

  if (!texts || texts.length === 0) {
    return null;
  }

  return <span className={className}>{displayText}</span>;
}

export default Typewriter;
