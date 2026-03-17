<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Documento</title>
    <style>
        @page { margin: 2cm; }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
        }

        .top-bar {
            width: 100%;
            height: 15px;
            margin-bottom: 40px;
        }

        .bar-SenaGreen { width: 30%; height: 100%; background-color: #0FB849; float: left; }
        .bar-blue { width: 40%; height: 100%; background-color: #2c3e50; float: left; }
        .bar-SenaGreen-right { width: 30%; height: 100%; background-color: #0FB849; float: left; }

        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }

        .main-title {
            text-align: center;
            text-decoration: underline;
            font-weight: bold;
            font-size: 14pt;
            margin-bottom: 30px;
            clear: both;
        }

        .centered { text-align: center; }
        .bold { font-weight: bold; }
        .section { margin-bottom: 18px; }
        .line { display: block; }
        .large-text { text-align: justify; margin-top: 10px; white-space: pre-line; }

        .signature-container {
            margin-top: 50px;
            width: 100%;
        }

        .signature-line {
            width: 250px;
            border-top: 1px solid #000;
            padding-top: 6px;
        }

        .footer {
            text-align: center;
            font-size: 10pt;
            color: #555;
            margin-top: 40px;
        }

        .small-note {
            font-size: 10pt;
            margin-top: 4px;
        }

        ol {
            margin-top: 8px;
            padding-left: 22px;
        }

        ul {
            margin-top: 8px;
            padding-left: 18px;
        }

        li { margin-bottom: 6px; }
    </style>
</head>
<body>
@php
    $documentType = $data['document_type'] ?? 'carta';

    $decodeList = function ($key) use ($data) {
        $raw = $data[$key] ?? '[]';
        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            return [];
        }

        return array_values(array_filter(array_map(function ($item) {
            return trim((string) $item);
        }, $decoded), function ($item) {
            return $item !== '';
        }));
    };

    $actaAsistentes = $decodeList('acta_asistentes_json');
    $actaInvitados = $decodeList('acta_invitados_json');
    $actaAusentes = $decodeList('acta_ausentes_json');
    $actaOrdenDia = $decodeList('acta_orden_dia_json');
    $actaDesarrollo = $decodeList('acta_desarrollo_json');

    $informeElaboradoPor = $decodeList('informe_elaborado_por_json');
    $informeObjetivos = $decodeList('informe_objetivos_json');
    $informeConclusiones = $decodeList('informe_conclusiones_json');
    $informeRecomendaciones = $decodeList('informe_recomendaciones_json');
@endphp

<div class="top-bar clearfix">
    <div class="bar-SenaGreen"></div>
    <div class="bar-blue"></div>
    <div class="bar-SenaGreen-right"></div>
</div>

<div class="main-title">
    SENA - Centro de comercio y servicios - Regional Pereira<br>
    {{ ucfirst($documentType) }}
</div>

@if($documentType === 'carta')
    <div class="section">
        <div class="line">{{ $data['codigo'] ?? '' }}</div>
        <div class="line">{{ $data['lugar'] ?? '' }} {{ !empty($data['fecha']) ? ' - ' . $data['fecha'] : '' }}</div>
    </div>

    <div class="section">
        <div class="line">{{ $data['tratamiento'] ?? '' }}</div>
        <div class="line bold">{{ $data['nombres'] ?? '' }}</div>
        <div class="line">{{ $data['cargo'] ?? '' }}</div>
        <div class="line">{{ $data['empresa'] ?? '' }}</div>
        <div class="line">{{ $data['direccion'] ?? '' }}</div>
        <div class="line">{{ $data['ciudad'] ?? '' }}</div>
    </div>

    <div class="section"><div class="line">{{ $data['asunto'] ?? '' }}</div></div>

    <div class="section">
        <div class="line">{{ $data['saludo'] ?? '' }}</div>
        <div class="large-text">{!! nl2br(e($data['texto'] ?? '')) !!}</div>
    </div>

    <div class="section"><div class="line">{{ $data['despedida1'] ?? '' }}</div></div>

    <div class="signature-container">
        <div class="signature-line">
            <div class="line bold">{{ $data['firma_nombres'] ?? '' }}</div>
            <div class="line">{{ $data['firma_cargo'] ?? '' }}</div>
        </div>
    </div>

    <div class="section small-note">
        <div class="line">{{ $data['anexo'] ?? '' }}</div>
        <div class="line">{{ $data['copia'] ?? '' }}</div>
        <div class="line">{{ $data['redactor'] ?? '' }}</div>
        <div class="line">{{ $data['transcriptor'] ?? '' }}</div>
    </div>
@endif

@if($documentType === 'circular')
    <div class="section centered bold" style="font-size: 13pt;">
        {{ $data['titulo'] ?? '' }}
    </div>

    <div class="section">
        <div class="line">{{ $data['codigo'] ?? '' }}</div>
        <div class="line">{{ $data['lugar'] ?? '' }} {{ !empty($data['fecha']) ? ' - ' . $data['fecha'] : '' }}</div>
    </div>

    <div class="section"><div class="line">{{ $data['grupo_destinatario'] ?? '' }}</div></div>
    <div class="section"><div class="line">{{ $data['asunto'] ?? '' }}</div></div>
    <div class="section"><div class="line">{{ $data['saludo'] ?? '' }}</div></div>

    <div class="section"><div class="large-text">{!! nl2br(e($data['texto'] ?? '')) !!}</div></div>
    <div class="section"><div class="line">{{ $data['despedida1'] ?? '' }}</div></div>

    <div class="signature-container">
        <div class="signature-line">
            <div class="line bold">{{ $data['firma_nombres'] ?? '' }}</div>
            <div class="line">{{ $data['firma_cargo'] ?? '' }}</div>
        </div>
    </div>

    <div class="section small-note">
        <div class="line">{{ $data['anexo'] ?? '' }}</div>
        <div class="line">{{ $data['copia'] ?? '' }}</div>
        <div class="line">{{ $data['redactor'] ?? '' }}</div>
        <div class="line">{{ $data['transcriptor'] ?? '' }}</div>
    </div>
@endif

@if($documentType === 'acta')
    <div class="section centered bold" style="font-size: 13pt;">
        {{ $data['titulo'] ?? '' }}
    </div>

    <div class="section">
        <div class="line">{{ $data['fecha'] ?? '' }}</div>
        <div class="line">{{ $data['hora'] ?? '' }}</div>
        <div class="line">{{ $data['lugar'] ?? '' }}</div>
    </div>

    <div class="section">
        @if(!empty($actaAsistentes))
            <div class="bold">Asistentes</div>
            <ul>
                @foreach($actaAsistentes as $item)
                    <li>{{ $item }}</li>
                @endforeach
            </ul>
        @endif

        @if(!empty($actaInvitados))
            <div class="bold">Invitados</div>
            <ul>
                @foreach($actaInvitados as $item)
                    <li>{{ $item }}</li>
                @endforeach
            </ul>
        @endif

        @if(!empty($actaAusentes))
            <div class="bold">Ausentes</div>
            <ul>
                @foreach($actaAusentes as $item)
                    <li>{{ $item }}</li>
                @endforeach
            </ul>
        @endif
    </div>

    @if(!empty($actaOrdenDia))
        <div class="section">
            <div class="bold">Orden del dia</div>
            <ol>
                @foreach($actaOrdenDia as $item)
                    <li>{{ $item }}</li>
                @endforeach
            </ol>
        </div>

        <div class="section">
            <div class="bold">Desarrollo</div>
            @foreach($actaOrdenDia as $index => $item)
                <div style="margin-top: 8px;">
                    <div class="bold">{{ $item }}</div>
                    <div>{!! nl2br(e($actaDesarrollo[$index] ?? '')) !!}</div>
                </div>
            @endforeach
        </div>
    @endif

    <div class="section"><div class="large-text">{!! nl2br(e($data['acta_cuerpo_informe'] ?? '')) !!}</div></div>
    <div class="section"><div class="line">{{ $data['convocatoria'] ?? '' }}</div></div>

    <div class="signature-container">
        <div class="signature-line">
            <div class="line bold">{{ $data['firma_nombres'] ?? '' }}</div>
            <div class="line">{{ $data['firma_cargo'] ?? '' }}</div>
        </div>
    </div>

    <div class="section small-note">
        <div class="line">{{ $data['anexo'] ?? '' }}</div>
        <div class="line">{{ $data['transcriptor'] ?? '' }}</div>
    </div>
@endif

@if($documentType === 'informe')
    <div class="section"><div class="line">{{ $data['codigo'] ?? '' }}</div></div>

    <div class="section centered bold" style="font-size: 13pt;">
        {{ $data['titulo'] ?? '' }}
    </div>

    <div class="section"><div class="line">{{ $data['fecha'] ?? '' }}</div></div>

    @if(!empty($informeElaboradoPor))
        <div class="section">
            <div class="bold">Elaborado por</div>
            <ul>
                @foreach($informeElaboradoPor as $item)
                    <li>{{ $item }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    @if(!empty($informeObjetivos))
        <div class="section">
            <div class="bold">Objetivos</div>
            <ol>
                @foreach($informeObjetivos as $item)
                    <li>{{ $item }}</li>
                @endforeach
            </ol>
        </div>
    @endif

    <div class="section">
        <div class="bold">{{ $data['informe_titulo_actividad'] ?? '' }}</div>
        <div class="large-text">{!! nl2br(e($data['informe_cuerpo'] ?? '')) !!}</div>
    </div>

    @if(!empty($informeConclusiones))
        <div class="section">
            <div class="bold">Conclusiones</div>
            <ol>
                @foreach($informeConclusiones as $item)
                    <li>{!! nl2br(e($item)) !!}</li>
                @endforeach
            </ol>
        </div>
    @endif

    @if(!empty($informeRecomendaciones))
        <div class="section">
            <div class="bold">Recomendaciones</div>
            <ol>
                @foreach($informeRecomendaciones as $item)
                    <li>{!! nl2br(e($item)) !!}</li>
                @endforeach
            </ol>
        </div>
    @endif

    <div class="signature-container">
        <div class="signature-line">
            <div class="line bold">{{ $data['firma_nombres'] ?? '' }}</div>
            <div class="line">{{ $data['firma_cargo'] ?? '' }}</div>
        </div>
    </div>

    <div class="section small-note">
        <div class="line">{{ $data['anexo'] ?? '' }}</div>
        <div class="line">{{ $data['transcriptor'] ?? '' }}</div>
    </div>
@endif

@if($documentType === 'constancia')
    <div class="section"><div class="line">{{ $data['codigo'] ?? '' }}</div></div>

    <div class="section centered bold" style="font-size: 13pt;">
        {{ $data['constancia_cargo_quien_consta'] ?? '' }}
    </div>

    <div class="section centered bold" style="font-size: 14pt; margin-top: 20px; margin-bottom: 20px;">
        HACE CONSTAR
    </div>

    <div class="section"><div class="large-text">{!! nl2br(e($data['constancia_cuerpo'] ?? '')) !!}</div></div>

    <div class="signature-container">
        <div class="signature-line">
            <div class="line bold">{{ $data['firma_nombres'] ?? '' }}</div>
        </div>
    </div>

    <div class="section small-note">
        <div class="line">{{ $data['anexo'] ?? '' }}</div>
        <div class="line">{{ $data['transcriptor'] ?? '' }}</div>
    </div>
@endif

<div class="footer">
    SENA - Centro de comercio y servicios - Area de gestion documental<br>
    &copy; Gedocs {{ date('Y') }} Todos los derechos reservados.
</div>

</body>
</html>
