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
        \App\Services\FolderStructureService::createDefaultStructure($sheetId, (int)date('Y'));
    }
}
