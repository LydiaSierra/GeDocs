<?php

namespace App\Http\Controllers;

// Importa la fachada de DOMPDF para generar PDFs
use Barryvdh\DomPDF\Facade\Pdf;

// Importa Request para poder recibir datos de formularios
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\PQR;
use App\Models\comunication;
use App\Models\AttachedSupport;
use Illuminate\Support\Facades\Mail;
use App\Mail\PQRResponseMail;

// Controlador encargado de generar el PDF
class PdfController extends Controller
{
    /**
     * Genera un PDF para descargar
     */
    public function generate(Request $request)
    {
        try {
            // Obtiene todos los datos enviados desde el formulario React
            $data = $request->all();
            $documentType = $data['document_type'] ?? 'documento';
            $safeDocumentType = preg_replace('/[^a-z0-9_-]/i', '', $documentType);
            $fileName = ($safeDocumentType ?: 'documento') . '.pdf';

            // Carga la vista 'pdf.template' (Blade) y le pasa la variable $data
            $pdf = Pdf::loadView('pdf.template', ['data' => $data]);

            // Retorna el PDF descargable con el nombre "acta.pdf"
            return $pdf->download($fileName);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Genera un PDF de comunicación oficial, lo guarda en storage
     * y lo registra como AttachedSupport vinculado a una comunicación/PQR.
     *
     * POST /api/pdf/generate-response
     */
    public function generateAndStore(Request $request)
    {
        $validated = $request->validate([
            'pqr_id'              => 'required|exists:p_q_r_s,id',
            'communication_id'    => 'nullable|exists:comunications,id',
            // Encabezado institucional
            'logo_url'            => 'nullable|string',
            'institucion_nombre'  => 'nullable|string|max:255',
            'institucion_nit'     => 'nullable|string|max:100',
            // Documento
            'codigo'              => 'nullable|string|max:100',
            'fecha'               => 'nullable|string|max:100',
            'lugar'               => 'nullable|string|max:255',
            // Destinatario
            'tratamiento'         => 'nullable|string|max:100',
            'nombres'             => 'nullable|string|max:255',
            'cargo'               => 'nullable|string|max:255',
            'empresa'             => 'nullable|string|max:255',
            'direccion'           => 'nullable|string|max:255',
            'ciudad'              => 'nullable|string|max:255',
            // Contenido
            'asunto'              => 'nullable|string|max:500',
            'saludo'              => 'nullable|string|max:500',
            'texto'               => 'nullable|string',
            // Despedida
            'despedida1'          => 'nullable|string|max:255',
            'despedida2'          => 'nullable|string|max:255',
            'despedida3'          => 'nullable|string|max:255',
            // Firma
            'firma_nombres'       => 'nullable|string|max:255',
            'firma_cargo'         => 'nullable|string|max:255',
            // Información adicional (opcionales)
            'anexo'               => 'nullable|string|max:500',
            'copia'               => 'nullable|string|max:500',
            'redactor'            => 'nullable|string|max:255',
            'transcriptor'        => 'nullable|string|max:255',
            // Pie de página
            'pie_pagina'          => 'nullable|string|max:500',
        ]);

        try {
            // Verificar que la PQR existe
            $pqr = PQR::find($validated['pqr_id']);
            if (!$pqr) {
                return response()->json(['error' => 'PQR no encontrada'], 404);
            }

            // Verificar si ya ha sido respondida
            if ($pqr->response_status === 'responded') {
                return response()->json(['error' => 'Esta PQR ya ha sido respondida y no admite más respuestas.'], 422);
            }

            // Generar el PDF con la plantilla
            $pdf = Pdf::loadView('pdf.comunicacion', ['data' => $validated]);
            $pdf->setPaper('letter', 'portrait');

            // Formato solicitado: dependenciaId-mes-anio-codigoPqr
            $dependencyId = $pqr->dependency_id ?? 0;
            $month = now()->month;
            $year = now()->year;
            $pqrCode = str_pad((string) $pqr->id, 3, '0', STR_PAD_LEFT);
            $fileName = $dependencyId . '-' . $month . '-' . $year . '-' . $pqrCode . '.pdf';
            $storagePath = 'pdf_responses/' . $fileName;

            // Guardar el PDF en storage/app/public/
            Storage::disk('public')->put($storagePath, $pdf->output());

            // Obtener el tamaño del archivo guardado
            $fileSize = Storage::disk('public')->size($storagePath);

            // Registrar como AttachedSupport vinculado a la comunicación y/o PQR
            $attachedSupport = AttachedSupport::create([
                'name'             => $fileName,
                'path'             => $storagePath,
                'type'             => 'pdf',
                'origin'           => 'ENV',
                'size'             => $fileSize,
                'pqr_id'           => $validated['pqr_id'],
                'comunication_id'  => $validated['communication_id'] ?? null,
                'hash'             => hash('sha256', uniqid((string) $pqr->id, true)),
                'no_radicado'      => str_pad((string) $pqr->id, 3, '0', STR_PAD_LEFT),
            ]);

            // Marcar la PQR como respondida
            $pqr->update([
                'response_status' => 'responded',
                'response_date' => now(),
            ]);

            // Enviar email de notificación
            try {
                $emailRecipient = $pqr->email ? $pqr->email : ($pqr->creator ? $pqr->creator->email : null);
                if ($emailRecipient) {
                    Mail::to($emailRecipient)->send(new PQRResponseMail($pqr, null, null));
                    Log::info('Email de notificación enviado desde PdfController a: ' . $emailRecipient);
                }
            } catch (\Exception $e) {
                Log::error('Error enviando email desde PdfController: ' . $e->getMessage());
            }

            return response()->json([
                'message'  => 'PDF generado y guardado exitosamente',
                'data'     => $attachedSupport,
                'url'      => Storage::url($storagePath),
                'pqr_status' => $pqr->response_status,
                'response_date' => $pqr->response_date,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error generando PDF de comunicación: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error generando el PDF: ' . $e->getMessage()
            ], 500);
        }
    }
}
