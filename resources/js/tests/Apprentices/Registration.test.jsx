import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Register from '@/Pages/Auth/Register';
import { toast } from 'sonner';
import { useForm } from '@inertiajs/react';

// Mock de ziggy-js route
global.route = vi.fn().mockReturnValue('/register');

// Mock de sonner
vi.mock('sonner', () => ({
    toast: {
        error: vi.fn(),
        loading: vi.fn(),
        dismiss: vi.fn(),
    }
}));

// Mock de @inertiajs/react
vi.mock('@inertiajs/react', () => ({
    Head: () => null,
    Link: ({ children }) => <a href="#">{children}</a>,
    useForm: vi.fn(),
}));

// Mock de componentes que podrían requerir configuraciones especiales
vi.mock('@/Layouts/GuestLayout', () => ({
    default: ({ children }) => <div>{children}</div>
}));

describe('Pruebas del Registro de Aprendiz', () => {
    let mockData, mockSetData, mockPost, mockReset;

    beforeEach(() => {
        vi.clearAllMocks();
        
        mockData = {
            type_document: "CC",
            document_number: "123456789",
            name: "Juan Perez",
            email: "juan@test.com",
            role: "Aprendiz",
            technical_sheet_id: "",
            password: "password123",
            password_confirmation: "password123",
        };

        mockSetData = vi.fn((key, value) => {
            mockData[key] = value;
        });

        mockPost = vi.fn();
        mockReset = vi.fn();

        useForm.mockReturnValue({
            data: mockData,
            setData: mockSetData,
            post: mockPost,
            processing: false,
            errors: {},
            reset: mockReset,
        });
    });

    const mockSheets = [
        { id: 1, number: 'Ficha-12345' },
        { id: 2, number: 'Ficha-67890' }
    ];

    it(' show the select of sheets when the selected role is Apprentice', () => {
        render(<Register sheets={mockSheets} />);
        
        expect(screen.getByLabelText(/^Ficha/i)).toBeInTheDocument();
        // Verificamos que se renderizan las opciones de las fichas mockeadas
        expect(screen.getByText('Ficha-12345')).toBeInTheDocument();
        expect(screen.getByText('Ficha-67890')).toBeInTheDocument();
    });

    it('throws toast error "Seleccione su ficha" if try to register as Apprentice without sheet', () => {
        render(<Register sheets={mockSheets} />);
        
        const btn = screen.getByRole('button', { name: /Registrarse/i });
        fireEvent.click(btn);

        // Como technical_sheet_id está vacío y el rol es Aprendiz, el frontend frena el envío
        expect(toast.error).toHaveBeenCalledWith("Seleccione su ficha");
        expect(mockPost).not.toHaveBeenCalled();
    });

    it('call post if all dates are filled', () => {
        // Llenamos la ficha simulando el estado listo
        mockData.technical_sheet_id = "1";
        
        useForm.mockReturnValue({
            data: mockData,
            setData: mockSetData,
            post: mockPost,
            processing: false,
            errors: {},
            reset: mockReset,
        });

        render(<Register sheets={mockSheets} />);
        
        const btn = screen.getByRole('button', { name: /Registrarse/i });
        fireEvent.click(btn);
        
        // El frontend no lanza ningún toast de error
        expect(toast.error).not.toHaveBeenCalled();
        
        // Verifica que se haya llamado al post en la ruta adecuada
        expect(mockPost).toHaveBeenCalledWith('/register', expect.any(Object));
    });
});