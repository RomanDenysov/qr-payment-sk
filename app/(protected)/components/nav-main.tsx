import {
  CreditCardIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  PlusIcon,
  QrCodeIcon,
  SettingsIcon,
} from 'lucide-react';
import Link from 'next/link';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar';
import { CreateQRDialog } from '~/components/qr/create-qr-dialog';

const items = [
  {
    label: 'Overview',
    href: '/overview',
    icon: LayoutDashboardIcon,
  },
  {
    label: 'Templates',
    href: '/templates',
    icon: LayoutTemplateIcon,
  },
  {
    label: 'Transactions',
    href: '/transactions',
    icon: CreditCardIcon,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: SettingsIcon,
  },
];

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <CreateQRDialog>
              <SidebarMenuButton
                tooltip="Quick Create"
                className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              >
                <QrCodeIcon />
                <span>Generovať QR kód</span>
                <PlusIcon className="ml-auto" />
              </SidebarMenuButton>
            </CreateQRDialog>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild tooltip={item.label}>
                <Link href={item.href}>
                  {item.icon && <item.icon />}
                  <span>{item.label}</span>
                  <span className="sr-only">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
