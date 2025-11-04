<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExplorerController extends Controller
{
    public function index(Request $request)
    {
        $parent_id = $request->get('parent_id', null);
        $search = $request->get('search', null);
        $query = Folder::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        } else {
            $query->where('parent_id', $parent_id);
        }

        $folders = $query->get();

        return Inertia::render('Explorer', ['folders' => $folders, 'parent_id' => $parent_id]);
    }
}
