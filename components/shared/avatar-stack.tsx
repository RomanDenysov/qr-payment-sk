import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type User = {
  email: string;
  name?: string;
  image?: string;
};

interface AvatarStackProps {
  className?: string;
  avatar: User;
  color?: string;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export function AvatarStack({
  className,
  avatar,
  color = 'bg-secondary',
}: AvatarStackProps) {
  const initials = getInitials(avatar.name ?? avatar.email);
  return (
    <Avatar className={cn('bg-secondary ring-1 ring-background', className)}>
      <AvatarImage src={avatar.image} alt={avatar.name} />
      <AvatarFallback className={cn('text-xs', color)}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

interface AvatarGroupProps {
  className?: string;
  avatars: User[];
}

export function AvatarGroup({ className, avatars }: AvatarGroupProps) {
  return (
    <div className={cn('-space-x-1 flex items-center px-4', className)}>
      {avatars.map((avatar) => (
        <AvatarStack
          key={avatar.name}
          avatar={avatar}
          color="bg-[var(--color-muted-foreground)]"
        />
      ))}
    </div>
  );
}
