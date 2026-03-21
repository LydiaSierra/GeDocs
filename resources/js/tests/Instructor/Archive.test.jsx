import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import api from '@/lib/axios';
import ArchiveTable from '@/Components/ArchiveTable/ArchiveTable';

if (typeof window !== 'undefined' && typeof window.DOMMatrix === 'undefined') {
    window.DOMMatrix = class DOMMatrix {};
}

// Mocks
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
                user: { id: 2, name: 'Instructor User', roles: [{ name: 'Instructor' }] },
            },
            sheets: [
                { id: 1, number: '123456', dependencies: [{id: 1, name: 'Dep 1'}] }
            ]
        },
    }),
}));

const mockMails = [
    {
        id: 102,
        sender_name: "Ana Instructor",
        affair: "Petición Archivada Instructor",
        description: "Desc Instructor",
        request_type: "Peticion",
        response_status: "Finalizado",
        created_at: new Date().toISOString(),
    }
];

describe('Archive Module Tests - Instructor (Frontend)', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
        api.get.mockResolvedValue({ data: { data: mockMails } });
        axios.patch.mockResolvedValue({ data: { message: "Desarchivado" } });
    });

    it('Renders table and Select option', async () => {
        render(<ArchiveTable />);
        
        await waitFor(() => {
            expect(screen.getByText('Petición Archivada Instructor')).toBeInTheDocument();
        });

        // Instructor should see the select button
        expect(screen.getByText('Ficha y/o dependencia')).toBeInTheDocument();
        
        // Check rows
        expect(screen.getByText('Ana Instructor')).toBeInTheDocument();
    });

    it('Opens modal on row click', async () => {
        render(<ArchiveTable />);
        
        await waitFor(() => {
            expect(screen.getByText('Petición Archivada Instructor')).toBeInTheDocument();
        });

        // Click the row
        const row = screen.getByText('Petición Archivada Instructor').closest('tr');
        fireEvent.click(row);

        // Modal should appear
        expect(screen.getByText('PQR #102')).toBeInTheDocument();
        expect(screen.getByText('Desc Instructor')).toBeInTheDocument();
    });

    it('Unarchives mail correctly', async () => {
        render(<ArchiveTable />);
        
        await waitFor(() => {
            expect(screen.getByText('Petición Archivada Instructor')).toBeInTheDocument();
        });

        // Click row
        fireEvent.click(screen.getByText('Petición Archivada Instructor').closest('tr'));

        // Click Desarchivar
        const unarchiveBtn = screen.getByRole('button', { name: /Desarchivar/i });
        fireEvent.click(unarchiveBtn);

        await waitFor(() => {
            expect(axios.patch).toHaveBeenCalledWith('/api/pqrs/102', { archived: false });
        });

        expect(screen.queryByText('Petición Archivada Instructor')).not.toBeInTheDocument();
    });
});
