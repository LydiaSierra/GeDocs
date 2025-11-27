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
                "type" => $file->type,
                "size" => $file->size,
                "url" => asset("storage/" . $file->file_path),
                "is_pdf" => str_contains($file->type, 'pdf'),
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
        try {
            // Validar que la carpeta existe primero
            $folder = Folder::findOrFail($folderId);
            
            $request->validate([
                "files.*" => "required|file|max:51200", // 50MB
            ]);

            $uploadedFiles = [];

            if (!$request->hasFile('files')) {
                return response()->json([
                    "success" => false,
                    "message" => "No files provided"
                ], 400);
            }

            foreach ($request->file('files') as $file) {
                $folderCode = $folder->folder_code ?? "000";
                $timestamp = now()->timestamp;

                $newName = "{$folderCode}_{$timestamp}_{$file->getClientOriginalName()}";

                $path = $file->storeAs("folders/{$folderId}", $newName, 'public');

                $newFile = File::create([
                    "name" => $newName,
                    "file_path" => $path,
                    "type" => $file->getClientMimeType(),
                    "size" => $file->getSize(),
                    "folder_id" => $folderId,
                ]);

                $uploadedFiles[] = [
                    "id" => $newFile->id,
                    "name" => $newFile->name,
                    "type" => $newFile->type,
                    "size" => $newFile->size,
                    "url" => asset("storage/" . $newFile->file_path),
                ];
            }

            return response()->json([
                "success" => true,
                "files" => $uploadedFiles
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                "success" => false,
                "message" => "Folder not found"
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                "success" => false,
                "message" => "Validation error",
                "errors" => $e->errors()
            ], 422);
        } catch (\Throwable $th) {
            \Log::error('Upload error: ' . $th->getMessage());
            return response()->json([
                "success" => false,
                "message" => $th->getMessage()
            ], 500);
        }
    }

    // DOWNLOAD FILE
    public function download($fileId)
    {
        $file = File::findOrFail($fileId);

        if (!Storage::disk('public')->exists($file->file_path)) {
            return response()->json(["success" => false, "message" => "Archivo no encontrado"], 404);
        }

        return response()->download(Storage::disk('public')->path($file->file_path), $file->name);
    }

    /** Delete File */
    public function destroyFile($fileId)
    {
        $file = File::findOrFail($fileId);

        Storage::disk('public')->delete($file->file_path);
        $file->delete();

        return response()->json(["success" => true]);
    }


}
