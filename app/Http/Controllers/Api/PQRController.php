<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePQRRequest;
use App\Http\Requests\UpdatePQRRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse; //Importacion para repuestas ne json
use App\Models\PQR;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\PQRResponseMail;

class PQRController extends Controller
{
    //Metodo index (Iniicio y autenticación)
    public function index(Request $request): JsonResponse //retorna Json
    {
    $user = $request->user();

    if (!$user) {
        return response()->json(['message' => 'Usuario de prueba no encontrado'], 404);
    }

    $roleName = $user->role?->name ?? null;

    if ($roleName === 'user') {
        $pqrs = PQR::where('user_id', $user->id)
                   ->with(['creator', 'responsible', 'dependency', 'attachedSupports'])
                   ->get();
    }
    elseif ($roleName === 'admin') {
        $pqrs = PQR::with(['creator', 'responsible', 'dependency', 'attachedSupports'])->get();
    }
    elseif ($roleName === 'dependent') {
        $pqrs = PQR::where('responsible_id', $user->id)
               ->with(['creator', 'responsible', 'dependency', 'attachedSupports'])
               ->get();
     }
    else {
        return response()->json(['message' => 'Rol no autorizado'], 403);
    }

    return response()->json([
        'data' => $pqrs,
        'message' => 'PQRs obtenidas exitosamente'
    ], 200);
    }

    //Metodo para crear PQRS
    public function store(Request $request):JsonResponse{
         $validated = $request->validate([
            'description' => 'required|string|max:1000',
            'affair' => 'required|string|max:255',
            'response_time' => 'required|date|after:today',
            'dependency_id' => 'required|exists:dependencies,id',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120'
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        $roleName = $user->role?->name ?? null;

        // Solo si es usuario normal pueden crear PQRs
        if ($roleName !== 'user') {
            return response()->json(['message' => 'Solo usuarios normales pueden crear PQRs'], 403);
        }

        $responsible = User::whereHas('role', function($query) {
                $query->where('name', 'dependent');
            })
            ->first(); // O mejor lógica para asignar responsable

        if (!$responsible) {
            return response()->json(['message' => 'No hay responsables disponibles'], 422);
        }

        //Creacion del PQRS
        $pqr = PQR::create([
            'description' => $validated['description'],
            'affair' => $validated['affair'],
            'response_time' => $validated['response_time'],
            'state' => false, // false = pendiente, true = resuelto
            'user_id' => $user->id,
            'responsible_id' => $responsible->id,
            'dependency_id' => $validated['dependency_id'],
        ]);

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
            'data' => $pqr->load(['creator', 'responsible', 'dependency',  'attachedSupports']),
            'message' => 'PQR creada exitosamente'
        ],201);

    }


    public function show(Request $request, string $id):JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        if(!$user){
            return response()->json(['message'=> 'No autenticado'],401);
        }

        $pqr = PQR::with(['creator', 'responsible','dependency', 'attachedSupports'])->find($id);

        if(!$pqr){
            return response()->json(['message'=> 'PQR no encontrada'], 404);
        }

        //Verificar permisos segun el rol

        $roleName = $user->role?->name ?? null;

        if($roleName === 'user' && $pqr->user_id !== $user->id){
            return response()->json(['message'=> 'No autorizado para ver este PQR'],403);
        }

        if ($roleName === 'dependent' && $pqr->responsible_id !== $user->id) {
            return response()->json(['message' => 'No autorizado para ver esta PQR'], 403);
        }

        return response()->json([
            'data' => $pqr,
            'message' => 'PQR obtenida exitosamente'
        ], 200);
    }

    /**
     * Update the specified resource in storage. (PATCH)
     */
    public function update(Request $request, string $id):JsonResponse
    {
         $validated = $request->validate([
            'response_time' => 'sometimes|date|after:today',
            'state' => 'sometimes|boolean',
            'dependency_id' => 'sometimes|exists:dependencies,id',
            'responsible_id' => 'sometimes|exists:users,id'
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        //Buscar PQR a actualizar
        $pqr = PQR::find($id);
        if (!$pqr) {
            return response()->json(['message' => 'PQR no encontrada'], 404);
        }

         $roleName = $user->role?->name ?? null;

        //Logica por roles para actualizar
         if ($roleName === 'admin') {
            // Superadmin puede actualizar response_time, dependency_id y responsible_id
            $updateData = [];

            if ($request->has('response_time')) {
                $updateData['response_time'] = $request->response_time;
            }

            if ($request->has('dependency_id')) {
                $updateData['dependency_id'] = $request->dependency_id;

                // Si se asigna dependencia, buscar encargado y cambiar estado
                if ($request->dependency_id) {
                    //Buscar encargado por dependencia
                    $encargado = User::whereHas('role', function($query) {
                        $query->where('name', 'dependent');
                    })->first();
                    //Asignar encargado si existe
                    if ($encargado) {
                        $updateData['responsible_id'] = $encargado->id;
                        $updateData['state'] = false;
                    }
                }
            }
            $pqr->update($updateData);
        }
        elseif ($roleName === 'dependent') {
            // Encargado solo puede cambiar estado si la PQR está asignada a él
            if ($pqr->responsible_id !== $user->id) {
                return response()->json(['message' => 'No autorizado para actualizar esta PQR'], 403);
            }

            if ($request->has('state')) {
            $pqr->update(['state' => $request->boolean('state')]); // ✅ Boolean
            }
        }
        else {
            return response()->json(['message' => 'No autorizado para actualizar PQRs'], 403);
        }

         return response()->json([
            //Fresh carga el modelo desde la base de datos actualizado
            //Load -> carga las relaciones despues de la actualizacion
            'data' => $pqr->fresh()->load(['creator', 'responsible', 'dependency', 'attachedSupports']),
            'message' => 'PQR actualizada exitosamente'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     * DELETE
     */
    public function destroy(string $id)
    {
        return response()->json(['message' => 'No esta permitido eliminar el PQRS'],405);
    }

    public function respond(Request $request, string $id): JsonResponse // ✅ AGREGAR $id y tipo de retorno
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'No autenticado'], 401);
            }

            $pqr = PQR::with(['creator', 'responsible', 'dependency'])->find($id);

            if (!$pqr) {
                return response()->json(['error' => 'PQR no encontrada'], 404);
            }

            $roleName = $user->role?->name ?? null;

            // Solo admins y dependents pueden responder
            if (!in_array($roleName, ['admin', 'dependent'])) {
                return response()->json(['error' => 'No autorizado para responder PQRs'], 403);
            }

            // Si es dependent, solo puede responder sus PQRs asignadas
            if ($roleName === 'dependent' && $pqr->responsible_id !== $user->id) {
                return response()->json(['error' => 'Solo puedes responder PQRs asignadas a ti'], 403);
            }

            // ✅ CAMBIAR: Verificar si ya fue respondida (sin método personalizado)
            if ($pqr->response_status === 'responded' || $pqr->response_status === 'closed') {
                return response()->json(['error' => 'Esta PQR ya fue respondida'], 422);
            }

            $validated = $request->validate([
                'response_message' => 'required|string|min:10|max:2000',
                'response_status' => 'sometimes|in:responded,closed'
            ]);

            // Actualizar PQR con respuesta
            $pqr->update([
                'response_message' => $validated['response_message'],
                'response_date' => now(),
                'response_status' => $validated['response_status'] ?? 'responded',
                'state' => true // Marcar como procesada
            ]);

            try {
                Mail::to($pqr->creator->email)->send(new \App\Mail\PQRResponseMail($pqr));
            } catch (\Exception $e) {
                // Log error pero no fallar la respuesta
                Log::error('Error enviando email PQR: ' . $e->getMessage());
            }

            return response()->json([
                'data' => $pqr->fresh()->load(['creator', 'responsible', 'dependency', 'attachedSupports']),
                'message' => 'Respuesta enviada exitosamente y email notificado al usuario'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error interno: ' . $e->getMessage()
            ], 500);
        }
    }
}
