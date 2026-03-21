import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Ejemplo de Test Frontend', () => {
    it('debería funcionar vitest correctamente', () => {
        expect(1 + 1).toBe(2);
    });

    it('debería poder renderizar un componente simple', () => {
        render(<div>Hola Mundo</div>);
        expect(screen.getByText('Hola Mundo')).toBeInTheDocument();
    });
});
