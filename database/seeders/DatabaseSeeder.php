<?php

namespace Database\Seeders;

use App\Models\Folder;
use App\Models\Role;
use App\Models\User;
use App\Models\PQR;
use App\DocumentType;
use App\Models\Dependence;
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
       // 1. Crear roles correctos
        $roleUsuario = Role::firstOrCreate(['name' => 'usuario']);
        $roleEncargado = Role::firstOrCreate(['name' => 'encargado']);
        $roleSuperadmin = Role::firstOrCreate(['name' => 'superadmin']);

        // 2. Crear dependencias
        $depSistemas = Dependence::firstOrCreate(['name' => 'Sistemas e Informática']);
        $depRRHH = Dependence::firstOrCreate(['name' => 'Recursos Humanos']);

        // 3. Crear usuarios de prueba
        $usuarioFinal = User::firstOrCreate([
            'email' => 'usuario@test.com'
        ], [
            'name' => 'Usuario Final',
            'last_name' => 'Prueba',
            'type_document' => DocumentType::CEDULA,
            'phone' => '1234567890',
            'password' => bcrypt('password'),
            'role_id' => $roleUsuario->id,
        ]);

        $encargado = User::firstOrCreate([
            'email' => 'encargado@test.com'
        ], [
            'name' => 'Encargado',
            'last_name' => 'Sistemas',
            'type_document' => DocumentType::CEDULA,
            'phone' => '0987654321',
            'password' => bcrypt('password'),
            'role_id' => $roleEncargado->id,
            'dependency_id' => $depSistemas->id,
        ]);

        $superadmin = User::firstOrCreate([
            'email' => 'admin@test.com'
        ], [
            'name' => 'Super',
            'last_name' => 'Admin',
            'type_document' => DocumentType::CEDULA,
            'phone' => '5555555555',
            'password' => bcrypt('password'),
            'role_id' => $roleSuperadmin->id,
        ]);

        // 4. Crear PQR de ejemplo
        PQR::firstOrCreate([
            'document' => '12345678',
            'email' => 'usuario@test.com'
        ], [
            'document_type' => DocumentType::CEDULA,
            'name' => 'Usuario Ejemplo',
            'address' => 'Calle 123',
            'phone' => '1234567890',
            'affair' => 'Problema con el sistema',
            'description' => 'No puedo acceder al sistema de gestión documental',
            'state' => 'pendiente',
            'user_id' => $usuarioFinal->id,
        ]);

        $this->command->info('Datos de prueba creados exitosamente');

    }
}
