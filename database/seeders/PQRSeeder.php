<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PQR;

class PQRSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PQR::insert([
            [
                'description' => 'PQR de ejemplo 1',
                'user_id' => 1,
                'affair' => 'Asunto 1',
                'response_days' => 5,
                'response_time' => now()->addDays(5),
                'state' => false,
                'responsible_id' => 2,
                'dependency_id' => 1,
                'email' => 'ejemplo1@correo.com',
                'document' => 'DOC001',
                'sheet_number_id' => 1,
                'request_type' => 'peticion',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'description' => 'PQR de ejemplo 2',
                'user_id' => 2,
                'affair' => 'Asunto 2',
                'response_days' => 3,
                'response_time' => now()->addDays(3),
                'state' => false,
                'responsible_id' => 3,
                'dependency_id' => 2,
                'email' => 'ejemplo2@correo.com',
                'document' => 'DOC002',
                'sheet_number_id' => 1,
                'request_type'=> 'queja',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'description' => 'PQR de ejemplo 3',
                'user_id' => 3,
                'affair' => 'Asunto 3',
                'response_days' => 7,
                'response_time' => now()->addDays(7),
                'state' => false,
                'responsible_id' => 1,
                'dependency_id' => 3,
                'email' => 'ejemplo3@correo.com',
                'document' => 'DOC003',
                'sheet_number_id' => 1,
                'request_type'=>'reclamo',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'description' => 'PQR de ejemplo 4',
                'user_id' => 1,
                'affair' => 'Asunto 4',
                'response_days' => 2,
                'response_time' => now()->addDays(2),
                'state' => false,
                'responsible_id' => 2,
                'dependency_id' => 1,
                'email' => 'ejemplo4@correo.com',
                'document' => 'DOC004',
                'sheet_number_id' => 1,
                'request_type'=>'sugerencia',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'description' => 'PQR de ejemplo 5',
                'user_id' => 2,
                'affair' => 'Asunto 5',
                'response_days' => 4,
                'response_time' => now()->addDays(4),
                'state' => false,
                'responsible_id' => 3,
                'dependency_id' => 2,
                'email' => 'ejemplo5@correo.com',
                'document' => 'DOC005',
                'sheet_number_id' => 1,
                'request_type'=>'peticion',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
