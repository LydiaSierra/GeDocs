<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Acta de Reunión</title>
    <style>
        /* Optimización para PDF */
        @page {
            margin: 2cm;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
        }

        /* Barra decorativa superior (basada en la imagen) */
        .top-bar {
            width: 100%;
            height: 15px;
            margin-bottom: 40px;
        }
        .bar-SenaGreen { width: 30%; height: 100%; background-color: #0FB849; float: left; }
        .bar-blue { width: 40%; height: 100%; background-color: #2c3e50; float: left; }
        .bar-SenaGreen-right { width: 30%; height: 100%; background-color: #0FB849; float: left; }

        /* Título Principal */
        .main-title {
            text-align: center;
            text-decoration: underline;
            font-weight: bold;
            font-size: 14pt;
            margin-bottom: 50px;
            clear: both;
        }

        /* Bloques de sección */
        .section {
            margin-bottom: 20px;
        }

        .label {
            font-weight: bold;
            display: block;
        }

        .line {
            display: block;
        }

        /* Contenedor de datos del destinatario */
        .destinatario {
            margin: 30px 0;
        }

        /* Área de texto justificada */
        .text-content {
            text-align: justify;
            margin-top: 15px;
            margin-bottom: 30px;
        }

        /* Estructura de Firma al pie */
        .signature-container {
            margin-top: 60px;
            width: 100%;
        }
        .signature-line {
            width: 250px;
            border-top: 1px solid #000;
            padding-top: 5px;
        }

        .footer-notes {
            margin-top: 40px;
            font-size: 10pt;
        }

        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }

        .footer{
            text-align: center; 
            font-size: 10pt; 
            color: #555;
        }
    </style>
</head>
<body>

    <div class="top-bar clearfix">
        <div class="bar-SenaGreen"></div>
        <div class="bar-blue"></div>
        <div class="bar-SenaGreen-right"></div>
    </div>

    <div class="main-title">
        SENA - Centro de comercio y servicios - Regional Pereira<br>
        Acta de Reunión
    </div>

    <div class="section">
        <div class="line">Código de acta: {{ $data['codigo'] ?? 'S/N' }}</div>
        <div class="label">Lugar y fecha de elaboración</div>
        <div class="line">{{ $data['lugar'] ?? '' }}</div>
        <div class="line">{{ $data['fecha'] ?? '' }}</div>
    </div>

    <div class="destinatario">
        <div class="line">{{ $data['tratamiento'] ?? '' }}</div>
        <div class="label">{{ $data['nombres'] ?? '' }}</div>
        <div class="line">{{ $data['cargo'] ?? '' }}</div>
        <div class="line">{{ $data['empresa'] ?? '' }}</div>
        <div class="line">{{ $data['direccion'] ?? '' }}</div>
        <div class="line">{{ $data['ciudad'] ?? '' }}</div>
    </div>

    <div class="section">
        <span class="label" style="display: inline;">Asunto:</span>
        <span>{{ $data['asunto'] ?? '' }}</span>
    </div>

    <div class="section">
        <div class="line">{{ $data['saludo'] ?? '' }}</div>
        <div class="text-content">
            {!! nl2br(e($data['texto'] ?? '')) !!}
        </div>
    </div>

    <div class="section">
        <div class="line">{{ $data['despedida1'] ?? '' }}</div>
        <div class="line">{{ $data['despedida2'] ?? '' }}</div>
        <div class="line">{{ $data['despedida3'] ?? '' }}</div>
    </div>

    <div class="signature-container">
        <div class="signature-line">
            <div class="label">{{ $data['firma_nombres'] ?? '' }}</div>
            <div class="line">{{ $data['firma_cargo'] ?? '' }}</div>
        </div>
    </div>

    <div class="footer-notes">
        @if(!empty($data['anexo']))
            <div><strong>Anexo:</strong> {{ $data['anexo'] }}</div>
        @endif
        @if(!empty($data['copia']))
            <div><strong>Copia:</strong> {{ $data['copia'] }}</div>
        @endif
        @if(!empty($data['transcriptor']))
            <div style="margin-top: 10px;"><strong>Transcriptor:</strong> {{ $data['transcriptor'] }}</div>
        @endif
    </div>

    <!-- <div class="top-bar clearfix">
        <div class="bar-SenaGreen"></div>
        <div class="bar-blue"></div>
        <div class="bar-SenaGreen-right"></div>
    </div> -->
    <br>
    <div class="footer">
        <div>
            SENA - Centro de comercio y servicios - Area de gestion documental<br>
            &copy; Gedocs {{ date('Y') }} Todos los derechos reservados.
        </div>
    </div>

</body>
</html>