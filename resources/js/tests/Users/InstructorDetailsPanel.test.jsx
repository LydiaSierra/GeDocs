import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserDetailsPanel from '@/Components/Users/UserDetailsPanel';
import { UserContext } from '@/context/UserContext/UserContext';
import * as InertiaReact from '@inertiajs/react';

vi.mock('@/lib/axios', () => ({
    default: {
        get: vi.fn().mockImplementation((url) => {
            if (url === '/api/sheetsNumber' || url === '/api/sheets') {
                return Promise.resolve({
                    data: { 
                        fichas: [
                            { id: 1, number: '100100' },
                            { id: 2, number: '200200' },
                            { id: 3, number: '300300' }
                        ],
                        sheets: [
                            { id: 1, number: '100100' },
                            { id: 2, number: '200200' },
                            { id: 3, number: '300300' }
                        ]
                    } 
                });
            }
            return Promise.resolve({ data: {} });
        }),
    }
}));

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

describe('InstructorDetailsPanel Component Tests', () => {
    const mockSetIdSelected = vi.fn();
    const mockSetEdit = vi.fn();
    const mockSetIsDelete = vi.fn();
    const mockUpdateInfo = vi.fn();

    const mockInstructor = {
        id: 5,
        name: 'Ana Instructor',
        type_document: 'CC',
        document_number: '10203040',
        email: 'ana@sena.edu.co',
        status: 'active',
        created_at: '2023-05-10T00:00:00.000000Z',
        roles: [{ name: 'Instructor' }],
        sheet_numbers: [{ id: 1, number: '100100' }, { id: 2, number: '200200' }]
    };

    beforeEach(() => {
        vi.clearAllMocks();
        HTMLDialogElement.prototype.showModal = vi.fn();
        HTMLDialogElement.prototype.close = vi.fn();

        InertiaReact.usePage.mockReturnValue({
            url: "/users/instructor",
            props: { 
                auth: { user: { roles: [{ name: "Admin" }] } },
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

    it('renders Instructor details properly with dynamic titles', () => {
        renderWithContext({
            idSelected: mockInstructor,
            edit: false,
        });

        expect(screen.getByText('Detalles de Instructor')).toBeInTheDocument();
        expect(screen.getAllByText('Ana Instructor')[0]).toBeInTheDocument();
        expect(screen.getByText('Fichas Asignadas')).toBeInTheDocument();

        expect(screen.getByText('100100')).toBeInTheDocument();
        expect(screen.getByText('200200')).toBeInTheDocument();
    });

    it('switches to Edit view and replaces Dependency select with multiple Sheet UI', async () => {
        
        renderWithContext({
            idSelected: mockInstructor,
            edit: true,
        });

        expect(screen.getByText('Editar Instructor')).toBeInTheDocument();

        expect(screen.getByText('Asignar Fichas')).toBeInTheDocument();
        expect(screen.queryByText('Asignar Dependencia')).not.toBeInTheDocument();

        await waitFor(() => {
            
            expect(screen.getAllByText('300300').length).toBeGreaterThan(0);
        });
    });

    it('modifies multiple sheets and submits UpdateInfo correctly', async () => {
        mockUpdateInfo.mockResolvedValueOnce(true);

        renderWithContext({
            idSelected: mockInstructor,
            edit: true,
        });

        await waitFor(() => {
            expect(screen.getAllByText('100100').length).toBeGreaterThan(0);
        });

        const addSheetDiv = screen.getAllByText('300300')[0]; 
        fireEvent.click(addSheetDiv);

        const removeSheetDiv = screen.getAllByText('200200')[screen.getAllByText('200200').length - 1]; 
        fireEvent.click(removeSheetDiv);

        const saveButton = screen.getByText('Guardar Cambios');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockUpdateInfo).toHaveBeenCalledWith(
                'Ana Instructor',
                'CC',
                '10203040',
                'ana@sena.edu.co',
                'active',
                5,
                [1, 3] 
            );
            expect(toast.success).toHaveBeenCalledWith('Información actualizada');
        });
    });

});
