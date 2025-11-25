<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\PQR;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\PQRResponseMail;

class PQRController extends Controller
{
    /**
     * LISTAR TODAS LAS PQRS
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        //Filtro de si el usuario esta autenticado y filtgra por dependencia

        if ($user && $user->hasRole('Dependencia')) {
        $pqrs = PQR::with(['creator', 'responsible', 'dependency', 'attachedSupports', 'sheetNumber'])
            ->where('dependency_id', $user->dependency_id)
            ->get();
        } else {
            //Muestra todas las pqrs si no es dependencia
            $pqrs = PQR::with(['creator', 'responsible', 'dependency', 'attachedSupports','sheetNumber'])->get();
        }

        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        if ($user->hasRole('Dependencia')) {
            $pqrs = PQR::where('dependency_id', $user->dependency_id)->get();
        } else {
            // Si quieres que solo admin vea todas, valida aquí
            if (!$user->hasRole('Admin')) {
                return response()->json(['message' => 'No autorizado'], 403);
            }
            $pqrs = PQR::all();
        }

        return response()->json([
            'data' => $pqrs,
            'message' => 'PQRs obtenidas exitosamente'
        ], 200);
    }

    /**
     * CREAR UNA PQR (solo Aprendiz / usuario normal)
     */
    public function store(Request $request): JsonResponse
    {
        //Validacion de los datos requeridos en la pqr
        $validated = $request->validate([
            'description' => 'required|string|max:1000',
            'affair' => 'required|string|max:255',
            'response_time' => 'required|date|after:today',
            'request_type' => 'required|string|in:Peticion,Queja,Reclamo,Sugerencia',
            'sheet_number_id' => 'required|exists:sheet_numbers,id',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
        ]);

        $user = $request->user();
        $userId = $user ? $user->id : null;


        // Crear la PQR
        $pqr = PQR::create([
            'description' => $validated['description'],
            'affair' => $validated['affair'],
            'response_time' => $validated['response_time'],
            'state' => false,
            'user_id' => $userId,
            'responsible_id' => null,
            'dependency_id' => null,
            'request_type' => $validated['request_type'],
            'sheet_number_id' => $validated['sheet_number_id'],
            'response_status' => 'pending'
        ]);

        // Guardar archivos
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('pqr_attachments', 'public');

                $pqr->attachedSupports()->create([
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'type' => $file->getClientOriginalExtension(),
                    'size' => $file->getSize()
                ]);
            }
        }

        return response()->json([
            'data' => $pqr->load(['creator', 'responsible', 'dependency', 'attachedSupports','sheetNumber']),
            'message' => 'PQR creada exitosamente'
        ], 201);
    }

    /**
     * MOSTRAR UNA PQR ESPECIFICA
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        $roleName = $user->getRoleNames()->first();

        $pqr = PQR::with(['creator', 'responsible', 'dependency', 'attachedSupports', 'sheetNumber'])->find($id);

        if (!$pqr) {
            return response()->json(['message' => 'PQR no encontrada'], 404);
        }

        // Autorización por rol
        if ($roleName === 'Aprendiz' && $pqr->user_id !== $user->id) {
            return response()->json(['message' => 'No autorizado para ver esta PQR'], 403);
        }

        //Solo las pqrs con la dependencia asignada las pueden ver
        if ($roleName === 'Dependencia' && $pqr->dependency_id !== $user->dependency_id) {
            return response()->json(['message' => 'No autorizado para ver esta PQR'], 403);
        }

        return response()->json([
            'data' => $pqr,
            'message' => 'PQR obtenida exitosamente'
        ], 200);
    }

    /**
     * ACTUALIZAR UNA PQR
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'response_time' => 'sometimes|date|after:today',
            'state' => 'sometimes|boolean',
            'dependency_id' => 'sometimes|exists:dependencies,id',
            'responsible_id' => 'sometimes|exists:users,id'
        ]);

        $user = $request->user();
        $roleName = $user->getRoleNames()->first();

        $pqr = PQR::find($id);
        if (!$pqr) {
            return response()->json(['message' => 'PQR no encontrada'], 404);
        }

        $pqr->update($validated);

        return response()->json([
            'data' => $pqr->fresh()->load(['creator', 'responsible', 'dependency', 'attachedSupports', 'sheetNumber']),
            'message' => 'PQR actualizada exitosamente'
        ], 200);
    }

    /**
     * RESPONDER UNA PQR
     */
    public function respond(Request $request, string $id): JsonResponse
    {
        try {
            $user = $request->user();
            $roleName = $user->getRoleNames()->first();

            $pqr = PQR::with(['creator', 'responsible', 'dependency'])->find($id);
            if (!$pqr) {
                return response()->json(['error' => 'PQR no encontrada'], 404);
            }

            if (!in_array($roleName, ['Admin', 'Dependencia'])) {
                return response()->json(['error' => 'No autorizado'], 403);
            }

            if ($roleName === 'Dependencia' && $pqr->responsible_id !== $user->id) {
                return response()->json(['error' => 'Solo puedes responder tus PQRs'], 403);
            }

            if (in_array($pqr->response_status, ['responded', 'closed'])) {
                return response()->json(['error' => 'Esta PQR ya fue respondida'], 422);
            }

            $validated = $request->validate([
                'response_message' => 'required|string|min:10|max:2000',
                'response_status' => 'sometimes|in:responded,closed'
            ]);

            // Actualizar
            $pqr->update([
                'response_message' => $validated['response_message'],
                'response_date' => now(),
                'response_status' => $validated['response_status'] ?? 'responded',
                'state' => true
            ]);

            // Enviar correo al creador
            try {
                Mail::to($pqr->creator->email)->send(new PQRResponseMail($pqr));
            } catch (\Exception $e) {
                Log::error('Error enviando email: ' . $e->getMessage());
            }

            return response()->json([
                'data' => $pqr->fresh()->load(['creator', 'responsible', 'dependency', 'attachedSupports','sheetNumber']),
                'message' => 'Respuesta enviada exitosamente'
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error interno: ' . $e->getMessage()], 500);
        }
    }

    /**
     * ELIMINAR PQR (NO PERMITIDO)
     */
    public function destroy(string $id)
    {
        return response()->json(['message' => 'No está permitido eliminar PQRs'], 405);
    }
}
