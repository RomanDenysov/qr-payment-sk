'use client';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  BookTemplate,
  CreditCard,
  History,
  Home,
  QrCode,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Navigation structure based on PRD requirements
const navigationItems = [
  {
    title: 'Prehľad',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'QR Generátor',
    url: '/dashboard/generator',
    icon: QrCode,
  },
  {
    title: 'Šablóny',
    url: '/dashboard/templates',
    icon: BookTemplate,
    items: [
      {
        title: 'Všetky šablóny',
        url: '/dashboard/templates',
      },
      {
        title: 'Vytvoriť šablónu',
        url: '/dashboard/templates/new',
      },
    ],
  },
  {
    title: 'História',
    url: '/dashboard/history',
    icon: History,
  },
  {
    title: 'Analytika',
    url: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: 'Nastavenia',
    url: '/dashboard/settings',
    icon: Settings,
    items: [
      {
        title: 'Profil',
        url: '/dashboard/settings/profile',
      },
      {
        title: 'IBAN účty',
        url: '/dashboard/settings/ibans',
      },
      {
        title: 'API prístup',
        url: '/dashboard/settings/api',
      },
    ],
  },
  {
    title: 'Predplatné',
    url: '/dashboard/billing',
    icon: CreditCard,
  },
];

export function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navigationItems.map((item) => {
        const isActive = pathname === item.url;
        const hasSubItems = item.items && item.items.length > 0;

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={isActive}>
              <Link href={item.url} className="flex items-center gap-2">
                <item.icon className="size-4" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>

            {hasSubItems && (
              <SidebarMenuSub>
                {item.items.map((subItem) => {
                  const isSubActive = pathname === subItem.url;
                  return (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild isActive={isSubActive}>
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
