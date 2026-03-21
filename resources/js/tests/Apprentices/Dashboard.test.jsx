import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { MailContext } from '@/context/MailContext/MailContext';
import InboxSidebar from '@/Components/InboxSidebar/InboxSidebar';
import { MailReader } from '@/Components/MailReader/MailReader';

// Mock de Axios
vi.mock('axios');

// Mock Ziggy route helper
window.route = () => ({
    current: () => 'inbox'
});

// Mock de @inertiajs/react con Rol Aprendiz
vi.mock('@inertiajs/react', () => ({
    usePage: () => ({
        props: {
            auth: {
                user: { id: 3, name: 'Aprendiz User', roles: [{ name: 'Aprendiz' }], dependency_id: 1 },
            },
            dependencies: [
                { id: 1, name: 'Dependencia Prueba', sheet_number_id: 1 }
            ]
        },
    }),
    Head: () => <div data-testid="head" />,
    Link: ({ children, href, className }) => <a href={href} className={className}>{children}</a>,
    router: {
        visit: vi.fn(),
    }
}));

// Datos de prueba limitados a lo que un Aprendiz puede ver
const mockMailCards = [
    {
        id: 301,
        sender_name: "Juan Perez",
        affair: "Petición Aprendiz",
        description: "Esta petición la ve un aprendiz porque está en su dependencia o la creó él.",
        request_type: "Peticion",
        user_id: 3,
        dependency_id: 1,
        sheet_number_id: 1,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        response_time: new Date(Date.now() + 10 * 86400000).toISOString(),
    }
];

const renderWithMailContext = (ui, contextOverrides = {}) => {
    const defaultContext = {
        mailCards: mockMailCards,
        filteredMailCards: mockMailCards,
        selectedMail: null,
        setSelectedMail: vi.fn(),
        setMailCards: vi.fn(),
        loading: false,
        toggleFilter: vi.fn(),
        filters: [],
        searchTerm: '',
        setSearchTerm: vi.fn(),
        setSideFilter: vi.fn(),
        isArchiveView: false,
        ...contextOverrides
    };

    return render(
        <MailContext.Provider value={defaultContext}>
            <div className="flex h-screen w-full">
                {ui}
            </div>
        </MailContext.Provider>
    );
};

describe('Dashboard Inbox Tests - Apprentice Role', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it(' Render of the interface and Apprentice restricted list', () => {
        renderWithMailContext(
            <>
                <InboxSidebar />
                <MailReader />
            </>
        );

        expect(screen.getByText('Bandeja de Entrada')).toBeInTheDocument();
        // Muestra la PQRS correspondiente al aprendiz
        expect(screen.getByText('Petición Aprendiz')).toBeInTheDocument();
    });

    it(' Apprentice is NOT able to assign Dependency (menu is hidden)', () => {
        renderWithMailContext(
            <MailReader />,
            { selectedMail: 301 } 
        );
        // The Apprentice should not see the "Seleccionar Dependencia" title or "Asignar Dependencia" option.
        // En MailReader.jsx: `{(isInstructor || isAdmin) && relevantDependencies.length > 0 && ...}`
        const menuTitle = screen.queryByText('Seleccionar Dependencia');
        expect(menuTitle).toBeNull();
        
        const assignDropdown = screen.queryByText('Asignar Dependencia');
        expect(assignDropdown).toBeNull();
    });

});
