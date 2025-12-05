<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttachedSupport extends Model
{
    use HasFactory;

    protected $table = 'attached_supports';

    protected $fillable = [
        'name',
        'path',
        'type',
        'size',
        'pqr_id',
        'comunication_id'
    ];

    public function pqr()
    {
        return $this->belongsTo(PQR::class, 'pqr_id');
    }

    public function comunication(){
        return $this->belongsTo(comunication::class, 'comunication_id');
    }

}
