"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { TUTORIAL_STEPS } from "@/lib/constants";

interface TutorialOverlayProps {
  onComplete: () => void;
}

export default function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
  const t = useTranslations("tutorial");
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const currentStep = TUTORIAL_STEPS[step];
  const isLast = step === TUTORIAL_STEPS.length - 1;

  useEffect(() => {
    if (currentStep.targetSelector) {
      const el = document.querySelector(currentStep.targetSelector);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  }, [step, currentStep.targetSelector]);

  const next = () => {
    if (isLast) { onComplete(); return; }
    setStep((s) => s + 1);
  };

  const prev = () => setStep((s) => Math.max(0, s - 1));

  const PADDING = 8;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100]">
      {/* Dark overlay with spotlight hole */}
      {targetRect ? (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={targetRect.left - PADDING}
                y={targetRect.top - PADDING}
                width={targetRect.width + PADDING * 2}
                height={targetRect.height + PADDING * 2}
                rx={12}
                fill="black"
              />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(0,0,0,0.65)" mask="url(#spotlight-mask)" />
          {/* Highlight border */}
          <rect
            x={targetRect.left - PADDING}
            y={targetRect.top - PADDING}
            width={targetRect.width + PADDING * 2}
            height={targetRect.height + PADDING * 2}
            rx={12}
            fill="none"
            stroke="#FCD34D"
            strokeWidth={2.5}
          />
        </svg>
      ) : (
        <div className="absolute inset-0 bg-black/65" />
      )}

      {/* Tooltip / info card */}
      <div
        className="absolute left-4 right-4 bg-white rounded-3xl shadow-2xl p-5 mx-auto max-w-xs"
        style={
          targetRect
            ? targetRect.bottom + 16 + 180 < window.innerHeight
              ? { top: targetRect.bottom + 16 }
              : { bottom: window.innerHeight - targetRect.top + 16 }
            : { top: "50%", transform: "translateY(-50%)" }
        }
      >
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1">
            {TUTORIAL_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-amber-500" : "w-1.5 bg-gray-200"}`}
              />
            ))}
          </div>
          <button onClick={onComplete} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          {t(`${currentStep.id}.title` as Parameters<typeof t>[0])}
        </h3>

        {/* Content — support newlines */}
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {t(`${currentStep.id}.content` as Parameters<typeof t>[0])}
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={prev}
            disabled={step === 0}
            className="flex items-center gap-1 text-sm text-gray-400 disabled:opacity-30 hover:text-gray-600"
          >
            <ChevronLeft size={16} />
            {t("prev")}
          </button>
          <button
            onClick={next}
            className="flex items-center gap-1 bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-amber-600"
          >
            {isLast ? t("finish") : t("next")}
            {!isLast && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
