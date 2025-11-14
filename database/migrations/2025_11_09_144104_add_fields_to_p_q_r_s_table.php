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
        Schema::create('p_q_r_s', function (Blueprint $table) {
            $table->id();
            $table->enum('document_type', ['cedula', 'tarjeta_identidad', 'pasaporte', 'cedula_extranjeria']);
            $table->string('document');
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('affair')->nullable();
            $table->text('description');
            $table->date('response_time')->nullable();
            $table->enum('state', ['pendiente', 'asignado', 'resuelto'])->default('pendiente');

            //Foreign keys
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('responsible_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('dependency_id')->nullable()->constrained('dependencies')->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::dropIfExists('p_q_r_s');
    }
};
