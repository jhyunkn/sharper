'use client';

/**
 * Section-cut navigation template.
 *
 * In Next.js app router, template.tsx (unlike layout.tsx) is re-instantiated
 * on every navigation. This means the motion.div below re-mounts, firing its
 * initial → animate transition every time the user changes sections.
 *
 * The philosophy: arriving at a new section is an act of sharpening.
 * You cut through the ambient blur to isolate a signal. The entry animation
 * physically enacts that — content begins blurred and slightly receded,
 * then snaps into razor focus.
 *
 * Duration is intentionally asymmetric:
 *   Blur → clear: 0.38s (the cut is fast but not instant — you feel the effort)
 *   The filter specifically clears at 0.22s (sharper than the opacity)
 *   so the text appears to SNAP into legibility before the full fade completes.
 */

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        filter: 'blur(12px)',
        scale: 0.985,
      }}
      animate={{
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
      }}
      transition={{
        duration: 0.38,
        ease: [0.16, 1, 0.3, 1],
        filter: { duration: 0.22, ease: 'easeOut' },  // filter clears faster than opacity
        scale:  { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
      }}
      style={{ height: '100%', position: 'relative' }}
    >
      {children}
    </motion.div>
  );
}
