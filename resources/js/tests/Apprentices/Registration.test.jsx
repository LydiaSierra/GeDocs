import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Register from '@/Pages/Auth/Register';
import { toast } from 'sonner';
import { useForm } from '@inertiajs/react';

global.route = vi.fn().mockReturnValue('/register');

vi.mock('sonner', () => ({
    toast: {
        error: vi.fn(),
        loading: vi.fn(),
        dismiss: vi.fn(),
    }
}));

vi.mock('@inertiajs/react', () => ({
    Head: () => null,
    Link: ({ children }) => <a href="#">{children}</a>,
    useForm: vi.fn(),
}));

vi.mock('@/Layouts/GuestLayout', () => ({
    default: ({ children }) => <div>{children}</div>
}));

describe('Apprentice Registration Tests', () => {
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

    it('shows the select of sheets when the selected role is Apprentice', () => {
        render(<Register sheets={mockSheets} />);
        
        expect(screen.getByLabelText(/^Ficha/i)).toBeInTheDocument();
        
        expect(screen.getByText('Ficha-12345')).toBeInTheDocument();
        expect(screen.getByText('Ficha-67890')).toBeInTheDocument();
    });

    it('throws toast error "Seleccione su ficha" if try to register as Apprentice without sheet', () => {
        render(<Register sheets={mockSheets} />);
        
        const btn = screen.getByRole('button', { name: /Registrarse/i });
        fireEvent.click(btn);

        expect(toast.error).toHaveBeenCalledWith("Seleccione su ficha");
        expect(mockPost).not.toHaveBeenCalled();
    });

    it('calls post if all fields are filled', () => {
        
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

        expect(toast.error).not.toHaveBeenCalled();

        expect(mockPost).toHaveBeenCalledWith('/register', expect.any(Object));
    });
});