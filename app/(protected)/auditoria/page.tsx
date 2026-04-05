import type { Metadata } from 'next';
import { AuditoriaModule } from '@/components/auditoria/auditoria-module';

export const metadata: Metadata = {
  title: 'Auditoría del Sistema',
};

export default function AuditoriaPage() {
  return <AuditoriaModule />;
}
