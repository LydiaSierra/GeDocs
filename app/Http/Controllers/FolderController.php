<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Folder;
use App\Models\File;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $folders = Folder::whereNull('parent_id')->get();
        return response()->json(["success" => true, "folders" => $folders], 200);
    }

//    public function store(Request $request){
//        $validate =
//    }

    public function getByParent($parent_id)
    {
        $folders = Folder::where('parent_id', $parent_id)
            ->with('files')
            ->get();
        $files = File::where('folder_id', $parent_id)->get();

        return response()->json([
            "success" => true,
            "folders" => $folders,
            "files" => $files
        ], 200);
    }

    public function getAllFolders()
    {
        $folders = Folder::all();
        return response()->json(["success" => true, "folders" => $folders], 200);


    }


}
