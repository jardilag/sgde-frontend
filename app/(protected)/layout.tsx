import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/layout/admin-shell';
import { getDemoUser } from '@/services/mock-db';
import { SESSION_COOKIE_NAME } from '@/utils/constants';

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);

  if (!session) {
    redirect('/login');
  }

  return <AdminShell initialUser={getDemoUser()}>{children}</AdminShell>;
}