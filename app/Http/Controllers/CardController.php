<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Card;
use Illuminate\Http\Request;


class CardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Mostrar la lista de fichas disponibles? 
        $cards = Card::get();
        if(!$cards){
            $cards = 'No hay fichas registradas';
        }
        return []; //Retornar la vista
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        return [];//Retornar la vista para crear fichas.

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $cardName = $request->input('card_name');
        $checkIfExist = Card::where('name',$cardName);
        //Revisar si la ficha ya existe antes de crearla
        if($checkIfExist){
            return response()->json(['success'=>false,'message'=>'La ficha ya está registrada'],400);
        }else{
        Card::create($cardName);
            return response()->json(['success'=>true,'messake'=>'La ficha '.$cardName.' fue creada correctamente'],201);
        }
     
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $card = Card::find($id);
        return []; //Retornar vista para el id
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $card = Card::find($id);
        if($card->name != $request->input('card_name'))
        {
            $card->name = $request->input('card_name');
            $card->save();
        }else
        {
            //Mensaje de error nuevo nombre es igual al nombre registrado ya
            return;
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        Card::delete($id);
    }
}
