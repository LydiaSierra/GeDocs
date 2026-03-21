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

// Mock de @inertiajs/react con Rol Instructor
vi.mock('@inertiajs/react', () => ({
    usePage: () => ({
        props: {
            auth: {
                user: { id: 2, name: 'Instructor User', roles: [{ name: 'Instructor' }] },
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

// Datos de prueba limitados a las fichas asignadas al Instructor
const mockMailCards = [
    {
        id: 201,
        sender_name: "Juan Perez",
        affair: "Petición Instructor",
        description: "Esta petición corresponde a una ficha asignada.",
        request_type: "Peticion",
        user_id: 10,
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

describe('Dashboard Inbox Tests - Instructor Role', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it(' Render of the interface and Instructor restricted list', () => {
        renderWithMailContext(
            <>
                <InboxSidebar />
                <MailReader />
            </>
        );

        expect(screen.getByText('Bandeja de Entrada')).toBeInTheDocument();
        // The list should only show PQRs for their sheets (mockMailCards above)
        expect(screen.getByText('Petición Instructor')).toBeInTheDocument();
    });

    it(' Instructor is able to assign Dependency (menu exists)', () => {
        renderWithMailContext(
            <MailReader />,
            { selectedMail: 201 } // Seleccionar la PQR
        );
        // The instructor is authorized to see the dropdown for assigning dependencies.
        // It says "Asignar Dependencia" or the name of the dependency if it has one.
        // In our mock, dependency_id is 1. Since mock dependency has id: 1. It should display "Dependencia Prueba" or similar from the list if mapped.
        // But the dropdown button exists and is clickable.
        const assignDropdowns = screen.getAllByText(/Dependencia Prueba|Asignar Dependencia/i);
        expect(assignDropdowns.length).toBeGreaterThan(0);
    });

});
