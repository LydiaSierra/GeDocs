<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\DocumentType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    //Campos que se pueden asignar con el create o update
    protected $fillable = [
        'name',
        'email',
        'password',
        'type_document',
        'last_name',
        'phone',
        'role_id',
        'dependency_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    //campos que no se mostraran en el json por seguridad
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */

    //Convierten los tipos de datos
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'type_document' => DocumentType::class,
        ];
    }

    //Relaciones
     public function role()
    {
        //Un usuario pertenece a un rol
        return $this->belongsTo(Role::class);
    }

    public function dependency()
    {
        return $this->belongsTo(Dependence::class);
    }

    public function createdPQRs()
    {
        //El usuario puede tener muchas pqrs creadas
        return $this->hasMany(PQR::class, 'user_id');
    }

    public function assignedPQRs()
    {
        return $this->hasMany(PQR::class, 'responsible_id');
    }
}
