<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Respuesta PQR</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: rgb(184, 184, 184);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .content {
            background: #f8f9fa;
            padding: 20px;
            border: 1px solid #dee2e6;
        }
        .response-box {
            background: white;
            padding: 15px;
            border-left: 4px solid #28a745;
            margin: 15px 0;
        }
        .footer {
            background: #6c757d;
            color: white;
            padding: 15px;
            text-align: center;
            border-radius: 0 0 8px 8px;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background: rgb(184, 184, 184);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
        }
        .btn:hover {
            background: #218838;
        }
        .alert {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Respuesta a tu PQR</h2>
         <p>{{ $comunication ? 'Nueva comunicación' : 'Tu consulta ha sido respondida' }}</p>
    </div>

    <div class="content">
        <h3>Información de tu PQR:</h3>
        <p><strong>Asunto:</strong> {{ $pqr->affair }}</p>
        <p><strong>Fecha de consulta:</strong> {{ $pqr->created_at->format('d/m/Y H:i') }}</p>
        <p><strong>Dependencia:</strong> {{ $pqr->dependency->name }}</p>
        <p><strong>Responsable:</strong> {{ $pqr->responsible->name }}</p>

        <h4>Tu consulta original:</h4>
        <div style="background: #e9ecef; padding: 10px; border-radius: 5px;">
            {{ $pqr->description }}
        </div>

        @if($comunication)
            <h4>{{ $comunication->sender_type === 'system' ? 'Respuesta oficial:' : 'Nueva comunicación:' }}</h4>
            <div class="response-box">
                {{ $comunication->message }}
            </div>

            {{-- Mostrar archivos adjuntos si los hay --}}
            @if($comunication->attachedSupports && $comunication->attachedSupports->count() > 0)
                <h5>Archivos adjuntos:</h5>
                <ul>
                    @foreach($comunication->attachedSupports as $attachment)
                        <li>{{ $attachment->name }} ({{ number_format($attachment->size / 1024, 2) }} KB)</li>
                    @endforeach
                </ul>
            @endif

            {{-- Mostrar link de respuesta si es necesario --}}
            @if($comunication->requires_response && $responseUrl)
                <div class="alert">
                    <strong>Se requiere información adicional</strong><br>
                    Para continuar con el procesamiento de tu PQR, necesitamos que adjuntes algunos documentos.
                </div>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="{{ $responseUrl }}" class="btn">
                        📎 Adjuntar Documentos Requeridos
                    </a>
                </div>

                <p style="font-size: 12px; color: #666;">
                    <strong>Nota:</strong> Este enlace es de un solo uso y expira en 7 días.
                    Una vez que subas los documentos, el enlace dejará de funcionar.
                </p>
            @endif
        @endif
    </div>

    <div class="footer">
        <p>Este es un correo automático, no responder.</p>
        <p>&copy; {{ date('Y') }} GeDocs - Sistema de Gestión Documental</p>
    </div>
</body>
</html>
