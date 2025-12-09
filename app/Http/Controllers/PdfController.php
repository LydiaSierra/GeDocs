<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class PdfController extends Controller
{
    public function generate(Request $request)
    {
        try {
            $data = $request->all();

            $pdf = Pdf::loadView('pdf.template', ['data' => $data])
                ->setPaper('letter', 'portrait');

            return $pdf->download('acta.pdf');

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
