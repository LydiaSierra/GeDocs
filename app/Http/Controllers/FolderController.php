<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Folder;
use App\Models\File;
use Storage;

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


    // SHOW ONE FOLDER
    public function show($id)
    {
        $folder = Folder::findOrFail($id);

        // Preparar archivos con información adicional
        $files = $folder->files->map(function ($file) {

            return [
                "id" => $file->id,
                "name" => $file->name,
                "extension" => $file->extension,
                "mime_type" => $file->mime_type,
                "size" => $file->size,
                "url" => asset("storage/" . $file->path),
                "is_pdf" => $file->extension === "pdf",

                "created_at" => $file->created_at,
            ];
        });

        return response()->json([
            "success" => true,
            "folder" => $folder,
            "children" => $folder->children,
            "files" => $files
        ]);
    }


    //GET ALL FOLDER
    public function getAllFolders(Request $request)
    {
        $folders = Folder::all();

        return response()->json(["success" => true, "folders" => $folders]);
    }

    // CREATE FOLDER
    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required",
            "parent_id" => "nullable|exists:folders,id",
        ]);

        $folder = Folder::create([
            "name" => $validated["name"],
            "parent_id" => $validated["parent_id"] ?? null,
            "type" => "folder",
        ]);

        return response()->json(["success" => true, "folder" => $folder]);
    }


    //UPLOAD FILE 
    public function upload(Request $request, $folderId)
    {
        $request->validate([
            "files.*" => "required|file|max:51200", // 50MB
        ]);

        $folder = Folder::findOrFail($folderId);
        $uploadedFiles = [];

        foreach ($request->file('files') as $file) {

            $folderCode = $folder->folder_code ?? "000";
            $timestamp = now()->timestamp;

            $newName = "{$folderCode}_{$timestamp}_{$file->getClientOriginalName()}";

            $path = $file->storeAs("folders/{$folderId}", $newName, 'public');

            $newFile = File::create([
                "name" => $newName,
                "path" => $path,
                "extension" => $file->getClientOriginalExtension(),
                "mime_type" => $file->getClientMimeType(),
                "size" => $file->getSize(),
                "folder_id" => $folderId,

            ]);

            $uploadedFiles[] = [
                "id" => $newFile->id,
                "name" => $newFile->name,
                "extension" => $newFile->extension,
                "mime_type" => $newFile->mime_type,
                "size" => $newFile->size,
                "url" => asset("storage/" . $newFile->path),
                "is_image" => in_array($newFile->extension, ["jpg", "jpeg", "png", "webp", "gif"]),
                "is_pdf" => $newFile->extension === "pdf",
            ];
        }

        return response()->json([
            "success" => true,
            "files" => $uploadedFiles
        ]);
    }


    // DOWNLOAD FILE
    public function download($fileId)
    {
        $file = File::findOrFail($fileId);

        if (!Storage::disk('public')->exists($file->path)) {
            return response()->json(["success" => false, "message" => "Archivo no encontrado"], 404);
        }

        return Storage::disk('public')->download($file->path, $file->name);
    }

    /** Delete File */
    public function destroyFile($fileId)
    {
        $file = File::findOrFail($fileId);

        Storage::disk('public')->delete($file->path);
        $file->delete();

        return response()->json(["success" => true]);
    }


}
