<?php

namespace Database\Seeders;

use App\Models\File;
use App\Models\Folder;
use App\Models\Role;
use App\Models\User;
use App\Models\PQR;
use App\DocumentType;
use App\Models\Dependency;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call([
            FoldersSeeder::class,
        ]);

        Role::create([
            'name' => 'admin'
        ]);
        Role::create([
            'name' => 'instructor'
        ]);
        Role::create([
            'name' => 'user'
        ]);
        Role::create([
            'name' => 'dependent'
        ]);



        User::factory()->create([
            'type_document'      => 'CC',
            'document_number'    => '1020304050',
            'name'               => 'Julio Alexis',
            'email'              => 'julioalexishoyoscolorado@gmail.com',
            'role'               => 'admin',
            'technical_sheet' => null,
            'status'             => 'activo',
        ]);
    }
}
