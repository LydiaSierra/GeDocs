<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Folder;
use App\Models\Sheet_number;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExplorerController extends Controller
{
   public function index(Request $request)
    {
        $folderId = $request->query('folder_id');
        $sheetId = $request->query('sheet_id');
        $buscador = $request->query('buscador');
        $permissionError = null;

        // 1. Validar Ficha (Sheet) si se proporciona
        if ($sheetId) {
            $sheet = Sheet_number::find($sheetId);
            if (!$sheet) {
                $permissionError = "esta ficha no existe";
            } else {
                $user = auth()->user();
                if ($user->hasRole('Instructor') || $user->hasRole('Aprendiz')) {
                    if (!$user->sheetNumbers()->where('sheet_number_id', $sheetId)->exists()) {
                        $permissionError = "no tienes permiso para visualizar esta ficha";
                    }
                }
            }
        }

        // 2. Validar Carpeta (Folder) si se proporciona
        $currentFolder = null;
        if (!$permissionError && $folderId) {
            $currentFolder = Folder::where('id', $folderId)->where('active', true)->first();
            if (!$currentFolder) {
                $permissionError = "esta carpeta no existe";
            } else {
                // Verificar que la carpeta pertenezca a la ficha (si se dio ficha)
                if ($sheetId && $currentFolder->sheet_number_id != $sheetId) {
                    $permissionError = "esta carpeta no pertenece a la ficha seleccionada";
                } else {
                    // Si no se dio sheetId, validar permiso sobre la ficha de la carpeta
                    $validationSheetId = $currentFolder->sheet_number_id;
                    $user = auth()->user();
                    if ($user->hasRole('Instructor') || $user->hasRole('Aprendiz')) {
                        if (!$user->sheetNumbers()->where('sheet_number_id', $validationSheetId)->exists()) {
                            $permissionError = "no tienes permiso para visualizar esta carpeta";
                        }
                    }
                }
            }
        }

        // Automatic creation of current year folder if at root of a valid sheet
        if (!$permissionError && $sheetId && !$folderId && !$buscador) {
            $currentYear = date('Y');
            $yearExists = Folder::where('sheet_number_id', $sheetId)
                ->where('year', $currentYear)
                ->whereNull('parent_id')
                ->where('active', true)
                ->exists();

            if (!$yearExists) {
                \App\Services\FolderStructureService::createDefaultStructure($sheetId, (int)$currentYear);
            }
        }

        // Base queries
        $foldersQuery = Folder::where("active", true);
        $filesQuery = File::where("active", true);

        if ($permissionError) {
            $foldersQuery->whereRaw('1 = 0');
            $filesQuery->whereRaw('1 = 0');
        } elseif ($buscador) {
            $foldersQuery->where('name', 'LIKE', "%{$buscador}%");
            $filesQuery->where('name', 'LIKE', "%{$buscador}%");
            
            if ($sheetId) {
                $foldersQuery->where('sheet_number_id', $sheetId);
                $filesQuery->whereHas('folder', function($q) use ($sheetId) {
                    $q->where('sheet_number_id', $sheetId);
                });
            }
        } else {
            if ($folderId) {
                $foldersQuery->where('parent_id', $folderId);
                $filesQuery->where('folder_id', $folderId);
            } elseif ($sheetId) {
                $foldersQuery->where('sheet_number_id', $sheetId)
                    ->whereNull('parent_id');
                $filesQuery->whereRaw('1 = 0');
            } else {
                $foldersQuery->whereRaw('1 = 0');
                $filesQuery->whereRaw('1 = 0');
            }
        }

        $allFolders = Folder::where("active", true);
        if ($permissionError) {
            $allFolders->whereRaw('1 = 0');
        } elseif ($sheetId) {
            $allFolders->where('sheet_number_id', $sheetId);
        }

        return Inertia::render('Explorer', [
            "folders" => $foldersQuery->get(),
            "files" => $filesQuery->get()->map(function ($file) {
                return [
                    "id" => $file->id,
                    "name" => $file->name,
                    "extension" => $file->extension,
                    "size" => $file->size,
                    "url" => asset("storage/" . $file->path),
                    "folder_id" => $file->folder_id
                ];
            }),
            "allFolders" => $allFolders->get(),
            "currentFolder" => $currentFolder,
            "filters" => $request->only(['buscador', 'folder_id', 'sheet_id']),
            "permissionError" => $permissionError
        ]);
    }

}
