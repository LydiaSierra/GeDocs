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
        $authUser = $request->user();

        $query = User::with('roles', "sheetNumbers");

        if ($authUser->hasRole("Instructor")) {
            $query->role("Aprendiz");
        }

        $users = $query->get();

        return response()->json([
            "success" => true,
            "data" => $users
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        if (!$request->user()->hasRole("Admin")) {
            return response()->json([
                "success" => false,
                "message" => "No tienes permiso para crear usuarios"
            ]);
        }

        $validated = $request->validate([
            'type_document' => 'required|string|max:50',
            'document_number' => 'required|string|max:50|unique:users,document_number',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => "required|string",
            "status" => "active"
        ]);



        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);
        $user->assignRole('Aprendiz');

        $user->load('roles');
        $user->load('sheetNumbers');

        return response()->json([
            "success" => true,
            "message" => "Usuario creado correctamente",
            "data" => $user
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {

        $authUser = $request->user();

        if (!$authUser->hasRole("Admin") && !$authUser->hasRole("Aprendiz")) {
            $user = User::role("Aprendiz")->with('roles')->find($id);
        } else {
            $user = User::with('roles')->find($id);
        }


        if (!$user) {
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
        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Usuario no encontrado"
            ]);
        }
        $user->delete();

        return response()->json([
            "success" => true,
            "message" => "Usuario eliminado correctamente"
        ]);
    }


    public function userByFilter(Request $request)
    {
        if (!$request->query()) {
            return response()->json([
                "success" => false,
                "message" => "No hay filtro seleccionado"
            ]);
        }
        // Allowed filters
        $allowed = ["name", "email", "document_number"];

        // Validate if the used filter is allowed
        foreach ($request->query() as $key => $value) {
            if (!in_array($key, $allowed)) {
                return response()->json([
                    "success" => false,
                    "message" => "Filtro '$key' no está permitido"
                ], 400);
            }
        }
        
        
        
        
        // loop through the array allowed to search for each selected filter
        
        $query = User::with('roles', "sheetNumbers");

        foreach ($request->query() as $key => $value) {
               $query->where($key, "LIKE", "%{$value}%");
        }

        $authUser = $request->user();

        if(!$authUser->hasRole("Admin")) {
            $query->role("Aprendiz");
        }


        $users = $query->get();

        return response()->json([
            "success" => true,
            "data" => $users
        ]);
    }

}
