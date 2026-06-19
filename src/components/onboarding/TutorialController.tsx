"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProfileStore } from "@/stores/useProfileStore";
import TutorialOverlay from "./TutorialOverlay";

export default function TutorialController() {
  const { user } = useAuthStore();
  const { profile, markOnboardingComplete } = useProfileStore();
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (profile && !profile.onboardingCompleted) {
      // Small delay so the page renders first (needed for spotlight selectors)
      const timer = setTimeout(() => setShowTutorial(true), 800);
      return () => clearTimeout(timer);
    }
  }, [profile]);

  const handleComplete = () => {
    setShowTutorial(false);
    if (user) markOnboardingComplete(user.id);
  };

  if (!showTutorial) return null;
  return <TutorialOverlay onComplete={handleComplete} />;
}
