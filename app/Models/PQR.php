<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\DocumentType;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PQR extends Model
{
    use HasFactory;

    protected $table = 'p_q_r_s';
    protected $fillable = [
        'description',
        'affair',
        'response_time',
        'state',
        'user_id',
        'responsible_id',
        'dependency_id'
    ];


    protected $casts = [
        'state' => 'boolean',
        'response_time' => 'date',
    ];

    //Relaciones
     public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function responsible()
    {
        return $this->belongsTo(User::class, 'responsible_id');
    }

    public function dependency()
    {
        return $this->belongsTo(Dependency::class);
    }

    public function attachedSupports(){
        return $this->hasMany(AttachedSupport::class, 'pqr_id');
    }
}
