'use client';

import { signOut, useSession } from '@/lib/auth-client';
import { LogOutIcon, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function UserButton() {
  const { data: session } = useSession();
  const router = useRouter();
  // TODO: Add session

  console.log(session);

  const handleSignOut = async () =>
    await signOut().then(() => {
      router.push('/');
      toast.success('Odhlásenie prebehlo úspešne');
      router.refresh();
    });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" className="size-8">
          <UserIcon className="size-4" />
        </Button>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOutIcon className="size-4" />
            Odhlásiť sa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
}
