const { screen, render } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;
import { AuditoriaFilters } from '@/components/auditoria/auditoria-filters';

jest.mock('antd', () => {
  const useForm = () => [{ resetFields: jest.fn() }];

  const Form = ({ children, onFinish }: { children: React.ReactNode; onFinish?: (values: Record<string, string>) => void }) => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onFinish?.({
          fechaDesde: '2026-04-01',
          fechaHasta: '2026-04-05',
        });
      }}
    >
      {children}
    </form>
  );

  const FormItem = ({ label, children }: { label?: React.ReactNode; children: React.ReactNode }) => (
    <label>
      <span>{label}</span>
      {children}
    </label>
  );

  return {
    Button: ({ children, onClick, htmlType }: { children: React.ReactNode; onClick?: () => void; htmlType?: 'button' | 'submit' }) => (
      <button type={htmlType ?? 'button'} onClick={onClick}>{children}</button>
    ),
    Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Form: Object.assign(Form, {
      Item: FormItem,
      useForm,
    }),
    Input: ({ type = 'text' }: { type?: string }) => <input aria-label={type === 'date' ? undefined : 'input'} type={type} />,
    Select: () => <select aria-label="select" />,
    Space: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Typography: {
      Title: ({ children }: { children: React.ReactNode }) => <h4>{children}</h4>,
      Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    },
  };
});

describe('AuditoriaFilters', () => {
  it('renderiza filtros avanzados', () => {
    render(
      <AuditoriaFilters
        usuarios={['Andrea Castro']}
        entidades={['Transferencia']}
        acciones={['Crear']}
        onApply={jest.fn()}
        onClear={jest.fn()}
      />,
    );

    expect(screen.getByText('Consulta administrativa de auditoría')).toBeInTheDocument();
    expect(screen.getByText('Usuario')).toBeInTheDocument();
    expect(screen.getByText('Fecha desde')).toBeInTheDocument();
    expect(screen.getByText('Fecha hasta')).toBeInTheDocument();
  });

  it('permite aplicar y limpiar filtros', async () => {
    const user = userEvent.setup();
    const onApply = jest.fn();
    const onClear = jest.fn();

    render(
      <AuditoriaFilters
        usuarios={['Andrea Castro']}
        entidades={['Transferencia']}
        acciones={['Crear']}
        onApply={onApply}
        onClear={onClear}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Aplicar filtros' }));

    expect(onApply).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
    expect(onClear).toHaveBeenCalled();
  });
});
