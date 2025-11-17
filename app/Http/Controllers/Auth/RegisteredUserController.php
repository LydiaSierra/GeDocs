<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TechnicalSheet;
use App\Notifications\NewUserRegistered;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class RegisteredUserController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type_document' => 'required|string|max:50',
            'document_number' => 'required|string|max:50|unique:users,document_number',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'role' => 'required|string|in:Aprendiz,Instructor',
            'technical_sheet_id' => 'nullable|exists:technical_sheets,id',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Crear usuario
        $user = User::create([
            'type_document' => $validated['type_document'],
            'document_number' => $validated['document_number'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'technical_sheet_id' => $validated['technical_sheet_id'] ?? null,
            'status' => 'pendiente',
            'password' => Hash::make($validated['password']),
        ]);

        event(new Registered($user));

        auth()->login($user);

        if ($user->role === "Instructor") {
            $admin = User::where('role', 'admin')->first();
            if ($admin) {
                $admin->notify(new NewUserRegistered($user));
            }
        }

        return redirect("/");
    }
}
