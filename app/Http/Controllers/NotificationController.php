<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->get();
        return redirect()->back()->with(['success' => true, 'notifications' => $notifications]);
    }

    public function unread(Request $request)
    {
        return redirect()->back()->with(['success' => true, 'notifications' => $request->user()->unreadNotifications]);
    }

    public function read(Request $request)
    {
        return redirect()->back()->with(['success' => true, 'notifications' => $request->user()->readNotifications]);
    }
    public function show(Request $request, $id)
    {
        $notification = $request->user()->notifications()->find($id);
        if (!$notification) {
            return redirect()->back()->with(['success' => false, 'message' => 'Notification not found']);
        }
        return redirect()->back()->with(['success' => true, 'notification' => $notification]);
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->first();
        if (!$notification) {
            return redirect()->back()->with(['success' => false, 'message' => 'Notificación no encontrada']);
        }
        $notification->markAsRead();
        return redirect()->back()->with(['success' => true, 'notifications' => $notification]);
    }

    public function updateUserOfNotification(Request $request, $id, $state)
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->first();
        if (!$notification) {
            return redirect()->back()->with(['success' => false, 'message' => 'Notificación no encontrada']);
        }
        $user = User::find($notification->data["user"]["id"]);
        if (!$user) {
            return redirect()->back()->with(['success' => false, 'message' => 'Usuario no encontrado']);
        }
        $stateAllowed = ["active", "pending", "rejected"];
        if (!in_array($state, $stateAllowed)) {
            return redirect()->back()->with(['success' => false, 'message' => 'Estado no permitido']);
        }
        $user->update([
            'status' => $state,
        ]);
        $data = $notification->data;
        $data["user"]["status"] = $state;
        $notification->update([
            'data' => $data,
        ]);
        return redirect()->back()->with(['success' => true, 'message' => 'Estado de usuario actualizado correctamente', 'notification' => $notification]);
    }
}
