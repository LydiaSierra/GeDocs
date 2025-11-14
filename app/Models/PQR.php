<?php

namespace App\Models;

use App\DocumentType;
use Illuminate\Database\Eloquent\Model;


class PQR extends Model
{
    protected $table = 'p_q_r_s';
    protected $fillable = [
        'document_type',
        'document',
        'name',
        'address',
        'email',
        'phone',
        'affair',
        'description',
        'response_time',
        'state',
        'user_id',
        'responsible_id',
        'dependency_id'
    ];


    protected $casts = [
        'document_type' => DocumentType::class,
        'state' => 'string',
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
        return $this->belongsTo(Dependence::class);
    }
}
