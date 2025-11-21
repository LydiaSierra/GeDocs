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
    </style>
</head>
<body>
    <div class="header">
        <h2>Respuesta a tu PQR</h2>
        <p>Tu consulta ha sido respondida</p>
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

        <h4>Respuesta oficial:</h4>
        <div class="response-box">
            {{ $pqr->response_message }}
        </div>

        <p><strong>Fecha de respuesta:</strong> {{ $pqr->response_date->format('d/m/Y H:i') }}</p>

        <div style="text-align: center;">
            <a href="{{ config('app.url') }}" class="btn">Acceder al Sistema</a>
        </div>
    </div>

    <div class="footer">
        <p>Este es un correo automático, no responder.</p>
        <p>&copy; {{ date('Y') }} GeDocs - Sistema de Gestión Documental</p>
    </div>
</body>
</html>
