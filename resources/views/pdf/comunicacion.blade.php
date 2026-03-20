<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Comunicación Oficial</title>
    <style>
        /* Tipografía y Base Unificada */
        @page {
            margin: 2cm 2cm 2.5cm 2cm;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #000;
            margin: 0;
            padding: 0;
        }

        /* ENCABEZADO */
        .page-header {
            width: 100%;
            margin-bottom: 20px;
        }

        .header-table {
            width: 100%;
            border-collapse: collapse;
        }

        .header-logo-cell {
            width: 70px;
            vertical-align: middle;
        }

        .header-logo {
            max-width: 70px;
            max-height: 70px;
        }

        .header-info-cell {
            vertical-align: middle;
            padding-left: 10px;
        }

        /* ======= CONTENIDO ======= */
        .content {
            padding: 0;
        }

        /* ======= BLOQUES DE INFORMACIÓN ======= */
        .info-block {
            margin-bottom: 20px;
        }

        .label-small {
            font-size: 11pt; 
            display: block;
        }

        /* ======= DESTINATARIO ======= */
        .destinatario {
            margin-bottom: 25px;
        }

        .dest-nombre {
            text-transform: uppercase;
        }

        /* ======= ASUNTO ======= */
        .asunto-block {
            margin-bottom: 25px;
        }

        /* ======= SALUDO + TEXTO ======= */
        .saludo {
            margin-bottom: 5px;
        }

        .texto {
            text-align: justify;
            margin-bottom: 15px; 
            white-space: pre-wrap;
        }

        /* ======= DESPEDIDA Y FIRMA ======= */
        .cierre-contenedor {
            margin-top: 10px;
        }

        .despedida {
            margin-bottom: 20px;
        }

        .firma-block {
            margin-top: 20px;
        }

        /* Pie de Página */
        .page-footer {
            position: fixed;
            bottom: -1cm;
            left: 0;
            right: 0;
            border-top: 1px solid #ccc;
            text-align: center;
            font-size: 9pt;
            color: #666;
            padding: 8px 0;
        }

        /* QR CODE */
        .qr-wrapper {
            position: absolute;
            top: 25px;
            right: 0;
        }
        .qr-code {
            width: 80px;
            height: 80px;
        }
    </style>
</head>
<body>

    {{-- ============ QR CODE ============ --}}
    @if(!empty($qrCodeDataUri))
        <div class="qr-wrapper">
            <img src="{{ $qrCodeDataUri }}" class="qr-code" alt="QR Code">
        </div>
    @endif

    {{-- ============ ENCABEZADO ============ --}}
    <div class="page-header">
        <table class="header-table">
            <tr>
                <td class="header-logo-cell">
                    @if(!empty($data['logo_url']))
                        <img src="{{ public_path($data['logo_url']) }}" class="header-logo" alt="Logo">
                    @else
                        <div style="width: 50px; height: 50px; border: 1px dashed #ccc;"></div>
                    @endif
                </td>
                <td class="header-info-cell">
                    <div>{{ $data['institucion_nombre'] ?? '' }}</div>
                    <div style="font-size: 10pt;">NIT {{ $data['institucion_nit'] ?? '' }}</div>
                </td>
            </tr>
        </table>
    </div>

    {{-- ============ CONTENIDO ============ --}}
    <div class="content">

        {{-- Código y Fecha --}}
        <div class="info-block">
            @if(!empty($data['codigo']))
                <div>Código: {{ $data['codigo'] }}</div>
            @endif
            <div>{{ $data['lugar'] ?? $data['ciudad'] ?? '' }}, {{ $data['fecha'] ?? '' }}</div>
        </div>

        {{-- Destinatario --}}
        <div class="destinatario">
            <div>{{ $data['tratamiento'] ?? 'Señor(a):' }}</div>
            <div class="dest-nombre">{{ $data['nombres'] ?? '' }}</div>
            @if(!empty($data['cargo_destinatario']) || !empty($data['cargo']))
                <div>{{ $data['cargo_destinatario'] ?? $data['cargo'] }}</div>
            @endif
            @if(!empty($data['empresa'])) <div>{{ $data['empresa'] }}</div> @endif
            @if(!empty($data['direccion'])) <div>{{ $data['direccion'] }}</div> @endif
            @if(!empty($data['ciudad_destinatario']) || !empty($data['ciudad']))
                <div>{{ $data['ciudad_destinatario'] ?? $data['ciudad'] }}</div>
            @endif
        </div>

        {{-- Asunto --}}
        <div class="asunto-block">
            <span>Asunto:</span>
            <span> {{ $data['asunto'] ?? '' }}</span>
        </div>

        {{-- Saludo y Cuerpo --}}
        @if(!empty($data['saludo']))
            <div class="saludo">{{ $data['saludo'] }}</div>
        @endif

        <div class="texto">{!! nl2br(e($data['texto'] ?? $data['cuerpo'] ?? '')) !!}</div>

        {{-- Cierre Compacto (Atentamente y Firma) --}}
        <div class="cierre-contenedor">
            <div class="despedida">
                @if(!empty($data['despedida1'])) {{ $data['despedida1'] }} @endif
                @if(!empty($data['despedida2'])) {{ $data['despedida2'] }} @endif
                @if(!empty($data['despedida3'])) {{ $data['despedida3'] }} @endif
            </div>

            <div class="firma-block">
                <span>{{ mb_strtoupper($data['firma_nombres'] ?? $data['remitente'] ?? '') }}</span>
                @php
                    $cargo = $data['firma_cargo'] ?? $data['cargo_remitente'] ?? '';
                @endphp
                @if($cargo)
                    <span> - {{ $cargo }}</span>
                @endif
            </div>
        </div>

        {{-- Información adicional (Anexos, etc) --}}
        @if(!empty($data['anexo']) || !empty($data['copia']) || !empty($data['redactor']) || !empty($data['transcriptor']))
            <div style="margin-top: 30px; font-size: 10pt;">
                @if(!empty($data['anexo'])) <div>Anexo: {{ $data['anexo'] }}</div> @endif
                @if(!empty($data['copia'])) <div>Copia: {{ $data['copia'] }}</div> @endif
                @if(!empty($data['redactor'])) <div>Redactor: {{ $data['redactor'] }}</div> @endif
                @if(!empty($data['transcriptor'])) <div>Transcriptor: {{ $data['transcriptor'] }}</div> @endif
            </div>
        @endif

    </div>

    {{-- Pie de página --}}
    <div class="page-footer">
        @if(!empty($data['pie_pagina']))
            <div style="margin-bottom: 3px;">{{ $data['pie_pagina'] }}</div>
        @endif
    </div>

</body>
</html>
