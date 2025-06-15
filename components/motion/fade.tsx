'use client';

import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import type { ComponentProps, ReactNode } from 'react';

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 16,
    filter: 'blur(4px)',
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      stiffness: 150,
      damping: 19,
      mass: 1.2,
    },
  },
};

function FadeContainer({ children, className }: ComponentProps<'div'>) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit="hidden"
      className={cn('relative', className)}
    >
      {children}
    </motion.div>
  );
}

function FadeDiv({ children, className }: ComponentProps<'div'>) {
  return (
    <motion.div variants={item} className={cn('relative', className)}>
      {children}
    </motion.div>
  );
}

function FadeSpan({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.span variants={item} className={className}>
      {children}
    </motion.span>
  );
}

export { FadeContainer, FadeDiv, FadeSpan };
