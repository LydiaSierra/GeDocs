import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { MailContext } from '@/context/MailContext/MailContext';
import InboxSidebar from '@/Components/InboxSidebar/InboxSidebar';
import { MailReader } from '@/Components/MailReader/MailReader';

if (typeof window !== 'undefined' && typeof window.DOMMatrix === 'undefined') {
    window.DOMMatrix = class DOMMatrix {};
}

// Mock de Axios
vi.mock('axios');

// Mock Ziggy route helper
window.route = () => ({
    current: () => 'inbox'
});

// Mock de @inertiajs/react
vi.mock('@inertiajs/react', () => ({
    usePage: () => ({
        props: {
            auth: {
                user: { id: 1, name: 'Admin User', roles: [{ name: 'Admin' }] },
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

// Datos de prueba (PQR con diferentes estados y tiempos)
const mockMailCards = [
    {
        id: 101,
        sender_name: "Juan Perez",
        affair: "Petición a tiempo",
        description: "Esta petición tiene mucho tiempo.",
        request_type: "Peticion",
        user_id: 10,
        dependency_id: 1,
        sheet_number_id: 1,
        // Creada hace 1 día
        created_at: new Date(Date.now() - 86400000).toISOString(),
        // Límite en 10 días (Verde)
        response_time: new Date(Date.now() + 10 * 86400000).toISOString(),
    },
    {
        id: 102,
        sender_name: "Maria Lopez",
        affair: "Queja proxima a vencer",
        description: "Esta queja casi se vence.",
        request_type: "Queja",
        user_id: 12,
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        // Límite en 3 días (Amarillo/Naranja) (>40% y <80% tiempo restante)
        response_time: new Date(Date.now() + 3 * 86400000).toISOString(),
    },
    {
        id: 103,
        sender_name: "Carlos Vargas",
        affair: "Reclamo vencido",
        description: "Esto ya está vencido hace varios días.",
        request_type: "Reclamo",
        user_id: 5,
        created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
        // Límite fue hace 2 días (Rojo)
        response_time: new Date(Date.now() - 2 * 86400000).toISOString(),
    }
];

// Helper para renderizar los componentes dentro del contexto falso
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

describe('Dashboard Inbox Tests (Frontend)', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it(' Render of the interface of the Sidebar and empty screen', () => {
        renderWithMailContext(
            <>
                <InboxSidebar />
                <MailReader />
            </>
        );

        // Sidebar Elements
        expect(screen.getByText('Bandeja de Entrada')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Buscar por asunto, id o descripción...')).toBeInTheDocument();
        
        // Chips (Categorías)
        expect(screen.getByLabelText('Peticiones')).toBeInTheDocument();
        expect(screen.getByLabelText('Quejas')).toBeInTheDocument();
        expect(screen.getByLabelText('Reclamos')).toBeInTheDocument();

        // Lista de Tarjetas (InboxMailCard renders affairs)
        expect(screen.getByText('Petición a tiempo')).toBeInTheDocument();
        expect(screen.getByText('Queja proxima a vencer')).toBeInTheDocument();
        expect(screen.getByText('Reclamo vencido')).toBeInTheDocument();

        // El lector (MailReader) por defecto está vacío -> Muestra la imagen '/images/OBJECTS.svg'
        const placeholderImg = screen.getByAltText('');
        expect(placeholderImg).toHaveAttribute('src', '/images/OBJECTS.svg');
    });

    it(' Filtering and Searching: Input text updates and toggle filters', () => {
        const setSearchTermMock = vi.fn();
        const toggleFilterMock = vi.fn();
        
        renderWithMailContext(<InboxSidebar />, {
            setSearchTerm: setSearchTermMock,
            toggleFilter: toggleFilterMock
        });

        const searchInput = screen.getByPlaceholderText('Buscar por asunto, id o descripción...');
        fireEvent.change(searchInput, { target: { value: 'prueba' } });
        expect(setSearchTermMock).toHaveBeenCalledWith('prueba');

        const peticionChip = screen.getByLabelText('Peticiones');
        fireEvent.click(peticionChip);
        expect(toggleFilterMock).toHaveBeenCalledWith('Peticion');
    });

    it(' Active Selection of PQR', () => {
        const setSelectedMailMock = vi.fn();
        
        // Renderizamos con 1 seleccionado
        const { rerender } = renderWithMailContext(
            <>
                <InboxSidebar />
                <MailReader />
            </>,
            {
                setSelectedMail: setSelectedMailMock,
                // Simulamos que el usuario seleccionó la 101, por lo que selectedMail: 101
                selectedMail: 101
            }
        );

        // MailReader debe mostrar el affair de la 101 ("Petición a tiempo") en lugar del placeholder
        expect(screen.getAllByText('Petición a tiempo').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Esta petición tiene mucho tiempo.').length).toBeGreaterThan(0);
        expect(screen.getAllByText('ID: 101').length).toBeGreaterThan(0);
        
        // Hacer click en la tarjeta de Queja en el Sidebar
        const quejaCard = screen.getByText('Queja proxima a vencer').closest('div');
        fireEvent.click(quejaCard);
        
        // Comprobar que hizo dispatch a ID 102
        expect(setSelectedMailMock).toHaveBeenCalledWith(102);
    });

    it('colors of deadline dates according to expiration', () => {
        // En InboxMailCard y MailReader se usa `getDeadlineColor`.
        // Renderizamos ambos visualizando el estado de fecha límite.
        renderWithMailContext(
            <>
                <InboxSidebar />
                <MailReader />
            </>,
            { selectedMail: 103 } // Seleccionamos Reclamo Vencido
        );

        // En la lista o detalles, la 103 está vencida, por la lógica (remaining % < 0 => text-red-600)
        // Y el texto es literalmente "Vencida" si ya se pasó (new Date() > response_time)
        const vencidaElements = screen.getAllByText('Vencida');
        expect(vencidaElements.length).toBeGreaterThan(0);
        
        // Buscamos las clases de color mapeadas en las fechas o estados
        // React Testing Library permite buscar por DOM Node.
        // O más fácil: validar que tengan las clases 'text-red-600', 'text-[#F0DA30]' o 'text-primary'
        const quejaCardDateContainer = screen.getByText('Queja proxima a vencer').parentNode.parentNode.querySelector('.text-\\[\\#F0DA30\\]');
        // El selector es complejo porque la clase exacta es text-[#F0DA30]. 
        // Alternativa: 
        const warnText = document.querySelector('.text-\\[\\#F0DA30\\]');
        expect(warnText).not.toBeNull(); 

        const primaryText = document.querySelector('.text-primary.font-medium');
        expect(primaryText).not.toBeNull(); // El texto en tiempo (Petición)
    });

    it(' Archive functionality sends patch with Axios', async () => {
        const setMailCardsMock = vi.fn();
        const setSelectedMailMock = vi.fn();

        // Mockear axios patch success
        axios.patch.mockResolvedValueOnce({ data: { message: "Archivada" } });

        renderWithMailContext(<MailReader />, {
            selectedMail: 101,
            isArchiveView: false,
            setMailCards: setMailCardsMock,
            setSelectedMail: setSelectedMailMock
        });

        // Encontrar botón "Archivar"
        const archiveBtn = screen.getByRole('button', { name: /Archivar/i });
        fireEvent.click(archiveBtn);

        // Debe haber llamado axios.patch para el currentMail.id (101)
        await waitFor(() => {
            expect(axios.patch).toHaveBeenCalledWith('/api/pqrs/101', {
                archived: true
            });
            // Una vez exitoso, debe haber despachado setSelectedMail(null) 
            expect(setSelectedMailMock).toHaveBeenCalledWith(null);
        });
    });
});
