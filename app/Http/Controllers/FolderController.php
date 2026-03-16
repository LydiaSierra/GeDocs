<?php

/**
 * Defines the namespace where this controller belongs.
 * All HTTP controllers in Laravel are usually placed here.
 */
namespace App\Http\Controllers;

/**
 * Generic Exception class used to catch unexpected errors.
 */
use Exception;

/**
 * Represents the incoming HTTP request.
 * Provides access to input data, files, headers, etc.
 */
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Folder Eloquent model.
 * Represents the "folders" table and its relationships.
 */
use App\Models\Folder;

/**
 * File Eloquent model.
 * Represents the "files" table and its relationships.
 */
use App\Models\File;

/**
 * Storage facade.
 * Used to interact with Laravel's filesystem abstraction.
 */
use Storage;

/**
 * Native PHP class used to create and manipulate ZIP files.
 */
use ZipArchive;


/**
 * FolderController
 *
 * This controller is responsible for handling all operations related to:
 * - Folder listing and navigation
 * - File uploads and downloads
 * - Logical deletion (trash system using "active" flag)
 * - Recursive folder operations
 * - Mixed ZIP downloads (folders + files)
 *
 * It acts as the bridge between the frontend (React/Inertia)
 * and the backend (database + filesystem).
 */
class FolderController extends Controller
{
    /**
     * Display a list of root folders.
     *
     * Only returns folders:
     * - That do not have a parent (root level)
     * - That are marked as active
     * - Ordered by newest first
     */
    public function index(Request $request)
    {
        $sheetId = $request->query('sheet_number_id');

        // Automatic Year Creation Logic
        if ($sheetId) {
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

        $query = Folder::whereNull('parent_id')
            ->where("active", true);

        // Filter by sheet_number_id if provided
        if ($sheetId) {
            $query->where('sheet_number_id', $sheetId);
        }

        $folders = $query->orderBy('created_at', 'desc')->get();

        // Returns the folders as a JSON response
        return back();
    }


    /**
     * Show a single folder with its children and files.
     *
     * This method:
     * - Retrieves one active folder
     * - Loads its active subfolders
     * - Loads its active files
     * - Transforms file data for frontend consumption
     */
    public function show($id)
    {
        // Retrieve the folder or fail if it does not exist or is inactive
        $folder = Folder::where('id', $id)
            ->where('active', true)
            ->firstOrFail();

        /**
         * Retrieve all active files belonging to the folder
         * and map them into a frontend-friendly structure.
         */
        $files = $folder->files()
            ->where('active', true)
            ->get()
            ->map(function ($file) {
                return [
                    "id" => $file->id,
                    "name" => $file->name,
                    "extension" => $file->extension,
                    "mime_type" => $file->mime_type,
                    "size" => $file->size,
                    "url" => asset("storage/" . $file->path),
                    "is_pdf" => $file->extension === "pdf",
                    "created_at" => $file->created_at,
                    "updated_at" => $file->updated_at,
                ];
            });

        // Return folder data, child folders and files
        return back();
    }


    public function explorer(Request $request)
    {
        $folderId = $request->query('folder_id');
        $sheetId = $request->query('sheet_id');
        $buscador = $request->query('buscador');

        $foldersQuery = Folder::where("active", true);
        $allFolders = Folder::where("active", true)->get();

        // Global Search
        if ($buscador) {
            $folders = Folder::where('active', true)
                ->where('name', 'LIKE', "%{$buscador}%")
                ->get();

            $files = File::where('active', true)
                ->where('name', 'LIKE', "%{$buscador}%")
                ->get()
                ->map(fn($file) => [
                    "id" => $file->id,
                    "name" => $file->name,
                    "extension" => $file->extension,
                    "size" => $file->size,
                    "url" => asset("storage/" . $file->path),
                    "folder_id" => $file->folder_id
                ]);

            return Inertia::render('Explorer', [
                "folders" => $folders,
                "files" => $files,
                "allFolders" => $allFolders,
                "currentFolder" => null,
                "filters" => $request->only(['buscador', 'folder_id', 'sheet_id'])
            ]);
        }

        if ($sheetId) {
            $foldersQuery->where('sheet_number_id', $sheetId);
            
            // If we are at the root of a sheet (no folder_id), ensure current year folder exists
            if (!$folderId && !$buscador) {
                $currentYear = date('Y');
                $this->ensureYearFolderExists($sheetId, $currentYear);
            }
        }

        if ($folderId) {
            $folder = Folder::where('id', $folderId)
                ->where('active', true)
                ->firstOrFail();

            $folders = $folder->children()
                ->where("active", true)
                ->get();

            $files = $folder->files()
                ->where("active", true)
                ->get()
                ->map(function ($file) {
                    return [
                        "id" => $file->id,
                        "name" => $file->name,
                        "extension" => $file->extension,
                        "size" => $file->size,
                        "url" => asset("storage/" . $file->path),
                        "folder_id" => $file->folder_id
                    ];
                });

            return Inertia::render('Explorer', [
                "folders" => $folders,
                "files" => $files,
                "allFolders" => $allFolders,
                "currentFolder" => $folder,
                "filters" => $request->only(['buscador', 'folder_id', 'sheet_id'])
            ]);
        }

        $folders = $foldersQuery
            ->whereNull("parent_id")
            ->get();

        return Inertia::render('Explorer', [
            "folders" => $folders,
            "files" => [],
            "allFolders" => $allFolders,
            "currentFolder" => null,
            "filters" => $request->only(['buscador', 'folder_id', 'sheet_id'])
        ]);
    }


    /**
     * Get all folders (without filtering).
     *
     * Mainly useful for administrative or internal operations.
     */
    public function getAllFolders(Request $request)
    {
        $folders = Folder::where("active", true)->get();

        return back();
    }


    /**
     * Create a new folder.
     *
     * Validates input and stores folder metadata in the database.
     */
    public function store(Request $request)
    {
        // Validate incoming data
        $validated = $request->validate([
            "name" => "required|string",
            "parent_id" => "nullable|exists:folders,id",
            "folder_code" => "nullable|string",
            "department" => "required|string",
            "sheet_number_id" => "nullable|exists:sheet_numbers,id",
        ]);

        // Create the folder record
        $data = [
            "name" => $validated["name"],
            "parent_id" => $validated["parent_id"] ?? null,
            "folder_code" => $validated["folder_code"] ?? null,
            "department" => $isYear ? 'Año' : $validated["department"],
            "sheet_number_id" => $validated["sheet_number_id"] ?? null,
        ];

        // If it's a root folder for a sheet, it's a Year folder
        if (!$data["parent_id"] && $data["sheet_number_id"]) {
            $data["year"] = is_numeric($data["name"]) ? (int)$data["name"] : date('Y');
            $data["department"] = "Año";
        }

        $folder = Folder::create($data);

        // If it was a Year folder, seed the structure
        if (!$data["parent_id"] && $data["sheet_number_id"]) {
            $this->seedYearStructure($data["sheet_number_id"], $folder->id);
        }

        return back();
    }


    /**
     * Upload one or multiple files into a folder.
     *
     * Responsibilities:
     * - Validate files
     * - Generate standardized filenames
     * - Store files on disk
     * - Persist file metadata in database
     */
    public function upload(Request $request, $folderId)
    {
        try {
            // Retrieve the folder where files will be uploaded
            $folder = Folder::find($folderId);

            // Validate uploaded files (max 50MB each)
            $request->validate([
                "files.*" => "required|file|max:51200",
            ]);

            $uploadedFiles = [];

            // If no files are provided, return an error
            if (!$request->hasFile('files')) {
                return back()->withErrors(['files' => 'No files provided']);
            }

            /**
             * Loop through each uploaded file
             * and store it individually.
             */
            foreach ($request->file('files') as $file) {

                // Used to build a standardized file name
                $fileYear = date("Y");
                $folderCode = $folder->folder_code ?? "000";

                // New file name format
                $newName = "{$fileYear}-Ex-{$folderCode}-{$file->getClientOriginalName()}";

                // Store file in public disk
                $path = $file->storeAs("folders/{$folderId}", $newName, 'public');

                // Create database record
                $newFile = File::create([
                    "name" => $newName,
                    "path" => $path,
                    "extension" => $file->getClientOriginalExtension(),
                    "mime_type" => $file->getClientMimeType(),
                    "size" => $file->getSize(),
                    "folder_id" => $folderId,
                    "active" => true,
                ]);


                // Prepare response data
                $uploadedFiles[] = [
                    "id" => $newFile->id,
                    "folder_id" => $folderId,
                    "name" => $newFile->name,
                    "extension" => $newFile->extension,
                    "mime_type" => $newFile->mime_type,
                    "size" => $newFile->size,
                    "is_pdf" => $newFile->extension === 'pdf',
                    "created_at" => $newFile->created_at,
                    "updated_at" => $newFile->updated_at,
                    "url" => asset("storage/" . $newFile->path),
                ];

            }

            return back();

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return back()->withErrors(['error' => 'Folder not found']);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function globalSearch(Request $request)
    {
        $query = $request->query('q');

        if (!$query) {
            return back();
        }

        $folders = Folder::where('active', true)
            ->where(function ($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                    ->orWhere('department', 'LIKE', "%{$query}%")
                    ->orWhere('folder_code', 'LIKE', "%{$query}%")
                    ->orWhereHas('sheetNumber', function ($sq) use ($query) {
                        $sq->where('number', 'LIKE', "%{$query}%");
                    });
            })
            ->get();

        $files = File::where('active', true)
            ->where(function ($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                    ->orWhere('extension', 'LIKE', "%{$query}%")
                    ->orWhereHas('folder.sheetNumber', function ($sq) use ($query) {
                        $sq->where('number', 'LIKE', "%{$query}%");
                    });
            })
            ->get()
            ->map(fn($file) => [
                "id" => $file->id,
                "name" => $file->name,
                "extension" => $file->extension,
                "size" => $file->size,
                "url" => asset("storage/" . $file->path),
                "folder_id" => $file->folder_id
            ]);

        return back();
    }


    /**
     * Download a single file.
     *
     * Checks if the file exists in storage before sending it.
     */
    public function download($fileId)
    {
        $file = File::findOrFail($fileId);

        if (!Storage::disk('public')->exists($file->path)) {
            return back()->withErrors(['error' => 'File not found on disk']);
        }

        return response()->download(
            Storage::disk('public')->path($file->path),
            $file->name
        );
    }


    /**
     * Logically delete (send to trash) files and folders.
     *
     * Uses "active = false" instead of physical deletion.
     * Supports mixed selection (files + folders).
     */
    public function deleteMixed(Request $request)
    {
        // Validate incoming IDs
        $request->validate([
            'folders' => 'array',
            'folders.*' => 'integer|exists:folders,id',
            'files' => 'array',
            'files.*' => 'integer|exists:files,id',
        ]);

        // Retrieve IDs from request
        $fileIds = $request->input('files', []);
        $folderIds = $request->input('folders', []);

        // Deactivate files
        if (!empty($fileIds)) {
            File::whereIn('id', $fileIds)
                ->update(['active' => false]);
        }

        // Deactivate folders recursively
        $folders = Folder::whereIn('id', $folderIds)->get();

        foreach ($folders as $folder) {
            $this->deactivateFolderRecursively($folder);
        }

        return back();
    }


    /**
     * Recursively deactivate a folder.
     *
     * This method:
     * - Deactivates all files in the folder
     * - Deactivates all child folders
     * - Finally deactivates the folder itself
     */
    private function deactivateFolderRecursively($folder)
    {
        // Deactivate files inside the folder
        foreach ($folder->files as $file) {
            $file->update(['active' => false]);
        }

        // Recursively deactivate child folders
        foreach ($folder->children as $child) {
            $this->deactivateFolderRecursively($child);
        }

        // Deactivate the folder
        $folder->update(['active' => false]);
    }


    /**
     * Update folder metadata.
     *
     * Allows partial updates using "sometimes" validation rules.
     */
    public function updateFolder(Request $request, $folderId)
    {
        $folder = Folder::find($folderId);

        if (!$folder) {
            return back()->withErrors(['error' => 'Folder not found']);
        }

        // Validate fields only if they are present
        $validated = $request->validate([
            "name" => "sometimes|required|string",
            "parent_id" => "sometimes|nullable|exists:folders,id",
            "folder_code" => "sometimes|nullable|string",
            "department" => "sometimes|required|string"
        ]);

        // Apply updates
        $folder->update($validated);

        return back();
    }


    /**
     * Download multiple folders and/or files as a ZIP archive.
     *
     * This method:
     * - Validates input
     * - Collects folders and files
     * - Creates a temporary ZIP
     * - Streams it to the client
     */
    public function downloadMixedZip(Request $request)
    {
        try {
            $request->validate([
                'folders' => 'array',
                'folders.*' => 'integer|exists:folders,id',
                'files' => 'array',
                'files.*' => 'integer|exists:files,id',
            ]);

            $folderIds = $request->input('folders', []);
            $fileIds = $request->input('files', []);

            $folders = Folder::whereIn('id', $folderIds)->get();
            $files = File::whereIn('id', $fileIds)->get();

            if ($folders->isEmpty() && $files->isEmpty()) {
                return back()->withErrors(['error' => 'No items to download']);
            }

            // Create temporary directory if it does not exist
            $tempDir = storage_path('app/temp');
            if (!file_exists($tempDir)) {
                mkdir($tempDir, 0777, true);
            }

            // Generate ZIP name
            $zipName = 'descarga_' . now()->format('Ymd_His') . '.zip';
            $zipPath = $tempDir . DIRECTORY_SEPARATOR . $zipName;

            $zip = new ZipArchive;

            // Open ZIP file
            if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
                throw new Exception('Failed to create ZIP file');
            }

            // Add folders recursively
            foreach ($folders as $folder) {
                $this->addFolderToZip($zip, $folder, $folder->name);
            }

            // Add individual files
            foreach ($files as $file) {
                $filePath = Storage::disk('public')->path($file->path);

                if (file_exists($filePath)) {
                    $zip->addFile($filePath, $file->name);
                }
            }

            $zip->close();

            // Download and delete ZIP after sending
            return response()->download($zipPath)->deleteFileAfterSend(true);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (Exception $e) {
            return back()->withErrors(['error' => 'ZIP generation error: ' . $e->getMessage()]);
        }
    }


    /**
     * Recursively adds a folder and its contents to a ZIP archive.
     *
     * Preserves folder structure inside the ZIP.
     */
    /**
     * Ensures that a folder for the given year exists for a specific sheet.
     * If it doesn't exist, it creates it and seeds the default structure.
     */
    private function ensureYearFolderExists($sheetId, $year)
    {
        $yearFolder = Folder::where('sheet_number_id', $sheetId)
            ->where('year', $year)
            ->whereNull('parent_id')
            ->where('active', true)
            ->first();

        if (!$yearFolder) {
            // Create the Year folder
            $yearFolder = Folder::create([
                'name' => (string)$year,
                'year' => $year,
                'sheet_number_id' => $sheetId,
                'parent_id' => null,
                'active' => true,
                'department' => 'Año',
                'folder_code' => $year
            ]);

            // Seed the default structure inside this year folder
            $this->seedYearStructure($sheetId, $yearFolder->id);
        }

        return $yearFolder;
    }

    /**
     * Seeds the default folder structure inside a specific year folder.
     */
    private function seedYearStructure($sheetId, $yearFolderId)
    {
        // Default structure from FoldersSeeder
        $folders = [
            // [tempKey, name, parentTempKey|null, folder_code, department]
            [1, 'Gerencia General', null, 100, 'sección'],
            [2, 'Oficina de Control Interno', null, 101, 'sección'],
            [3, 'Oficina Jurídica', null, 102, 'sección'],
            [4, 'Dirección administrativa y Financiera', 1, 110, 'Subsección'],
            [5, 'Dirección Técnica', 1, 120, 'Subsección'],
            [6, 'ACTAS', 4, 2, 'Serie'],
            [7, 'CIRCULARES', 4, 4, 'Serie'],
            [8, 'CONSECUTIVOS DE COMUNICACIONES OFICIALES', 4, 9, 'Serie'],
            [9, 'INFORMES', 4, 16, 'Serie'],
            [10, 'INSTRUMENTOS ARCHIVÍSTICOS', 4, 17, 'Serie'],
            [11, 'NOMINA', 4, 24, 'Serie'],
            [12, 'ACTAS', 5, 2, 'Serie'],
            [13, 'DERECHOS DE PETICIÓN', 5, 12, 'Serie'],
            [14, 'PROYECTOS', 5, 29, 'Serie'],
            [15, 'REPORTES DE VISITAS DE CAMPO', 5, 31, 'Serie'],
            [16, 'Actas de comité Técnico a la Contratación', 12, 8, 'Subserie'],
            [17, 'Proyectos de Inversión', 14, 1, 'Subserie'],
            [18, 'Actas de Comité Institucional de Gestión y Desempeño', 6, 6, 'Subserie'],
            [19, 'Actas de Eliminacón Documental', 6, 9, 'Subserie'],
            [20, 'Circulares Informativas', 7, 2, 'Subserie'],
            [21, 'Consecutivos de Comunicaciones Oficiales Enviadas', 8, 1, 'Subserie'],
            [22, 'Consecutivos de Comunicaciones Oficiales Recibidas', 8, 2, 'Subserie'],
            [23, 'Informes de Ejecución Presupuestal', 9, 3, 'Subserie'],
            [24, 'Informes Trimestrales de Seguimiento al Modelo Integrado de Planeación y COntrol MIPG', 9, 5, 'Subserie'],
            [25, 'Bancos Terminológicos de Series Y Subseries Documentales', 10, 1, 'Subserie'],
            [26, 'Cuadros de Clasificación Documental', 10, 2, 'Subserie'],
            [27, 'Inventarios Documentales de Archivo Cental', 10, 3, 'Subserie'],
            [28, 'Planes Institucionales de Archivos - PINAR', 10, 4, 'Subserie'],
            [29, 'Programas de Gestión Documental PGD', 10, 5, 'Subserie'],
            [30, 'Tablas de Control de Acceso', 10, 6, 'Subserie'],
            [31, 'Tabla de Retención Documental TRD', 10, 7, 'Subserie'],
            [32, 'Tablas de Valoración Documental TVD', 10, 8, 'Subserie'],
            [33, 'ACCIONES CONSTITUCIONALES', 3, 1, 'Serie'],
            [34, 'ACTAS', 3, 2, 'Serie'],
            [35, 'CONCEPTOS', 3, 7, 'Serie'],
            [36, 'DERECHOS DE PETICIÓN', 3, 12, 'Serie'],
            [37, 'Acciones de Cumplimiento', 33, 1, 'SubSerie'],
            [38, 'Acciones de Tutela', 33, 2, 'SubSerie'],
            [39, 'Actas de Comité de Conciliación y Defensa Jurídica', 34, 2, 'SubSerie'],
            [40, 'Conceptos Juríridicos', 35, 1, 'SubSerie'],
            [41, 'ACTAS', 2, 2, 'Serie'],
            [42, 'INFORMES', 2, 16, 'Serie'],
            [43, 'PLANES', 2, 25, 'Serie'],
            [44, 'Actas de Comité de Coordicación del Sistema de Control Interno', 41, 4, 'Subserie'],
            [45, 'Informes a Entes de Control', 42, 1, 'Subserie'],
            [46, 'Informes de Audiroría del Sistema de Gestión de Calidad', 42, 2, 'Subserie'],
            [47, 'Planes de Auditoría', 43, 4, 'Subserie'],
            [48, 'Planes de Mejoramiento Institucional', 43, 6, 'Subserie'],
            [49, 'ACTAS', 1, 2, 'Serie'],
            [50, 'ACTOS ADMINISTRATIVOS', 1, 3, 'Serie'],
            [51, 'CICULARES', 1, 4, 'Serie'],
            [52, 'CONTRATOS', 1, 10, 'Serie'],
            [53, 'CONVENIOS', 1, 11, 'Serie'],
            [54, 'DERECHOS DE PETICIÓN', 1, 12, 'Serie'],
            [55, 'INFORMES', 1, 16, 'Serie'],
            [56, 'Actas de Cómite de Gerencia', 49, 5, 'Subserie'],
            [57, 'Actas Junta Directiva', 49, 10, 'Subserie'],
            [58, 'Acuerdos de Junta Directiva', 50, 1, 'Subserie'],
            [59, 'Resoluciones', 50, 2, 'Subserie'],
            [60, 'Circulares Dispositivas', 51, 1, 'Subserie'],
            [61, 'Contratos de Servicios Públicos', 52, 1, 'Subserie'],
            [62, 'Convenios Interinstitucionales', 53, 1, 'Subserie'],
            [63, 'Informes a Entes de Control', 55, 1, 'Subserie'],
        ];

        $map = [];

        foreach ($folders as [$tempKey, $name, $parentTempKey, $folderCode, $department]) {
            $parentId = $parentTempKey ? ($map[$parentTempKey] ?? $yearFolderId) : $yearFolderId;

            $folder = Folder::create([
                'name' => $name,
                'parent_id' => $parentId,
                'folder_code' => $folderCode,
                'department' => $department,
                'sheet_number_id' => null, // Sheets are now only linked to Year folders
                'active' => true,
            ]);

            $map[$tempKey] = $folder->id;
        }
    }

    private function addFolderToZip(ZipArchive $zip, $folder, $zipPath)
    {
        // Create empty directory inside ZIP
        $zip->addEmptyDir($zipPath);

        // Add files inside the folder
        foreach ($folder->files as $file) {
            $filePath = Storage::disk('public')->path($file->path);

            if (file_exists($filePath)) {
                $zip->addFile(
                    $filePath,
                    $zipPath . '/' . $file->name
                );
            } else {
                \Log::warning('File not found during ZIP creation: ' . $filePath);
            }
        }

        // Recursively add child folders
        foreach ($folder->children as $child) {
            $this->addFolderToZip(
                $zip,
                $child,
                $zipPath . '/' . $child->name
            );
        }
    }
}
