import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import api from '@/lib/axios';
import ArchiveTable from '@/Components/ArchiveTable/ArchiveTable';

if (typeof window !== 'undefined' && typeof window.DOMMatrix === 'undefined') {
    window.DOMMatrix = class DOMMatrix {};
}

vi.mock('axios');
vi.mock('@/lib/axios', () => ({
    default: { get: vi.fn() }
}));

window.route = () => ({
    current: () => 'archive'
});

vi.mock('@inertiajs/react', () => ({
    usePage: () => ({
        props: {
            auth: {
                user: { id: 1, name: 'Admin User', roles: [{ name: 'Admin' }] },
            },
            sheets: [
                { id: 1, number: '123456', dependencies: [{id: 1, name: 'Dep 1'}] }
            ]
        },
    }),
}));

const mockMails = [
    {
        id: 101,
        sender_name: "Juan Admin",
        affair: "Petición Archivada Admin",
        description: "Desc Admin",
        request_type: "Peticion",
        response_status: "Finalizado",
        created_at: new Date().toISOString(),
    }
];

describe('Archive Module Tests - Admin (Frontend)', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
        api.get.mockResolvedValue({ data: { data: mockMails } });
        axios.patch.mockResolvedValue({ data: { message: "Desarchivado" } });
    });

    it('Renders table and Select option', async () => {
        render(<ArchiveTable />);
        
        await waitFor(() => {
            expect(screen.getByText('Petición Archivada Admin')).toBeInTheDocument();
        });

        expect(screen.getByText('Ficha y/o dependencia')).toBeInTheDocument();

        expect(screen.getByText('Juan Admin')).toBeInTheDocument();
        expect(screen.getByText('Finalizado')).toBeInTheDocument();
    });

    it('Opens modal on row click', async () => {
        render(<ArchiveTable />);
        
        await waitFor(() => {
            expect(screen.getByText('Petición Archivada Admin')).toBeInTheDocument();
        });

        const row = screen.getByText('Petición Archivada Admin').closest('tr');
        fireEvent.click(row);

        expect(screen.getByText('PQR #101')).toBeInTheDocument();
        expect(screen.getByText('Desc Admin')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Desarchivar/i })).toBeInTheDocument();
    });

    it('Unarchives mail correctly', async () => {
        render(<ArchiveTable />);
        
        await waitFor(() => {
            expect(screen.getByText('Petición Archivada Admin')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Petición Archivada Admin').closest('tr'));

        const unarchiveBtn = screen.getByRole('button', { name: /Desarchivar/i });
        fireEvent.click(unarchiveBtn);

        await waitFor(() => {
            expect(axios.patch).toHaveBeenCalledWith('/api/pqrs/101', { archived: false });
        });

        expect(screen.queryByText('Petición Archivada Admin')).not.toBeInTheDocument();
    });
});
