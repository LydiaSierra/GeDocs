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
     * LISTAR TODAS LAS PQRS (INBOX = NO ARCHIVADAS)
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        // 🔹 Read ?archived=true|false (default: false → inbox)
        $archived = filter_var(
            $request->query('archived', false),
            FILTER_VALIDATE_BOOLEAN
        );

        // 🔹 Base query (shared by all roles)
        $query = PQR::with([
            'creator',
            'responsible',
            'dependency',
            'attachedSupports',
            'sheetNumber'
        ])->where('archived', $archived);

        // 🔹 Dependencia: only its own PQRs
        if ($user->hasRole('Dependencia')) {
            $query->where('dependency_id', $user->dependency_id);
        }

        // 🔹 Admin: sees all (no extra filters)
        if ($user->hasRole('Admin')) {
            // no additional conditions
        }

        $pqrs = $query->get();

        return response()->json([
            'data' => $pqrs,
            'message' => $archived
                ? 'PQRs archivadas obtenidas exitosamente'
                : 'PQRs obtenidas exitosamente'
        ], 200);
    }


    /**
     * CREAR UNA PQR
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sender_name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'affair' => 'required|string|max:255',
            'request_type' => 'required|string|in:Peticion,Queja,Reclamo,Sugerencia',
            'response_time' => 'nullable|date|after_or_equal:today',
            'response_days' => 'nullable|in:10,15,30',
            'number' => 'required|string',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
            'email' => 'nullable|email|string|unique:p_q_r_s,email',
            'document_type' => 'required|string|in:CC,TI,CE',
            'document' => 'nullable|string|max:100|unique:p_q_r_s,document',
        ]);

        if (!empty($validated['response_days']) && !empty($validated['response_time'])) {
            return response()->json([
                'error' => 'No se pueden enviar response_days y response_time al mismo tiempo.'
            ], 422);
        }

        $sheetNumber = SheetNumber::where('number', $validated['number'])->first();
        if (!$sheetNumber) {
            return response()->json(['error' => 'Ficha técnica no encontrada'], 404);
        }

        $ventanillaUnica = Dependency::find($sheetNumber->ventanilla_unica_id);
        if (!$ventanillaUnica) {
            return response()->json(['error' => 'Ventanilla única no encontrada'], 404);
        }

        $userId = optional($request->user())->id;

        if (!empty($validated['response_days']) && empty($validated['response_time'])) {
            $validated['response_time'] = Carbon::now()
                ->addDays((int)$validated['response_days'])
                ->toDateString();
        }

        $pqr = PQR::create([
            'sender_name' => $validated['sender_name'],
            'description' => $validated['description'],
            'affair' => $validated['affair'],
            'response_time' => $validated['response_time'] ?? null,
            'response_days' => $validated['response_days'] ?? null,
            'state' => false,
            'archived' => false, // 🔸 ARCHIVE
            'user_id' => $userId,
            'responsible_id' => null,
            'dependency_id' => $ventanillaUnica->id,
            'request_type' => $validated['request_type'],
            'sheet_number_id' => $sheetNumber->id,
            'response_status' => 'pending',
            'email' => $validated['email'] ?? null,
            'document' => $validated['document'] ?? null,
            'document_type' => $validated['document_type'],
        ]);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('pqr_attachments', 'public');

                $pqr->attachedSupports()->create([
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'type' => $file->getClientOriginalExtension(),
                    'size' => $file->getSize(),
                ]);
            }
        }

        return response()->json([
            'data' => $pqr->load([
                'creator',
                'responsible',
                'dependency',
                'attachedSupports',
                'sheetNumber'
            ]),
            'message' => 'PQR creada exitosamente'
        ], 201);
    }

    /**
     * MOSTRAR PQRS DE UNA FICHA (NO ARCHIVADAS)
     */
    public function sheetShow(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user && $user->hasRole('Instructor')) {
            $pqrs = PQR::with(['creator', 'responsible', 'dependency', 'attachedSupports', 'sheetNumber'])
                ->whereIn('sheet_number_id', $user->sheetNumbers->pluck('id'))
                ->where('archived', false) // 🔸 ARCHIVE
                ->get();

            return response()->json($pqrs);
        }

        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        return response()->json([
            'message' => 'PQRs obtenidas exitosamente',
        ], 200);
    }

    /**
     * ACTUALIZAR UNA PQR (ARCHIVAR / DESARCHIVAR)
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'response_time' => 'sometimes|date|after:today',
            'response_days' => 'sometimes|in:10,15,30',
            'state' => 'sometimes|boolean',
            'archived' => 'sometimes|boolean', // 🔸 ARCHIVE
            'dependency_id' => 'sometimes|exists:dependencies,id',
            'responsible_id' => 'sometimes|exists:users,id'
        ]);

        $user = $request->user();
        $pqr = PQR::find($id);

        if (!$pqr) {
            return response()->json(['message' => 'PQR no encontrada'], 404);
        }

        if (isset($validated['response_days'])) {
            $pqr->response_days = (int)$validated['response_days'];
            $pqr->response_time = Carbon::now()->addDays($pqr->response_days)->toDateString();
            unset($validated['response_days']);
        }

        $pqr->fill($validated);
        $pqr->save();

        return response()->json([
            'data' => $pqr->fresh()->load(['creator', 'responsible', 'dependency', 'attachedSupports', 'sheetNumber']),
            'message' => 'PQR actualizada exitosamente'
        ], 200);
    }
}
