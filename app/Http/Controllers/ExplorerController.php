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
        return Inertia::render('Explorer');
    }
}
