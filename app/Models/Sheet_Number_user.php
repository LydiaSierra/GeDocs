<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sheet_Number_user extends Model
{
    use HasFactory;

    protected $fillable = ['name']; 

    public function users()
    {
        return $this->hasMany(User::class);
    }
    
    public function sheets()
    {
        return $this->hasMany(Sheet_number::class);
    }
}
