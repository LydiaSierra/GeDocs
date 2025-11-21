<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dependency extends Model
{
     use HasFactory;

    protected $fillable = ['name'];

    public function pqrs()
    {
        return $this->hasMany(PQR::class);
    }
}
