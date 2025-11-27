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
        return view("",[$dependencies]);
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
        //
        $validate = $request->validate([
            "name"=> "required|alpha"]);
        
        $dependency = Dependency::create($validate);

        return response()->json([
            "success"=>true,
            "message"=> "Dependencia creada con exito",],200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $dependencies = Dependency::with('sheet')->get();

        $relatedDependency = $dependencies->map(function($dependency){
            $sheet = [];

            foreach($dependency->sheets as $sheetName){
                $sheet[] = $sheetName;
            }
            return [
                'id'=>$dependency->id,
                'name'=>$dependency->name,
                'sheet'=>$sheet
            ];
    });
        return response()->json([
            'success'=>true,
            'Dependencies'=> $relatedDependency],200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
        $dependency = Dependency::find($id);
        if(!$dependency){
            return response()->json([
                'status'=> 'error',
                'message'=> 'Dependencia no encontrada'],404);
        }
        return view('',[$dependency]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $dependency = Dependency::find($id);
        $validate = $request->validate([
            'name'=>"required|alpha"]);

        $dependency->update($validate);
        return response()->json([
            "success"=>true,
            "message"=> "Dependencia actualizada exitosamente"],200);
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