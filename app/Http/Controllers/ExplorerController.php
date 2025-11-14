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
        $parent_id = $request->get('parent_id', null);
        $search = $request->get('search', null);

        $foldersQuery = Folder::query();

        if ($search) {
            $foldersQuery->where('name', 'like', "%{$search}%");
        } else {
            $foldersQuery->where('parent_id', $parent_id);
        }

        $folders = $foldersQuery->get();

        $files = File::query()->where('folder_id', $parent_id)->get();

        return Inertia::render('Explorer', [
            'folders' => $folders,
            'files' => $files,
            'parent_id' => $parent_id,
        ]);
    }
}
