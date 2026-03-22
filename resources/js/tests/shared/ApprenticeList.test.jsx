import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserList } from '@/Components/Users/UserList';
import { UserContext } from '@/context/UserContext/UserContext';
import * as InertiaReact from '@inertiajs/react';

// Mock Inertia usePage
vi.mock('@inertiajs/react', () => ({
    usePage: vi.fn(),
    Link: ({ children }) => <div>{children}</div>,
}));

// Mock ResizeObserver for HeadlessUI/Dialogs if needed
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

describe('UserList Component', () => {
    const mockSetContent = vi.fn();
    const mockShowInformation = vi.fn();
    const mockFetchUser = vi.fn();

    const mockUsers = [
        {
            id: 1,
            name: 'Apprentice One',
            document_number: '123456',
            email: 'app1@test.com',
            status: 'active',
            created_at: '2023-01-01T00:00:00.000000Z',
            roles: [{ name: 'Aprendiz' }],
        },
        {
            id: 2,
            name: 'Instructor One',
            document_number: '987654',
            email: 'inst1@test.com',
            status: 'pending',
            created_at: '2023-01-02T00:00:00.000000Z',
            roles: [{ name: 'Instructor' }],
        }
    ];

    const renderWithContext = (contextValues) => {
        return render(
            <UserContext.Provider value={contextValues}>
                <UserList url="/users/aprendiz" />
            </UserContext.Provider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
        HTMLDialogElement.prototype.showModal = vi.fn();
        HTMLDialogElement.prototype.close = vi.fn();
        
        InertiaReact.usePage.mockReturnValue({
            url: "/users/aprendiz",
            props: { auth: { user: { roles: [{ name: "Instructor" }] } } }
        });
    });

    it('renders loading state correctly', () => {
        renderWithContext({
            loading: true,
            fetchUser: mockFetchUser,
            setContent: mockSetContent,
        });

        expect(screen.getByText('Cargando')).toBeInTheDocument();
        expect(screen.queryByText('Apprentice One')).not.toBeInTheDocument();
    });

    it('renders only users that match the current content (Apprentices)', () => {
        renderWithContext({
            user: mockUsers,
            loading: false,
            content: 'Aprendiz',
            setContent: mockSetContent,
            fetchUser: mockFetchUser,
            isSearching: false,
        });

        // The hook fetchUser should have been called
        expect(mockFetchUser).toHaveBeenCalled();

        // Should see the apprentice
        expect(screen.getByText('Apprentice One')).toBeInTheDocument();
        expect(screen.getByText('123456')).toBeInTheDocument();
        expect(screen.getByText('app1@test.com')).toBeInTheDocument();

        // Should NOT see the instructor (since the filter is roles.name === content)
        expect(screen.queryByText('Instructor One')).not.toBeInTheDocument();
    });

    it('renders search results correctly', () => {
        renderWithContext({
            user: mockUsers,
            filteredUser: [mockUsers[0]], // Simulating search found the apprentice
            loading: false,
            isSearching: true,
            loadingSearch: false,
            content: 'Aprendiz',
            setContent: mockSetContent,
            fetchUser: mockFetchUser,
        });

        expect(screen.getByText('Apprentice One')).toBeInTheDocument();
    });

    it('shows empty state when no users are found during search', () => {
        renderWithContext({
            user: mockUsers,
            filteredUser: [], // Empty search results
            loading: false,
            isSearching: true,
            loadingSearch: false,
            content: 'Aprendiz',
            setContent: mockSetContent,
            fetchUser: mockFetchUser,
        });

        expect(screen.getByText('No hay resultados para mostrar.')).toBeInTheDocument();
    });
});
