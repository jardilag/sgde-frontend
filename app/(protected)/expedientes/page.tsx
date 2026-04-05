/**
 * Página principal de Expedientes
 */

import { ExpedientesModule } from '@/components/expedientes/expedientes-module';

export const metadata = {
  title: 'Expedientes | SGDE',
  description: 'Gestión de expedientes archivísticos',
};

export default function ExpedientesPage() {
  return <ExpedientesModule />;
}
