import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import Login from '@/Pages/Auth/Login';
import { toast } from 'sonner';
import { useForm } from '@inertiajs/react';

// Mock de ziggy-js route
global.route = vi.fn((name) => `/${name}`);

// Mock de sonner
vi.mock('sonner', () => ({
    toast: {
        error: vi.fn(),
        loading: vi.fn(),
        dismiss: vi.fn(),
        info: vi.fn(),
    }
}));

// Mock de @inertiajs/react
vi.mock('@inertiajs/react', () => ({
    Head: () => null,
    Link: ({ children }) => <a href="#">{children}</a>,
    useForm: vi.fn(),
    usePage: vi.fn(() => ({ props: {} })),
    router: {
        post: vi.fn(),
    }
}));

// Mock de GuestLayout
vi.mock('@/Layouts/GuestLayout', () => ({
    default: ({ children }) => <div>{children}</div>
}));

describe('Pruebas del Frontend de Login', () => {
    let mockData, mockSetData, mockPost, mockReset;

    beforeAll(() => {
        // jsdom/happy-dom no soportan los métodos de dialog por defecto
        HTMLDialogElement.prototype.showModal = vi.fn();
        HTMLDialogElement.prototype.close = vi.fn();
    });

    beforeEach(() => {
        vi.clearAllMocks();
        
        mockData = {
            email: "",
            password: "",
            remember: false,
        };

        mockSetData = vi.fn((key, value) => {
            mockData[key] = value;
        });

        // Hacemos que post ejecute automáticamente opciones para poder probar callbacks si quisiéramos
        mockPost = vi.fn((routeName, options) => {
            if (options && options.onStart) options.onStart();
            // No llamamos onSuccess/onError automáticamente para que cada prueba decida
        });
        
        mockReset = vi.fn();

        useForm.mockReturnValue({
            data: mockData,
            setData: mockSetData,
            post: mockPost,
            processing: false,
            errors: {},
            reset: mockReset,
        });
    });

    it('renders all initial login form fields and buttons', () => {
        render(<Login status="" canResetPassword={true} />);
        
        expect(screen.getByLabelText(/^Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Iniciar Sesion/i })).toBeInTheDocument();
        expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument();
    });

    it('throws frontend validation toast when submitted with empty fields', () => {
        render(<Login status="" canResetPassword={true} />);
        
        const btn = screen.getByRole('button', { name: /Iniciar Sesion/i });
        fireEvent.click(btn);

        // Como los campos están vacíos (definidos en mockData al inicio), aborta y muestra toast
        expect(toast.error).toHaveBeenCalledWith("Por favor complete todos los campos");
        expect(mockPost).not.toHaveBeenCalled();
    });

    it('displays backend errors when passed through useForm errors', () => {
        // Simulamos que el backend ya respondió con errores (el componente los toma de errors)
        useForm.mockReturnValue({
            data: { email: "usuario@test.com", password: "password", remember: false },
            setData: mockSetData,
            post: mockPost,
            processing: false,
            errors: {
                email: "Estas credenciales no coinciden con nuestros registros.",
            },
            reset: mockReset,
        });

        render(<Login status="" canResetPassword={true} />);
        
        // Verifica que el error se imprima en el formulario (InputError). 
        // Usamos getAllByText porque el mock globally shared lo renderiza tanto en Login como en PasswordResetModal.
        expect(screen.getAllByText("Estas credenciales no coinciden con nuestros registros.")[0]).toBeInTheDocument();
    });

    it('shows toast error on bad credentials via onError callback in post', () => {
        // Llenamos los datos para pasar la validación inicial
        mockData.email = "test@test.com";
        mockData.password = "wrong";

        // Simulamos que al postear, la ruta llama a onError
        mockPost.mockImplementation((url, options) => {
            if (options && options.onError) {
                options.onError({ email: "error falso" });
            }
        });

        render(<Login status="" canResetPassword={true} />);
        
        const btn = screen.getByRole('button', { name: /Iniciar Sesion/i });
        fireEvent.click(btn);

        // Debería mostrar el toast error "Correo o contraseña incorrectos" manejado en el onError
        expect(toast.error).toHaveBeenCalledWith("Correo o contraseña incorrectos");
    });

    it('triggers the password recovery function and calls password.email', () => {
        // useForm para el Login form y Modal form es compartido en nuestro Mock básico,
        // esto está bien para una prueba aislada
        
        render(<Login status="" canResetPassword={true} />);
        
        // Abrir el modal
        const recoveryLink = screen.getByText('¿Olvidaste tu contraseña?');
        fireEvent.click(recoveryLink);
        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();

        // Buscar el input de correo dentro del modal
        const emailInput = screen.getByPlaceholderText('Ingresa tu correo');
        fireEvent.change(emailInput, { target: { value: 'apprentice@test.com' } });

        // Simular que mockData se actualizó (ya que usamos el mismo mockData)
        mockData.email = 'apprentice@test.com';

        // Evitamos fireEvent.click en el botón porque forms method="dialog" a veces no lo autodisparan en jsdom
        const modalForm = emailInput.closest('form');
        fireEvent.submit(modalForm);

        // Debería postear a la ruta mockeada de password.email, que es /password.email
        expect(mockPost).toHaveBeenCalledWith('/password.email', expect.any(Object));
    });

    it('shows info toast when apprentice is not yet approved by instructor', () => {
        const statusMsg = "Espera a que el instructor de la ficha que selecionaste te de aceptacion para ingresar al sistema";
        
        // Al recibir la redirección del backend, Inertia pasa el mensaje en la prop 'status'
        render(<Login status={statusMsg} canResetPassword={true} />);
        
        // El componente Login a través de su useEffect llama a toast.info
        expect(toast.info).toHaveBeenCalledWith(statusMsg);
    });

    it('successfully posts to the login route and expects redirect to dashboard (/)', async () => {
            // Llenamos los datos para un login exitoso
            mockData.email = "apprentice@test.com";
            mockData.password = "password123";
    
            // Simulamos el post exitoso
            mockPost.mockImplementation((url, options) => {
                if (options && options.onStart) options.onStart();
                if (options && options.onSuccess) options.onSuccess();
                if (options && options.onFinish) options.onFinish();
            });
    
            render(<Login status="" canResetPassword={true} />);
            
            const btn = screen.getByRole('button', { name: /Iniciar Sesion/i });
            fireEvent.click(btn);
    
            // Verificamos que se llame a post con la ruta que el backend redirige a '/'
            expect(mockPost).toHaveBeenCalledWith('/login', expect.any(Object));
        });
});
