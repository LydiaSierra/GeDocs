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
        $sheet1 = Sheet_number::create([
            "number" => "3002085"
        ]);

        $sheet2 = Sheet_number::create([
            "number" => "3002082"
        ]);
        
        $userInstructor = User::find(2) ?? User::first();
        $userAprendiz = User::find(4) ?? User::first();

        if ($userInstructor && $userAprendiz) {
            $sheet1->users()->attach($userInstructor->id);
            $sheet1->users()->attach($userAprendiz->id);
        }
    }
}
