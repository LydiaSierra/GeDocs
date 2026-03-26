<?php

namespace Database\Seeders;

use App\Models\Dependency;
use App\Models\PQR;
use App\Models\Sheet_number;
use App\Models\User;
use Illuminate\Database\Seeder;

class VencidosVisualTestSeeder extends Seeder
{
    /**
     * Seed mixed PQR data for visual testing of the Vencidos section.
     */
    public function run(): void
    {
        $loremDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus, nulla gravida orci a odio, vehicula vulputate justo sem at ipsum. Integer in mauris eu nibh euismod gravida. Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis velit, rhoncus eu, luctus et interdum adipiscing wisi. Aliquam erat ac ipsum. Integer aliquam purus.';

        $sheet = Sheet_number::firstOrCreate(
            ['number' => '3999001'],
            ['state' => 'Activa']
        );

        $dependency = Dependency::firstOrCreate(
            ['name' => 'Dependencia Visual Vencidos', 'sheet_number_id' => $sheet->id]
        );

        if (!$sheet->ventanilla_unica_id) {
            $sheet->ventanilla_unica_id = $dependency->id;
            $sheet->save();
        }

        $creator = User::firstOrCreate(
            ['email' => 'visual.creator@sena.edu.co'],
            [
                'type_document' => 'CC',
                'document_number' => 99000001,
                'name' => 'Visual Creator',
                'password' => bcrypt('Password123!'),
                'status' => 'active',
                'dependency_id' => $dependency->id,
            ]
        );

        $responsible = User::firstOrCreate(
            ['email' => 'visual.responsible@sena.edu.co'],
            [
                'type_document' => 'CC',
                'document_number' => 99000002,
                'name' => 'Visual Responsible',
                'password' => bcrypt('Password123!'),
                'status' => 'active',
                'dependency_id' => $dependency->id,
            ]
        );

        if (method_exists($creator, 'assignRole')) {
            $creator->assignRole('Aprendiz');
        }

        if (method_exists($responsible, 'assignRole')) {
            $responsible->assignRole('Dependencia');
        }

        $requests = ['Peticion', 'Queja', 'Reclamo', 'Sugerencia', 'Otro'];
        $now = now();

        // 6 overdue + pending (should auto-appear in Vencidos after API read)
        for ($i = 1; $i <= 6; $i++) {
            PQR::create([
                'sender_name' => "Solicitante Vencido {$i}",
                'description' => "{$loremDescription} [VENCIDA {$i}]",
                'affair' => "PQR Vencida {$i}",
                'response_days' => 10,
                'response_time' => $now->copy()->subDays($i)->toDateString(),
                'state' => false,
                'archived' => false,
                'user_id' => $creator->id,
                'responsible_id' => $responsible->id,
                'dependency_id' => $dependency->id,
                'request_type' => $requests[$i % count($requests)],
                'sheet_number_id' => $sheet->id,
                'response_status' => 'pending',
                'email' => "visual.vencida.{$i}@correo.com",
                'document_type' => 'CC',
                'document' => 'V' . str_pad((string) $i, 5, '0', STR_PAD_LEFT),
            ]);
        }

        // 4 in-time + pending (must stay out of Vencidos)
        for ($i = 1; $i <= 4; $i++) {
            PQR::create([
                'sender_name' => "Solicitante Vigente {$i}",
                'description' => "{$loremDescription} [VIGENTE {$i}]",
                'affair' => "PQR Vigente {$i}",
                'response_days' => 10,
                'response_time' => $now->copy()->addDays($i + 1)->toDateString(),
                'state' => false,
                'archived' => false,
                'user_id' => $creator->id,
                'responsible_id' => $responsible->id,
                'dependency_id' => $dependency->id,
                'request_type' => $requests[($i + 1) % count($requests)],
                'sheet_number_id' => $sheet->id,
                'response_status' => 'pending',
                'email' => "visual.vigente.{$i}@correo.com",
                'document_type' => 'CC',
                'document' => 'G' . str_pad((string) $i, 5, '0', STR_PAD_LEFT),
            ]);
        }

        // 2 responded (must stay in Enviados and never be auto-archived by overdue job)
        for ($i = 1; $i <= 2; $i++) {
            PQR::create([
                'sender_name' => "Solicitante Respondida {$i}",
                'description' => "{$loremDescription} [RESPONDIDA {$i}]",
                'affair' => "PQR Respondida {$i}",
                'response_days' => 10,
                'response_time' => $now->copy()->subDays($i + 1)->toDateString(),
                'state' => true,
                'archived' => false,
                'user_id' => $creator->id,
                'responsible_id' => $responsible->id,
                'dependency_id' => $dependency->id,
                'request_type' => $requests[($i + 2) % count($requests)],
                'sheet_number_id' => $sheet->id,
                'response_status' => 'responded',
                'response_message' => 'Respuesta de prueba visual',
                'response_date' => $now->copy()->subDays($i),
                'email' => "visual.respondida.{$i}@correo.com",
                'document_type' => 'CC',
                'document' => 'R' . str_pad((string) $i, 5, '0', STR_PAD_LEFT),
            ]);
        }
    }
}
