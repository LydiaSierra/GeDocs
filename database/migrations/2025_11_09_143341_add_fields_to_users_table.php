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
        Schema::table('users', function (Blueprint $table) {
            $table->string('type_document')->nullable();
            $table->string('last_name')->nullable();
            $table->string('phone')->nullable();
            $table->foreignId('role_id')->nullable()->constrained('roles')->onDelete('set null');
            //OnDelete -> Evita errores si se eliminan registros relacionados
            $table->foreignId('dependency_id')->nullable()->constrained('dependencies')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropForeign(['dependency_id']);
            $table->dropColumn(['type_document', 'last_name', 'phone', 'role_id', 'dependency_id']);
        });
    }
};
