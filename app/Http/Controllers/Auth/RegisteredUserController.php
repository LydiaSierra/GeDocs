<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Sheet_number;
use App\Models\User;
use App\Models\TechnicalSheet;
use App\Notifications\NewUserRegistered;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class RegisteredUserController extends Controller
{
    public function create()
    {
        $sheets = Sheet_number::all();
        return Inertia::render('Auth/Register', [
            'sheets' => $sheets
        ]);
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
            'status' => "pending",
            'technical_sheet_id' => $validated['technical_sheet_id'] ?? null,
            'password' => Hash::make($validated['password']),
        ]);

        event(new Registered($user));


        $user->assignRole($validated['role']);

        if ($user->hasRole('Instructor')) {
            $admin = User::role("Admin")->first();
            if($admin){
                $admin->notify(new NewUserRegistered($user));
            }
            if ($user->status === "pending") {
                Auth::logout();
                return redirect()->route('login')->with('pending', [
                    'message' => "Instructor. Tu cuenta sera revisada por el administrador",
                ]);
            }
        }


        auth()->login($user);

        return redirect("/");
    }
}
