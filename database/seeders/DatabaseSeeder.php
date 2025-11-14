<?php

namespace Database\Seeders;

use App\Models\File;
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
        $this->call([
            FoldersSeeder::class,
        ]);
        User::factory()->create([
            'name' => 'Julio Alexis',
            'email' => 'julioalexishoyoscolorado@gmail.com',
        ]);

        Role::create([
            'name' => 'admin'
        ]);
        Role::create([
            'name' => 'user'
        ]);
        Role::create([
            'name' => 'dependent'
        ]);

        File::create([
            'name' => 'file1',
            "file_path" => "asdfasdfasdf",
            "type" => "file",
            "size" => 412341324,
            "folder_id" => 54
        ]);


    }
}
