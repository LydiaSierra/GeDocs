<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\PQR;

class PqrDeadlineNotification extends Notification
{
    use Queueable;
    public $pqr;
    public function __construct(PQR $pqr)
    {
        $this->pqr = $pqr;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'pqr_deadline',
            'pqr_id' => $this->pqr->id,
            'title' => '¡PQR a punto de vencer!',
            'message' => 'El tiempo de respuesta de la PQR #' . $this->pqr->id . ' está por agotarse.',
        ];
    }
}
