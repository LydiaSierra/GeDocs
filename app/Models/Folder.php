<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Folder extends Model
{
    use hasFactory;
    protected $fillable = [
        'name',
        'parent_id',
        'type',
        'folder_code',
        'path',
        'departament',
    ];
    public function files(){
        return $this->hasMany(File::class);
    }

}
