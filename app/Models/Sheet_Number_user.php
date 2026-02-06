<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sheet_number_user extends Model
{
    //
        protected $table = "Sheet_number_user";

        //Relaciones
        public function users(){
            return $this->belongsToMany(User::class, "sheet_number_user", "sheet_number_id", "user_id");
        }

        public function sheetNumbers(){
            return $this->belongsToMany(Sheet_number::class, 'sheet_number_user', 'user_id', 'sheet_number_id');
        }
}
