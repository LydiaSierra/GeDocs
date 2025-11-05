<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;

class FileController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required|file',
            'folder_id' => 'nullable|exists:folders,id',
        ]);

        $file = $request->file('file');
        $name = $file->getClientOriginalName();
        $type = $file->getClientOriginalExtension();
        $size = $file->getSize();
        $path = $file->store('files', "public");


        File::create([
            "name" => $name,
            "file_path" => $path,
            "size" => $size,
            "type" => $type,
            "folder_id" => $validated["folder_id"] ?? null,
        ]);

        return redirect()->back()->with('success', 'Archivo subido correctamente.');



    }
}
