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
        $sheets = Sheet_number::whereHas('users', function ($q) {
            $q->whereHas('roles', function ($r) {
                $r->where('name', 'Instructor');
            });
        })->get();
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
            'technical_sheet_id' => 'nullable|exists:sheet_numbers,id',
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

        if (!empty($validated['technical_sheet_id'])) {
            $user->sheetNumbers()->attach($validated['technical_sheet_id']);
        }

        if ($user->hasRole('Instructor')) {
            $admin = User::role("Admin")->first();
            if ($admin) {
                $admin->notify(new NewUserRegistered($user));
            }
            if ($user->status === "pending") {
                Auth::logout();
                return redirect()->route('login')->with(["status" => "Instructor. Tu cuenta sera revisada por el administrador"]);
            }
        }

        if ($user->hasRole('Aprendiz')) {
            if (!empty($validated['technical_sheet_id'])) {
                $instructors = User::role('Instructor')->whereHas('sheetNumbers', function ($q) use ($validated) {
                    $q->where('sheet_numbers.id', $validated['technical_sheet_id']);
                })->get();

                foreach ($instructors as $instructor) {
                    $instructor->notify(new NewUserRegistered($user));
                }
            } else {
                $instructor = User::role("Instructor")->first();
                if ($instructor) {
                    $instructor->notify(new NewUserRegistered($user));
                }
            }

            if ($user->status === "pending") {
                Auth::logout();
                return redirect()->route('login')->with(["status" => "Aprendiz. Tu cuenta sera revisada por el instructor de la ficha que seleccionaste"]);

            }
        }


        auth()->login($user);

        return redirect("/");
    }
}