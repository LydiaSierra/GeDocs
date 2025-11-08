<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\TypeEnum;

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
        'asunto',
        'descripcion'
    ];

    //Enum -> select document type
    protected $casts = [
        'document_type' => TypeEnum::class,
    ];
}
