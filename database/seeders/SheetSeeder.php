<?php

namespace Database\Seeders;

use App\Models\Sheet_number;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Dependency;

class SheetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //Crea la ficha
        $sheet = Sheet_number::create([
            "number" => 3002085,
        ]);

        //Crea dependencia de ventanilla unica
        $ventanilla = Dependency::create([
            'name' => 'Ventanilla Unica',
            'sheet_number_id' => $sheet->id,
        ]);

        // Actualizar la ficha con el id de la ventanilla unica
        $sheet->ventanilla_unica_id = $ventanilla->id;
        $sheet->save();

        $sheet1 = Sheet_number::create([
            "number" => "3002086"
        ]);

        $sheet2 = Sheet_number::create([
            "number" => "3002082"
        ]);
        
        $userInstructor = User::find(2) ?? User::first();
        $userAprendiz = User::find(4) ?? User::first();

        if ($userInstructor && $userAprendiz) {
            $sheet1->users()->attach($userInstructor->id);
            $sheet1->users()->attach($userAprendiz->id);
            $sheet2->users()->attach($userInstructor->id);
        }
    }
}
