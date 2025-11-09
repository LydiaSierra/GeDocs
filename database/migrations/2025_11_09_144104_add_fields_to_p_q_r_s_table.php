<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('p_q_r_s', function (Blueprint $table) {
            $table->enum('document_type', ['cedula', 'tarjeta_identidad', 'pasaporte', 'cedula_extranjeria']);
            $table->string('document');
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('affair')->nullable();
            $table->date('response_time')->nullable();
            $table->enum('state', ['pendiente', 'asignado', 'resuelto'])->default('pendiente');
            $table->foreignId('responsible_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('dependency_id')->nullable()->constrained('dependencies')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('p_q_r_s', function (Blueprint $table) {
             $table->dropForeign(['responsible_id']);
            $table->dropForeign(['dependency_id']);
            $table->dropColumn([
                'document_type', 'document', 'name', 'address', 'email',
                'phone', 'affair', 'response_time', 'state',
                'responsible_id', 'dependency_id'
            ]);
        });
    }
};
