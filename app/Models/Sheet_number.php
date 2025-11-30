<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sheet_number extends Model
{
    use HasFactory;

    protected $fillable = [
        "number",
        'ventanilla_unica_id',
    ];

    //

    public function users(){
        return $this->belongsToMany(User::class, "sheet_number_user", "sheet_number_id", "user_id");
    }

    public function dependencies()
    {
        return $this->hasMany(Dependency::class);
    }
}
