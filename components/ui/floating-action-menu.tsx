'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

type FloatingActionMenuProps = {
  options: {
    label: string;
    onClick: () => void;
    Icon?: React.ReactNode;
  }[];
  className?: string;
};

const FloatingActionMenu = ({
  options,
  className,
}: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn('fixed right-8 bottom-8', className)}>
      <Button
        onClick={toggleMenu}
        className="h-10 w-10 rounded-full bg-[#11111198] shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:bg-[#111111d1] "
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
        >
          <Plus className="h-6 w-6" />
        </motion.div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10, y: 10, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 10, y: 10, filter: 'blur(10px)' }}
            transition={{
              duration: 0.6,
              type: 'spring',
              stiffness: 300,
              damping: 20,
              delay: 0.1,
            }}
            className="absolute right-0 bottom-10 mb-2"
          >
            <div className="flex flex-col items-end gap-2">
              {options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                >
                  <Button
                    onClick={option.onClick}
                    size="sm"
                    className="flex items-center gap-2 rounded-xl border-none bg-[#11111198] shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm hover:bg-[#111111d1]"
                  >
                    {option.Icon}
                    <span>{option.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionMenu;
