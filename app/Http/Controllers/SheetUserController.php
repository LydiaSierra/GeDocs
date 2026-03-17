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
        $sheets_id = null;
        if($user && $user->hasRole('Instructor')){
            $sheets_id = $user->sheetNumbers;
        }
        if (!$sheets_id) {
            return response()->json(['success' => false, 'message' => 'El usuario no tiene fichas asignadas'], 404);
        }
        return response()->json(['success' => true, 'message' => 'Fichas encontradas', 'fichas' => $sheets_id]);
    }


}
