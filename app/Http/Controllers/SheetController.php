<?php

namespace App\Http\Controllers;

use App\Models\Sheet_number;
use Illuminate\Http\Request;
use App\Models\Dependency;
use Illuminate\Support\Facades\DB;

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
        return DB::transaction(function () use ($request) {
            // Crear la ficha sin ventanilla_unica_id
            $sheetNumber = Sheet_number::create([
                'number' => $request->input('number'),
                // 'ventanilla_unica_id' => null
            ]);

            // Crear la dependencia "Ventanilla Unica" relacionada a la ficha
            $ventanilla = Dependency::create([
                'name' => 'Ventanilla Unica',
                'sheet_number_id' => $sheetNumber->id,
            ]);

            // Actualizar la ficha con el id de la ventanilla unica
            $sheetNumber->ventanilla_unica_id = $ventanilla->id;
            $sheetNumber->save();

            // Retornar la ficha con la relación cargada
            return response()->json($sheetNumber->load('dependencies'), 201);
        });
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
}
