import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '@/lib/axios';
import ArchiveTable from '@/Components/ArchiveTable/ArchiveTable';

if (typeof window !== 'undefined' && typeof window.DOMMatrix === 'undefined') {
    window.DOMMatrix = class DOMMatrix {};
}

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
    });

    it('Renders table and DOES NOT show the sheet Select option', async () => {
        render(<ArchiveTable />);
        
        await waitFor(() => {
            expect(screen.getByText('Petición Archivada Aprendiz')).toBeInTheDocument();
        });

        expect(screen.queryByText('Ficha y/o dependencia')).not.toBeInTheDocument();

        expect(screen.getByText('Pedro Apprentice')).toBeInTheDocument();
        expect(screen.queryByText('Estado')).not.toBeInTheDocument();
    });

    it('Opens modal on row click', async () => {
        render(<ArchiveTable />);
        
        await waitFor(() => {
            expect(screen.getByText('Petición Archivada Aprendiz')).toBeInTheDocument();
        });

        const row = screen.getByText('Petición Archivada Aprendiz').closest('tr');
        fireEvent.click(row);

        expect(screen.getByText('PQR #103')).toBeInTheDocument();
        expect(screen.getByText('Desc Aprendiz')).toBeInTheDocument();
    });

    it('Shows read-only modal content', async () => {
        render(<ArchiveTable />);
        
        await waitFor(() => {
            expect(screen.getByText('Petición Archivada Aprendiz')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Petición Archivada Aprendiz').closest('tr'));

        expect(screen.getByText(/Fecha límite:/i)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Desarchivar/i })).not.toBeInTheDocument();
    });
});
