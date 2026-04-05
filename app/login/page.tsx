import type { Metadata } from 'next';
import { LoginModule } from '@/components/auth/login-module';

export const metadata: Metadata = {
  title: 'Ingreso',
};

export default function LoginPage() {
  return <LoginModule />;
}