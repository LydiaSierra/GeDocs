<?php

namespace Database\Seeders;

use App\Models\Dependency;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Sheet_number;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call([
            RoleSeeder::class,
            SheetSeeder::class,
            FoldersSeeder::class,
        ]);



        //Dependencias
        // Busca una ficha existente para asociar dependencias adicionales
        $sheet = Sheet_number::first();

        if ($sheet) {
            $recursosHumanos = Dependency::firstOrCreate([
                'name' => 'Recursos Humanos',
                'sheet_number_id' => $sheet->id,
            ]);
            Dependency::firstOrCreate([
                'name' => 'Sistemas',
                'sheet_number_id' => $sheet->id,
            ]);
            Dependency::firstOrCreate([
                'name' => 'Académica',
                'sheet_number_id' => $sheet->id,
            ]);
            Dependency::firstOrCreate([
                'name' => 'Financiera',
                'sheet_number_id' => $sheet->id,
            ]);
        }




        //Usuario admin
        $userAdmin = User::create([
            'type_document' => 'CC',
            'document_number' => 1020304050,
            'name' => 'Julio Alexis',
            'email' => 'julioalexishoyoscolorado@gmail.com',
            'password' => bcrypt('password'),
            'status' => 'active',
        ]);

        $userAdmin->assignRole('Admin');


        //Usuario Instructor
        $userInstructor = User::create([
            'type_document' => 'CC',
            'document_number' => 1094454354,
            'name' => 'Instructor User',
            'email' => 'instructor@gmail.com',
            'password' => bcrypt('password'),
            'status' => 'active',
        ]);

        $userInstructor->assignRole('Instructor');




        // Usuario dependiente (encargado)
        $dependencia = User::create([
            'type_document' => 'CC',
            'document_number' => 1020304051,
            'name' => 'Carlos Dependent',
            'email' => 'dependent@test.com',
            'password' => bcrypt('password'),
            'status' => 'pending',
        ]);

        $dependencia->assignRole('Dependencia');


        // Usuario normal
        $aprendiz = User::create([
            'type_document' => 'CC',
            'document_number' => 1020304052,
            'name' => 'Maria User',
            'email' => 'user@test.com',
            'password' => bcrypt('password'),
            'status' => 'pending',
        ]);
        $aprendiz->assignRole('Aprendiz');

        $this->call([
            PQRSeeder::class,
        ]);
    }


}
