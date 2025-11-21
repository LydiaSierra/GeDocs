<?php

namespace Database\Seeders;

use App\Models\Dependency;
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

        $this->call([
            FoldersSeeder::class,
            RoleSeeder::class,
        ]);

       

           // Crear dependencias
        $recursosHumanos = Dependency::create(['name' => 'Recursos Humanos']);
        $sistemas = Dependency::create(['name' => 'Sistemas']);
        $academica = Dependency::create(['name' => 'Académica']);
        $financiera = Dependency::create(['name' => 'Financiera']);




        //Usuario admin
        $userAdmin = User::create([
            'type_document'      => 'CC',
            'document_number'    => 1020304050,
            'name'               => 'Julio Alexis',
            'email'              => 'julioalexishoyoscolorado@gmail.com',
            'password' => bcrypt('password'),
            'status'             => 'active',
        ]);

        $userAdmin->assignRole('Admin');


        //Usuario Instructor
        $userInstructor = User::create([
            'type_document'      => 'CC',
            'document_number'    => 1094454354,
            'name'               => 'Instructor User',
            'email'              => 'instructor@gmail.com',
            'password' => bcrypt('password'),
            'status'             => 'active',
        ]);

        $userInstructor->assignRole('Instructor');

    

         // Usuario dependiente (encargado)
        $dependencia = User::create([
            'type_document' => 'CC',
            'document_number' => 1020304051,
            'name' => 'Carlos Dependent',
            'email' => 'dependent@test.com',
            'password' => bcrypt('password'),
            'status' => 'activo',
        ]);

        $dependencia->assignRole('Dependencia');


         // Usuario normal
        $aprendiz = User::create([
            'type_document' => 'CC',
            'document_number' => 1020304052,
            'name' => 'Maria User',
            'email' => 'user@test.com',
            'password' => bcrypt('password'),
            'status' => 'activo',
        ]);
        $aprendiz->assignRole('Aprendiz');


         $this->call([
            SheetSeeder::class,
        ]);
    }
}
