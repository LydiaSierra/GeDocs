<?php

namespace Database\Seeders;

use App\Models\Folder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FoldersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Folder::create([
            'name' => 'Gerencia General',
            'parent_id' => null,
            'type' => 'folder',
            'folder_code' => 100,
            'departament' => "sección"
        ]);
        Folder::create([
            'name' => 'Oficina de Control Interno',
            'parent_id' => null,
            'type' => 'folder',
            'folder_code' => 101,
            'departament' => "sección"
        ]);

        Folder::create([
            'name' => 'Oficina Jurídica',
            'parent_id' => null,
            'type' => 'folder',
            'folder_code' => 102,
            'departament' => "sección"
        ]);


        //subsecciones
        Folder::create([
            'name' => 'Dirección administrativa y Financiera',
            'parent_id' => 1,
            'type' => 'folder',
            'folder_code' => 110,
            'departament' => "Subsección"
        ]);

        Folder::create([
            'name' => 'Dirección Técnica',
            'parent_id' => 1,
            'type' => 'folder',
            'folder_code' => 120,
            'departament' => "Subsección"
        ]);

        Folder::create([
            'name' => 'ACTAS',
            'parent_id' => 4,
            'type' => 'folder',
            'folder_code' => 2,
            'departament' => "Serie"
        ]);
        Folder::create([
            'name' => 'CIRCULARES',
            'parent_id' => 4,
            'type' => 'folder',
            'folder_code' => 4,
            'departament' => "Serie"
        ]);
        Folder::create([
            'name' => 'CONSECUTIVOS DE COMUNICACIONES OFICIALES',
            'parent_id' => 4,
            'type' => 'folder',
            'folder_code' => 9,
            'departament' => "Serie"
        ]);
        Folder::create([
            'name' => 'INFORMES',
            'parent_id' => 4,
            'type' => 'folder',
            'folder_code' => 16,
            'departament' => "Serie"
        ]);
        Folder::create([
            'name' => 'INSTRUMENTOS ARCHIVÍSTICOS',
            'parent_id' => 4,
            'type' => 'folder',
            'folder_code' => 17,
            'departament' => "Serie"
        ]);

        Folder::create([
            'name' => 'NOMINA',
            'parent_id' => 4,
            'type' => 'folder',
            'folder_code' => 24,
            'departament' => "Serie"
        ]);

        Folder::create([
            'name' => 'ACTAS',
            'parent_id' => 5,
            'type' => 'folder',
            'folder_code' => 2,
            'departament' => "Serie"
        ]);
        Folder::create([
            'name' => 'DERECHOS DE PETICIÓN',
            'parent_id' => 5,
            'type' => 'folder',
            'folder_code' => 12,
            'departament' => "Serie"
        ]);
        Folder::create([
            'name' => 'PROYECTOS',
            'parent_id' => 5,
            'type' => 'folder',
            'folder_code' => 29,
            'departament' => "Serie"
        ]);
        Folder::create([
            'name' => 'REPORTES DE VISITAS DE CAMPO',
            'parent_id' => 5,
            'type' => 'folder',
            'folder_code' => 31,
            'departament' => "Serie"
        ]);
        Folder::create([
            'name' => 'Actas de comité Técnico a la Contratación',
            'parent_id' => 12,
            'type' => 'folder',
            'folder_code' => 8,
            'departament' => "Subserie"
        ]);
        Folder::create([
            'name' => 'Proyectos de Inversión',
            'parent_id' => 14,
            'type' => 'folder',
            'folder_code' => 1,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => 'Actas de Comité Institucional de Gestión y Desempeño',
            'parent_id' => 6,
            'type' => 'folder',
            'folder_code' => 6,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => 'Actas de Eliminacón Documental',
            'parent_id' => 6,
            'type' => 'folder',
            'folder_code' => 9,
            'departament' => "Subserie"
        ]);
        Folder::create([
            'name' => 'Circulares Informativas',
            'parent_id' => 7,
            'type' => 'folder',
            'folder_code' => 2,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => 'Consecutivos de Comunicaciones Oficiales Enviadas',
            'parent_id' => 8,
            'type' => 'folder',
            'folder_code' => 1,
            'departament' => "Subserie"
        ]);
        Folder::create([
            'name' => 'Consecutivos de Comunicaciones Oficiales Recibidas',
            'parent_id' => 8,
            'type' => 'folder',
            'folder_code' => 2,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => 'Informes de Ejecución Presupuestal',
            'parent_id' => 9,
            'type' => 'folder',
            'folder_code' => 3,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => 'Informes Trimestrales de Seguimiento al Modelo Integrado de Planeación y COntrol MIPG',
            'parent_id' => 9,
            'type' => 'folder',
            'folder_code' => 5,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => 'Bancos Terminológicos de Series Y Subseries Documentales',
            'parent_id' => 10,
            'type' => 'folder',
            'folder_code' => 1,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => 'Cuadros de Clasificación Documental',
            'parent_id' => 10,
            'type' => 'folder',
            'folder_code' => 2,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => "Inventarios Documentales de Archivo Cental",
            'parent_id' => 10,
            'type' => 'folder',
            'folder_code' => 3,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => 'Planes Institucionales de Archivos - PINAR',
            'parent_id' => 10,
            'type' => 'folder',
            'folder_code' => 4,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => 'Programas de Gestión Documental PGD',
            'parent_id' => 10,
            'type' => 'folder',
            'folder_code' => 5,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => 'Tablas de Control de Acceso',
            'parent_id' => 10,
            'type' => 'folder',
            'folder_code' => 6,
            'departament' => "Subserie"
        ]);


        Folder::create([
            'name' => 'Tabla de Retención Documental TRD',
            'parent_id' => 10,
            'type' => 'folder',
            'folder_code' => 7,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => 'Tablas de Valoración Documental TVD',
            'parent_id' => 10,
            'type' => 'folder',
            'folder_code' => 8,
            'departament' => "Subserie"
        ]);


        Folder::create([
            'name' => 'ACCIONES CONSTITUCIONALES',
            'parent_id' => 3,
            'type' => 'folder',
            'folder_code' => 1,
            'departament' => "Serie"
        ]);

        Folder::create([
            'name' => 'ACTAS',
            'parent_id' => 3,
            'type' => 'folder',
            'folder_code' => 2,
            'departament' => "Serie"
        ]);

        Folder::create([
            'name' => 'CONCEPTOS',
            'parent_id' => 3,
            'type' => 'folder',
            'folder_code' => 7,
            'departament' => "Serie"
        ]);

        Folder::create([
            'name' => 'DERECHOS DE PETICIÓN',
            'parent_id' => 3,
            'type' => 'folder',
            'folder_code' => 12,
            'departament' => "Serie"
        ]);

        Folder::create([
            'name' => "Acciones de Cumplimiento",
            'parent_id' => 33,
            'type' => 'folder',
            'folder_code' => 1,
            'departament' => "SubSerie"
        ]);

        Folder::create([
            'name' => "Acciones de Tutela",
            'parent_id' => 33,
            'type' => 'folder',
            'folder_code' => 2,
            'departament' => "SubSerie"
        ]);

        Folder::create([
            'name' => "Actas de Comité de Conciliación y Defensa Jurídica",
            'parent_id' => 34,
            'type' => 'folder',
            'folder_code' => 2,
            'departament' => "SubSerie"
        ]);

        Folder::create([
            'name' => "Conceptos Juríridicos",
            'parent_id' => 35,
            'type' => 'folder',
            'folder_code' => 1,
            'departament' => "SubSerie"
        ]);

        Folder::create([
            'name' => "ACTAS",
            'parent_id' => 2,
            'type' => 'folder',
            'folder_code' => 2,
            'departament' => "Serie"
        ]);

        Folder::create([
            'name' => "INFORMES",
            'parent_id' => 2,
            'type' => 'folder',
            'folder_code' => 16,
            'departament' => "Serie"
        ]);

        Folder::create([
            'name' => "PLANES",
            'parent_id' => 2,
            'type' => 'folder',
            'folder_code' => 25,
            'departament' => "Serie"
        ]);

        Folder::create([
            'name' => "Actas de Comité de Coordicación del Sistema de Control Interno",
            'parent_id' => 41,
            'type' => 'folder',
            'folder_code' => 4,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => "Informes a Entes de Control",
            'parent_id' => 42,
            'type' => 'folder',
            'folder_code' => 1,
            'departament' => "Subserie"
        ]);
        Folder::create([
            'name' => "Informes de Audiroría del Sistema de Gestión de Calidad",
            'parent_id' => 42,
            'type' => 'folder',
            'folder_code' => 2,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => "Planes de Auditoría",
            'parent_id' => 43,
            'type' => 'folder',
            'folder_code' => 4,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => "Planes de Mejoramiento Institucional",
            'parent_id' => 43,
            'type' => 'folder',
            'folder_code' => 6,
            'departament' => "Subserie"
        ]);


        Folder::create([
            'name' => "ACTAS",
            'parent_id' => 1,
            'type' => 'folder',
            'folder_code' => 2,
            'departament' => "Serie"
        ]);

        Folder::create([
            'name' => "ACTOS ADMINISTRATIVOS",
            'parent_id' => 1,
            'type' => 'folder',
            'folder_code' => 3,
            'departament' => "Serie"
        ]);

        Folder::create([
            'name' => "CICULARES",
            'parent_id' => 1,
            'type' => 'folder',
            'folder_code' => 4,
            'departament' => "Serie"
        ]);

        Folder::create([
            'name' => "CONTRATOS",
            'parent_id' => 1,
            'type' => 'folder',
            'folder_code' => 10,
            'departament' => "Serie"
        ]);

        Folder::create([
            'name' => "CONVENIOS",
            'parent_id' => 1,
            'type' => 'folder',
            'folder_code' => 11,
            'departament' => "Serie"
        ]);

        Folder::create([
            'name' => "DERECHOS DE PETICIÓN",
            'parent_id' => 1,
            'type' => 'folder',
            'folder_code' => 12,
            'departament' => "Serie"
        ]);

        Folder::create([
            'name' => "INFORMES",
            'parent_id' => 1,
            'type' => 'folder',
            'folder_code' => 16,
            'departament' => "Serie"
        ]);

        Folder::create([
            'name' => "Actas de Cómite de Gerencia",
            'parent_id' => 49,
            'type' => 'folder',
            'folder_code' => 5,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => "Actas Junta Directiva",
            'parent_id' => 49,
            'type' => 'folder',
            'folder_code' => 10,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => "Acuerdos de Junta Directiva",
            'parent_id' => 50,
            'type' => 'folder',
            'folder_code' => 1,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => "Resoluciones",
            'parent_id' => 50,
            'type' => 'folder',
            'folder_code' => 2,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => "Circulares Dispositivas",
            'parent_id' => 51,
            'type' => 'folder',
            'folder_code' => 1,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => "Contratos de Servicios Públicos",
            'parent_id' => 52,
            'type' => 'folder',
            'folder_code' => 1,
            'departament' => "Subserie"
        ]);
        Folder::create([
            'name' => "Convenios Interinstitucionales",
            'parent_id' => 53,
            'type' => 'folder',
            'folder_code' => 1,
            'departament' => "Subserie"
        ]);

        Folder::create([
            'name' => "Informes a Entes de Control",
            'parent_id' => 55,
            'type' => 'folder',
            'folder_code' => 1,
            'departament' => "Subserie"
        ]);















    }
}
