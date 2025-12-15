<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Folder extends Model
{
    use hasFactory;
    protected $fillable = [
        'name',
        'parent_id',

        'folder_code',

        'department',
    ];

    public function parent()
    {
        return $this->belongsTo(Folder::class, 'parent_id');
    }
    public function children()
    {
        return $this->hasMany(Folder::class, 'parent_id', 'id');
    }
    public function files()
    {
        return $this->hasMany(File::class);
    }

    public function folder()
    {
        return $this->belongsTo(Folder::class);
    }

    public function getIsPdfAttribute()
    {
        return $this->extension === 'pdf';
    }
}
