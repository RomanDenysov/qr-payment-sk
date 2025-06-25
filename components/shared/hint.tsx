import type { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type HintProps = {
  children: ReactNode;
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
};

export function Hint({
  children,
  content,
  side = 'bottom',
  sideOffset = 2,
  align = 'center',
}: HintProps) {
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        {/* biome-ignore lint/complexity/noUselessFragments: <explanation> */}
        <>{children}</>
      </TooltipTrigger>
      <TooltipContent side={side} sideOffset={sideOffset} align={align}>
        <span className="font-medium text-sm">{content}</span>
      </TooltipContent>
    </Tooltip>
  );
}
