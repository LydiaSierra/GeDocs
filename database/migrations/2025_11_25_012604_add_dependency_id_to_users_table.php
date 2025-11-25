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
            $table->unsignedBigInteger('dependency_id')->nullable()->after('id');
            $table->foreign('dependency_id')->references('id')->on('dependencies');
        });
    }

    /**
     * Reverse the migrations.
     */
    //la funcion de down sirve para que se puedan revertir los cambios en la base de datos con un migrate:rollback
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['dependency_id']);
            $table->dropColumn('dependency_id');
        });
    }
};
