import {
  BarChart3Icon,
  HistoryIcon,
  HomeIcon,
  ListIcon,
  QrCodeIcon,
  SettingsIcon,
} from 'lucide-react';

export const dashboardNavItems = [
  {
    title: 'Prehľad',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    title: 'Generátor QR',
    href: '/dashboard/generator',
    icon: QrCodeIcon,
  },
  {
    title: 'Šablóny',
    href: '/dashboard/templates',
    icon: ListIcon,
  },
  {
    title: 'História',
    href: '/dashboard/history',
    icon: HistoryIcon,
  },
];

export const dashboardSecondaryNavItems = [
  {
    title: 'Štatistiky',
    href: '/dashboard/analytics',
    icon: BarChart3Icon,
  },
  {
    title: 'Nastavenia',
    href: '/dashboard/settings',
    icon: SettingsIcon,
  },
];
