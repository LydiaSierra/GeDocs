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
            VencidosVisualTestSeeder::class,
        ]);

        //Usuario admin
        $userAdmin = User::create([
            'type_document' => 'CC',
            'document_number' => 0000000001,
            'name' => 'Oriana Buitrago',
            'profile_photo' => null,
            'email' => 'obuitragon@sena.edu.co',
            'password' => bcrypt('Oriana12'),
            'status' => 'active',
        ]);

        $userAdmin->assignRole('Admin');

    }
}
