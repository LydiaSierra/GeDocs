<?php

namespace Database\Seeders;

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


        $user = User::factory()->create([
            'type_document'      => 'CC',
            'document_number'    => 1020304050,
            'name'               => 'Julio Alexis',
            'email'              => 'julioalexishoyoscolorado@gmail.com',
            'status'             => 'active',
        ]);
        $user->assignRole('admin');

        $this->call([
            SheetSeeder::class,
        ]);
    }
}
