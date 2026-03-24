import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProfileSettingsPage from '@/Pages/Profile/ProfileSettingsPage';
import HamburguerMenu from '@/Components/HamburguerMenu/HamburguerMenu';
import { UserContext } from '@/context/UserContext/UserContext';

if (typeof window !== 'undefined' && typeof window.DOMMatrix === 'undefined') {
    window.DOMMatrix = class DOMMatrix {};
}

// Mocks
window.route = (name) => `/${name}`;

vi.mock('@inertiajs/react', () => ({
    usePage: () => ({
        url: '/current-url',
        props: {
            auth: {
                user: { id: 1, name: 'Admin User', email: 'admin@test.com', roles: [{ name: 'Admin' }] },
            },
        },
    }),
    useForm: () => ({
        data: { password: '', name: '', email: '' },
        setData: vi.fn(),
        delete: vi.fn(),
        patch: vi.fn(),
        processing: false,
        reset: vi.fn(),
        errors: {},
        clearErrors: vi.fn(),
        recentlySuccessful: false,
    }),
    Link: ({ children, href }) => <a href={href}>{children}</a>,
}));

// Mock ProfileSummaryCard specifically since we only test the presence of forms here
vi.mock('@/Components/Profile/ProfileSummaryCard', () => ({
    default: () => <div data-testid="profile-summary">Summary Card</div>
}));

vi.mock('@/Layouts/SettingsLayout', () => ({
    default: ({ children }) => <div data-testid="settings-layout">{children}</div>
}));


describe('Profile and Menu Tests - Admin (Frontend)', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Admin Profile Settings: renders Delete Account form and Edit forms', () => {
        const mockContext = { setContent: vi.fn(), notifications: [] };
        render(
            <UserContext.Provider value={mockContext}>
                <ProfileSettingsPage mustVerifyEmail={false} status={null} />
            </UserContext.Provider>
        );
        
        // Admin SHOULD see Delete Account section
        expect(screen.getByText('Eliminar Cuenta')).toBeInTheDocument();
        
        // Edit sections are visible
        expect(screen.getByRole('heading', { name: 'Información de Perfil' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Cambiar Contraseña' })).toBeInTheDocument();
    });

    it('Admin Hamburguer Menu: renders Instructors, Apprentices and Sheets', () => {
        const mockContext = { setContent: vi.fn() };
        render(
            <UserContext.Provider value={mockContext}>
                <HamburguerMenu />
            </UserContext.Provider>
        );

        // Can see all management options
        expect(screen.getByText('Instructores')).toBeInTheDocument();
        expect(screen.getByText('Aprendices')).toBeInTheDocument();
        expect(screen.getByText('Fichas')).toBeInTheDocument();
        expect(screen.getByText('Dependencias')).toBeInTheDocument();
    });
});
