import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserDetailsPanel from '@/Components/Users/UserDetailsPanel';
import { UserContext } from '@/context/UserContext/UserContext';
import * as InertiaReact from '@inertiajs/react';

// Mock axios para simular que traemos las fichas de /api/sheetsNumber
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

// Mock sonner directamente
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

    // Este es nuestro Instructor (ya tiene 2 fichas al abrir)
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

        // Verifying visual details
        expect(screen.getByText('Detalles de Instructor')).toBeInTheDocument();
        expect(screen.getAllByText('Ana Instructor')[0]).toBeInTheDocument();
        expect(screen.getByText('Fichas Asignadas')).toBeInTheDocument();
        
        // Debe pintar los números de las dos fichas actuales
        expect(screen.getByText('100100')).toBeInTheDocument();
        expect(screen.getByText('200200')).toBeInTheDocument();
    });

    it('switches to Edit view and replaces Dependency select with multiple Sheet UI', async () => {
        // En modo Edición
        renderWithContext({
            idSelected: mockInstructor,
            edit: true,
        });

        // Título cambia a Editar Instructor
        expect(screen.getByText('Editar Instructor')).toBeInTheDocument();
        
        // Debe decir "Asignar Fichas" y NO "Asignar Dependencia" (que es solo para Aprendiz)
        expect(screen.getByText('Asignar Fichas')).toBeInTheDocument();
        expect(screen.queryByText('Asignar Dependencia')).not.toBeInTheDocument();
        
        // Esperar a que Axios resuelva las Fichas y actualice el State local
        await waitFor(() => {
            // El listado de abajo debe pintar la Ficha 300300 que vino vacía pero lista para cliquear
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

        // La UX para hojas seleccionadas las dibuja en un contenedor tipo span.
        // La lista de abajo las dibuja en divs (donde toggleSheet es invocable).
        
        // Vamos a SIMULAR un escenario de clics: Quitar la segunda ficha y añadir una tercera.
        // En RTL los spans/divs de hojas seleccionadas tienen click logic. 
        // Buscamos el elemento "300300" (la inactiva) de la lista y le damos clic para agregarla.
        const addSheetDiv = screen.getAllByText('300300')[0]; // De la lista de todos
        fireEvent.click(addSheetDiv);

        // Removemos la de 200200. "XMarkIcon" está mapeado a un button dentro del span de la ficha en selectedSheets.
        // Screen expone los spans con el texto: '200200'. El button está adentro.
        // Como '200200' aparece tanto arriba (en seleccionado) como abajo (en general), le damos click a la ficha en general
        // toggleSheet es un simple array.filter y toggle, es un solo handler. Si le damos click de nuevo a 200200, se desactiva.
        const removeSheetDiv = screen.getAllByText('200200')[screen.getAllByText('200200').length - 1]; 
        fireEvent.click(removeSheetDiv);

        // Hacer Clic en Guardar
        const saveButton = screen.getByText('Guardar Cambios');
        fireEvent.click(saveButton);

        // El payload UpdateInfo(nombre, documento, numero_doc, email, estado, id, sheets, dependecy)
        await waitFor(() => {
            expect(mockUpdateInfo).toHaveBeenCalledWith(
                'Ana Instructor',
                'CC',
                '10203040',
                'ana@sena.edu.co',
                'active',
                5,
                [1, 3] // <- Aquí probamos que Quitó la [2] y metió la [3], [1] queda igual
            );
            expect(toast.success).toHaveBeenCalledWith('Información actualizada');
        });
    });

});
