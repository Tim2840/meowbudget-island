"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useTutorialStore } from "@/stores/useTutorialStore";
import TutorialOverlay from "./TutorialOverlay";

export default function TutorialController() {
  const { user } = useAuthStore();
  const { profile, markOnboardingComplete } = useProfileStore();
  const { isOpen, close } = useTutorialStore();
  const [autoStart, setAutoStart] = useState(false);

  useEffect(() => {
    if (profile && !profile.onboardingCompleted) {
      // Small delay so the first page renders before the spotlight measures it.
      const timer = setTimeout(() => setAutoStart(true), 800);
      return () => clearTimeout(timer);
    }
  }, [profile]);

  // Overlay is hosted here (in the layout) so it persists while the tutorial
  // navigates between pages. It shows on first-run auto-start OR when a page
  // (e.g. Settings → replay) opens it via the global store.
  const visible = autoStart || isOpen;

  const handleComplete = () => {
    setAutoStart(false);
    close();
    if (user && profile && !profile.onboardingCompleted) {
      markOnboardingComplete(user.id);
    }
  };

  if (!visible) return null;
  return <TutorialOverlay onComplete={handleComplete} />;
}
