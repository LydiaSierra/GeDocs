<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sheet_number extends Model
{
    use HasFactory;

    protected $fillable = [
        "number",
        "active",
        "state"
    ];

    public function users(){
        return $this->belongsToMany(User::class, "sheet_number_user", "sheet_number_id", "user_id");
    }
}
