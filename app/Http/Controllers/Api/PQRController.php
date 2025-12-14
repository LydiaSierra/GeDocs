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
use App\Models\Dependency;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use App\Models\Sheet_number as SheetNumber;

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

            return response()->json($pqrs);
        }

        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        // Si quieres que solo admin vea todas, validaaquí
        if ($user->hasRole('Admin')) {
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
            'request_type' => 'required|string|in:Peticion,Queja,Reclamo,Sugerencia',
            'response_time' => 'nullable|date|after:today',
            'response_days' => 'sometimes|in:10,15,30',
            'number' => 'required|string',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
            'email'=> 'nullable|email|string|unique:p_q_r_s,email',
            'document'=> 'nullable|string|max:100|unique:p_q_r_s,document',
        ]);

        //Buscar id de la ficha tecnica por el numero en la tabla sheet
        $sheetNumber = SheetNumber::where('number', $request->number)->first();

        if (!$sheetNumber) {
            return response()->json(['error' => 'Ficha técnica no encontrada'], 404);
        }
        //Buscar dependencia de ventanilla unica
        $ventanillaUnica = Dependency::find($sheetNumber->ventanilla_unica_id);

        if(!$ventanillaUnica){
            return response()->json(['error' => 'Ventanilla unica no encontrada para esta ficha'],404);
        }


        $user = $request->user();
        $userId = $user ? $user->id : null;

          // Si envían response_days y no response_time, calcular response_time desde hoy
        if (isset($validated['response_days']) && empty($validated['response_time'])) {
            $validated['response_time'] = Carbon::now()->addDays((int)$validated['response_days'])->toDateString();
        }

        // Asegurar que response_time exista o sea null
        $responseTime = $validated['response_time'] ?? null;


        // Crear la PQR
        $pqr = PQR::create([
            'description' => $validated['description'],
            'affair' => $validated['affair'],
            'response_time' => $responseTime,
            'response_days' => $validated['response_days'] ?? null,
            'state' => false,
            'user_id' => $userId,
            'responsible_id' => null,
            'dependency_id' => $ventanillaUnica->id,
            'request_type' => $validated['request_type'],
            'sheet_number_id' => $sheetNumber->id,
            'response_status' => 'pending',
            'email'=> $validated['email'] ?? null,
            'document'=> $validated['document'] ?? null,
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
            'response_days' => 'sometimes|in:10,15,30',
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

        //Permisos para establecer tiempos por dias
        $canSetDays = $user -> hasRole('Admin') || $user -> hasRole('Instructor') || ((int) $pqr->responsible_id) == $user->id;

        if (isset($validated['response_days'])) {
            if (!$canSetDays) {
                return response()->json(['message' => 'No autorizado para establecer tiempo de respuesta'], 403);
            }
            // asigna y persiste la columna response_days explícitamente
            $pqr->response_days = (int)$validated['response_days'];
            $pqr->response_time = Carbon::now()->addDays($pqr->response_days)->toDateString();
            // removemos para que no lo sobreescriba más abajo
            unset($validated['response_days']);
        }

        //Permisos para autorizar el update de tiempo de respuesta

        if (isset($validated['response_time'])) {
            if (!($user->hasRole('Admin') || $user->hasRole('Instructor'))) {
                return response()->json(['message' => 'No autorizado para modificar el tiempo de respuesta'], 403);
            }

        }

        // Actualizar el resto de campos (evitar sobrescribir response_days)
        $data = Arr::except($validated, ['response_days']);
        $pqr->fill($data);
        $pqr->save();


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
