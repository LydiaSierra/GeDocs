<?php

namespace Database\Seeders;

use App\Models\Sheet_number;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SheetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sheet = Sheet_number::create([
            "number" => 3002085
        ]);
        $user = User::find(1) ?? User::first();

        if($user){
            $sheet->users()->attach($user->id);
        }
    }
}
