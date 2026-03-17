<?php

namespace App\Exports;

use App\Models\PQR;
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
class ExcelExport implements FromQuery, WithHeadings, WithMapping, WithColumnFormatting, WithStyles, ShouldAutoSize, Responsable
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

    /**
     * Build the base query applying optional filters.
     */
    public function query()
    {
        $q = PQR::query()
            ->with(['creator', 'responsible', 'dependency', 'sheetNumber'])
            ->orderByDesc('created_at');

        // Year filter (by created_at)
        if (!empty($this->filters['year'])) {
            $q->whereYear('created_at', (int) $this->filters['year']);
        }

        // Trimester filter (Q1=Jan-Mar, Q2=Apr-Jun, Q3=Jul-Sep, Q4=Oct-Dec)
        if (!empty($this->filters['trimester'])) {
            $trimester = (int) $this->filters['trimester'];
            [$startMonth, $endMonth] = match ($trimester) {
                1 => [1, 3],
                2 => [4, 6],
                3 => [7, 9],
                4 => [10, 12],
                default => [1, 12],
            };
            $year = !empty($this->filters['year']) ? (int) $this->filters['year'] : (int) date('Y');
            $q->whereBetween('created_at', [
                Carbon::create($year, $startMonth, 1)->startOfDay(),
                Carbon::create($year, $endMonth, 1)->endOfMonth()->endOfDay(),
            ]);
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

        // Direction filter (received|sent) — PLACEHOLDER
        if (!empty($this->filters['direction'])) {
            // Example (uncomment and adapt):
            // $q->where('direction', $this->filters['direction']);
        }

        // Environment filter — PLACEHOLDER
        if (!empty($this->filters['environment'])) {
            // Example: $q->where('environment', $this->filters['environment']);
        }

        return $q;
    }

    /**
     * Headings shown in the first row.
     *
     * @return array<int,string>
     */
    public function headings(): array
    {
        return [
             // Fila 1 (headers)
        [
            'Numero Radicado',
            'Fecha(dd/mm/aa)',
            'Hora',
            'Cod. Barras',
            'Codigo de la Dependencia',
            'Nombre de la Dependencia',
            'Nombre y Apellidos',
            'Cargo',
            'Empresa',
            'Direccion',
            'Correo Electronico',
            'Telefono',
            'Tipo de Comunicacion',
            'Asunto',
            'Anexos',
            'Fecha Limite Respuesta(dd/mm/aa)',
            'Firma de Recibido',
            'Observaciones',
            'Numero Consecutivo',
            'Fecha (dd/mm/aa)'
        ],

        // 👇 Fila 2 VACÍA (clave)
        array_fill(0, 20, '')
        ];
    }

    /**
     * Map each PQR model into a row array matching the headings order.
     *
     * @param PQR $p
     * @return array<int,mixed>
     */
    public function map($p): array
    {
        return [
            $p->id,
            optional($p->created_at)->format('Y-m-d'),
            optional($p->created_at)->format('H:i'),
            $p->sender_name,
            $p->email,
            $p->affair,
            $p->request_type,
            $p->response_status,
            optional($p->response_date)->format('Y-m-d H:i'),
            optional($p->dependency)->name,
            optional($p->responsible)->name,
            $p->archived ? 'Sí' : 'No',
            optional($p->sheetNumber)->number,
        ];
    }

    /**
     * Column formats using Excel codes.
     * Keys are 1-based column indexes: 1=>'A', 2=>'B', etc.
     *
     * @return array<int,string>
     */
    public function columnFormats(): array
    {
        return [
            2 => 'yyyy-mm-dd hh:mm', // Creado
            8 => 'yyyy-mm-dd hh:mm', // Fecha Respuesta
        ];
    }

    /**
     * Basic styling: bold header, fill color, borders, alignment, zebra stripes.
     */
    public function styles(Worksheet $sheet)
    {
        // Header row style
        $headerRange = 'A1:T2';
        $sheet->getStyle($headerRange)->getFont()->setBold(true);
        $sheet->getStyle($headerRange)->getFill()->setFillType(Fill::FILL_SOLID)
            ->getStartColor()->setARGB('FFE5F1FB'); // light blue
        $sheet->getStyle($headerRange)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Apply thin borders to used range
        $highestRow = $sheet->getHighestRow();
        $highestCol = $sheet->getHighestColumn();
        $sheet->getStyle("A1:{$highestCol}{$highestRow}")
            ->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

        // Zebra stripes for data rows
        for ($row = 2; $row <= $highestRow; $row++) {
            if ($row % 2 === 0) {
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
            foreach (range('A', 'T') as $col) {
                $event->sheet->mergeCells($col . '1:' . $col . '2');
            }

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
