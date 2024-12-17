"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useState } from "react";

interface BlurIntProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: {
    hidden: any;
    visible: any;
  };
  duration?: number;
  show?: boolean;
}
const BlurInOut = ({
  children,
  className,
  variant,
  duration = 1,
  delay = 0,
  show = true,
}: BlurIntProps) => {
  const defaultVariants = {
    hidden: { filter: "blur(10px)", opacity: 0 },
    visible: { filter: "blur(0px)", opacity: 1 },
  };
  const combinedVariants = variant || defaultVariants;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          // mount
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration, delay }}
          variants={combinedVariants}
          className={cn("", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlurInOut;
