# Sistema de Gestión Documental con PQRS

Proyecto backend y frontend para la gestión documental y manejo de PQRS, desarrollado con Laravel, Inertia.js, React.

## Índice de contenido

## Índice de contenido

- [ROLES](#roles)
  - [Crear Rol](#crear-rol)
  - [Asignar un rol](#asignar-un-rol)
  - [Asignar varios roles](#asignar-varios-roles)
  - [Remover un rol](#remover-un-rol)
  - [Reemplazar todos los roles](#reemplazar-todos-los-roles)
  - [Obtener roles del usuario](#obtener-roles-del-usuario)
  - [Verificar si el usuario tiene un rol](#verificar-si-el-usuario-tiene-un-rol)
  - [Verificar si tiene cualquiera de varios roles](#verificar-si-tiene-cualquiera-de-varios-roles)
  - [Verificar si tiene todos los roles](#verificar-si-tiene-todos-los-roles)
  - [Asignar permiso](#asignar-permiso)
  - [Verificar permiso](#verificar-permiso)
- [Middleware para proteger rutas](#middleware-para-proteger-rutas)
  - [Restringir por rol](#restringir-por-rol)
  - [Permitir varios roles](#permitir-varios-roles)
  - [Restringir por permiso](#restringir-por-permiso)
  - [Obtener rol del usuario autenticado](#obtener-rol-del-usuario-autenticado)
- [NOTIFICACIONES](#notificaciones)
  - [Crear una notificación](#crear-una-notificacion)
  - [Ejemplo básico](#ejemplo-basico)
  - [Ver notificaciones de un usuario](#ver-notificaciones-de-un-usuario)
  - [Solo las no leídas](#solo-las-no-leidas)
  - [Marcar una específica](#marcar-una-especifica)
  - [Marcar todas](#marcar-todas)
  - [Eliminar una notificación](#eliminar-una-notificacion)
  - [Enviar notificaciones a varios usuarios](#enviar-notificaciones-a-varios-usuarios)
  - [Enviar a una colección](#enviar-a-una-coleccion)
- [API ENDPOINTS](#api-endpoints)
  - [API DE USUARIOS](#api-de-usuarios)
  - [API DE ARCHIVOS Y CARPETAS (GeDocs)](#api-de-archivos-y-carpetas-gedocs)
  - [API DE FICHAS](#api-de-fichas)
  - [API DE PQRs](#api-de-pqrs)
  - [COMUNICACIONES](#comunicaciones)
  - [GENERACIÓN DE PDF](#generacion-de-pdf)
  - [GENERACIÓN DE QR](#generacion-de-qr)
  - [API DE NOTIFICACIONES](#api-de-notificaciones-1)
  - [Reglas importantes de notificaciones](#reglas-importantes-de-notificaciones)
  - [Mensajes de Error Comunes](#mensajes-de-error-comunes)
---

# ROLES

## Crear Rol
```bash
composer require spatie/laravel-permission
```
```bash
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
```
```php
use Spatie\Permission\Models\Role;

Role::create(['name' => 'administrador']);
Role::create(['name' => 'instructor']);
Role::create(['name' => 'aprendiz']);
```

## Asignar un rol
```php
$user = User::find(1);
$user->assignRole('Administrador');
```

## Asignar varios roles
```php
$user->assignRole(['Admin', 'Instructor']);
```

## Remover un rol
```php
$user->removeRole('Instructor');
```

## Reemplazar todos los roles
```php
$user->syncRoles(['Instructor']);
```

## Obtener roles del usuario
```php
$user->getRoleNames(); // devuelve una colección
```

## Verificar si el usuario tiene un rol
```php
$user->hasRole('Admin'); // true o false
```

## Verificar si tiene cualquiera de varios roles
```php
$user->hasAnyRole(['Admin', 'Instructor']);
```

## Verificar si tiene todos los roles
```php
$user->hasAllRoles(['Admin', 'Instructor']);
```

## Asignar permiso
```php
$user->givePermissionTo('crear usuarios');
```

## Verificar permiso
```php
$user->can('crear usuarios');
```

---

# Middleware para proteger rutas

## Restringir por rol
```php
Route::get('/admin', function () {
    // ...
})->middleware('role:Admin');
```
o
```php
Route::middleware('role:Admin')->group(function () {
    // ...
});
```

## Permitir varios roles
```php
->middleware('role:Admin|Instructor');
```

## Restringir por permiso
```php
->middleware('permission:crear usuarios');
```

## Obtener rol del usuario autenticado
```php
auth()->user()->getRoleNames();
```

---

# NOTIFICACIONES

## Crear una notificación
```bash
php artisan make:notification WelcomeNotification
```

## Ejemplo básico
```php
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class WelcomeNotification extends Notification
{
    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Bienvenido')
            ->line('Gracias por registrarte.');
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => 'Tu cuenta fue creada con éxito.'
        ];
    }
}
```

## Ver notificaciones de un usuario
```php
$user->notifications;
```

## Solo las no leídas
```php
$user->unreadNotifications;
```

## Marcar una específica
```php
$notification->markAsRead();
```

## Marcar todas
```php
$user->unreadNotifications->markAsRead();
```

## Eliminar una notificación
```php
$notification = auth()->user()->notifications()->find($id);
$notification->delete();
```

## Enviar notificaciones a varios usuarios
```php
Notification::send(User::role('administrador')->get(), new SystemAlertNotification());
```

## Enviar a una colección
```php
Notification::send($usuarios, new AlertNotification());
```

---

# API ENDPOINTS

---

## API DE USUARIOS

### Visualizar todos los usuarios
> Si el usuario es de rol "Admin" ve todos los usuarios, si es de rol Instructor ve solo los "Aprendices"

**METHOD:** `GET`
```
/api/users
```

### Visualizar un usuario
**METHOD:** `GET`
```
/api/users/{id del usuario}
```

### Crear Usuario
**METHOD:** `POST`
```
/api/users/
```
> El rol se asigna automáticamente como Aprendiz. Solo el administrador puede crear usuarios.
```json
{
    "type_document": "CC",
    "document_number": "109600652",
    "name": "Usuario creado a mano",
    "email": "usuariocreado@gmail.com",
    "password": "password"
}
```

### Actualizar usuario
**METHOD:** `PUT`
```
/api/users/{id del usuario}
```

### Cambiar el estado del usuario (active o pending)
**METHOD:** `PUT`
```
/api/users/status/{id del usuario}/{estado}
```

### Eliminar usuario
**METHOD:** `DELETE`
```
/api/users/{id del usuario}
```

### Filtrar Usuarios
> Se puede filtrar solo por `name`, `email`, `document_number`, `technical_sheet`

**METHOD:** `GET`
```
/api/users/filter?{nombre del filtro}={valor del filtro}
```

**Ejemplo:**
```
/api/users/filter?document_number=102030
```

**Buscar por varios filtros:**
```
/api/users/filter?document_number=102030&email=andres@gmail.com&name=andres
```

---

## API DE ARCHIVOS Y CARPETAS (GeDocs)

### 1. Explorador y Navegación

#### `GET /explorer`
Endpoint principal para cargar la estructura de archivos y carpetas.

**Query Params:**
- `sheet_id` (Opcional): ID de la ficha técnica.
- `folder_id` (Opcional): ID de la carpeta actual. Si es nulo, muestra las carpetas raíz (años).
- `buscador` (Opcional): Término de búsqueda para filtrado global.

**Respuesta:** Renderiza la vista `Explorer` vía Inertia con los objetos `folders` y `files`.

---

### 2. Gestión de Carpetas

#### `POST /folders`
Crea una nueva carpeta.
- **Cuerpo (JSON):** `name`, `parent_id`, `sheet_number_id`, `folder_code`.

#### `PUT /folders/{folderId}`
Actualiza o renombra una carpeta existente.
- **Cuerpo (JSON):** `name`, `folder_code`.

#### `POST /folders/move-mixed`
Mueve una selección de carpetas y archivos a una nueva ubicación.
- **Cuerpo (JSON):** `target_folder_id`, `folders` (array de IDs), `files` (array de IDs).

---

### 3. Gestión de Archivos

#### `POST /folders/{id}/upload`
Sube uno o más archivos a una carpeta específica.
- **Cuerpo (Multipart/Form-Data):** `files[]` (array de archivos).
- **Lógica especial:**
  - Genera un código secuencial (`file_code`) basado en el máximo global.
  - Genera un hash SHA256 del contenido.
  - Renombra el archivo en disco: `AÑO-Ex-COD-SEQ-HASH-NombreOriginal.pdf`.

#### `GET /folders/file/download/{id}`
Descarga un archivo específico.

#### `POST /folders/download-mixed-zip`
Comprime y descarga una selección mixta de carpetas y archivos en un archivo ZIP.

---

### 4. Sistema de Papelera (Trash)

#### `POST /folders/delete-mixed`
Realiza un "borrado lógico" (mueve a la papelera) desactivando el flag `active`.
- **Cuerpo (JSON):** `folders` (array de IDs), `files` (array de IDs).

#### `POST /folders/restore-mixed`
Restaura elementos de la papelera volviendo a activar el flag `active`.

#### `GET /folders/archived`
Lista todos los elementos que están actualmente en la papelera (`active = false`).

---

### Estructura de Datos (Modelo File)

| Campo | Descripción |
|---|---|
| `name` | Nombre estandarizado visible |
| `file_code` | Código consecutivo (ej: `008`) |
| `hash` | Hash SHA256 para verificar integridad |
| `path` | Ruta física en el storage |
| `folder_id` | Referencia a la carpeta contenedora |

---

## API DE FICHAS

### Listar todas las fichas
> Obtiene las fichas asociadas al usuario autenticado según su rol (Instructor / Aprendices).

**METHOD:** `GET`
```
/sheetsNumber
```

**Respuesta exitosa (200 OK):**
```json
{
  "message": "Fichas encontradas",
  "fichas": [
    {
      "id": 1,
      "number": "3002085",
      "active": 1,
      "state": "active",
      "created_at": "2025-12-15T10:00:00.000000Z"
    }
  ]
}
```

**Error (404):**
```json
{
  "status": "error",
  "message": "El usuario no tiene fichas asignadas"
}
```

### Buscar ficha por número
**METHOD:** `GET`
```
/api/sheets/{numero_de_la_ficha}
```

**Ejemplo:**
```
/api/sheets/2578
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Ficha encontrada exitosamente",
  "sheet": [...]
}
```

### Crear una nueva ficha (Solo Admin)
**METHOD:** `POST`
```
/sheets
```

**Body:**
```json
{
  "number": "3002085"
}
```

**Respuesta (200 OK):**
```json
{
  "number": "3002085",
  "dependencies": {
    "name": "Ventanilla unica",
    "id": 2
  }
}
```

### Actualizar una ficha (Solo Admin)
**METHOD:** `PUT`
```
/sheets/{id}
```

**Body:**
```json
{
  "name": "3002086",
  "Active": 1,
  "state": "active"
}
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "message": "Ficha actualizada con exito"
}
```

**Error (404):**
```json
{
  "success": false,
  "message": "Ficha no encontrada"
}
```

### Eliminar una ficha (Solo Admin)
**METHOD:** `DELETE`
```
/api/sheets/{id_de_la_ficha}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Ficha eliminada con exito"
}
```

### Agregar un usuario a una ficha

**Reglas de validación:**
- **500:** No se permite agregar usuarios con rol `Admin`.
- **403:** Un Instructor no puede modificar fichas en las que no está asignado.
- **409:** No se permite agregar un usuario que ya está vinculado a la ficha.

**METHOD:** `POST`
```
/api/sheets/add/user/{numero_ficha}/{id_usuario}
```

**Ejemplo:**
```
/api/sheets/add/user/2578923/15
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Usuario agregado correctamente a la ficha"
}
```

**Errores comunes:**
1. Ficha no encontrada → 404
2. Usuario no encontrado → 404
3. Usuario ya está en la ficha → 409
4. Instructor sin permiso sobre esta ficha → 403
5. No puedes agregar un Admin → 500

### Eliminar un usuario de una ficha (Solo Admin)
**METHOD:** `DELETE`
```
/api/sheets/delete/user/{numero_ficha}/{id_usuario}
```

**Ejemplo:**
```
/api/sheets/delete/user/2578923/15
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Usuario eliminado de la ficha con exito"
}
```

**Errores:**
1. Ficha no encontrada → 404
2. Usuario no pertenece a la ficha → 404

---

## API DE PQRs

### 1.1 Listar PQRs
**METHOD:** `GET /api/pqrs` *(Requiere Autenticación)*

Obtiene el listado de PQRs filtradas según el rol del usuario.

**Query Params:**
- `archived` (boolean, opcional): `true` para ver archivadas, `false` para bandeja de entrada.

**Respuesta (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "sender_name": "Juan Perez",
      "affair": "Falla en plataforma",
      "request_type": "Queja",
      "state": false,
      "response_status": "pending",
      "created_at": "2024-03-21T..."
    }
  ],
  "message": "PQRs obtenidas exitosamente"
}
```

### 1.2 Crear una PQR
**METHOD:** `POST /api/pqrs` *(Acceso Público)*

**Body (Multipart/Form-Data):**
- `sender_name` (string, requerido): Nombre del remitente.
- `affair` (string, requerido): Asunto.
- `description` (string, requerido): Detalle de la solicitud.
- `request_type` (string, requerido): `Peticion`, `Queja`, `Reclamo`, `Sugerencia`, `Otro`.
- `number` (string, requerido): Número de ficha técnica relacionada.
- `document_type` (string, requerido): `CC`, `TI`, `CE`.
- `document` (string): Número de identificación.
- `email` (string): Correo para notificaciones.
- `attachments[]` (files): Archivos adjuntos (pdf, docx, jpg, png). Máx 5MB c/u.
- `dependency_id` (int, opcional): ID de la dependencia destino.

**Respuesta (201 Created):**
```json
{
  "data": { "id": 45, "sender_name": "Juan Perez" },
  "message": "PQR creada exitosamente"
}
```

### 1.3 Finalizar y Cerrar PQR
**METHOD:** `POST /api/pqr/{id}/finalize` *(Requiere Autenticación)*

**Body (Multipart/Form-Data):**
- `response_message` (string, requerido): Mensaje de cierre (mín 10 caracteres).
- `attachments[]` (files): Documentos finales de soporte.

**Respuesta (200 OK):**
```json
{
  "data": { "id": 1, "response_status": "closed", "state": true },
  "message": "PQR finalizada y cerrada exitosamente"
}
```

---

## COMUNICACIONES

### 2.1 Crear Comunicación (Respuesta Admin)
**METHOD:** `POST /api/pqr/{id}/comunicaciones` *(Requiere Autenticación)*

**Body:**
- `message` (string, requerido): Contenido del mensaje.
- `requires_response` (boolean): Si es `true`, genera un link de respuesta para el usuario.
- `attachments[]` (files): Archivos adjuntos.

**Respuesta (201 Created):**
```json
{
  "data": { "id": 10, "message": "...", "attached_supports": [] },
  "response_url": "http://.../pqr/responder/uuid-generado",
  "message": "Comunicación enviada exitosamente"
}
```

### 2.2 Procesar Respuesta de Usuario
**METHOD:** `POST /api/pqr/responder/{uuid}` *(Acceso Público vía UUID)*

**Body:**
- `message` (string, requerido): Texto de la respuesta.
- `attachments[]` (files): Archivos de soporte.

**Respuesta (201 Created):**
```json
{
  "message": "Respuesta enviada exitosamente"
}
```

---

## GENERACIÓN DE PDF

### `POST /api/pdf/generate-response` *(Requiere Autenticación)*

Genera una Carta Oficial en PDF con QR de validación y fusiona archivos de soporte.

**Librerías utilizadas:**
- **DomPDF** (`barryvdh/laravel-dompdf`): Renderiza la plantilla Blade a PDF.
- **PDFMerger** (`webklex/laravel-pdfmerger`): Fusiona el PDF principal con los `support_files`.

**Body (Multipart/Form-Data):**

| Campo | Descripción |
|---|---|
| `pqr_id` | Requerido |
| `folder_id` | Para guardar en el explorador |
| `codigo`, `fecha`, `lugar` | Encabezado |
| `tratamiento`, `nombres`, `cargo`, `empresa`, `direccion`, `ciudad` | Destinatario |
| `asunto`, `saludo`, `texto` | Contenido |
| `despedida1` a `despedida3`, `firma_nombres`, `firma_cargo`, `footer_text` | Firma y cierre |
| `logo_file` | Imagen del logo (PNG/JPG) |
| `signature_file` | Imagen de la firma |
| `support_files[]` | PDFs adicionales a anexar |

**Flujo de proceso:**
1. Genera el PDF base (Carta).
2. Genera un Código QR apuntando a la URL de descarga.
3. Fusiona el PDF base con los `support_files`.
4. Almacena el resultado en `storage/app/public/pdf_responses/`.
5. Registra el archivo como soporte de tipo `ENV` (Enviado) en la base de datos.
6. Notifica por correo al usuario con el documento adjunto.

**Respuesta (200 OK):**
```json
{
  "message": "Respuesta enviada y PDFs fusionados exitosamente.",
  "pdf_url": "http://localhost:8000/storage/pdf_responses/PREFIJO-2024-045.pdf",
  "pqr_status": "responded"
}
```

---

## GENERACIÓN DE QR

### `GET /qrcode`

Crea una imagen PNG del QR que apunta a la URL indicada. La imagen se guarda en `storage/qrcodes`.

**Body:**
```json
{
  "url": "URL a la que dirige el QR",
  "file_name": "nombre del archivo png"
}
```

---

## API DE NOTIFICACIONES

> Todas las notificaciones están asociadas al usuario autenticado. Todos los endpoints requieren `auth:sanctum`.

### Obtener todas las notificaciones
**METHOD:** `GET`
```
/api/notifications
```

**Respuesta:**
```json
{
  "success": true,
  "notifications": [...]
}
```

### Obtener solo notificaciones no leídas
**METHOD:** `GET`
```
/api/notifications/filter/unread
```

### Obtener solo notificaciones leídas
**METHOD:** `GET`
```
/api/notifications/filter/read
```

### Ver una notificación específica
**METHOD:** `GET`
```
/api/notifications/{id}
```

**Errores:**
1. 404: Notificación no encontrada para este usuario.

### Marcar una notificación como leída
**METHOD:** `POST`
```
/api/notifications/{id}/mark-as-read
```

**Respuesta:**
```json
{
  "success": true,
  "notifications": {}
}
```

**Errores:**
1. 404: La notificación no pertenece al usuario o no existe.

---

## Reglas importantes de notificaciones

- Solo se pueden ver notificaciones del usuario autenticado.
- No es posible acceder a notificaciones de otros usuarios.
- Las notificaciones se devuelven en orden descendente por fecha.
- Una notificación ya leída no se vuelve a marcar como no leída.

---

## Mensajes de Error Comunes

| Código | Mensaje | Causa |
|---|---|---|
| **404** | PQR no encontrada | El ID proporcionado no existe en la base de datos. |
| **422** | Esta PQR ya ha sido respondida | Se intenta responder una PQR cerrada o ya atendida. |
| **410** | Este enlace ha expirado | El UUID de respuesta superó el tiempo límite (7 días). |
| **500** | Error al generar la respuesta | Fallo interno en DomPDF o permisos de escritura en disco. |
