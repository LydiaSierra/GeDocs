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

        //Creacion de roles
        $adminRole = Role::create(['name' => 'admin']);
        $instructorRole = Role::create(['name' => 'instructor']);
        $userRole = Role::create(['name' => 'user']);
        $dependentRole = Role::create(['name' => 'dependent']);

           // Crear dependencias
        $recursosHumanos = Dependency::create(['name' => 'Recursos Humanos']);
        $sistemas = Dependency::create(['name' => 'Sistemas']);
        $academica = Dependency::create(['name' => 'Académica']);
        $financiera = Dependency::create(['name' => 'Financiera']);


        //Usuario admin
        User::create([
            'type_document'      => 'CC',
            'document_number'    => '1020304050',
            'name'               => 'Julio Alexis',
            'email'              => 'julioalexishoyoscolorado@gmail.com',
            'password' => bcrypt('password'),
            'role_id'               => $adminRole->id,
            'technical_sheet' => null,
            'status'             => 'activo',
        ]);

         // Usuario dependiente (encargado)
        User::create([
            'type_document' => 'CC',
            'document_number' => '1020304051',
            'name' => 'Carlos Dependent',
            'email' => 'dependent@test.com',
            'password' => bcrypt('password'),
            'role_id' => $dependentRole->id,
            'technical_sheet' => null,
            'status' => 'activo',
        ]);

         // Usuario normal
        User::create([
            'type_document' => 'CC',
            'document_number' => '1020304052',
            'name' => 'Maria User',
            'email' => 'user@test.com',
            'password' => bcrypt('password'),
            'role_id' => $userRole->id,
            'technical_sheet' => null,
            'status' => 'activo',
        ]);
    }
}
