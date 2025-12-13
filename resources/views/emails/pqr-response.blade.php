<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Respuesta PQR</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #2c5282; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background: #f7fafc; }
        .response-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #3182ce; }
        .btn { display: inline-block; padding: 12px 30px; background: #3182ce; color: white; text-decoration: none; border-radius: 5px; }
        .btn:hover { background: #2c5282; }
        .footer { text-align: center; padding: 20px; color: #718096; font-size: 12px; }
        .alert { background: #fef5e7; border-left: 4px solid #f39c12; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Sistema de PQR</h1>
    </div>

    <div class="content">
        <h2>Hola, {{ $pqr->creator ? ', ' . $pqr->creator->name : ''}}</h2>

        <p>Tenemos una actualización sobre tu PQR:</p>

        <div class="response-box">
            <p><strong>Asunto:</strong> {{ $pqr->affair }}</p>
            <p><strong>Tipo:</strong> {{ $pqr->request_type }}</p>
            <p><strong>Fecha de solicitud:</strong> {{ $pqr->created_at->format('d/m/Y H:i') }}</p>
        </div>

        @if($comunication)
            {{-- CASO 1: Email con link para subir documentos --}}
            <div class="alert">
                <p><strong>Acción Requerida</strong></p>
                <p>{{ $comunication->message }}</p>
            </div>

            <p>Para continuar con el proceso, necesitamos que adjuntes los documentos solicitados.</p>

            @if(isset($responseUrl) && $responseUrl)
                <p style="text-align: center; margin: 30px 0;">
                    <a href="{{ $responseUrl }}" class="btn">
                        Adjuntar Documentos Requeridos
                    </a>
                </p>

                <p style="font-size: 12px; color: #718096;">
                    <strong>Nota importante:</strong> Este enlace es de un solo uso y expirará el
                    {{ \Carbon\Carbon::parse($comunication->response_expires_at)->format('d/m/Y') }}.
                </p>
            @else
                <p style="color: #e53e3e;">Error: No se pudo generar el enlace de respuesta.</p>
            @endif
        @else
            {{-- CASO 2: Respuesta tradicional sin link --}}
            <div class="response-box">
                <h3>Respuesta:</h3>
                <p>{{ $pqr->response_message ?? 'No hay mensaje de respuesta disponible'}}</p>

                @if($pqr->response_time)
                    <p><strong>Fecha de respuesta:</strong> {{ \Carbon\Carbon::parse($pqr->response_time)->format('d/m/Y H:i') }}</p>
                @endif

                @if($pqr->response_days)
                    <p><strong>Días de respuesta:</strong> {{ $pqr->response_days }} días</p>
                @endif

                <p><strong>Estado:</strong>
                    <span style="color: {{ $pqr->state ? '#22c55e' : '#ef4444' }};">
                        {{ $pqr->state ? '✓ Resuelta' : 'En proceso' }}
                    </span>
                </p>
            </div>

            <p>Si tienes alguna pregunta adicional, no dudes en contactarnos.</p>
        @endif
    </div>

    <div class="footer">
        <p>Este es un correo automático, por favor no responder.</p>
        <p>&copy; {{ date('Y') }} Sistema de Gestión de PQR</p>
    </div>
</body>
</html>
