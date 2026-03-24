import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreatePDF from '@/Pages/CreatePDF';
import { usePage, router } from '@inertiajs/react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import React from 'react';

// --- GLOBAL MOCKS ---
window.route = (name, params) => {
    if (params) return `/${name}/${JSON.stringify(params)}`;
    return `/${name}`;
};

vi.mock('@inertiajs/react', () => ({
    usePage: vi.fn(),
    router: {
        visit: vi.fn(),
    },
    Head: ({ title }) => <title>{title}</title>,
    Link: ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>,
}));

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        loading: vi.fn(() => 'toast-id'),
        dismiss: vi.fn(),
    }
}));

vi.mock('@/lib/axios', () => ({
    default: {
        post: vi.fn(),
        delete: vi.fn(),
    }
}));

// Mock Layout to avoid Header/Sidebar deep rendering issues
vi.mock('@/Layouts/DashboardLayout', () => ({
    DashboardLayout: ({ children }) => <div data-testid="dashboard-layout">{children}</div>
}));

// Provide basic mocking for JSDOM missing <dialog> APIs
HTMLDialogElement.prototype.showModal = vi.fn(function() { this.open = true; });
HTMLDialogElement.prototype.close = vi.fn(function() { this.open = false; });

describe('CreatePDF Interface', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        
        usePage.mockReturnValue({
            props: {
                auth: {
                    user: { pdf_footer_text: "Mi pie de pagina predeterminado" }
                },
                // Vulnerabilidad IDOR simulada en Front:
                // Emulamos que un payload inyectado maliciosamente llegó en los props de Inertia:
                targetFolderId: 999,      
                targetSheetId: 3
            }
        });
    });

    it('renders default state with active "Carta" document template', () => {
        render(<CreatePDF />);
        
        expect(screen.getByText('Seleccionar tipo de documento')).toBeInTheDocument();
        
        // Elementos visuales únicos de Carta
        expect(screen.getByPlaceholderText('Tratamiento')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Asunto')).toBeInTheDocument();
        
        // Verificamos que el footer inyectado por props se renderiza
        expect(screen.getAllByText('Mi pie de pagina predeterminado')[0]).toBeInTheDocument();
    });

    it('dynamically re-renders template fields conditionally based on document type (Acta/Circular)', () => {
        render(<CreatePDF />);
        
        const select = screen.getByRole('combobox');
        
        // 1. Cambiamos visual a "Circular"
        fireEvent.change(select, { target: { value: 'circular' } });
        
        expect(screen.getByPlaceholderText('Titulo')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Grupo destinatario')).toBeInTheDocument();
        // El tratamiento de Carta ya no debería existir
        expect(screen.queryByPlaceholderText('Tratamiento')).not.toBeInTheDocument();
        
        // 2. Cambiamos visual a "Acta"
        fireEvent.change(select, { target: { value: 'acta' } });
        
        expect(screen.getByText('Asistentes')).toBeInTheDocument();
        expect(screen.getByText('Orden del dia')).toBeInTheDocument();
        expect(screen.getByText('+ Agregar punto')).toBeInTheDocument(); // Boton EditableList
    });

    it('allows editing and saving the global generic footer from the dialog modal', async () => {
        // Resolvemos el mock exitoso para el guardado local del footer personal
        api.post.mockResolvedValueOnce({ 
            data: { footer_text: "Este es el footer corporativo guardado." } 
        });
        
        render(<CreatePDF />);
        
        const editFooterBtn = screen.getByText('Editar pie de pagina');
        fireEvent.click(editFooterBtn);

        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
        
        // Modificar textarea
        const footerTextarea = screen.getByPlaceholderText('Escribe el pie de pagina del documento');
        fireEvent.change(footerTextarea, { target: { value: 'Mi nuevo intento corporativo' } });

        // Guardar
        const saveModalBtn = screen.getByText('Guardar pie de pagina');
        fireEvent.click(saveModalBtn);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/pdf/footer-preference', { 
                footer_text: 'Mi nuevo intento corporativo' 
            });
        });

        // Comprobamos que el toast aparece confirmando la personalización
        await waitFor(() => {
            expect(screen.getByText('Pie de pagina guardado correctamente.')).toBeInTheDocument();
        });
    });

    it('triggers PDF Generation forwarding the IDOR-injected targetFolderId (999) accurately capturing the vulnerability', async () => {
        // Mock success generation API
        api.post.mockResolvedValueOnce({ 
            data: { folder_id: 999, sheet_id: 3 } 
        });

        render(<CreatePDF />);

        const generatePdfBtn = screen.getByText('Generar PDF');
        fireEvent.click(generatePdfBtn);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/generate-pdf-to-explorer', expect.any(FormData));
        });

        // Extraemos y auditamos el formData que el componente envió hacia Laravel
        const formData = api.post.mock.calls[0][1];
        
        // Assert de IDOR flagranti - Frontend obedece e inyecta folder inautorizado
        expect(formData.get('folder_id')).toBe("999");
        expect(formData.get('sheet_id')).toBe("3");
        expect(formData.get('document_type')).toBe("carta"); // default state

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('PDF generado y guardado correctamente');
        });
        
        // Chequeamos el redireccionamiento para inyectar nuevo estado visual validado en componente de Explorer
        expect(router.visit).toHaveBeenCalled();
    });
});
