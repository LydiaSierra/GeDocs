<?php

namespace App\Exports;

use App\Models\PQR;
use App\Models\Folder;
use App\Models\File;
use Carbon\Carbon;
use Illuminate\Contracts\Support\Responsable;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;


/**
 * PQRs Excel Export (template)
 *
 * Same as the previous ProjectsExport but renamed to ExcelExport, so it's clearer.
 * Includes:
 * - Query-based export
 * - Headings and mapping
 * - Basic styles (header row, zebra stripes, borders)
 * - Column formats for dates
 * - Flexible filters: trimester, year, date range, archived, dependency, responsible, response_status
 * - Placeholders for direction/environment once fields exist
 */
class ExcelExport implements WithMultipleSheets, Responsable
{
    use Exportable;

    protected array $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    public function sheets(): array
    {
        return [
            new Received($this->filters),   // Hoja 1
            new Sended($this->filters),     // Hoja 2
        ];
    }

    // Implement Responsable to allow returning this export directly from controllers/routes
    public function toResponse($request)
    {
        $sheet = $this->filters['sheet_number_id'] ?? 'all';
        $date = date('Ymd_His');
        $filename = "pqrs_{$sheet}_{$date}.xlsx";
        return $this->download($filename);
    }
}




class Received implements FromQuery, WithHeadings, WithMapping, WithColumnFormatting, WithStyles, ShouldAutoSize, WithEvents, WithTitle
{
    use Exportable;

    /** @var array<string,mixed> */
    protected array $filters;

    /**
     * @param array<string,mixed> $filters
     */
    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    // Cache to avoid repeated DB lookups per $noRadicado during one export run
    protected array $radicadoFolderCache = [];

    /**
     * Resolve folder_code via $noRadicado using files.file_code -> files.folder_id -> folders.folder_code
     */
    protected function resolveFolderCodeByNoRadicado(?string $noRadicado): ?string
    {
        try {
            if (!$noRadicado || $noRadicado === 'N/A') {
                return null;
            }
            if (isset($this->radicadoFolderCache[$noRadicado])) {
                return $this->radicadoFolderCache[$noRadicado];
            }
            $file = File::with('folder')
                ->where('file_code', $noRadicado)
                ->first();
            $code = $file?->folder?->folder_code;
            // Cache even nulls to minimize repeated misses
            $this->radicadoFolderCache[$noRadicado] = $code;
            return $code;
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Build the base query applying optional filters.
     */
    public function query()
    {
        $table = (new PQR())->getTable();

        $q = PQR::query()
            ->leftJoin('attached_supports as ats', function ($join) use ($table) {
                $join->on('ats.pqr_id', '=', $table . '.id')
                    ->whereIn('ats.origin', ['REC', 'ENV']);
            })
            ->leftJoin('files as f', 'f.file_code', '=', 'ats.no_radicado')
            ->leftJoin('folders as fo', 'fo.id', '=', 'f.folder_id')

            ->with(['creator', 'responsible', 'dependency', 'sheetNumber'])

            ->select(
                $table . '.*',
                'ats.no_radicado as no_radicado_from_join',
                'fo.folder_code as folder_code_from_join'
            )

            ->orderByDesc($table . '.created_at');

        // Main filter: by Sheet Number
        if (!empty($this->filters['sheet_number_id'])) {
            $q->where('sheet_number_id', (int) $this->filters['sheet_number_id']);
        }




        // Date range filters (overrides trimester if both are provided)
        if (!empty($this->filters['from'])) {
            $q->whereDate('created_at', '>=', Carbon::parse($this->filters['from'])->toDateString());
        }
        if (!empty($this->filters['to'])) {
            $q->whereDate('created_at', '<=', Carbon::parse($this->filters['to'])->toDateString());
        }

        // Archived flag
        if (isset($this->filters['archived'])) {
            // Accepts: true|false|1|0|'true'|'false'
            $archived = filter_var($this->filters['archived'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($archived !== null) {
                $q->where('archived', $archived);
            }
        }

        // Dependency filter (by id)
        if (!empty($this->filters['dependency_id'])) {
            $q->where('dependency_id', (int) $this->filters['dependency_id']);
        }

        // Responsible filter (by user id)
        if (!empty($this->filters['responsible_id'])) {
            $q->where('responsible_id', (int) $this->filters['responsible_id']);
        }

        // Response status filter (pending|responded|closed)
        if (!empty($this->filters['response_status'])) {
            $q->where('response_status', $this->filters['response_status']);
        }




        return $q;
    }



    public function title(): string
    {
        return 'Recibidos';
    }






    /**
     * Headings shown in the first row.
     *
     * @return array<int,string>
     */
    public function headings(): array
    {
        return [
            // Rows 1–2 (top band)
            [
                'LOGO','',
                "ALCALDÍA MUNICIPAL SOPÓ - CUNDINAMARCA\nNIT 899999468-2",'','','','','','','','','','','','','','','','',
                'Fecha de elaboración','',''
            ],

            [
                '','','','','','','','','','','','','','','','','','','','','',''
            ],

            // Rows 3–4 (main title band)
            [
                'Registro de Radicación de Comunicaciones Recibidas','','','','','','','','','','','','','','','','','','','','',''
            ],

            [
                '','','','','','','','','','','','','','','','','','','','','',''
            ],

            // Row 5 (secondary captions)
            [
                'Unidad Administrativa','','','','','','','','','','','','','','','','','','','','','',
            ],

            // Row 6 (secondary captions)
            [
                'Oficina productora','','','','','','','','','','','','','','','','','','','','','',
            ],

            // Row 7 (table header, first line)
            [
                'Numero Radicado',
                'Fecha(dd/mm/aa)',
                'Hora',
                'Cod. Barras',
                'Datos destinatario','','','',
                'Datos del remitente','','','','','',
                'Tipo de Comunicacion',
                'Asunto',
                'Anexos',
                'Fecha Limite Respuesta(dd/mm/aa)',
                'Firma de Recibido',
                'Observaciones',
                'Respuesta',''
            ],

            // Row 8 (table header, second line)
            [
                '','','','',
                'Codigo de la Dependencia',
                'Nombre de la Dependencia',
                'Nombre y Apellidos',
                'Cargo',
                'Nombre y Apellidos',
                'Cargo',
                'Empresa',
                'Direccion',
                'Correo Electronico',
                'Telefono',
                '','','','','','',
                'Numero Consecutivo',
                'Fecha (dd/mm/aa)'
            ]
        ];
    }

    /**
     * Map each PQR model into a row array matching the headings order.
     *
     * @param PQR $p
     * @return array<int,mixed>
     */
    protected function resolveFolderCode(PQR $p): ?string
    {
        try {
            $depName = $p->dependency->name ?? null;
            $sheetId = $p->sheet_number_id ?? null;
            if (!$depName || !$sheetId) return null;
            $year = $p->created_at ? Carbon::parse($p->created_at)->format('Y') : date('Y');
            $folder = Folder::query()
                ->where('name', $depName)
                ->where('sheet_number_id', $sheetId)
                ->whereHas('parent', function ($q) use ($year) {
                    $q->where('year', $year)->orWhere('name', $year);
                })
                ->first();
            return $folder?->folder_code;
        } catch (\Throwable $e) {
            return null;
        }
    }

    public function map($p): array
    {
        $PH = 'N/A';



        // Attached support for REC origin (first match)


        $noRadicado = $p->no_radicado_from_join ?? 'N/A';

        $folderCode = $p->folder_code_from_join
            ?? $this->resolveFolderCodeByNoRadicado($noRadicado)
            ?? 'N/A';


        // Dates and times
        $fechaCreacion = $p->created_at ? Carbon::parse($p->created_at)->format('d/m/Y') : $PH; // dd/mm/yyyy
        $horaCreacion = $p->created_at ? Carbon::parse($p->created_at)->format('H:i') : $PH;    // HH:MM
        $fechaLimite = $p->response_time ? Carbon::parse($p->response_time)->format('d/m/Y') : $PH;
        $fechaRespuesta = $p->response_date ? Carbon::parse($p->response_date)->format('d/m/Y') : $PH;

        // Dependency and responsible
        $depNombre = $p->dependency->name ?? $PH;
        $responsable = $p->responsible;
        $responsableNombre = $responsable->name ?? $PH;
        $rolResponsable = $responsable ? ($responsable->getRoleNames()->first() ?? $PH) : $PH;

        // Sender (creator) and role
        $senderNombre = $p->sender_name ?: ($p->creator->name ?? $PH);
        $rolCreador = $p->creator ? ($p->creator->getRoleNames()->first() ?? $PH) : $PH;

        \Log::info('DEBUG FINAL', [
            'pqr_id' => $p->id,
            'no_radicado_join' => $p->no_radicado_from_join,
            'folder_code_join' => $p->folder_code_from_join,
        ]);

        if ($noRadicado === 'N/A') {
            \Log::info('NO RADICADO VACIO', ['pqr_id' => $p->id]);
        }

        $file = File::where('file_code', $noRadicado)->first();
        if (!$file) {
            \Log::info('FILE NO ENCONTRADO', ['noRadicado' => $noRadicado]);
        }

        if ($file && !$file->folder) {
            \Log::info('FILE SIN FOLDER', ['file_id' => $file->id]);
        }

        return [
            // A–D
            $noRadicado,          // A Numero Radicado (from attachedSupports.no_radicado)
            $fechaCreacion,       // B Fecha creación dd/mm/yyyy
            $horaCreacion,        // C Hora creación HH:MM
            $noRadicado,          // D Cod. Barras (use same no_radicado for now)

            // E
            $folderCode, // E Codigo de la Dependencia (folder_code)

            // F–H destinatario/dependencia/responsable
            $depNombre,           // F Nombre de la Dependencia
            $responsableNombre,   // G Nombre del responsable
            $rolResponsable,      // H Rol del responsable

            // I–N remitente (PQR fields / creator)
            $senderNombre,        // I sender_name
            $rolCreador,          // J rol del remitente/creador
            $PH,                  // K N/A
            $PH,                  // L N/A
            ($p->email ?: $PH),   // M email del PQR
            $PH,                  // N N/A

            // O–T otros
            ($p->request_type ?: $PH),  // O tipo de solicitud
            ($p->affair ?: $PH),        // P asunto
            $PH,                        // Q N/A
            $fechaLimite,               // R response_time (fecha límite)
            $PH,                        // S N/A
            $PH,                        // T N/A

            // U–V respuesta
            $noRadicado,                // U Hash (again)
            $fechaRespuesta,      // V response_date
        ];
    }

    /**
     * Column formats using Excel codes.
     * Keys are 1-based column indexes: 1=>'A', 2=>'B', etc.
     * Applies to the Received sheet.
     *
     * @return array<int,string>
     */

    /*
    public function columnFormats(): array
    {
        return [
            2 => 'dd/mm/yy', // B Fecha (dd/mm/aa)
            3 => 'hh:mm',    // C Hora
            18 => 'dd/mm/yy', // R Fecha Limite Respuesta (dd/mm/aa)
            22 => 'dd/mm/yy', // V Fecha Respuesta (dd/mm/aa)
        ];
    }

    */



    public function columnFormats(): array
    {
        return [
            'B' => 'dd/mm/yyyy',
            'C' => 'hh:mm',
            'R' => 'dd/mm/yyyy',
            'V' => 'dd/mm/yyyy',
        ];
    }

    /**
     * Basic styling: bold header, fill color, borders, alignment, zebra stripes.
     */
    public function styles(Worksheet $sheet)
    {
        $highestRow = $sheet->getHighestRow();
        $highestCol = $sheet->getHighestColumn();

        // Header alignment and wrapping (rows 1–8)
        $sheet->getStyle('A1:V8')
            ->getAlignment()
            ->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER)
            ->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER)
            ->setWrapText(true);

        // Base font for header
        $sheet->getStyle('A1:V8')->getFont()
            ->setName('Times New Roman')
            ->setBold(true)
            ->setSize(11);

        $sheet->getStyle("A9:{$highestCol}{$highestRow}")
            ->getAlignment()
            ->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER)
            ->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER)
            ->setWrapText(true);

        // Specific font sizes per template
        $sheet->getStyle('C1:S2')->getFont()->setSize(24); // main title and NIT
        $sheet->getStyle('A3:V4')->getFont()->setSize(18); // secondary title

        // Light fills (subtle so text is readable)
        $sheet->getStyle('A1:V2')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFF5F5F5');
        $sheet->getStyle('A3:V4')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFE2EFD9');
        $sheet->getStyle('A7:D8')->getFill()
            ->setFillType(Fill::FILL_SOLID)
            ->getStartColor()->setARGB('FFE2EFD9');

        $sheet->getStyle('E7:H8')->getFill()
            ->setFillType(Fill::FILL_SOLID)
            ->getStartColor()->setARGB('FFD9E2F3');

        $sheet->getStyle('I7:N8')->getFill()
            ->setFillType(Fill::FILL_SOLID)
            ->getStartColor()->setARGB('FFFEF2CB');

        $sheet->getStyle('O7:V8')->getFill()
            ->setFillType(Fill::FILL_SOLID)
            ->getStartColor()->setARGB('FFE2EFD9');

        // Row heights to visually match template proportions
        $sheet->getRowDimension(1)->setRowHeight(28);
        $sheet->getRowDimension(2)->setRowHeight(28);
        $sheet->getRowDimension(3)->setRowHeight(24);
        $sheet->getRowDimension(4)->setRowHeight(24);
        $sheet->getRowDimension(5)->setRowHeight(18);
        $sheet->getRowDimension(6)->setRowHeight(18);
        $sheet->getRowDimension(7)->setRowHeight(22);
        $sheet->getRowDimension(8)->setRowHeight(22);

        // Apply thin borders to entire used range
        $highestRow = $sheet->getHighestRow();
        $highestCol = $sheet->getHighestColumn();
        $sheet->getStyle("A1:{$highestCol}{$highestRow}")
            ->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

        // Zebra stripes for data rows only (from row 9 onward)
        for ($row = 9; $row <= $highestRow; $row++) {
            if ($row % 9 === 0) {
                $sheet->getStyle("A{$row}:{$highestCol}{$row}")
                    ->getFill()->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()->setARGB('FFF8FBFF'); // very light blue
            }
        }

        return [
            1 => ['font' => ['bold' => true]],
        ];
    }


    public function registerEvents(): array
{
    return [
        AfterSheet::class => function($event) {

            // Total de columnas = 20 (A → T)
            //Fila 1
            $event->sheet->mergeCells('A1:B2');
            $event->sheet->mergeCells('C1:S2');
            $event->sheet->mergeCells('T1:V2');
            $event->sheet->mergeCells('A3:V4');
            $event->sheet->mergeCells('A5:B5');
            $event->sheet->mergeCells('A6:B6');
            $event->sheet->mergeCells('C5:V5');
            $event->sheet->mergeCells('C6:V6');
            $event->sheet->mergeCells('E7:H7');
            $event->sheet->mergeCells('I7:N7');
            $event->sheet->mergeCells('U7:V7');
            $event->sheet->mergeCells('A7:A8');
            $event->sheet->mergeCells('B7:B8');
            $event->sheet->mergeCells('C7:C8');
            $event->sheet->mergeCells('D7:D8');
            $event->sheet->mergeCells('O7:O8');
            $event->sheet->mergeCells('P7:P8');
            $event->sheet->mergeCells('Q7:Q8');
            $event->sheet->mergeCells('R7:R8');
            $event->sheet->mergeCells('S7:S8');
            $event->sheet->mergeCells('T7:T8');


            // Centrar vertical y horizontal
            $event->sheet->getStyle('A1:T2')
                ->getAlignment()
                ->setVertical('center')
                ->setHorizontal('center');

            // Negrita
            $event->sheet->getStyle('A1:T2')
                ->getFont()
                ->setBold(true);
        },
    ];
}
}


class Sended  implements FromQuery, WithHeadings, WithMapping, WithColumnFormatting, WithStyles, ShouldAutoSize, WithEvents, WithTitle
{

    use Exportable;

    /** @var array<string,mixed> */
    protected array $filters = [];

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    // Cache to avoid repeated DB lookups per $noRadicado during one export run
    protected array $radicadoFolderCache = [];

    /**
     * Resolve folder_code via $noRadicado using files.file_code -> files.folder_id -> folders.folder_code
     */
    protected function resolveFolderCodeByNoRadicado(?string $noRadicado): ?string
    {
        try {
            if (!$noRadicado || $noRadicado === 'N/A') {
                return null;
            }
            if (isset($this->radicadoFolderCache[$noRadicado])) {
                return $this->radicadoFolderCache[$noRadicado];
            }
            $file = File::with('folder')
                ->where('file_code', $noRadicado)
                ->first();
            $code = $file?->folder?->folder_code;
            // Cache even nulls to minimize repeated misses
            $this->radicadoFolderCache[$noRadicado] = $code;
            return $code;
        } catch (\Throwable $e) {
            return null;
        }
    }

    public function query()
    {
        $q = PQR::query()
            ->with(['creator', 'responsible', 'dependency', 'sheetNumber', 'attachedSupports'])
            ->whereNotNull('response_date')
            ->orderByDesc('response_date');

        // Filter by sheet number if provided
        if (!empty($this->filters['sheet_number_id'])) {
            $q->where('sheet_number_id', (int) $this->filters['sheet_number_id']);
        }

        // Only PQRs with attached supports origin = 'ENV'
        $q->whereHas('attachedSupports', function (Builder $qq) {
            $qq->where('origin', 'ENV');
        });

        return $q;
    }

   /* public function columnFormats(): array
    {
        return [
            2 => 'dd/mm/yy', // B Fecha (dd/mm/aa)
            3 => 'hh:mm',    // C Hora
            22 => 'dd/mm/yy', // V Fecha Respuesta (dd/mm/aa)
        ];
    }
    */

    public function columnFormats(): array
    {
        return [
            'B' => 'dd/mm/yyyy',
            'C' => 'hh:mm',
            'V' => 'dd/mm/yyyy',
        ];
    }


    public function title(): string
    {
        return 'Enviados';
    }


    public function headings(): array
    {
        return [
            [
                'LOGO','',
                "ALCALDÍA MUNICIPAL SOPÓ - CUNDINAMARCA\nNIT 899999468-2",'','','','','','','','','','','','','','','','',
                'Fecha de elaboración','','',''
            ],

            [
                '','','','','','','','','','','','','','','','','','','','','','',''
            ],

            // Rows 3–4 (main title band)
            [
                'Registro de Radicación de Comunicaciones Enviadas','','','','','','','','','','','','','','','','','','','','','',''
            ],

            [
                '','','','','','','','','','','','','','','','','','','','','','',''
            ],

            // Row 5 (secondary captions)
            [
                'Unidad Administrativa','','','','','','','','','','','','','','','','','','','','','',''
            ],

            // Row 6 (secondary captions)
            [
                'Oficina productora','','','','','','','','','','','','','','','','','','','','','',''
            ],

            // Row 7 (table header, first line)
            [
                'Numero consecutivo',
                'Fecha(dd/mm/aa)',
                'Hora',
                'Datos Remitente','','','',
                'Datos destinatario','','','','','',
                'Tipo de Comunicacion',
                'Asunto',
                'Anexos',
                'Canal de Envio','','',
                'Observaciones',
                'Respuesta','',''
            ],

            // Row 8 (table header, second line)
            [
                '','','',
                'Codigo de la Dependencia',
                'Nombre de la Dependencia',
                'Nombre y Apellidos',
                'Cargo',
                'Nombre y Apellidos',
                'Cargo',
                'Empresa',
                'Direccion',
                'Correo Electronico',
                'Telefono',
                '','','',
                'Nro de guia',
                'Empresa',
                'Observaciones',
                '',
                'Numero de radicado',
                'Fecha (dd/mm/aa)',
                'Copia'
            ]
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function($event) {

                // Total de columnas = 20 (A → T)
                //Fila 1
                $event->sheet->mergeCells('A1:B2');
                $event->sheet->mergeCells('C1:S2');
                $event->sheet->mergeCells('T1:W2');
                $event->sheet->mergeCells('A3:W4');
                $event->sheet->mergeCells('A5:B5');
                $event->sheet->mergeCells('A6:B6');
                $event->sheet->mergeCells('C5:W5');
                $event->sheet->mergeCells('C6:W6');
                $event->sheet->mergeCells('D7:G7');
                $event->sheet->mergeCells('H7:M7');
                $event->sheet->mergeCells('N7:N8');
                $event->sheet->mergeCells('O7:O8');
                $event->sheet->mergeCells('P7:P8');
                $event->sheet->mergeCells('Q7:S7');
                $event->sheet->mergeCells('T7:T8');
                $event->sheet->mergeCells('U7:W7');
                $event->sheet->mergeCells('A7:A8');
                $event->sheet->mergeCells('B7:B8');
                $event->sheet->mergeCells('C7:C8');



                // Centrar vertical y horizontal
                $event->sheet->getStyle('A1:W8')
                    ->getAlignment()
                    ->setVertical('center')
                    ->setHorizontal('center');

                // Negrita
                $event->sheet->getStyle('A1:T2')
                    ->getFont()
                    ->setBold(true);
            },
        ];
    }


    public function styles(Worksheet $sheet)
    {

        $highestRow = $sheet->getHighestRow();
        $highestCol = $sheet->getHighestColumn();
        // Header alignment and wrapping (rows 1–8)
        $sheet->getStyle("A9:{$highestCol}{$highestRow}")
            ->getAlignment()
            ->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER)
            ->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER)
            ->setWrapText(true);

        // Base font for header
        $sheet->getStyle('A1:W8')->getFont()
            ->setName('Times New Roman')
            ->setBold(true)
            ->setSize(11);

        // Specific font sizes per template
        $sheet->getStyle('C1:S2')->getFont()->setSize(24); // main title and NIT
        $sheet->getStyle('A3:V4')->getFont()->setSize(18); // secondary title

        // Light fills (subtle so text is readable)
        $sheet->getStyle('A1:W2')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFF5F5F5');
        $sheet->getStyle('A3:W4')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFE2EFD9');
        $sheet->getStyle('A7:C8')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFE2EFD9');
        $sheet->getStyle('D7:G8')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFB4C6E7');
        $sheet->getStyle('H7:M8')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFEF2CB');
        $sheet->getStyle('N7:P8')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFE2EFD9');
        $sheet->getStyle('Q7:S8')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFC000');
        $sheet->getStyle('T7:T8')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFE2EFD9');
        $sheet->getStyle('U7:W8')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FF70AD47');



         // very light blue for table header

        // Row heights to visually match template proportions
        $sheet->getRowDimension(1)->setRowHeight(28);
        $sheet->getRowDimension(2)->setRowHeight(28);
        $sheet->getRowDimension(3)->setRowHeight(24);
        $sheet->getRowDimension(4)->setRowHeight(24);
        $sheet->getRowDimension(5)->setRowHeight(18);
        $sheet->getRowDimension(6)->setRowHeight(18);
        $sheet->getRowDimension(7)->setRowHeight(22);
        $sheet->getRowDimension(8)->setRowHeight(22);

        // Apply thin borders to entire used range
        $highestRow = $sheet->getHighestRow();
        $highestCol = $sheet->getHighestColumn();
        $sheet->getStyle("A1:{$highestCol}{$highestRow}")
            ->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

        // Zebra stripes for data rows only (from row 9 onward)
        for ($row = 9; $row <= $highestRow; $row++) {
            if ($row % 9 === 0) {
                $sheet->getStyle("A{$row}:{$highestCol}{$row}")
                    ->getFill()->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()->setARGB('FFF8FBFF'); // very light blue
            }
        }

        return [
            1 => ['font' => ['bold' => true]],
        ];
    }

    protected function resolveFolderCode(PQR $p): ?string
    {
        try {
            $depName = $p->dependency->name ?? null;
            $sheetId = $p->sheet_number_id ?? null;
            if (!$depName || !$sheetId) return null;
            $year = $p->created_at ? Carbon::parse($p->created_at)->format('Y') : date('Y');
            $folder = Folder::query()
                ->where('name', $depName)
                ->where('sheet_number_id', $sheetId)
                ->whereHas('parent', function ($q) use ($year) {
                    $q->where('year', $year)->orWhere('name', $year);
                })
                ->first();
            return $folder?->folder_code;
        } catch (\Throwable $e) {
            return null;
        }
    }

    public function map($p): array
    {
        $PH = 'N/A';

        // Attached support for ENV origin (first match)
        $support = $p->attachedSupports ? $p->attachedSupports->firstWhere('origin', 'ENV') : null;
        $hash = $support->hash ?? $PH;

        // Dates and times from PQR creation for B and C
        $fechaCreacion = $p->created_at ? Carbon::parse($p->created_at)->format('d/m/Y') : $PH; // dd/mm/yyyy
        $horaCreacion = $p->created_at ? Carbon::parse($p->created_at)->format('H:i') : $PH;    // HH:MM
        $fechaRespuesta = $p->response_date ? Carbon::parse($p->response_date)->format('d/m/Y') : $PH;

        // Dependency and responsible
        $depNombre = $p->dependency->name ?? $PH;
        $responsable = $p->responsible;
        $responsableNombre = $responsable->name ?? $PH;
        $rolResponsable = $responsable ? ($responsable->getRoleNames()->first() ?? $PH) : $PH;

        // NRO Racicado

        $noRadicado = $support->no_radicado ?? $PH;

        // Sender (creator) role and name
        $senderNombre = $p->sender_name ?: ($p->creator->name ?? $PH);
        $rolCreador = $p->creator ? ($p->creator->getRoleNames()->first() ?? $PH) : $PH;

        return [
            // A–D
            $noRadicado,               // A hash from attachedSupports
            $fechaCreacion,      // B Fecha creación dd/mm/yyyy
            $horaCreacion,       // C Hora creación HH:MM
            $this->resolveFolderCodeByNoRadicado($noRadicado) ?: ($this->resolveFolderCode($p) ?: $PH), // D Codigo de la Dependencia (folder_code)

            // E–G dependencia/responsable/rol
            $depNombre,          // E Nombre de la Dependencia
            $responsableNombre,  // F Nombre del responsable
            $rolResponsable,     // G Rol del responsable

            // H–M remitente
            $senderNombre,               // H sender_name
            $rolCreador,                 // I rol del remitente/creador
            $PH,                         // J N/A
            $PH,                         // K N/A
            ($p->email ?: $PH),          // L email
            $PH,                         // M N/A

            // N–T otros
            ($p->request_type ?: $PH),   // N request type
            ($p->affair ?: $PH),         // O affair
            $PH,                         // P N/A
            $PH,                         // Q N/A
            $PH,                         // R N/A
            'Se envia respuesta por correo electronico', // S fixed text
            $PH,                         // T N/A

            // U–W respuesta
            $noRadicado,               // U hash again
            $fechaRespuesta,     // V response_date
            $PH,                 // W N/A
        ];
    }
}
