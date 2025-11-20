<?php

namespace App\Http\Controllers;

use App\Models\Sheet_number;
use Illuminate\Http\Request;

class SheetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sheets = Sheet_number::with("users")->get();
        return response()->json(["success" => true, "sheets" => $sheets], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validate = $request->validate([
            "number" => "required|numeric",
        ]);
        $sheet = Sheet_number::create($validate);
        return response()->json(["success" => true, "message" => "Ficha creada con exito", "ficha" => $sheet], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $sheet = Sheet_number::find($id);
        if (!$sheet) {
            return response()->json(["success" => false, "message" => "Ficha no encontrada"], 404);
        }
        return response()->json(["success" => true, "message" => "Ficha encontrada", "sheet" => $sheet], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $sheet = Sheet_number::find($id);
        if (!$sheet) {
            return response()->json(["success" => false, "message" => "Ficha no encontrada"], 404);
        }

        $validate = $request->validate([
            "number" => "sometimes|required|numeric",
        ]);
        return response()->json(["success" => true, "message" => "Ficha actualizada con exito", "ficha" => $sheet], 200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $sheet = Sheet_number::find($id);
        if (!$sheet) {
            return response()->json(["success" => false, "message" => "Ficha no encontrada"], 404);
        }

        $sheet->delete();
    }
}
