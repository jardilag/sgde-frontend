import type { Metadata } from 'next';
import { DocumentosModule } from '@/components/documentos/documentos-module';

export const metadata: Metadata = {
  title: 'Radicación Documental',
};

export default function DocumentosPage() {
  return <DocumentosModule />;
}