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
        Schema::create('file__p_q_r_s', function (Blueprint $table) {
            $table->foreignId('file_id')->constrained('files');
            $table->foreignId('pqr_id')->constrained('p_q_r_s');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file__p_q_r_s');
    }
};
