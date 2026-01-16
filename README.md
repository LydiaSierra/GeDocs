<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## Sistema de Gestión Documental con PQRS 

Proyecto backend y frontend para la gestión documental y manejo de PQRS, desarrollado con Laravel, Inertia.js, React. 


## Índice de contenido 

- Descripción del proyecto. 
- Características principales. 
- Arquitectura y tecnologías. 
- Requisitos previos. 
- Instalación. 
- Configuración del entorno. 
- Ejecución del proyecto. 
- Estructura del proyecto. 
- Comandos útiles. 
- Problemas comunes.
- Tecnologías utilizadas.
- Herramientas de desarrollo (DevDependencies) .
- Scripts principales.
- Api EndPoints. 
- Notas finales. 

## Descripción del proyecto 

El Sistema de Gestión Documental con PQRS es una plataforma web diseñada para administrar documentos institucionales y gestionar Peticiones, Quejas, Reclamos y Sugerencias (PQRS) de manera centralizada, segura y trazable. 

## Características principales 

- Gestión de documentos digitales. 

- Registro y seguimiento de PQRS. 

- Notificaciones internas. 

- Control de acceso por roles y permisos. 

- Interfaz moderna con React. 

## Arquitectura y tecnologías

| Método      | URI                           | 
|-------------|-------------------------------|
| Backend     | Laravel (PHP >= 8.1)          | 
| Frontend    | Inertia.js, React y Vite      | 
| Otros       | MySQL                         | 

## Requisitos previos

Asegúrese de tener instalado lo siguiente: 

- PHP >= 8.1 

- Composer >= 2.x 

- Node.js >= 18.x 

- npm >= 9.x 

- Git 

- MySQL >= 8.x  

##  Instalación

1. Clonar el repositorio 
``` 
git clone https://github.com/LydiaSierra/GeDocs.git 
cd GecDosc 
``` 
2. Instalar dependencias backend 
``` 
composer install 
``` 
3. Instalar dependencias frontend 
``` 
npm install 
``` 
4. Instalar paquetes backend 
``` 
composer require spatie/laravel-permission 
``` 
``` 
php artisan vendor:publish --provider="Spatie\\Permission\\PermissionServiceProvider" 
``` 
``` 
composer require barryvdh/laravel-dompdf 
``` 
``` 
php artisan vendor:publish --provider="Barryvdh\DomPDF\ServiceProvider" 
``` 

## Configuración del entorno

1. Variables de entorno 

cp .env.example .env 

Cree el archivo .env en la raiz del proyecto. 

Copie todo del .env.example y peguelo en el .env creado 

2. Generar clave de la aplicación 
``` 
php artisan key:generate 
``` 
3. Migraciones y seeders 
``` 
php artisan migrate 

``` 

``` 
php artisan db:seed 
``` 
4. Enlace de almacenamiento 
``` 
php artisan storage:link 
``` 

## Ejecución del proyecto

``` 
composer run dev 
``` 
| Aplicación disponible en | http://localhost:8000 |
|--------------------------|-----------------------|

## Estructura del proyecto

``` 
app/ 
├── Http/                                                          # Capa de entrada HTTP 
|   ├── Controllers/                                               # Controladores de la aplicación            
|   |   ├── Api/                                                   # Controladores API (JSON)
|   |   |   └── AuthController.php                                 # Autenticación vía API
│   │   ├── Controller.php                                         # Controlador base 
│   │   ├── DependencyController.php                               # Gestión de dependencias 
│   │   ├── ExplorerController.php                                 # Render de vista Explorer 
│   │   ├── FolderController.php                                   # Gestión de carpetas documentales 
│   │   ├── NotificationController.php                             # Notificaciones del sistema 
│   │   ├── PdfController.php                                      # Generación de documentos PDF 
│   │   ├── ProfileController.php                                  # Perfil de usuario 
│   │   ├── SheetController.php                                    # Gestión de fichas 
│   │   └── UserController.php                                     # Gestión de usuarios 
│   ├── Middleware/                                                # Middlewares HTTP 
│   │   └── HandleInertiaRequests.php                              # Middleware Inertia  
│   ├── Requests/                                                  # Form Requests (validaciones) 
│   └── Resources/                                                 # API Resources (transformación de datos) 
├── Models/                                                        # Modelos Eloquent                                      │   ├── User.php                                                   # Modelo de usuario 
│   └── ...                                                        # Otros modelos del dominio              
├── Notifications/                                                 # Notificaciones (mail, database, etc.)
├── Providers/                                                     # Service Providers 
│   └── AppServiceProvider.php                                     # Configuración global 
├── Policies/                                                      # Políticas de autorización
├── config/                                                        # Archivos de configuración 
|   ├── auth.php 
|   ├── database.php 
|   ├── services.php 
|   └── ... 
├── database/                                                      # Persistencia 
|   ├── factories/                                                 # Factories para testing 
|   ├── migrations/                                                # Migraciones de base de datos 
|   └── seeders/                                                   # Seeders 
├── lang/                                                          # Traducciones 
|   ├── es/ 
|   └── en/ 
├── public/                                                        # Archivos públicos 
├── resources/                                                     # Frontend (Inertia + React)
|   ├── js/ 
|   |   ├── Components/                                            # Componentes reutilizables 
|   │   ├── Context/                                               # Contextos globales 
|   │   ├── Layouts/                                               # Layouts de la aplicación 
|   │   ├── Pages/                                                 # Páginas Inertia 
|   │   ├── lib/ 
|   │   │   └── axios.js                                           # Configuración global de Axios 
|   │   ├── app.jsx                                                # Punto de entrada React 
|   │   └── bootstrap.js                                           # Inicialización frontend 
|   ├── views/ 
|   │   └── app.blade.php                                          # Vista base Inertia 
├── routes/                                                        # Definición de rutas
|   ├── web.php                                                    # Rutas web (Inertia)
|   └── api.php                                                    # Rutas API
├── tests/                                                         # Pruebas automatizadas 
└── vendor/                                                        # Dependencias PHP (Composer) 
``` 

## Comandos útiles

``` 
php artisan optimize:clear 
php artisan migrate:fresh --seed 
npm run build 
``` 

## Problemas comunes

- Pantalla en blanco: verificar que npm run dev esté activo. 

- Error de permisos: revisar carpetas storage y bootstrap/cache. 

- Error de Vite: limpiar cache y reinstalar dependencias. 

## Tecnologías utilizadas

| BACKEND | 
|---------|

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| PHP        | 8.2 | Lenguaje backend  |
| Laravel    | 12.x | Framework backend |
| Inertia Laravel | 2.0 | Integración SPA sin API REST |
| Laravel Sanctum | * | Autenticación |
| Spatie Laravel Permission | 6.23 | Roles y permisos |
| Laravel DOMPDF | 3.1 | Generación de documentos PDF |
| Tighten Ziggy | 2.0 | Rutas de Laravel en frontend |
| Laravel Spanish | 1.5 | Traducciones al español |

| FRONTEND |
|----------|

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React       | 18.2 | Librería UI  |
| React DOM     | 18.2 | Renderizado en navegador  |
| Inertia.js  | 0.11.1  | Navegación SPA  |
| Vite  | 7.0.7  | Bundler y servidor de desarrollo  |
| Tailwind CSS  | 4.1.16  | Estilos utilitarios  |
| DaisyUI  | 5.3.10  | Componentes UI  |
| Headless UI  | 2.0 | Componentes accesibles  |
| Heroicons  | 2.2 | Íconos SVG  |
| Axios | 1.13.2 | Cliente HTTP  |
| Sonner  | 2.0.7 | Notificaciones (toasts)  |

## Herramientas de desarrollo (DevDependencies)

| FRONTEND |
|----------|

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| Laravel Vite Plugin | 2.0 | Integración Vite con Laravel  |
| Vite React Plugin   | 4.2 | Soporte React en Vite   |
| PostCSS | 8.4  | Procesamiento CSS   |
| Tailwind Forms | 0.5  | Estilos para formularios   |
| Concurrently   | 9.0  | Ejecutar procesos en paralelo   |

| BACKEND | 
|---------|

| Herramienta  | Versión | Propósito |
|--------------|---------|-----------|
| Laravel Breeze        | 2.3 | Autenticación base  |
| Laravel Sail     | 1.41 | Entorno Docker |
| Laravel Pint  | 1.24 | Formateador de código  |
| Pest PHP  | 3.8 |Testing  |
| Faker PHP  | 1.23 | Datos de prueba  |
| Collision  | 8.6 | Manejo de errores en consola  |

## Scripts principales

| Script | Descripción  | 
|--------|--------------|
| npm run dev | Ejecuta Vite en modo desarrollo  | 
| npm run build | Compila assets para producción | 
| composer setup | Instalación completa del proyecto | 
| composer dev | Backend + colas + frontend en paralelo |
| composer test | Ejecuta pruebas automatizadas |

## API

## Api EndPoints 

Autenticación requerida:  para utilizar las APIs en aplicaciones externas debera ingresar el siguiente endpoint para iniciar sesión y generar el token para agregarlo a su aplicacion externa (postman).

POST  api/login 

Genera el token para iniciar sesión desde aplicacion externa como (postman); 

- Respuesta 200 (Éxito) 

``` 
{ 

    "success": true, 

    "token": "2|yJ48w4oW10UoRhdgND9bnm7wHrlg9...", 

    "user": { 

        "id": 1, 

        "type_document": "CC", 

        "document_number": 1020304050, 

        "status": "active", 

        "name": "Julio Alexis", 

        "email": "julioalexishoyoscolorado@gmail.com", 

        "email_verified_at": null, 

        "profile_photo": "http://localhost:8000/storage/profile/picture/user-1/239defc0-089d-4f0f-a2fc-e3178f204500.jpg", 

        "dependency_id": null, 

        "created_at": "2025-12-15T00:25:46.000000Z", 

        "updated_at": "2025-12-15T17:58:26.000000Z" 

    } 

} 
``` 

Authorization: Bearer <TOKEN> 

## API – Gestión de Carpetas (Folders)

Esta sección describe el funcionamiento de la API de Carpetas, incluyendo los endpoints disponibles, los datos esperados en cada solicitud y las respuestas devueltas en caso de éxito o error, siguiendo el estilo de documentación mostrado en el ejemplo. 

- Modelo Folder

| Columnas |
|----------|

| Campo | VTipo  | Descripción |
|-------------|---------|-----------|
| id  | bigint | Identificador único   |
| name   | string  | Nombre de la carpeta   |
| parent_id | integer - null  | Carpeta padre (estructura jerárquica)   |
| folder_code | string - null  | Código interno de la carpeta    |
| department   | string  | Departamento responsable   |
| created_at | timestamp   | Fecha de creación   |
| updated_at  | timestamp   | Fecha de actualización   |

| Relaciones |
|------------|
| Folder tiene muchos File |
| Folder puede tener una carpeta padre |
| Folder puede tener carpetas hijas |

- Endpoints

| Listar fichas |
|---------------|
| GET /api/sheets | 

Devuelve todas las fichas con los usuarios asignados. 

-  Respuesta 200 (Éxito)

``` 
{ 

  "success": true, 

  "sheets": [ 

    { 

      "id": 1, 

      "number": "2690123", 

      "active": true, 

      "state": "active", 

      "users": [ 

        { 

          "id": 5, 

          "name": "Juan Pérez" 

        } 

      ] 

    } 

  ] 

}  
``` 
|  Buscar ficha por número |
|--------------------------|
| GET /api/sheets/{number} | 

Busca fichas por coincidencia parcial del número. 

| Parámetro | Tipo  | Descripción |
|-----------|-------|-------------|
| number | string | Número o parte del número de ficha |

- Respuesta 200

``` 
{ 

  "success": true, 

  "message": "Ficha encontrada exitosamente", 

  "sheet": [ 

    { 

      "id": 1, 

      "number": "2690123", 

      "users": [] 

    } 

  ]}
``` 

- Respuesta 404 

``` 
{ 
  "success": false, 
  "message": "Ficha no encontrada" 
} 
``` 
|  Crear ficha  |
|---------------|
| Rol permitido: Admin | 
| POST /api/sheets |

Crea una nueva ficha y su dependencia Ventanilla Única. 

- Request Body
  
``` 
{ 
  "number": "2690123" 
} 
```

- Respuesta 201
  
``` 
{ 

    "number": "234234", 

    "updated_at": "2025-12-15T20:46:43.000000Z", 

    "created_at": "2025-12-15T20:46:43.000000Z", 

    "id": 5, 

    "ventanilla_unica_id": 7, 

    "dependencies": [ 

        { 

            "id": 7, 

            "name": "Ventanilla Unica", 

            "sheet_number_id": 5, 

            "created_at": "2025-12-15T20:46:43.000000Z", 

            "updated_at": "2025-12-15T20:46:43.000000Z" 

        } 

    ] 

} 
``` 

|  Actualizar ficha |
|-------------------|
| Rol permitido: Admin | 
| PUT /api/sheets/{id} |

Actualiza el número, estado o activa la ficha. 

- Request Body 

``` 
{ 
  "active": true, 
  "state": "active" 
} 
``` 
 
 Al activar una ficha, las demás se desactivan automáticamente. 


- Respuesta 200

``` 
{ 
  "success": true, 
  "message": "Ficha actualizada con éxito" 
} 
``` 

|  Agregar usuario a ficha |
|-------------------|
| Roles permitidos: Admin, Instructor | 
| POST /api/sheets/add/user/{numberSheet}/{idUser}  |

Asigna un usuario a una ficha. 

| Parámetros |
|------------|

| Parámetro  | Tipo | Descripción |
|------------|------|-------------|
| numberSheet| string | Número de la ficha |
| idUser | integer | ID del usuario |

- Respuesta 200

``` 
{ 
  "success": true, 
  "message": "Usuario agregado correctamente a la ficha" 
} 
``` 

- Respuesta 409 

``` 
{ 
  "success": false, 
  "message": "Este usuario ya está asignado a esta ficha" 
} 
``` 

|  Eliminar usuario de ficha |
|-------------------|
| Roles permitidos: Admin | 
| DELETE /api/sheets/delete/user/{numberSheet}/{idUser}  |

Elimina la relación entre un usuario y una ficha. 

- Respuesta 200

``` 
{ 
  "success": true, 
  "message": "Usuario eliminado de la ficha con exito" 
} 
``` 

| Notas finales |
|---------------|
| Un Instructor solo puede gestionar fichas que tenga asignadas |
| No se permite agregar usuarios con rol Admin a una ficha |
| Una sola ficha puede estar activa al mismo tiempo |
| Todos los endpoints retornan success: true - false |
| Errores de validación → 422 |
| Errores de permisos → 401 / 403 |


## API – Gestión de Usuarios

|  Endpoints de Usuarios |
|------------------------|

| Método  | Endpoint  | Roles  | Descripción |
|---------|-----------|--------|-------------|
| GET | /users |Admin, Instructor | Listar usuarios |
| GET | /users/{id} | Admin, Instructor | Ver usuario por ID |
| POST | /users | Admin | Crear usuario |
| PUT | /users/{id}  | Admin | Actualizar usuario  |
| DELETE | /users/{id}  | Admin | Eliminar usuario |
| GET | /users/search/filter | Admin, Instructor | Buscar usuarios por filtros |
| POST | /profile/photo | Usuario autenticado | Actualizar foto de perfil |

|  GET /users |
|-------------|

Lista usuarios con roles y fichas asociadas. 

- Respuesta 200 OK

``` 
{ 
  "success": true, 
  "data": [ 
    { 
      "id": 1, 
      "name": "Juan Pérez", 
      "email": "juan@email.com", 
      "status": "active", 
      "roles": [{ "name": "Aprendiz" }], 
      "sheet_numbers": [] 
    } 
  ] 
} 
``` 

|  GET /users/{id} |
|------------------|

Obtiene la información de un usuario específico. 

- Respuesta 200 OK

``` 
{ 
  "success": true, 
  "data": { 
    "id": 3, 
    "name": "María Gómez", 
    "email": "maria@email.com", 
    "status": "active", 
    "roles": [{ "name": "Aprendiz" }] 
  } 
} 
``` 
 
- Respuesta 404 Not Found 

``` 
{ 
  "success": false, 
  "message": "Usuario no encontrado" 
} 
``` 

|  POST /users |
|--------------|

Crea un nuevo usuario (solo Admin). 

- Body

``` 
{ 
  "type_document": "CC", 
  "document_number": "123456789", 
  "name": "Carlos Ruiz", 
  "email": "carlos@email.com", 
  "password": "secret123", 
  "status": "active", 
  "role": "Aprendiz" 
} 
``` 

- Respuesta 201 Created 

``` 
{ 
  "success": true, 
  "message": "Usuario creado correctamente", 
  "data": { 
    "id": 5, 
    "name": "Carlos Ruiz", 
    "email": "carlos@email.com", 
    "status": "active" 
  } 
} 
``` 

- Respuesta 403 Forbidden 

``` 
{ 
  "success": false, 
  "message": "No tienes permiso para crear usuarios" 
} 
``` 

- Respuesta 422 Validation Error 

``` 
{ 
  "message": "The email has already been taken.", 
  "errors": { 
    "email": ["El correo ya existe"] 
  } 
} 
``` 

|   PUT /users/{id} |
|-------------------|

Actualiza datos del usuario. 

- Respuesta 200 OK

``` 
{ 
  "success": true, 
  "message": "Usuario actualizado correctamente", 
  "data": { 
    "id": 5, 
    "name": "Carlos Ruiz", 
    "status": "active" 
  } 
} 
``` 
 
- Respuesta 400 Bad Request 

``` 
{ 
  "success": false, 
  "message": "Estado no permitido" 
} 
``` 

|   DELETE /users/{id} |
|----------------------|

Elimina un usuario. 

- Respuesta 200 OK

``` 
{ 
  "success": true, 
  "message": "Usuario eliminado correctamente" 
} 
``` 

- Respuesta 404 Not Found 

``` 
{ 
  "success": false, 
  "message": "Usuario no encontrado" 
} 
```

|   GET /users/search/filter |
|----------------------------|

Busca usuarios por filtros (name, email, document_number). 

|   Ejemplo  |
|--------------------------------|
| /users/search/filter?name=Juan |

- Respuesta 200 OK

``` 
{ 
  "success": true, 
  "data": [ 
    { 
      "id": 1, 
      "name": "Juan Pérez", 
      "email": "juan@email.com" 
    } 
  ] 
} 
``` 

- Respuesta 400 Bad Request 

``` 
{ 
  "success": false, 
  "message": "Filtro 'role' no está permitido" 
} 
``` 
 
|   POST /profile/photo |
|-----------------------|

Actualiza la foto de perfil del usuario autenticado. 

- Form‑Data

|   Campo  | Tipo |
|----------|------|
| profile_photo | image (jpg, png) |

- Respuesta 200 OK

``` 
{ 
  "success": true, 
  "image": "https://dominio/storage/profile/picture/user-1/uuid.jpg" 
} 
``` 

- Respuesta 422 Validation Error 

``` 
{ 
  "message": "The profile photo must be an image" 
} 
``` 

## Api - Gestión de Dependencias (DependencyController)

Estos endpoints son para administrar las dependencias dentro del sistema. Requieren autenticación y roles específicos (Admin o Instructor).

|  Listar Todas las Dependencias |
|--------------------------------|

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET | /dependency | Obtiene una lista de todas las dependencias existentes | Rol Admin o Instructor |

- Respuesta Exitosa (200 OK)

``` 
{
"message": "Dependencias obtenidas exitosamente",
"dependencies": [
    {
      "id": 1,
      "name": "Coordinación Académica",
      "sheet_number_id": 1,
      "created_at": "2025-12-15T10:00:00.000000Z",
      "updated_at": "2025-12-15T10:00:00.000000Z"
    }
]
}
``` 

- Respuesta de Error (404 Not Found)

```
{
"status": "error",
"message": "No hay dependencias"
}
```

|  Crear una Nueva Dependencia |
|------------------------------|

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| POST | /dependency | Crea una nueva dependencia. El sheet_number_id es opcional si el usuario autenticado ya tiene una ficha asignada | Rol Admin o Instructor |

- Cuerpo de la Petición (Request Body)

``` 
{
"name": "Bienestar al Aprendiz",
"sheet_number_id": 2
}
``` 

- Respuesta Exitosa (200 OK)

``` 
{
"message": "Dependencia creada con exito",
"dependency": {
    "name": "Bienestar al Aprendiz",
    "sheet_number_id": 2,
    "id": 2
}
}
``` 

- Respuesta de Error (422 Unprocessable Entity)

``` 
{
"success": false,
"message": "Debe proporcionar un sheet_number_id o tener una ficha asignada"
}
``` 

|  Obtener una Dependencia Específica |
|-------------------------------------|

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET | /dependency/{id} | Muestra los detalles de una dependencia específica, incluyendo la información de la ficha asociada | Rol Admin o Instructor |

- Respuesta Exitosa (200 OK)

``` 
{
"success": true,
"dependency": {
    "id": 1,
    "name": "Coordinación Académica",
    "sheet_number_id": {
      "id": 1,
      "number": "2558104",
      "program_name": "ADSO",
      "created_at": "2025-12-15T09:00:00.000000Z",
      "updated_at": "2025-12-15T09:00:00.000000Z"
    }
}
}
``` 

| Actualizar una Dependencia |
|----------------------------|

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| PUT | /dependency/{id} | Actualiza el nombre de una dependencia existente | Rol Admin o Instructor |

- Cuerpo de la Petición (Request Body)

``` 
{
"name": "Coordinación Académica (Actualizado)"
}
``` 

- Respuesta Exitosa (200 OK)

``` 
{
"success": true,
"message": "Dependencia actualizada exitosamente",
"dependency": {
    "id": 1,
    "name": "Coordinación Académica (Actualizado)",
    "sheet_number_id": 1,
    "created_at": "2025-12-15T10:00:00.000000Z",
    "updated_at": "2025-12-15T10:05:00.000000Z"
}
}
``` 

| Eliminar una Dependencia |
|--------------------------|

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| DELETE | /dependency/{id} | Elimina una dependencia del sistema | Rol Admin o Instructor |

- Respuesta Exitosa (200 OK)

``` 
{
"success": true,
"message": "Dependencia eliminada"
}
``` 

## Api - Gestión de PQRS (PQRController)

Endpoints para el ciclo de vida de las Peticiones, Quejas, Reclamos y Sugerencias.

| Listar PQRS |
|-------------|

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET | /pqrs | Obtiene una lista de PQRS. La respuesta varía según el rol del usuario | Rol Admin (Ve todas las PQRS del sistema) o Dependencia (Ve solo las PQRS asignadas a su dependencia) |

- Respuesta Exitosa (200 OK) 

``` 
{
"data": [
    {
      "id": 1,
      "affair": "Problema con la plataforma",
      "request_type": "Queja",
      "response_status": "pending",
      "creator": null,
      "responsible": null,
      "dependency": { "id": 1, "name": "Soporte TI" },
      "attachedSupports": [],
      "sheetNumber": { "id": 1, "number": "2558104" },
      "comunications": []
    }
],
"message": "PQRs obtenidas exitosamente"
}
``` 

| Crear una Nueva PQR |
|---------------------|

| Método | Endpoint | Descripción | Permisos | Cuerpo de la Petición (multipart/form-data) |
|--------|----------|-------------|----------|---------------------------------------------|
| POST | /pqrs | Permite a cualquier usuario (autenticado o no) crear una nueva PQR. Si el usuario no está autenticado, debe proporcionar email y document. Los archivos adjuntos se envían como multipart/form-data. | Abierto | Description (string, required): "Descripción detallada del problema." , affair (string, required): "Asunto de la PQR" , request_type (string, required): "Peticion", "Queja", "Reclamo" o "Sugerencia" , number (string, required): Número de la ficha técnica (e.g., "2558104") , email (string, optional): "correo@externo.com" (requerido si no está autenticado) , document (string, optional): "123456789" (requerido si no está autenticado) y attachments[] (file, optional): Archivos adjuntos (PDF, DOC, imágenes) |

- Respuesta Exitosa (201 Created)

``` 
{
"data": {
    "id": 2,
    "description": "Descripción detallada del problema.",
    "affair": "Asunto de la PQR",
    "dependency_id": 3,
    "sheet_number_id": 1,
    "email": "correo@externo.com",
    "document": "123456789",
    "creator": null,
    /* ... otros campos ... */
},
"message": "PQR creada exitosamente"
}
``` 

| Actualizar una PQR |
|---------------------|

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| PUT o PATCH | /pqrs/{id} | Actualiza campos de una PQR. Los permisos para cada campo son restringidos | Requiere autenticación. Rol Admin o Instructor: Puede cambiar response_time, response_days, dependency_id, responsible_id |

- Cuerpo de la Petición (Request Body)

``` 
{
"dependency_id": 4,
"responsible_id": 2,
"response_days": "15"
}
``` 

- Respuesta Exitosa (200 OK)

``` 
{
"data": {
    "id": 1,
    "dependency_id": 4,
    "responsible_id": 2,
    "response_time": "2025-12-30",
    /* ... otros campos actualizados ... */
},
"message": "PQR actualizada exitosamente"
}
``` 

| Finalizar y Cerrar una PQR|
|---------------------------|

| Método | Endpoint | Descripción | Permisos | Cuerpo de la Petición (multipart/form-data) |
|--------|----------|-------------|----------|---------------------------------------------|
| POST | /pqr/{id}/finalize | Da la respuesta final a una PQR, la marca como "closed" y crea una comunicación final | Rol Admin o Dependencia asignada a la PQR | response_message (string, required): "Esta es la respuesta final y cierre del caso." y attachments[] (file, optional): Archivos adjuntos a la respuesta final |

- Respuesta Exitosa (200 OK)

``` 
{
"data": {
    "id": 1,
    "response_status": "closed",
    "state": true,
    "response_message": "Esta es la respuesta final y cierre del caso.",
    /* ... */
},
"message": "PQR finalizada y cerrada exitosamente"
}
``` 

| Eliminar una PQR|
|---------------------|

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| DELETE | pqrs/{id} | Esta acción no está permitida por la lógica de negocio |

- Respuesta (405 Method Not Allowed)

``` 
{
"message": "No está permitido eliminar PQRs"
}
``` 

## Api - Gestión de Comunicaciones (CommunicationController)

Endpoints para manejar el intercambio de mensajes dentro de una PQR.

| Crear una Nueva Comunicación |
|---------------------|

| Método | Endpoint | Descripción | Permisos | Cuerpo de la Petición (multipart/form-data) |
|--------|----------|-------------|----------|---------------------------------------------|
| POST | /pqr/{id}/comunicaciones | Envía un nuevo mensaje relacionado con una PQR. Si requires_response es true, se genera un enlace único para que el usuario responda | Requiere autenticación | message (string, required): "Necesitamos información adicional sobre su caso. Por favor, adjunte los documentos solicitados." , requires_response (boolean, optional): true y attachments[] (file, optional): Archivos adjuntos al mensaje |

- Respuesta Exitosa (201 Created)

``` 
{
"data": {
    "id": 5,
    "pqr_id": 1,
    "message": "Necesitamos información adicional sobre su caso...",
    "requires_response": true,
    /* ... */
},
"message": "Comunicación enviada exitosamente",
"response_url": "http://localhost/api/pqr/responder/a1b2c3d4-e5f6-..."
}
``` 

| Archivar / Desarchivar una Comunicación |
|-----------------------------------------|

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| PATCH | /pqr/comunicaciones/{communicationId}/archive | Cambia el estado de archivado de un mensaje de comunicación | Rol Admin o Dependencia asignada a la PQR |

- Respuesta Exitosa (200 OK)

```
{
"data": {
    "id": 5,
    "archived": true,
    /* ... */
},
"message": "Comunicación archivada exitosamente",
"archived": true
}
```

| Mostrar Formulario de Respuesta (Público) |
|-------------------------------------------|

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET | /pqr/responder/{uuid} | Endpoint público al que accede el usuario final a través del enlace único (UUID) para ver el mensaje y poder responder | Abierto (controlado por la validez del UUID) |

- Respuesta Exitosa (200 OK)

```
{
"data": {
    "communication": { /* ... */ },
    "pqr": { /* ... */ },
    "dependency": { /* ... */ }
},
"message": "Formulario de respuesta obtenido exitosamente"
}
```

- Respuesta de Error (410 Gone): Si el enlace ha expirado o ya fue utilizado

```
{
"error": "Este enlace de respuesta ha expirado"
}
```

| Procesar Respuesta del Usuario (Público) |
|------------------------------------------|

| Método | Endpoint | Descripción | Permisos | Cuerpo de la Petición (multipart/form-data) |
|--------|----------|-------------|----------|---------------------------------------------|
| POST | /pqr/responder/{uuid}| Endpoint público que recibe la respuesta del usuario final | Abierto (controlado por la validez del UUID) | message (string, required): "Aquí está la información adicional que solicitaron."  y  attachments[] (file, optional): Archivos adjuntos del usuario |

- Respuesta Exitosa (201 Created)

```
{
"data": {
    "id": 6,
    "pqr_id": 1,
    "message": "Aquí está la información adicional que solicitaron.",
    "is_user_response": true,
    /* ... */
},
"message": "Respuesta enviada exitosamente"
}
```













