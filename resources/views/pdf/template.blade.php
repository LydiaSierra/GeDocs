<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Acta</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            line-height: 1.4;
        }

        .line {
            border-bottom: 1px solid #000;
            height: 18px;
            margin: 4px 0;
            width: 100%;
        }

        .label {
            font-weight: bold;
        }

        .textarea {
            border: 1px solid #000;
            min-height: 120px;
            margin-top: 5px;
            padding: 5px;
        }

        .section {
            margin-bottom: 15px;
        }
    </style>
</head>
<body>

    <div class="section">
        <div class="label">Código</div>
        <div class="line">{{ $data['codigo'] ?? '' }}</div>
    </div>

    <div class="section">
        <div class="label">Lugar y fecha de elaboración</div>
        <div class="line">{{ $data['lugar'] ?? '' }}</div>
        <div class="line">{{ $data['fecha'] ?? '' }}</div>
    </div>

    <div class="section">
        <div class="label">Tratamiento</div>
        <div class="line">{{ $data['tratamiento'] ?? '' }}</div>

        <div class="label">NOMBRES Y APELLIDOS</div>
        <div class="line">{{ $data['nombres'] ?? '' }}</div>

        <div class="label">Cargo</div>
        <div class="line">{{ $data['cargo'] ?? '' }}</div>

        <div class="label">Empresa</div>
        <div class="line">{{ $data['empresa'] ?? '' }}</div>

        <div class="label">Dirección</div>
        <div class="line">{{ $data['direccion'] ?? '' }}</div>

        <div class="label">Ciudad</div>
        <div class="line">{{ $data['ciudad'] ?? '' }}</div>
    </div>

    <div class="section">
        <div class="label">Asunto:</div>
        <div class="line">{{ $data['asunto'] ?? '' }}</div>
    </div>

    <div class="section">
        <div class="label">Saludo</div>
        <div class="line">{{ $data['saludo'] ?? '' }}</div>
    </div>

    <div class="section">
        <div class="label">Texto</div>
        <div class="textarea">
            {!! nl2br(e($data['texto'] ?? '')) !!}
        </div>
    </div>

    <div class="section">
        <div class="label">Despedida</div>
        <div class="line">{{ $data['despedida1'] ?? '' }}</div>
        <div class="line">{{ $data['despedida2'] ?? '' }}</div>
        <div class="line">{{ $data['despedida3'] ?? '' }}</div>
    </div>

    <div class="section">
        <div class="label">NOMBRES Y APELLIDOS</div>
        <div class="line">{{ $data['firma_nombres'] ?? '' }}</div>

        <div class="label">Cargo</div>
        <div class="line">{{ $data['firma_cargo'] ?? '' }}</div>
    </div>

    <div class="section">
        <div class="label">Anexo:</div>
        <div class="line">{{ $data['anexo'] ?? '' }}</div>
    </div>

    <div class="section">
        <div class="label">Copia:</div>
        <div class="line">{{ $data['copia'] ?? '' }}</div>
    </div>

    <div class="section">
        <div class="label">Transcriptor:</div>
        <div class="line">{{ $data['transcriptor'] ?? '' }}</div>
    </div>

</body>
</html>