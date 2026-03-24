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
                user: { id: 3, name: 'Apprentice User', roles: [{ name: 'Aprendiz' }], dependency_id: 1 },
            },
            sheets: [
                { id: 1, number: '123456', dependencies: [{id: 1, name: 'Dep 1'}] }
            ]
        },
    }),
}));

const mockMails = [
    {
        id: 103,
        sender_name: "Pedro Apprentice",
        affair: "Petición Archivada Aprendiz",
        description: "Desc Aprendiz",
        request_type: "Peticion",
        response_status: "Finalizado",
        dependency_id: 1,
        created_at: new Date().toISOString(),
    }
];

describe('Archive Module Tests - Apprentice (Frontend)', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
        api.get.mockResolvedValue({ data: { data: mockMails } });
        axios.patch.mockResolvedValue({ data: { message: "Desarchivado" } });
    });

    it('Renders table and DOES NOT show the sheet Select option', async () => {
        render(<ArchiveTable />);
        
        await waitFor(() => {
            expect(screen.getByText('Petición Archivada Aprendiz')).toBeInTheDocument();
        });

        // Apprentice SHOULD NOT see the select button
        expect(screen.queryByText('Ficha y/o dependencia')).not.toBeInTheDocument();
        
        // Check rows
        expect(screen.getByText('Pedro Apprentice')).toBeInTheDocument();
    });

    it('Opens modal on row click', async () => {
        render(<ArchiveTable />);
        
        await waitFor(() => {
            expect(screen.getByText('Petición Archivada Aprendiz')).toBeInTheDocument();
        });

        // Click the row
        const row = screen.getByText('Petición Archivada Aprendiz').closest('tr');
        fireEvent.click(row);

        // Modal should appear
        expect(screen.getByText('PQR #103')).toBeInTheDocument();
        expect(screen.getByText('Desc Aprendiz')).toBeInTheDocument();
    });

    it('Unarchives mail correctly', async () => {
        render(<ArchiveTable />);
        
        await waitFor(() => {
            expect(screen.getByText('Petición Archivada Aprendiz')).toBeInTheDocument();
        });

        // Click row
        fireEvent.click(screen.getByText('Petición Archivada Aprendiz').closest('tr'));

        // Click Desarchivar
        const unarchiveBtn = screen.getByRole('button', { name: /Desarchivar/i });
        fireEvent.click(unarchiveBtn);

        await waitFor(() => {
            expect(axios.patch).toHaveBeenCalledWith('/api/pqrs/103', { archived: false });
        });

        expect(screen.queryByText('Petición Archivada Aprendiz')).not.toBeInTheDocument();
    });
});
