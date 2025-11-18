<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::with('roles');

        // Filtro por número de documento
        if ($request->has('document_number') && $request->document_number !== '') {
            $query->where('document_number', 'LIKE', "%{$request->document_number}%");
        }


        $users = $query->get();
        return response()->json(["success" => true, "data" => $users]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type_document' => 'required|string|max:50',
            'document_number' => 'required|string|max:50|unique:users,document_number',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'role' => 'nullable|string|in:Aprendiz,Instructor',
            'technical_sheet_id' => 'nullable|exists:technical_sheets,id',
            'password' => "required|string",
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        $role = $validated['role'] ?? 'Aprendiz';
        $user->assignRole($role);

        return response()->json([
            "success" => true,
            "message" => "Usuario creado correctamente",
            "data" => $user
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::with('roles')->find($id);
        if(!$user){
            return response()->json(["success" => false, "message" => "Usuario no encontrado"], 404);
        }
        return response()->json(["success" => true, "data" => $user]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find($id);

        $validated = $request->validate([
            'type_document' => 'sometimes|required|string|max:50',
            'document_number' => 'sometimes|required|string|max:50|unique:users,document_number,' . $user->id,
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'sometimes|nullable|string|in:Aprendiz,Instructor',
            'technical_sheet_id' => 'sometimes|nullable|exists:technical_sheets,id',
            'password' => "sometimes|required|string",
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        // Actualizar rol si llega uno nuevo
        if (!empty($validated['role'])) {
            $user->syncRoles([$validated['role']]);
        }

        return response()->json([
            "success" => true,
            "message" => "Usuario actualizado correctamente",
            "data" => $user
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);
        $user->delete();

        return response()->json([
            "success" => true,
            "message" => "Usuario eliminado correctamente"
        ]);
    }
}
