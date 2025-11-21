<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewUserRegistered extends Notification
{
    use Queueable;

    public $newUser;
    /**
     * Create a new notification instance.
     */
    public function __construct($newUser)
    {
        $this->newUser = $newUser;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toDatabase($notifiable): array
    {
        $user = $this->newUser;
        return [
            'title' => "Registro de $user->role",
            'description' => "El usuario $user->name se ha registrado como $user->role",
            'message' => "
                    El usuario $user->name se ha registrado como $user->role:
                    datos del usuario:
                    Nombre: $user->name
                    Correo: $user->email
                    Tipo de documento: $user->document_type
                    Documento: $user->document_number.

                    Su estado actual es $user->state.

                    ¿DESEA PERMITIR QUE ESTE USUARIO INGRESE COMO INSTRUCTOR?

            ",
            'user' => $user,
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
