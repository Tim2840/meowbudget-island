"use client";

import { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/stores/useSettingsStore";

interface MotionSheetProps {
  onClose: () => void;
  children: ReactNode;
  zIndex?: string;
  cardClassName?: string;
  cardStyle?: CSSProperties;
}

export default function MotionSheet({
  onClose,
  children,
  zIndex = "z-[100]",
  cardClassName = "",
  cardStyle,
}: MotionSheetProps) {
  const { animationsEnabled } = useSettingsStore();

  return (
    <motion.div
      className={`fixed inset-0 ${zIndex} flex items-end justify-center bg-black/40`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: animationsEnabled ? 0.2 : 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`w-full max-w-md bg-white rounded-t-3xl shadow-xl ${cardClassName}`}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={
          animationsEnabled
            ? { type: "spring", damping: 30, stiffness: 300 }
            : { duration: 0 }
        }
        style={cardStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
