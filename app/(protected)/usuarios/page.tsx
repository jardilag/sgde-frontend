import type { Metadata } from 'next';
import { UsuariosModule } from '@/components/usuarios/usuarios-module';

export const metadata: Metadata = {
  title: 'Usuarios',
};

export default function UsuariosPage() {
  return <UsuariosModule />;
}