<?php

namespace Database\Seeders;

use App\Models\Folder;
use App\Models\Role;
use App\Models\User;
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
        // User::factory(10)->create();

//        User::factory()->create([
//            'name' => 'Julio Alexis',
//            'email' => 'julioalexishoyoscolorado@gamil.com',
//            'type_document' => '1097007444',
//
//
//        ]);

        Role::create([
            'name' => 'admin'
        ]);
        Role::create([
            'name' => 'user'
        ]);
        Role::create([
            'name' => 'dependent'
        ]);

        Folder::create([
            'name' => 'Gerencia General',
            'parent_id' => null,
            'type' => 'folder',
            'document_code' => 101,
        ]);

        Folder::create([
            'name' => 'Oficina de control interno',
            'parent_id' => null,
            'type' => 'folder',
            'document_code' => 102,
        ]);
        Folder::create([
            'name' => 'Oficina Juridica',
            'parent_id' => null,
            'type' => 'folder',
            'document_code' => 103,
        ]);


        Folder::create([
            'name' => 'folder',
            'parent_id' => 1,
            'type' => 'folder',
            'document_code' => 100,
        ]);


    }
}
