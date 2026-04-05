import type { Metadata } from 'next';
import { PrestamosModule } from '@/components/prestamos/prestamos-module';

export const metadata: Metadata = {
  title: 'Préstamos Documentales',
};

export default function PrestamosPage() {
  return <PrestamosModule />;
}
