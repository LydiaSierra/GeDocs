<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    private function checkDeadlines(Request $request)
    {
        $user = $request->user();
        if (!$user->hasRole('Dependencia') || !$user->dependency_id) {
            return;
        }

        $pqrs = \App\Models\PQR::where('dependency_id', $user->dependency_id)
            ->whereNull('response_date')
            ->whereNotNull('response_time')
            ->where('state', false)
            ->where('response_status', '!=', 'responded')
            ->where('response_status', '!=', 'closed')
            ->get();

        foreach ($pqrs as $pqr) {
            $created = \Carbon\Carbon::parse($pqr->created_at);
            $deadline = \Carbon\Carbon::parse($pqr->response_time);
            $now = \Carbon\Carbon::now();

            $total = $deadline->diffInMinutes($created);
            if ($total <= 0) continue;

            $remaining = $deadline->diffInMinutes($now, false);
            $pct = ($remaining / $total) * 100;

            if ($pct < 50) {
                $exists = $user->notifications()
                    ->where('type', \App\Notifications\PqrDeadlineNotification::class)
                    ->where('data->pqr_id', $pqr->id)
                    ->exists();

                if (!$exists) {
                    $user->notify(new \App\Notifications\PqrDeadlineNotification($pqr));
                }
            }
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->checkDeadlines($request);
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->get();
        return response()->json(['success' => true, 'notifications' => $notifications]);
    }

    public function unread(Request $request)
    {
        $this->checkDeadlines($request);
        return response()->json(['success' => true, 'notifications' => $request->user()->unreadNotifications]);
    }

    public function read(Request $request)
    {
        return response()->json(['success' => true, 'notifications' => $request->user()->readNotifications]);
    }
    public function show(Request $request, $id)
    {
        $notification = $request->user()->notifications()->find($id);
        if (!$notification) {
            return response()->json(['success' => false, 'message' => 'Notification not found'], 404);
        }
        return response()->json(['success' => true, 'notification' => $notification]);
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->first();
        if (!$notification) {
            return response()->json(['success' => false, 'message' => 'Notificación no encontrada'], 404);
        }
        $notification->markAsRead();
        return response()->json(['success' => true, 'notification' => $notification]);
    }

    public function updateUserOfNotification(Request $request, $id, $state)
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->first();
        if (!$notification) {
            return response()->json(['success' => false, 'message' => 'Notificación no encontrada'], 404);
        }
        $userSummary = $notification->data["user"];
        $user = User::find($userSummary["id"]);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuario no encontrado'], 404);
        }
        $stateAllowed = ["active", "pending", "rejected"];
        if (!in_array($state, $stateAllowed)) {
            return response()->json(['success' => false, 'message' => 'Estado no permitido'], 400);
        }
        $user->update([
            'status' => $state,
        ]);
        $data = $notification->data;
        $data["user"]["status"] = $state;
        $notification->update([
            'data' => $data,
        ]);
        return response()->json(['success' => true, 'message' => 'Estado de usuario actualizado correctamente', 'notification' => $notification]);
    }
}
