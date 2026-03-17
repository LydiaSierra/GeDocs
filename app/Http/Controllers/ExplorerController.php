<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Folder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExplorerController extends Controller
{
    public function index(Request $request)
    {
        $sheetId = $request->query('sheet_id');
        $folderId = $request->query('folder_id');
        $buscador = $request->query('buscador');

        // Check if we are at root level of a sheet to ensure current year exists
        if ($sheetId && !$folderId && !$buscador) {
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
        $foldersQuery = Folder::where('active', true);
        $filesQuery = \App\Models\File::where('active', true);

        if ($buscador) {
            $foldersQuery->where('name', 'like', "%{$buscador}%");
            $filesQuery->where('name', 'like', "%{$buscador}%");
            
            if ($sheetId) {
                $foldersQuery->where('sheet_number_id', $sheetId);
                // For files, we need to join with folders to check sheet_id if they are deeply nested
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
                $filesQuery->whereRaw('1 = 0'); // No files at the root of a sheet (only years)
            } else {
                // Global root (Ficha selection level in UI)
                $foldersQuery->whereRaw('1 = 0');
                $filesQuery->whereRaw('1 = 0');
            }
        }

        $currentFolder = $folderId ? Folder::find($folderId) : null;
        $allFolders = Folder::where('active', true);
        if ($sheetId) $allFolders->where('sheet_number_id', $sheetId);

        return Inertia::render('Explorer', [
            'folders' => $foldersQuery->get(),
            'files' => $filesQuery->get(),
            'currentFolder' => $currentFolder,
            'allFolders' => $allFolders->get(),
            'filters' => $request->only(['sheet_id', 'folder_id', 'buscador']),
        ]);
    }
}
