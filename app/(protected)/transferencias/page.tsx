import type { Metadata } from 'next';
import { TransferenciasModule } from '@/components/transferencias/transferencias-module';

export const metadata: Metadata = {
  title: 'Transferencias Documentales',
};

export default function TransferenciasPage() {
  return <TransferenciasModule />;
}
