import type { Metadata } from 'next';
import { RadicadosModule } from '@/components/radicados/radicados-module';

export const metadata: Metadata = {
  title: 'Radicados',
};

export default function RadicadosPage() {
  return <RadicadosModule />;
}