'use client';

import { MoonIcon, SunIcon, DesktopIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

const themes = [
  { label: 'Light', value: 'light', icon: <SunIcon className="h-[1.2rem] w-[1.2rem]" /> },
  { label: 'Dark', value: 'dark', icon: <MoonIcon className="h-[1.2rem] w-[1.2rem]" /> },
  { label: 'System', value: 'system', icon: <DesktopIcon className="h-[1.2rem] w-[1.2rem]" /> },
];

type ModeToggleProps = {
  side?: 'top' | 'bottom' | 'left' | 'right';
};

export const ModeToggle = ({ side = 'top' }: ModeToggleProps) => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-foreground"
        >
          <SunIcon className="dark:-rotate-90 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side={side}>
        {themes.map(({ label, value, icon }) => (
          <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
            {icon}
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
