"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { TUTORIAL_STEPS } from "@/lib/constants";

interface TutorialOverlayProps {
  onComplete: () => void;
}

const MARGIN = 16; // min gap from any screen edge
const NAV_CLEARANCE = 88; // keep the card clear of the bottom navigation bar

export default function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
  const t = useTranslations("tutorial");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [cardTop, setCardTop] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentStep = TUTORIAL_STEPS[step];
  const isLast = step === TUTORIAL_STEPS.length - 1;

  // Full path (with locale prefix) the current step should be shown on.
  const stepPath = `/${locale}${currentStep.route === "/" ? "" : currentStep.route}`;

  // For each step: navigate to its page (if needed), then poll until the target
  // element is mounted on that page before spotlighting it. Re-runs when the
  // pathname changes so measurement happens after navigation finishes.
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    // Clear the previous spotlight while we (possibly) switch pages.
    setTargetRect(null);

    if (pathname !== stepPath) {
      router.push(stepPath);
      return () => { cancelled = true; };
    }

    if (!currentStep.targetSelector) return;

    let attempts = 0;
    const tryFind = () => {
      if (cancelled) return;
      const el = document.querySelector(currentStep.targetSelector!);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        // Let the smooth scroll settle before measuring.
        timer = setTimeout(() => {
          if (!cancelled) setTargetRect(el.getBoundingClientRect());
        }, 350);
        return;
      }
      // Element not mounted yet (page still rendering) — retry up to ~3s.
      if (attempts++ < 50) timer = setTimeout(tryFind, 60);
    };
    tryFind();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [step, pathname, stepPath, currentStep.targetSelector, router]);

  // Position the info card so it is ALWAYS fully on screen. We measure the
  // card's real height and clamp it into the viewport, preferring the side of
  // the spotlight that has room. This is what prevents the card from spilling
  // off the top/bottom when the highlighted element is large (cats grid, island
  // scene, reports tabs…), which was the root cause of the overflow.
  const positionCard = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    const vh = window.innerHeight;
    const ch = card.offsetHeight;
    const maxTop = Math.max(MARGIN, vh - ch - MARGIN);

    let top: number;
    if (!targetRect) {
      top = (vh - ch) / 2; // text-only card → center
    } else {
      const below = targetRect.bottom + MARGIN;
      const above = targetRect.top - MARGIN - ch;
      if (below + ch <= vh - NAV_CLEARANCE) {
        top = below; // fits under the spotlight
      } else if (above >= MARGIN) {
        top = above; // fits above the spotlight
      } else {
        top = vh - NAV_CLEARANCE - ch; // target fills the screen → pin above nav
      }
    }
    setCardTop(Math.min(Math.max(MARGIN, top), maxTop));
  }, [targetRect]);

  // Re-measure whenever the step/spotlight changes or the viewport resizes.
  useEffect(() => {
    positionCard();
    window.addEventListener("resize", positionCard);
    return () => window.removeEventListener("resize", positionCard);
  }, [positionCard, step]);

  const next = () => {
    if (isLast) { onComplete(); return; }
    setStep((s) => s + 1);
  };

  const prev = () => setStep((s) => Math.max(0, s - 1));

  const PADDING = 8;

  return (
    <div className="fixed inset-0 z-[100]">
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

      {/* Tooltip / info card — clamped within the viewport, capped height + scroll */}
      <div
        ref={cardRef}
        className="absolute left-4 right-4 bg-white rounded-3xl shadow-2xl p-5 mx-auto max-w-xs max-h-[80vh] overflow-y-auto transition-opacity"
        style={{ top: cardTop ?? 0, opacity: cardTop === null ? 0 : 1 }}
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
