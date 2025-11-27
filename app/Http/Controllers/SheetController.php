<?php

namespace App\Http\Controllers;

use App\Models\Sheet_number;
use App\Models\User;
use Illuminate\Http\Request;

class SheetController extends Controller
{
    /**
     * Display a listing of the resource.
     * Retrieves all training sheets along with their related users.
     * Users are separated into "Instructors" and "Aprendices" (Students)
     * based on their assigned Spatie roles.
     */
    public function index()
    {
        // Load all sheets with their related users
        $sheets = Sheet_number::with('users')->get();

        // Format each sheet by grouping users according to their roles
        $formattedSheets = $sheets->map(function ($sheet) {

            $instructors = [];
            $aprendices = [];

            // Loop through each user related to the sheet
            foreach ($sheet->users as $user) {
                $role = $user->getRoleNames()->first(); // Get first assigned role

                if ($role === 'Instructor') {
                    $instructors[] = $user;
                } elseif ($role === 'Aprendiz') {
                    $aprendices[] = $user;
                }
            }

            // Return structured response
            return [
                'id' => $sheet->id,
                'number' => $sheet->number,
                'created_at' => $sheet->created_at,
                'updated_at' => $sheet->updated_at,
                'Instructor' => $instructors,
                'Aprendices' => $aprendices,
            ];
        });

        return response()->json([
            "success" => true,
            "sheets" => $formattedSheets
        ], 200);
    }


    /**
     * Store a newly created resource in storage.
     * Validates and creates a new training sheet.
     */
    public function store(Request $request)
    {
        $validate = $request->validate([
            "number" => "required|numeric",
        ]);

        $sheet = Sheet_number::create($validate);

        return response()->json([
            "success" => true,
            "message" => "Ficha creada con exito",
            "ficha" => $sheet
        ], 200);
    }

    /**
     * Display the specified resource.
     * Searches sheets by number using a LIKE query.
     * Returns users grouped by role (Instructor, Aprendiz).
     */
    public function show(string $numberSheet)
    {
        // Search sheet(s) by partial sheet number
        $sheet = Sheet_number::where("number", "LIKE", "%" . $numberSheet . "%")
            ->with('users')
            ->get();

        if ($sheet->isEmpty()) {
            return response()->json([
                "success" => false,
                "message" => "Ficha no encontrada"
            ], 404);
        }

        // Same grouping logic as index()
        $formattedSheets = $sheet->map(function ($sheet) {

            $instructors = [];
            $aprendices = [];

            foreach ($sheet->users as $user) {
                $role = $user->getRoleNames()->first();

                if ($role === 'Instructor') {
                    $instructors[] = $user;
                } elseif ($role === 'Aprendiz') {
                    $aprendices[] = $user;
                }
            }

            return [
                'id' => $sheet->id,
                'number' => $sheet->number,
                'created_at' => $sheet->created_at,
                'updated_at' => $sheet->updated_at,
                'Instructor' => $instructors,
                'Aprendices' => $aprendices,
            ];
        });

        return response()->json([
            "success" => true,
            "message" => "Ficha encontrada exitosamente",
            "sheet" => $formattedSheets
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     * Updates the sheet number if the sheet exists.
     */
    public function update(Request $request, string $id)
    {
        $sheet = Sheet_number::find($id);

        if (!$sheet) {
            return response()->json([
                "success" => false,
                "message" => "Ficha no encontrada"
            ], 404);
        }

        $request->validate([
            "number" => "sometimes|required|numeric",
        ]);

        $sheet->update($request->only('number'));

        return response()->json([
            "success" => true,
            "message" => "Ficha actualizada con exito"
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     * Deletes a sheet by ID if it exists.
     */
    public function destroy(string $id)
    {
        $sheet = Sheet_number::find($id);

        if (!$sheet) {
            return response()->json([
                "success" => false,
                "message" => "Ficha no encontrada"
            ], 404);
        }

        $sheet->delete();

        return response()->json([
            "success" => true,
            "message" => "Ficha eliminada con exito"
        ], 200);
    }

    /**
     * Removes a user from a sheet (many-to-many relationship).
     * Looks up a sheet by its number and checks if the user belongs to it.
     * If found, it detaches the user from the pivot table.
     */
    public function deleteUserFromSheet(string $numberSheet, string $idUser)
    {
        // Find sheet by number
        $sheet = Sheet_number::where("number", $numberSheet)->first();

        if (!$sheet) {
            return response()->json([
                "success" => false,
                "message" => "Ficha no encontrada"
            ], 404);
        }

        // Check if the user is attached to the sheet
        $user = $sheet->users()->where("users.id", $idUser)->first();

        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Usuario no encontrado en la ficha"
            ], 404);
        }

        // Remove relationship in pivot table
        $sheet->users()->detach($user->id);

        return response()->json([
            "success" => true,
            "message" => "Usuario eliminado de la ficha con exito"
        ], 200);
    }


  public function addUserFromSheet(Request $request, string $numberSheet, string $idUser)
{
    $sheet = Sheet_number::where("number", $numberSheet)->first();

    if (!$sheet) {
        return response()->json([
            "success" => false,
            "message" => "Ficha no encontrada"
        ], 404);
    }

    $user = User::find($idUser);

    if (!$user) {
        return response()->json([
            "success" => false,
            "message" => "Usuario no encontrado"
        ], 404);
    }

    if ($user->hasRole("Admin")) {
        return response()->json([
            "success" => false,
            "message" => "No puedes agregar a este usuario"
        ], 500);
    }

    $authUser = $request->user();

    $authUser->load("sheetNumbers");

    if ($authUser->hasRole("Instructor") && !$authUser->sheetNumbers->contains("id", $sheet->id)) {
        return response()->json([
            "success" => false,
            "message" => "No tienes permisos sobre esta ficha"
        ], 403);
    }

    $sheet->load("users");  

    if ($sheet->users->contains("id", $user->id)) {
        return response()->json([
            "success" => false,
            "message" => "Este usuario ya está asignado a esta ficha"
        ], 409); // 409 Conflict
    }

    $sheet->users()->attach($user->id);

    return response()->json([
        "success" => true,
        "message" => "Usuario agregado correctamente a la ficha",
    ]);
}





}
