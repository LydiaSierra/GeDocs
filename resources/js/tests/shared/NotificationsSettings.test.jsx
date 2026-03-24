import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { NotificationsProvider } from '@/context/Notifications/NotificationsContext';
import NotificationsSettingsSection from '@/Components/Notifications/NotificationsSettingsSection';

if (typeof window !== 'undefined' && typeof window.DOMMatrix === 'undefined') {
    window.DOMMatrix = class DOMMatrix {};
}

// Mocks
vi.mock('axios', () => {
    return {
        default: {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            delete: vi.fn()
        }
    };
});

import api from '@/lib/axios'; // Since NotificationsContext uses api from "@/lib/axios"
vi.mock('@/lib/axios', () => {
    return {
        default: {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            delete: vi.fn()
        }
    };
});

let mockUserRole = 'Admin';
vi.mock('@inertiajs/react', () => ({
    usePage: () => ({
        props: {
            auth: {
                user: { id: 1, name: 'Admin', roles: [{ name: mockUserRole }] }
            }
        }
    })
}));

vi.mock('sonner', () => ({
    toast: {
        loading: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
        dismiss: vi.fn()
    }
}));

const mockNotifications = [
    {
        id: "1",
        type: "App\\Notifications\\NewUserRegistered",
        data: {
            role: "Instructor",
            user: {
                id: 10,
                name: "Instructor Activo",
                email: "inst@test.com",
                type_document: "CC",
                document_number: "123456",
                roles: [{ name: "Instructor" }],
                status: "active"
            }
        },
        read_at: new Date().toISOString(), // Leído
        created_at: new Date().toISOString()
    },
    {
        id: "2",
        type: "App\\Notifications\\NewUserRegistered",
        data: {
            role: "Instructor",
            user: {
                id: 11,
                name: "Instructor Reachazado",
                email: "inst2@test.com",
                type_document: "CC",
                document_number: "654321",
                roles: [{ name: "Instructor" }],
                status: "rejected"
            }
        },
        read_at: null, // Sin leer
        created_at: new Date().toISOString()
    },
    {
        id: "3",
        type: "App\\Notifications\\NewUserRegistered",
        data: {
            role: "Aprendiz",
            user: {
                id: 12,
                name: "Aprendiz Pendiente",
                email: "apr3@test.com",
                type_document: "CC",
                document_number: "11111",
                roles: [{ name: "Aprendiz" }],
                status: "pending"
            }
        },
        read_at: null,
        created_at: new Date().toISOString()
    }
];

import { useContext, useEffect } from 'react';
import { NotificationsContext } from '@/context/Notifications/NotificationsContext';

const TestWrapper = () => {
    const { fetchNotifications } = useContext(NotificationsContext);
    useEffect(() => {
        fetchNotifications();
    }, []);
    return <NotificationsSettingsSection />;
};

const renderComponent = () => {
    return render(
        <NotificationsProvider>
            <TestWrapper />
        </NotificationsProvider>
    );
};

describe('Notifications Frontend Tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        // default response for fetch
        api.get.mockResolvedValue({
            data: { success: true, notifications: mockNotifications }
        });
        mockUserRole = 'Admin';
    });

    it('Render complete lists for Admin (Solo ve instructores)', async () => {
        mockUserRole = 'Admin';
        renderComponent();
        
        await waitFor(() => {
            expect(screen.getByText('Instructor Activo')).toBeInTheDocument();
            expect(screen.getByText('Instructor Reachazado')).toBeInTheDocument();
        });
        
        // Admin shouldn't see Aprendiz
        expect(screen.queryByText('Aprendiz Pendiente')).not.toBeInTheDocument();
    });

    it('Render complete lists for Instructor (Solo ve aprendices)', async () => {
        mockUserRole = 'Instructor';
        renderComponent();
        
        await waitFor(() => {
            expect(screen.getByText('Aprendiz Pendiente')).toBeInTheDocument();
        });
        
        // Instructor shouldn't see Instructors
        expect(screen.queryByText('Instructor Activo')).not.toBeInTheDocument();
    });

    it('Verify styling/colors based on notification status (read, unread, active, rejected, pending)', async () => {
        mockUserRole = 'Admin';
        renderComponent();
        
        await waitFor(() => {
            // Aceptada
            const spanAceptada = screen.getByText('Aceptada');
            expect(spanAceptada).toHaveClass('bg-green-50 text-green-600');
            
            // Rechazada
            const spanRechazada = screen.getByText('Rechazada');
            expect(spanRechazada).toHaveClass('bg-red-50 text-red-500');
        });
    });

    it('Verify Details Card visibility when notification is clicked', async () => {
        mockUserRole = 'Admin';
        renderComponent();
        
        // Esperamos a que cargue
        await waitFor(() => expect(screen.getByText('Instructor Reachazado')).toBeInTheDocument());

        // Hacemos click en un item (el Rechazado) id 2 está sin leer, llamará a markAsRead
        api.post.mockResolvedValueOnce({ data: { success: true } });
        
        const listItem = screen.getByText('Instructor Reachazado').closest('li');
        fireEvent.click(listItem);

        // Aparece la tarjeta detallada de Solicitud de Acceso
        await waitFor(() => {
            expect(screen.getByText('Solicitud de Acceso')).toBeInTheDocument();
            expect(screen.getByText('Usuario rechazado')).toBeInTheDocument(); // detail card rejection text
        });
    });

    it('Verify Accept functionality triggers PUT endpoint', async () => {
        mockUserRole = 'Instructor'; // El id 3 es pendiente (Aprendiz)
        api.put.mockResolvedValueOnce({ data: { success: true } });
        renderComponent();
        
        // Esperar fetch
        await waitFor(() => expect(screen.getByText('Aprendiz Pendiente')).toBeInTheDocument());
        
        // Click en la notificacion de pendiente
        api.post.mockResolvedValueOnce({ data: { success: true } }); // para mark-as-read
        fireEvent.click(screen.getByText('Aprendiz Pendiente').closest('li'));

        // El card se muestra
        await waitFor(() => expect(screen.getByText('Solicitud de Acceso')).toBeInTheDocument());

        // Clic en Aceptar
        const acceptBtn = screen.getByRole('button', { name: /Aceptar/i });
        fireEvent.click(acceptBtn);

        await waitFor(() => {
            expect(api.put).toHaveBeenCalledWith('/api/notifications/update/3/active');
        });
    });

    it('Verify Reject functionality triggers DELETE endpoint', async () => {
        mockUserRole = 'Instructor'; // El id 3 es pendiente
        api.delete.mockResolvedValueOnce({ data: { success: true } });
        renderComponent();
        
        await waitFor(() => expect(screen.getByText('Aprendiz Pendiente')).toBeInTheDocument());
        
        api.post.mockResolvedValueOnce({ data: { success: true } });
        fireEvent.click(screen.getByText('Aprendiz Pendiente').closest('li'));

        await waitFor(() => expect(screen.getByText('Solicitud de Acceso')).toBeInTheDocument());

        // Clic en Rechazar
        const rejectBtn = screen.getByRole('button', { name: /Rechazar/i });
        fireEvent.click(rejectBtn);

        await waitFor(() => {
            // El userId es 12
            expect(api.delete).toHaveBeenCalledWith('/api/users/12');
        });
    });

    it('Verify Refresh fetch button functionality', async () => {
        mockUserRole = 'Admin';
        renderComponent();
        
        await waitFor(() => {
            expect(screen.getByText('Instructor Activo')).toBeInTheDocument();
        });

        // Limpiar mocks para que sea facil contar llamadas
        vi.clearAllMocks();
        api.get.mockResolvedValue({
            data: { success: true, notifications: mockNotifications }
        });

        const refreshBtn = screen.getByTitle('Refrescar notificaciones');
        fireEvent.click(refreshBtn);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('/api/notifications');
        });
    });
});
