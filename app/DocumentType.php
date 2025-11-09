<?php

namespace App;

enum DocumentType: string
{
    case CEDULA = 'cedula';
    case TARJETA_IDENTIDAD = 'tarjeta_identidad';
    case PASAPORTE = 'pasaporte';
    case CEDULA_EXTRANJERIA = 'cedula_extranjeria';

    //Metodo para obtener los nombres
    public function label(): string
    {
        return match($this) {
            self::CEDULA => 'Cédula de Ciudadanía',
            self::TARJETA_IDENTIDAD => 'Tarjeta de Identidad',
            self::PASAPORTE => 'Pasaporte',
            self::CEDULA_EXTRANJERIA => 'Cédula de Extranjería',
        };
    }

    //Metodo para obtener todos los valores como array
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
