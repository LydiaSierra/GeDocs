<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Acta</title>
    <style>

        /* contenido general */
        body {
            font-family: DejaVu Sans, sans-serif;
            line-height: 1.4;
        }
        /* contenedor del encabezado */
        .titleContainer{
            border: 1px solid black;
            display: flex;
            justify-content: start;
            width: 100%;
            height: 5vh;
            margin: 0;
            padding: 0;
        }

        .containerGedocs{
            background-color: skyblue;
            text-align: center;
            height: auto;
        }
        .containerSena{
            height: auto;
            background-color: skyblue;
            text-align: center;
        }
        .sectionTitle{
            width: 60%;
            text-align: center;
            background-color: orange;
            height: auto;
        }

        /* subtitulos */
        .label {
            font-weight: bold;
        }

        /* texto de la información */
        .line{
            color: gray;
        }

        .section {
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="titleContainer">
        
        <div class="containerGedocs">
            <!-- <img src="/gedocs-logo.svg" alt="gedocs logo"> -->
             <h1> GeDocs </h1>
        </div>

        <div class="sectionTitle">
            <div class="label">Código de acta:</div>
            <div class="line">{{ $data['codigo'] ?? '' }}</div>
        </div>

        <div class="containerSena">
            <h1> SENA </h1>
        </div>

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