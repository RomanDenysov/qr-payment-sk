'use server';

import db from '@/db';
import { user } from '@/db/better-auth-schema';
import { auth } from '@/lib/auth';
import { unstable_cache } from '@/lib/unstable-cache';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

const cachedGetUserQuery = unstable_cache(
  async (userId: string) =>
    await db.query.user.findFirst({
      where: eq(user.id, userId),
    }),
  ['user'],
  {
    revalidate: 60,
  }
);

export async function getUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return null;
  }

  return await cachedGetUserQuery(session.user.id);
}
