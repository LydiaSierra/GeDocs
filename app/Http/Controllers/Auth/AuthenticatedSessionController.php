<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;
use App\Models\User;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse|JsonResponse
    {
        $request->authenticate();

         /** @var \Illuminate\Http\Request $request */

        //Detectar si es peticion API
        if ($request->expectsJson() || $request->is('api/*')) {
             $user = User::where('email', $request->input('email'))->first();

             // Validar que el usuario existe
            if (!$user) {
                return response()->json([
                    'message' => 'Usuario no encontrado'
                ], 404);
            }

            // Crear token de Sanctum
            $token = $user->createToken('api-token')->plainTextToken;

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role_id' => $user->role_id
                ],
                'token' => $token,
                'message' => 'Login exitoso'
            ], 200);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('inbox'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
