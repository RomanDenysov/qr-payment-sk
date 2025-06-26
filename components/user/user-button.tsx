'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { signOut, useSession } from '@/lib/auth/client';
import { BellIcon, CreditCardIcon, LogOutIcon, User2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AvatarStack } from '../shared/avatar-stack';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function UserButton() {
  const { data: session } = useSession();
  const isMobile = useIsMobile();
  const user = session?.user;
  const router = useRouter();
  // TODO: Add session

  console.log(session);

  const handleSignOut = async () =>
    await signOut().then(() => {
      router.push('/');
      toast.success('Odhlásenie prebehlo úspešne');
      router.refresh();
    });

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <AvatarStack
          className="rounded-lg"
          avatar={{
            email: user.email,
            name: user.name ?? undefined,
            image: user.image ?? undefined,
          }}
        />
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          side={'bottom'}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <AvatarStack
                className="rounded-lg"
                avatar={{
                  email: user.email,
                  name: user.name ?? undefined,
                  image: user.image ?? undefined,
                }}
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                {user.name && (
                  <span className="truncate font-medium">{user.name}</span>
                )}
                <span className="truncate text-muted-foreground text-xs">
                  {user.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/konto/nastavenia">
                <User2Icon className="mr-2 size-4" />
                Nastavenia
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/konto/faktury">
                <CreditCardIcon className="mr-2 size-4" />
                Faktury
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/konto/notifikacie">
                <BellIcon className="mr-2 size-4" />
                Notifikácie
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOutIcon className="mr-2 size-4" />
            Odhlásiť sa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
}
