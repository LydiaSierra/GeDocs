<?php

namespace Database\Seeders;

use App\Models\Folder;
use App\Models\Sheet_number;
use Illuminate\Database\Seeder;

class FoldersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates the full folder structure for EACH sheet_number (ficha).
     */
    public function run(): void
    {
        $sheets = Sheet_number::all();

        foreach ($sheets as $sheet) {
            $this->createFolderStructure($sheet->id);
        }
    }

    /**
     * Creates the complete folder structure for a given sheet inside the current year.
     */
    private function createFolderStructure(int $sheetId): void
    {
        $currentYear = date('Y');

        // Create the Year folder first
        $yearFolder = Folder::create([
            'name' => (string)$currentYear,
            'year' => $currentYear,
            'sheet_number_id' => $sheetId,
            'parent_id' => null,
            'active' => true,
            'department' => 'Año',
            'folder_code' => $currentYear
        ]);

        // Map of temp key => real folder ID (to resolve parent references)
        $map = [];

        // Define all folders with temp keys and optional parent temp keys
        // Format: [tempKey, name, parentTempKey|null, folder_code, department]
        $folders = [
            // ── Secciones (root of year) ──
            [1, 'Ventanilla Única', null, null, 'sección'],
        ];

        // Create each folder, resolving parent IDs through the map
        foreach ($folders as [$tempKey, $name, $parentTempKey, $folderCode, $department]) {
            $parentId = $parentTempKey ? ($map[$parentTempKey] ?? $yearFolder->id) : $yearFolder->id;

            $folder = Folder::create([
                'name' => $name,
                'parent_id' => $parentId,
                'folder_code' => $folderCode,
                'department' => $department,
                'sheet_number_id' => $sheetId,
                'active' => true,
            ]);

            $map[$tempKey] = $folder->id;
        }
    }
}
