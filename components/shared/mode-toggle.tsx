'use client';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { AnimatedBackground } from '../motion/animated-background';

type ThemeOption = 'light' | 'dark' | 'system';

interface ThemeConfig {
  value: ThemeOption;
  icon: typeof SunIcon;
  label: string;
}

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const themeOptions: ThemeConfig[] = [
    { value: 'light', icon: SunIcon, label: 'Light mode' },
    { value: 'dark', icon: MoonIcon, label: 'Dark mode' },
    { value: 'system', icon: MonitorIcon, label: 'System mode' },
  ];

  const currentTheme = (theme as ThemeOption) || 'system';

  return (
    <div className="flex w-fit items-center rounded-lg border bg-background p-1">
      <AnimatedBackground
        defaultValue={currentTheme}
        onValueChange={(value) => setTheme(value as ThemeOption)}
        className="rounded-md border bg-accent"
        transition={{
          ease: 'easeInOut',
          duration: 0.2,
        }}
      >
        {themeOptions.map((option) => (
          <button
            key={option.value}
            data-id={option.value}
            type="button"
            aria-label={`Switch to ${option.label.toLowerCase()}`}
            className="relative z-10 flex items-center justify-center p-2 transition-all duration-200 active:scale-[0.98]"
          >
            <option.icon className="size-4 text-muted-foreground" />
            <span className="sr-only">{option.label}</span>
          </button>
        ))}
      </AnimatedBackground>
    </div>
  );
}
