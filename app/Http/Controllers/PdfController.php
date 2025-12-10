<?php

namespace App\Http\Controllers;

// Importa la fachada de DOMPDF para generar PDFs
use Barryvdh\DomPDF\Facade\Pdf;

// Importa Request para poder recibir datos de formularios
use Illuminate\Http\Request;

// Controlador encargado de generar el PDF
class PdfController extends Controller
{
    // Método que recibe la petición del frontend y genera el PDF
    public function generate(Request $request)
    {
        try {
            // Obtiene todos los datos enviados desde el formulario React
            // Se convierte en un array asociativo con todos los campos
            $data = $request->all();

            // Carga la vista 'pdf.template' (Blade) y le pasa la variable $data
            // Esta vista será convertida en un archivo PDF por DOMPDF
            $pdf = Pdf::loadView('pdf.template', ['data' => $data]);

            // Retorna el PDF descargable con el nombre "acta.pdf"
            return $pdf->download('acta.pdf');

        } catch (\Exception $e) {
            // Si ocurre algún error (por ejemplo, la vista no existe)
            // responde con un JSON de error y código HTTP 500
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
