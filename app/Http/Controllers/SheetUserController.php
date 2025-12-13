<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Sheet_number;
use App\Models\Sheet_number_user;

use function PHPUnit\Framework\isEmpty;

class SheetUserController extends Controller
{
    //
    public function index($user_id){
        $sheets_id = Sheet_number_user::where('user_id',$user_id);
        $query = $sheets_id->get();
        $query = collect($query)->pluck('sheet_number_id');
        if(!$query){
            return response()->json([
                "sucess"=>false,
                "message"=>"Usuario sin fichas"
            ],404);
        }

        $sheets = Sheet_number::whereIn('id',$query);
        $sheets_query = $sheets->get();
        return response()->json([
            "sucess"=>true,
            "message"=>"Fichas encontradas",
            "fichas"=>$sheets_query,
        ],200);
    }


}
