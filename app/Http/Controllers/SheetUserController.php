<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Sheet_number;
use App\Models\Sheet_number_user;
use App\Models\User;
use Illuminate\Http\Request;

class SheetUserController extends Controller
{
    //
    public function index(Request $request){
        $user = $request->user();
        if($user && $user->hasRole('Instructor')){
            $sheets_id = $user->sheetNumbers;
        };

        if(!$sheets_id){
            response()->json([
                "sucess"=>false,
                "message"=>"El usuario no tiene fichas asignadas",
            ]);
        }
        return response()->json([
            "sucess"=>true,
            "message"=>"Fichas encontradas",
            "fichas"=>$sheets_id,
        ],200);
    }


}
