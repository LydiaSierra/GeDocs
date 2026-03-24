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
                user: { id: 3, name: 'Apprentice User', email: 'apprentice@test.com', roles: [{ name: 'Aprendiz' }] },
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


describe('Profile and Menu Tests - Apprentice (Frontend)', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Apprentice Profile Settings: does NOT render Delete Account form, but renders Edit forms', () => {
        const mockContext = { setContent: vi.fn(), notifications: [] };
        render(
            <UserContext.Provider value={mockContext}>
                <ProfileSettingsPage mustVerifyEmail={false} status={null} />
            </UserContext.Provider>
        );
        
        // Apprentice SHOULD NOT see Delete Account section
        expect(screen.queryByText('Eliminar Cuenta')).not.toBeInTheDocument();
        
        // Edit sections are visible
        expect(screen.getByRole('heading', { name: 'Información de Perfil' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Cambiar Contraseña' })).toBeInTheDocument();
    });

    it('Apprentice Hamburguer Menu: renders ONLY Dependencies and Profile info', () => {
        const mockContext = { setContent: vi.fn() };
        render(
            <UserContext.Provider value={mockContext}>
                <HamburguerMenu />
            </UserContext.Provider>
        );

        // Can see allowed options
        expect(screen.getByText('Dependencias')).toBeInTheDocument();
        expect(screen.getByText('Informacion de Perfil')).toBeInTheDocument();

        // CANNOT see forbidden management options
        expect(screen.queryByText('Instructores')).not.toBeInTheDocument();
        expect(screen.queryByText('Aprendices')).not.toBeInTheDocument();
        expect(screen.queryByText('Fichas')).not.toBeInTheDocument();
    });
});
