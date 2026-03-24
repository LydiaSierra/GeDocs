import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserDetailsPanel from '@/Components/Users/UserDetailsPanel';
import { UserContext } from '@/context/UserContext/UserContext';
import * as InertiaReact from '@inertiajs/react';

// Mock axios
vi.mock('@/lib/axios', () => ({
    default: {
        get: vi.fn().mockResolvedValue({ data: { fichas: [], sheets: [] } }),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    }
}));

// Mock sonner directly
vi.mock('sonner', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
        loading: vi.fn(),
        dismiss: vi.fn(),
    }
}));

import { toast } from 'sonner';

vi.mock('@inertiajs/react', () => ({
    usePage: vi.fn(),
}));

describe('UserDetailsPanel & Edit Component Tests', () => {
    const mockSetIdSelected = vi.fn();
    const mockSetEdit = vi.fn();
    const mockSetIsDelete = vi.fn();
    const mockUpdateInfo = vi.fn();

    const mockApprentice = {
        id: 10,
        name: 'Carlos Perez',
        type_document: 'CC',
        document_number: '100200300',
        email: 'carlos@sena.edu.co',
        status: 'pending',
        created_at: '2023-05-10T00:00:00.000000Z',
        roles: [{ name: 'Aprendiz' }],
        sheet_numbers: [{ id: 1, number: '2550000' }]
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // HTMLDialogs aren't fully supported in JSDOM, we mock its visual methods
        HTMLDialogElement.prototype.showModal = vi.fn();
        HTMLDialogElement.prototype.close = vi.fn();

        InertiaReact.usePage.mockReturnValue({
            url: "/users/aprendiz",
            props: { 
                auth: { user: { roles: [{ name: "Instructor" }] } },
                dependencies: []
            }
        });
    });

    const renderWithContext = (contextValues) => {
        return render(
            <UserContext.Provider value={{
                ...contextValues,
                setidSelected: mockSetIdSelected,
                setEdit: mockSetEdit,
                setIsDelete: mockSetIsDelete,
                UpdateInfo: mockUpdateInfo,
            }}>
                <UserDetailsPanel />
            </UserContext.Provider>
        );
    };

    it('renders the detailed view of the user when idSelected is populated', () => {
        renderWithContext({
            idSelected: mockApprentice,
            edit: false,
        });

        // Verifying details in the Panel (not the edit form)
        expect(screen.getByText('Detalles de Usuario')).toBeInTheDocument();
        expect(screen.getAllByText('Carlos Perez')[0]).toBeInTheDocument();
        expect(screen.getByText('100200300')).toBeInTheDocument();
        expect(screen.getByText('carlos@sena.edu.co')).toBeInTheDocument();
        // Modal shouldn't show the Edit Inputs yet
        expect(screen.queryByDisplayValue('Carlos Perez')).not.toBeInTheDocument();
    });

    it('opens Edit view when Edit button is clicked in details', () => {
        renderWithContext({
            idSelected: mockApprentice,
            edit: false,
        });

        const editButton = screen.getByText('Editar');
        fireEvent.click(editButton);

        expect(mockSetEdit).toHaveBeenCalledWith(true);
    });

    it('renders edit form correctly and validates empty/wrong inputs with Sonner', async () => {
        // Render in Edit Mode
        renderWithContext({
            idSelected: mockApprentice,
            edit: true,
        });

        // The form has "Guardar Cambios"
        const saveButton = screen.getByText('Guardar Cambios');

        // Validation 1: Nombre < 3
        const nameInput = screen.getByDisplayValue('Carlos Perez');
        fireEvent.change(nameInput, { target: { value: 'Ca' } });
        fireEvent.click(saveButton);
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('El nombre debe tener al menos 3 caracteres');
        });

        // Restore name, Validation 2: Correo Inválido
        fireEvent.change(nameInput, { target: { value: 'Carlos P' } });
        const emailInput = screen.getByDisplayValue('carlos@sena.edu.co');
        fireEvent.change(emailInput, { target: { value: 'carlos_sin_arroba_sena.edu.co' } });
        fireEvent.click(saveButton);
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Ingrese un correo electrónico válido');
        });

        // Restore email, Validation 3: Documento > 10
        fireEvent.change(emailInput, { target: { value: 'carlos2@sena.edu.co' } });
        const docInput = screen.getByDisplayValue('100200300');
        fireEvent.change(docInput, { target: { value: '12345678901' } }); // 11 chars
        fireEvent.click(saveButton);
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('El número de documento no puede tener más de 10 caracteres');
        });
    });

    it('submits form successfully calling UpdateInfo', async () => {
        mockUpdateInfo.mockResolvedValueOnce(true);

        renderWithContext({
            idSelected: mockApprentice,
            edit: true,
        });

        // Just clicking Save with existing valid data should succeed
        const saveButton = screen.getByText('Guardar Cambios');
        fireEvent.click(saveButton);

        await waitFor(() => {
             // 8 params: nombre, documento, numero, email, estado, id, sheets, dependency
            expect(mockUpdateInfo).toHaveBeenCalledWith(
                'Carlos Perez',
                'CC',
                '100200300',
                'carlos@sena.edu.co',
                'pending',
                10,
                [],
                null
            );
            expect(toast.success).toHaveBeenCalledWith('Información actualizada');
        });
    });

});
