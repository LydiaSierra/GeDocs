<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePQRRequest;
use App\Http\Requests\UpdatePQRRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse; //Importacion para repuestas ne json
use App\Models\PQR;
use App\Models\User;

class PQRController extends Controller
{
    //Metodo index (Iniicio y autenticación)
    public function index(Request $request): JsonResponse //retorna Json
    {
        $user = $request->user(); //Obtiene el usuario autenticado
        if(!$user){ //Verifica si hay usuario
            return response()->json(['message' => 'No autenticado'], 401);
        }

         $roleName = $user->role?->name ?? null;

         if (!$roleName) {
            return response()->json(['message' => 'Usuario sin rol asignado'], 403);
        }

        // Usuario final: solo sus PQRs creadas
        if ($roleName === 'usuario') {
            $pqrs = PQR::where('user_id', $user->id)
                       ->with(['creator', 'responsible', 'dependency']) //Carga relaciones
                       ->get();
        }
        // Superadmin: todas las PQRs
        elseif ($roleName === 'superadmin') {
            $pqrs = PQR::with(['creator', 'responsible', 'dependency'])->get();
        }
        // Encargado: solo PQRs asignadas a él
        elseif ($roleName === 'encargado') {
            $pqrs = PQR::where('responsible_id', $user->id) //pqrs asignadas a el
                       ->with(['creator', 'responsible', 'dependency'])
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
         $validated = $request->validate((new StorePQRRequest)->rules(), (new StorePQRRequest)->messages());

        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        $roleName = $user->role?->name ?? null;

        // Solo si es usuario final pueden crear PQRs
        if ($roleName !== 'usuario') {
            return response()->json(['message' => 'Solo usuarios normales pueden crear PQRs'], 403);
        }

        //Creacion del PQRS
        $pqr = PQR::create([
            'document_type' => $request->document_type,
            'document' => $request->document,
            'name' => $request->name,
            'address' => $request->address,
            'email' => $request->email,
            'phone' => $request->phone,
            'affair' => $request->affair,
            'description' => $request->description,
            'state' => 'pendiente',
            'user_id' => $user->id,
        ]);

        return response()->json([
            'data' => $pqr->load(['creator', 'responsible', 'dependency']),
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

        $pqr = PQR::with(['creator', 'responsible','dependency'])->find($id);

        if(!$pqr){
            return response()->json(['message'=> 'PQR no encontrada'], 404);
        }

        //Verificar permisos segun el rol

        $roleName = $user->role?->name ?? null;

        if($roleName === 'usuario' && $pqr->user_id !== $user->id){
            return response()->json(['message'=> 'No autorizado para ver este PQR'],403);
        }

        if ($roleName === 'encargado' && $pqr->responsible_id !== $user->id) {
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
        //Validar manualmente el request
        $validated = $request->validate((new UpdatePQRRequest)->rules(), (new UpdatePQRRequest)->messages());

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
         if ($roleName === 'superadmin') {
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
                    $encargado = User::where('dependency_id', $request->dependency_id)
                                   ->where('role_id', function($query) {
                                       $query->select('id')->from('roles')->where('name', 'encargado');
                                   })->first();
                    //Asignar encargado si existe
                    if ($encargado) {
                        $updateData['responsible_id'] = $encargado->id;
                        $updateData['state'] = 'asignado';
                    }
                }
            }
            $pqr->update($updateData);
        }
        elseif ($roleName === 'encargado') {
            // Encargado solo puede cambiar estado si la PQR está asignada a él
            if ($pqr->responsible_id !== $user->id) {
                return response()->json(['message' => 'No autorizado para actualizar esta PQR'], 403);
            }

            if ($request->has('state')) {
                $allowedStates = ['asignado', 'resuelto'];
                if (!in_array($request->state, $allowedStates)) {
                    return response()->json(['message' => 'Estado no válido'], 422);
                }

                $pqr->update(['state' => $request->state]);
            }
        }
        else {
            return response()->json(['message' => 'No autorizado para actualizar PQRs'], 403);
        }

         return response()->json([
            //Fresh carga el modelo desde la base de datos actualizado
            //Load -> carga las relaciones despues de la actualizacion
            'data' => $pqr->fresh()->load(['creator', 'responsible', 'dependency']),
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
}
