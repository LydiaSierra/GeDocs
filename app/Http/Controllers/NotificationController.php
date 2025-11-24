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

        return response()->json([
            'success' => true,
            'notifications' => $notifications
        ]);
    }

    public function unread(Request $request)
    {
        return response()->json([
            'success' => true,
            'notifications' => $request->user()->unreadNotifications,
        ]);
    }


      public function read(Request $request)
    {
        return response()->json([
            'success' => true,
            'notifications' => $request->user()->readNotifications,
        ]);
    }
    public function show(Request $request, $id)
    {
        $notification = $request->user()->notifications()->find($id);
        if (!$notification) {
            return response()->json(["success" => false, "message" => "Notification not found"], 404);
        }
        return response()->json(['success' => true, 'notification' => $notification], 200);
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
        
        return response()->json(["success" => true, "notifications"=> $notification],200);

    }
}
