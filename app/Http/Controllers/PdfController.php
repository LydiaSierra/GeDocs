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
            $documentType = $data['document_type'] ?? 'documento';
            $safeDocumentType = preg_replace('/[^a-z0-9_-]/i', '', $documentType);
            $fileName = ($safeDocumentType ?: 'documento') . '.pdf';
            $logoDataUri = $this->resolveLogoDataUri($request);

            // Carga la vista 'pdf.template' (Blade) y le pasa la variable $data
            $pdf = Pdf::loadView('pdf.template', [
                'data' => $data,
                'logoDataUri' => $logoDataUri,
            ]);

            // Retorna el PDF descargable con el nombre "acta.pdf"
            return $pdf->download($fileName);

        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 422);

        } catch (\Exception $e) {
            // Si ocurre algún error (por ejemplo, la vista no existe)
            // responde con un JSON de error y código HTTP 500
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function resolveLogoDataUri(Request $request): string
    {
        $minFileBytes = 10 * 1024;
        $maxFileBytes = 2 * 1024 * 1024;
        $minDimension = 64;
        $maxDimension = 2000;

        if ($request->hasFile('logo_file')) {
            $file = $request->file('logo_file');
            $mimeType = $file->getMimeType();
            $allowedMimeTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];

            if (!in_array($mimeType, $allowedMimeTypes, true)) {
                throw new \InvalidArgumentException('Tipo de archivo no permitido. Solo PNG, JPG o SVG.');
            }

            $fileSize = $file->getSize() ?? 0;
            if ($fileSize < $minFileBytes) {
                throw new \InvalidArgumentException('El logo es demasiado pequeno. Minimo: 10 KB.');
            }

            if ($fileSize > $maxFileBytes) {
                throw new \InvalidArgumentException('El logo es demasiado pesado. Maximo: 2 MB.');
            }

            [$width, $height] = $this->extractDimensionsFromUploadedFile($file);
            if (
                $width < $minDimension ||
                $height < $minDimension ||
                $width > $maxDimension ||
                $height > $maxDimension
            ) {
                throw new \InvalidArgumentException('Dimensiones invalidas. Use una imagen entre 64x64 y 2000x2000 px.');
            }

            $content = base64_encode(file_get_contents($file->getPathname()));
            return "data:{$mimeType};base64,{$content}";
        }

        $defaultLogoPath = public_path('SENA-LOGO.png');
        if (!file_exists($defaultLogoPath)) {
            throw new \InvalidArgumentException('No se encontro el logo predeterminado en public/SENA-LOGO.png.');
        }

        $content = base64_encode(file_get_contents($defaultLogoPath));
        return "data:image/png;base64,{$content}";
    }

    private function extractDimensionsFromUploadedFile($file): array
    {
        $mimeType = $file->getMimeType();

        if ($mimeType === 'image/svg+xml') {
            $svg = file_get_contents($file->getPathname());

            preg_match('/width=["\']([0-9.]+)(px)?["\']/i', $svg, $widthMatch);
            preg_match('/height=["\']([0-9.]+)(px)?["\']/i', $svg, $heightMatch);

            if (!empty($widthMatch[1]) && !empty($heightMatch[1])) {
                return [(int) ceil((float) $widthMatch[1]), (int) ceil((float) $heightMatch[1])];
            }

            preg_match('/viewBox=["\']\s*[0-9.\-]+\s+[0-9.\-]+\s+([0-9.\-]+)\s+([0-9.\-]+)\s*["\']/i', $svg, $viewBoxMatch);
            if (!empty($viewBoxMatch[1]) && !empty($viewBoxMatch[2])) {
                return [(int) ceil((float) $viewBoxMatch[1]), (int) ceil((float) $viewBoxMatch[2])];
            }

            throw new \InvalidArgumentException('No se pudieron determinar las dimensiones del SVG.');
        }

        $imageSize = @getimagesize($file->getPathname());
        if (!$imageSize) {
            throw new \InvalidArgumentException('No se pudieron leer las dimensiones de la imagen.');
        }

        return [(int) $imageSize[0], (int) $imageSize[1]];
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

            // Nombre único para el archivo
            $fileName = 'comunicacion_' . $validated['pqr_id'] . '_' . Str::uuid() . '.pdf';
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
