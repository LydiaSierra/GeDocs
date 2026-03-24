import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserList } from '@/Components/Users/UserList';
import { UserContext } from '@/context/UserContext/UserContext';
import * as InertiaReact from '@inertiajs/react';

// Mock Inertia usePage
vi.mock('@inertiajs/react', () => ({
    usePage: vi.fn(),
}));

describe('InstructorList Component (Frontend)', () => {
    const mockSetContent = vi.fn();
    const mockShowInformation = vi.fn();
    const mockFetchUser = vi.fn();

    const mockUsers = [
        {
            id: 1,
            name: 'Apprentice Filtered Out',
            document_number: '123456',
            email: 'app@test.com',
            status: 'active',
            created_at: '2023-01-01T00:00:00.000000Z',
            roles: [{ name: 'Aprendiz' }],
        },
        {
            id: 2,
            name: 'Instructor Visible',
            document_number: '987654',
            email: 'inst1@test.com',
            status: 'pending',
            created_at: '2023-01-02T00:00:00.000000Z',
            roles: [{ name: 'Instructor' }],
            profile_photo: null
        }
    ];

    const renderWithContext = (contextValues) => {
        return render(
            <UserContext.Provider value={contextValues}>
                <UserList url="/users/instructor" />
            </UserContext.Provider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
        HTMLDialogElement.prototype.showModal = vi.fn();
        HTMLDialogElement.prototype.close = vi.fn();
        
        // Simular que el frontend detecta que estamos en la ruta de instructores
        InertiaReact.usePage.mockReturnValue({
            url: "/users/instructor",
            props: { auth: { user: { roles: [{ name: "Admin" }] } } }
        });
    });

    it('renders only users that match the current content (Instructor)', () => {
        renderWithContext({
            user: mockUsers,
            loading: false,
            // UserList setea setContent(Instructor) cuando la URL es /users/instructor
            content: 'Instructor', 
            setContent: mockSetContent,
            fetchUser: mockFetchUser,
            isSearching: false,
            ShowInformation: mockShowInformation
        });

        // The hook fetchUser should have been called
        expect(mockFetchUser).toHaveBeenCalled();

        // Debería ver al Instructor
        expect(screen.getByText('Instructor Visible')).toBeInTheDocument();
        expect(screen.getByText('987654')).toBeInTheDocument();
        expect(screen.getByText('inst1@test.com')).toBeInTheDocument();

        // NO debería ver al aprendiz, confirmando el filtrado exitoso en el DOM
        expect(screen.queryByText('Apprentice Filtered Out')).not.toBeInTheDocument();
    });

    it('shows empty state when no instructors are in the database', () => {
        // Enviar un user list vacío
        renderWithContext({
            user: [], 
            loading: false,
            isSearching: false,
            content: 'Instructor',
            setContent: mockSetContent,
            fetchUser: mockFetchUser,
        });

        expect(screen.getByText('No hay usuarios para mostrar.')).toBeInTheDocument();
    });
});
