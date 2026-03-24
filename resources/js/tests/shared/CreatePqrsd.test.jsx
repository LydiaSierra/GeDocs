import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import Form from '@/Pages/Form'; // Ajusta la ruta a tu componente Form.jsx
import { toast } from 'sonner';

// Mock de Axios
vi.mock('axios');

// Mock de Sonner
vi.mock('sonner', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    }
}));

// Mock de @inertiajs/react
vi.mock('@inertiajs/react', () => ({
    usePage: () => ({
        props: {
            auth: {
                user: { id: 2, name: 'Test User', roles: [{ name: 'Aprendiz' }] },
            },
            sheets: [
                { id: 1, number: '1234567', state: 'Activa' },
                { id: 2, number: '7654321', state: 'Activa' }
            ]
        },
    }),
    Head: () => <div data-testid="head" />,
    Link: ({ children, href, className }) => <a href={href} className={className}>{children}</a>,
}));

// Mock Ziggy route helper
window.route = () => 'inbox'; // O retorna un obj si necesita route().current()

describe('Form.jsx - Frontend Validations and Toast Tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('1. Renderiza los campos iniciales correctamente', () => {
        render(<Form />);
        
        expect(screen.getByText('Diligenciar PQRS')).toBeInTheDocument();
        expect(screen.getByLabelText(/Nombre Completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Ficha/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Número de Documento/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Asunto/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
        
        // El botón de enviar debe estar deshabilitado hasta aceptar tratamiento de datos
        const submitBtn = screen.getByRole('button', { name: /Enviar PQRS/i });
        expect(submitBtn).toBeDisabled();
    });

    it('limit the types of files that can be uploaded in frontend', async () => {
        render(<Form />);
        
        const fileInput = document.querySelector('input[type="file"]');
        expect(fileInput).toHaveAttribute('type', 'file');
        
        // En una plantilla óptima debería tener la limitación 'accept'
        // Esto fallará si el frontend carece de un atributo "accept" que restrinja tipos
        expect(fileInput).toHaveAttribute('accept', expect.stringMatching(/\.pdf|\.doc|\.jpg|\.png/));
    });
});
