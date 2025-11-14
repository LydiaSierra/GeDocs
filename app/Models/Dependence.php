<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dependence extends Model
{
    protected $table = 'dependencies';  // ← Especificar la tabla correcta

    protected $fillable = [
        'name'
    ];

    // Relación con usuarios
    public function users()
    {
        return $this->hasMany(User::class, 'dependency_id');
    }

    // Relación con PQRs
    public function pqrs()
    {
        return $this->hasMany(PQR::class, 'dependency_id');
    }
}
