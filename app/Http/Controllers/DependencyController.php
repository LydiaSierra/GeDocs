<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Dependency;

class DependencyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $dependencies = Dependency::get();
        if(!$dependencies){
            return response()->json([
                "status"=> "error",
                "message"=> "No hay dependencias",
            ],404);
        }
        return response()->json([
            "message"=> "Dependencias obtenidas exitosamente",
            "dependencies"=>$dependencies
        ],200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        //Obtener la ficha del suuario
        $sheet = $user->sheetNumbers()->first();

        if(!$sheet){
            return response()->json([
                "success"=> false,
                "message"=> "El usuario no tiene ficha asignada"
            ],422);
        }

        $validate = $request->validate([
            "name"=> "required|string|max:255"]);

        $dependency = Dependency::create([
            'name' => $validate['name'],
            'sheet_number_id' => $sheet->id,
        ]);

        return response()->json([
            "message"=> "Dependencia creada con exito",
            "dependency" => $dependency
        ],200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //Encontrar dependencia por id
        $dependency = Dependency::with('sheetNumber')->find($id);

        if (!$dependency) {
            return response()->json([
                'success' => false,
                'message' => 'Dependencia no encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'dependency' => [
                'id' => $dependency->id,
                'name' => $dependency->name,
                'sheet_number_id' => $dependency->sheetNumber
            ]
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //Busca la dependencia con el id
        $dependency = Dependency::find($id);

        if(!$dependency){
            return response()->json([
                "message" => "Depenedencia no encontrada"
            ], 404);
        }

        $validate = $request->validate([
            'name' => "required|string|max:255"
        ]);

        $dependency->update($validate);
        return response()->json([
            "success"=>true,
            "message"=> "Dependencia actualizada exitosamente",
            "dependency" => $dependency
        ],200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $dependency = Dependency::find($id);
        if(!$dependency){
            return response()->json([
                "status"=> "error",
                "message"=> "Dependencia no encontrada"],404);
        }

        $dependency->delete();

        return response()->json([
            "success"=>true,
            "message"=> "Dependencia eliminada"],200);
    }
}
