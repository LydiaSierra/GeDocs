# Document Management System with PQRS

Backend and frontend project for document management and handling PQRS, developed with Laravel, Inertia.js, and React.

## Table of Contents
- [Project Description](#project-description)
- [Main Features](#main-features)
- [Architecture and Technologies](#architecture-and-technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Project Execution](#project-execution)
- [Project Structure](#project-structure)
- [Useful Commands](#useful-commands)
- [Common Issues](#common-issues)
- [Technologies Used](#technologies-used)
- [Development Tools (DevDependencies)](#development-tools)
- [Main Scripts](#main-scripts)

- [ROLES](#roles)
  - [Create Role](#create-role)
  - [Assign a Role](#assign-a-role)
  - [Assign Multiple Roles](#assign-multiple-roles)
  - [Remove a Role](#remove-a-role)
  - [Replace All Roles](#replace-all-roles)
  - [Get User Roles](#get-user-roles)
  - [Check if User Has a Role](#check-if-user-has-a-role)
  - [Check if User Has Any of Multiple Roles](#check-if-user-has-any-of-multiple-roles)
  - [Check if User Has All Roles](#check-if-user-has-all-roles)
  - [Assign Permission](#assign-permission)
  - [Check Permission](#check-permission)
- [Middleware to Protect Routes](#middleware-to-protect-routes)
  - [Restrict by Role](#restrict-by-role)
  - [Allow Multiple Roles](#allow-multiple-roles)
  - [Restrict by Permission](#restrict-by-permission)
  - [Get Authenticated User Role](#get-authenticated-user-role)
- [NOTIFICATIONS](#notifications)
  - [Create a Notification](#create-a-notification)
  - [Basic Example](#basic-example)
  - [View User Notifications](#view-user-notifications)
  - [Only Unread](#only-unread)
  - [Mark a Specific Notification](#mark-a-specific-notification)
  - [Mark All](#mark-all)
  - [Delete a Notification](#delete-a-notification)
  - [Send Notifications to Multiple Users](#send-notifications-to-multiple-users)
  - [Send to a Collection](#send-to-a-collection)
- [API ENDPOINTS](#api-endpoints)
  - [USERS API](#users-api)
  - [FILES AND FOLDERS API (GeDocs)](#files-and-folders-api-gedocs)
  - [FICHAS API](#fichas-api)
  - [PQRs API](#pqrs-api)
  - [COMMUNICATIONS](#communications)
  - [PDF GENERATION](#pdf-generation)
  - [QR GENERATION](#qr-generation)
  - [NOTIFICATIONS API](#notifications-api)
  - [Important Notification Rules](#important-notification-rules)
  - [Common Error Messages](#common-error-messages)
---

# Project Description

The Document Management System with PQRS is a web platform designed to manage institutional documents and handle Petitions, Complaints, Claims, and Suggestions (PQRS) in a centralized, secure, and traceable manner.

# Main Features

• Management of digital documents.  
• Registration and tracking of PQRS.  
• Internal notifications.  
• Role and permission-based access control.  
• Modern interface with React.

# Architecture and Technologies

## Backend
• Laravel (PHP >= 8.1)

## Frontend
• Inertia.js
• React
• Vite

## Others
• MySQL

# Prerequisites

Make sure the following are installed:
• PHP >= 8.1
• Composer >= 2.x
• Node.js >= 18.x
• npm >= 9.x
• Git
• MySQL >= 8.x 

# Installation

## 1. Clone the repository

composer install

## 3. Install frontend dependencies

npm install

## 4. Install backend packages
```
composer require spatie/laravel-permission
```
```
php artisan vendor:publish --
provider="Spatie\\Permission\\PermissionServiceProvider"
```
```
composer require barryvdh/laravel-dompdf
```
```
php artisan vendor:publish --provider="Barryvdh\DomPDF\ServiceProvider"
```

# Environment Configuration

## 1. Environment Variables

cp .env.example .env

Create the .env file in the root of the project.

Copy everything from .env.example and paste it into the newly created .env file.

## 2. Generate Application Key

php artisan key:generate

## 3. Migrations and Seeders
```
php artisan migrate
```
```
php artisan db:seed
```

## 4. Storage Link
```
php artisan storage:link
```

# Project Execution

```
composer run dev
```
Application available at:  
http://localhost:8000

# Project Structure
```

app/
├── Http/                                # HTTP layer
│ ├── Controllers/                       # Application controllers
│ │ ├── Api/                             # API controllers (JSON)
│ │ │ └── AuthController.php             # API authentication
│ │ │
│ │ ├── Controller.php                   # Base controller
│ │ ├── DependencyController.php         # Dependency management
│ │ ├── ExplorerController.php           # Explorer view rendering
│ │ ├── FolderController.php             # Document folder management
│ │ ├── NotificationController.php       # System notifications
│ │ ├── PdfController.php                # PDF document generation
│ │ ├── ProfileController.php            # User profile
│ │ ├── SheetController.php              # Sheet management
│ │ └── UserController.php               # User management
│ │
│ ├── Middleware/                        # HTTP middlewares
│ │ └── HandleInertiaRequests.php        # Inertia middleware
│ │
│ ├── Requests/                          # Form Requests (validations)
│ └── Resources/                         # API Resources (data transformation)
│
├── Models/                              # Eloquent models
│ ├── User.php                           # User model
│ └── ...                                # Other domain models
│
├── Notifications/                       # Notifications (mail, database, etc.)
├── Providers/                           # Service Providers
│ └── AppServiceProvider.php             # Global configuration
│
├── Policies/                            # Authorization policies
│
config/                                  # Configuration files
├── auth.php
├── database.php
├── services.php
└── ...
│
database/                               # Persistence
├── factories/                           # Testing factories
├── migrations/                          # Database migrations
└── seeders/                             # Seeders
│
lang/                                   # Translations
├── es/
└── en/
│
public/                                 # Public files
│
resources/                              # Frontend (Inertia + React)
├── js/
│ ├── Components/                        # Reusable components
│ ├── Context/                           # Global contexts
│ ├── Layouts/                           # Application layouts
│ ├── Pages/                             # Inertia pages
│ ├── lib/
│ │ └── axios.js                         # Global Axios configuration
│ ├── app.jsx                             # React entry point
│ └── bootstrap.js                        # Frontend initialization
│
├── views/
│ └── app.blade.php                       # Base Inertia view
│
routes/                                  # Route definitions
├── web.php                              # Web routes (Inertia)
└── api.php                              # API routes
│
tests/                                   # Automated tests
│
vendor/                                  # PHP dependencies (Composer)
```

# Useful Commands

```
php artisan optimize:clear
php artisan migrate:fresh --seed
npm run build
```

# Common Issues

• Blank screen: check that `npm run dev` is running  
• Permission error: check `storage` and `bootstrap/cache` folders  
• Vite error: clear cache and reinstall dependencies  

# Technologies Used

## BACKEND
- PHP 8.2 Backend language
- Laravel 12.x Backend framework
- Inertia Laravel 2.0 SPA integration without separate REST API
- Laravel Sanctum * Authentication
- Spatie Laravel Permission 6.23 Roles and permissions
- Laravel DOMPDF 3.1 PDF document generation
- Tighten Ziggy 2.0 Laravel routes in frontend
- Laravel Spanish 1.5 Spanish translations

## FRONTEND
- React 18.2 UI library
- React DOM 18.2 Browser rendering
- Inertia.js 0.11.1 SPA navigation
- Vite 7.0.7 Bundler and development server
- Tailwind CSS 4.1.16 Utility-first styling
- DaisyUI 5.3.10 UI components
- Headless UI 2.0 Accessible components
- Heroicons 2.2 SVG icons
- Axios 1.13.2 HTTP client
- Sonner 2.0.7 Notifications (toasts)

# Development Tools

## FRONTEND
- Laravel Vite Plugin 2.0 Vite integration with Laravel
- Vite React Plugin 4.2 React support in Vite
- PostCSS 8.4 CSS processing
- Tailwind Forms 0.5 Form styling
- Concurrently 9.0 Run parallel processes

## BACKEND
- Laravel Breeze 2.3 Base authentication
- Laravel Sail 1.41 Docker environment
- Laravel Pint 1.24 Code formatter
- Pest PHP 3.8 Testing
- Faker PHP 1.23 Test data generation
- Collision 8.6 Console error handling

# Main Scripts

- `npm run dev` (Runs Vite in development mode)  
- `npm run build` (Compiles assets for production)  
- `composer setup` (Full project installation)  
- `composer dev` (Backend + queues + frontend in parallel)  
- `composer test` (Runs automated tests)

# ROLES

## Create Role
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

## Assign a Role
```php
$user = User::find(1);
$user->assignRole('Administrador');
```

## Assign Multiple Roles
```php
$user->assignRole(['Admin', 'Instructor']);
```

## Remove a Role
```php
$user->removeRole('Instructor');
```

## Get User Roles
```php
$user->syncRoles(['Instructor']);
```

## Check if User Has a Role
```php
$user->getRoleNames(); // devuelve una colección
```

## Check if User Has a Role
```php
$user->hasRole('Admin'); // true o false
```

## Check if User Has Any of Multiple Roles
```php
$user->hasAnyRole(['Admin', 'Instructor']);
```

## Check if User Has All Roles
```php
$user->hasAllRoles(['Admin', 'Instructor']);
```

## Assign Permission
```php
$user->givePermissionTo('crear usuarios');
```

## Check Permission
```php
$user->can('crear usuarios');
```

---


## Middleware to Protect Routes

# Restrict by Role
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

## Allow Multiple Roles
```php
->middleware('role:Admin|Instructor');
```

## Restrict by Permission
```php
->middleware('permission:crear usuarios');
```

## Get Authenticated User's Roles
```php
auth()->user()->getRoleNames();
```

---

# NOTIFICATIONS

## Create a Notification
```bash
php artisan make:notification WelcomeNotification
```

## Basic Example
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

## View User Notifications
```php
$user->notifications;
```

## Only Unread
```php
$user->unreadNotifications;
```

## Mark a Specific Notification
```php
$notification->markAsRead();
```

## Mark All
```php
$user->unreadNotifications->markAsRead();
```

## Delete a Notification
```php
$notification = auth()->user()->notifications()->find($id);
$notification->delete();
```

## Send Notifications to Multiple Users
```php
Notification::send(User::role('administrador')->get(), new SystemAlertNotification());
```

## Send to a Collection
```php
Notification::send($usuarios, new AlertNotification());
```

---

# API ENDPOINTS

---

## USERS API

### View All Users
> If the user has the "Admin" role, they see all users; if they have the Instructor role, they only see the "Learners"

**METHOD:** `GET`
```
/api/users
```

### View a User
**METHOD:** `GET`
```
/api/users/{id del usuario}
```

### Create User
**METHOD:** `POST`
```
/api/users/
```
> > The role is automatically assigned as Learner. Only the administrator can create users.
```json
{
    "type_document": "CC",
    "document_number": "109600652",
    "name": "Usuario creado a mano",
    "email": "usuariocreado@gmail.com",
    "password": "password"
}
```

### Update User
**METHOD:** `PUT`
```
/api/users/{id del usuario}
```

### Change User Status (active or pending)
**METHOD:** `PUT`
```
/api/users/status/{id del usuario}/{estado}
```

### Delete User
**METHOD:** `DELETE`
```
/api/users/{id del usuario}
```

### Filter Users
> You can filter only by `name`, `email`, `document_number`, `technical_sheet`

**METHOD:** `GET`
```
/api/users/filter?{nombre del filtro}={valor del filtro}
```

**Example:**
```
/api/users/filter?document_number=102030
```

**Search by multiple filters:**
```
/api/users/filter?document_number=102030&email=andres@gmail.com&name=andres
```

---

## FILES AND FOLDERS API (GeDocs)

### 1. Explorer and Navigation

#### `GET /explorer`
Main endpoint to load the file and folder structure.

**Query Params:**
- `sheet_id` (Optional): Technical sheet ID.
- `folder_id` (Optional): Current folder ID. If null, shows root folders (years).
- `buscador` (Optional): Search term for global filtering.

**Response:** Renders the `Explorer` view via Inertia with `folders` and `files` objects.

---

### 2. Folder Management

#### `POST /folders`
Creates a new folder.
- **Body (JSON):** `name`, `parent_id`, `sheet_number_id`, `folder_code`.

#### `PUT /folders/{folderId}`
Updates or renames an existing folder.
- **Body (JSON):** `name`, `folder_code`.

#### `POST /folders/move-mixed`
Moves a selection of folders and files to a new location.
- **Body (JSON):** `target_folder_id`, `folders` (array of IDs), `files` (array of IDs).

---

### 3. File Management

#### `POST /folders/{id}/upload`
Uploads one or more files to a specific folder.
- **Body (Multipart/Form-Data):** `files[]` (array of files).
- **Special logic:**
  - Generates a sequential code (`file_code`) based on the global maximum.
  - Generates a SHA256 hash of the content.
  - Renames the file on disk: `YEAR-Ex-COD-SEQ-HASH-OriginalName.pdf`.

#### `GET /folders/file/download/{id}`
Downloads a specific file.

#### `POST /folders/download-mixed-zip`
Compresses and downloads a mixed selection of folders and files as a ZIP file.

---

### 4. Trash System

#### `POST /folders/delete-mixed`
Performs a "soft delete" (moves to trash) by disabling the `active` flag.
- **Body (JSON):** `folders` (array of IDs), `files` (array of IDs).

#### `POST /folders/restore-mixed`
Restores items from trash by reactivating the `active` flag.

#### `GET /folders/archived`
Lists all items currently in trash (`active = false`).

---

### Data Structure (File Model)

| Field | Description |
|---|---|
| `name` | Standardized visible name |
| `file_code` | Consecutive code (e.g., `008`) |
| `hash` | SHA256 hash to verify integrity |
| `path` | Physical path in storage |
| `folder_id` | Reference to the containing folder |

---

## SHEETS API

### List all sheets
> Retrieves the sheets associated with the authenticated user according to their role (Instructor / Learners).

**METHOD:** `GET`
```
/sheetsNumber
```

**Successful response (200 OK):**
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

### Search sheet by number
**METHOD:** `GET`
```
/api/sheets/{numero_de_la_ficha}
```

**Example:**
```
/api/sheets/2578
```

**Response:**  
```json
{
  "success": true,
  "message": "Ficha encontrada exitosamente",
  "sheet": [...]
}
```

### Create a new sheet (Admin Only)
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

**Response (200 OK):**
```json
{
  "number": "3002085",
  "dependencies": {
    "name": "Ventanilla unica",
    "id": 2
  }
}
```

### Eliminar una ficha (Solo Admin)
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

**Response (200 OK):**
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

### Delete a sheet (Admin Only)
**METHOD:** `DELETE`
```
/api/sheets/{id_de_la_ficha}
```

**Response:**
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

**Example:**
```
/api/sheets/add/user/2578923/15
```

**Successful response:**
```json
{
  "success": true,
  "message": "Usuario agregado correctamente a la ficha"
}
```

**Common errors:**
1. Sheet not found → 404
2. User not found → 404
3. User already in the sheet → 409
4. Instructor without permission on this sheet → 403
5. Cannot add an Admin → 500

### Remove a user from a sheet (Admin Only)
**METHOD:** `DELETE`
```
/api/sheets/delete/user/{numero_ficha}/{id_usuario}
```

**Example:**
```
/api/sheets/delete/user/2578923/15
```

**Successful response:**
```json
{
  "success": true,
  "message": "Usuario eliminado de la ficha con exito"
}
```

**Errors:**
1. Sheet not found → 404
2. User does not belong to the sheet → 404

---

## API OF PQRS

### 1.1 List PQRS
**METHOD:** `GET /api/pqrs` *(Authentication Required)*

Retrieves the list of PQRS filtered according to the user's role.

**Query Params:**
- `archived` (boolean, optional): `true` to view archived, `false` for inbox.

**Response (200 OK):**
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

### 1.2 Create a PQR
**METHOD:** `POST /api/pqrs` *(Public Access)*

**Body (Multipart/Form-Data):**
- `sender_name` (string, required): Sender's name.
- `affair` (string, required): Subject.
- `description` (string, required): Request details.
- `request_type` (string, required): `Peticion`, `Queja`, `Reclamo`, `Sugerencia`, `Otro`.
- `number` (string, required): Related technical sheet number.
- `document_type` (string, required): `CC`, `TI`, `CE`.
- `document` (string): Identification number.
- `email` (string): Email for notifications.
- `attachments[]` (files): Attached files (pdf, docx, jpg, png). Max 5MB each.
- `dependency_id` (int, optional): Destination dependency ID.

**Response (201 Created):**
```json
{
  "data": { "id": 45, "sender_name": "Juan Perez" },
  "message": "PQR creada exitosamente"
}
```

### 1.3 Finalize and Close PQR
**METHOD:** `POST /api/pqr/{id}/finalize` *(Requires Authentication)*

**Body (Multipart/Form-Data):**
- `response_message` (string, required): Closing message (min 10 characters).
- `attachments[]` (files): Final supporting documents.

**Response (200 OK):**
```json
{
  "data": { "id": 1, "response_status": "closed", "state": true },
  "message": "PQR finalizada y cerrada exitosamente"
}
```

---

## COMMUNICATIONS

### 2.1 Create Communication (Admin Response)
**METHOD:** `POST /api/pqr/{id}/comunicaciones` *(Requires Authentication)*

**Body:**
- `message` (string, required): Message content.
- `requires_response` (boolean): If `true`, generates a response link for the user.
- `attachments[]` (files): Attached files.

**Response (201 Created):**
```json
{
  "data": { "id": 10, "message": "...", "attached_supports": [] },
  "response_url": "http://.../pqr/responder/uuid-generado",
  "message": "Comunicación enviada exitosamente"
}
```

### 2.2 Process User Response
**METHOD:** `POST /api/pqr/responder/{uuid}` *(Public Access via UUID)*

**Body:**
- `message` (string, required): Response text.
- `attachments[]` (files): Supporting files.

**Response (201 Created):**
```json
{
  "message": "Respuesta enviada exitosamente"
}
```

---

## PDF GENERATION

### `POST /api/pdf/generate-response` *(Requires Authentication)*

Generates an Official Letter in PDF with a validation QR and merges supporting files.

**Libraries used:**
- **DomPDF** (`barryvdh/laravel-dompdf`): Renders the Blade template to PDF.
- **PDFMerger** (`webklex/laravel-pdfmerger`): Merges the main PDF with `support_files`.

**Body (Multipart/Form-Data):**

| Field | Description |
|---|---|
| `pqr_id` | Required |
| `folder_id` | To store in the explorer |
| `codigo`, `fecha`, `lugar` | Header |
| `tratamiento`, `nombres`, `cargo`, `empresa`, `direccion`, `ciudad` | Recipient |
| `asunto`, `saludo`, `texto` | Content |
| `despedida1` to `despedida3`, `firma_nombres`, `firma_cargo`, `footer_text` | Signature and closing |
| `logo_file` | Logo image (PNG/JPG) |
| `signature_file` | Signature image |
| `support_files[]` | Additional PDFs to append |

**Process flow:**
1. Generates the base PDF (Letter).
2. Generates a QR code pointing to the download URL.
3. Merges the base PDF with `support_files`.
4. Stores the result in `storage/app/public/pdf_responses/`.
5. Registers the file as support of type `ENV` (Sent) in the database.
6. Sends email notification to the user with the attached document.

**Response (200 OK):**
```json
{
  "message": "Respuesta enviada y PDFs fusionados exitosamente.",
  "pdf_url": "http://localhost:8000/storage/pdf_responses/PREFIJO-2024-045.pdf",
  "pqr_status": "responded"
}
```

---

## QR GENERATION

### `GET /qrcode`

Creates a PNG image of the QR code pointing to the specified URL. The image is saved in `storage/qrcodes`.

**Body:**
```json
{
  "url": "URL a la que dirige el QR",
  "file_name": "nombre del archivo png"
}
```

---

## NOTIFICATIONS API

> All notifications are associated with the authenticated user. All endpoints require `auth:sanctum`.

### Get all notifications
**METHOD:** `GET`
```
/api/notifications
```

**Response:**
```json
{
  "success": true,
  "notifications": [...]
}
```

### Get only unread notifications
**METHOD:** `GET`
```
/api/notifications/filter/unread
```

### Get only read notifications
**METHOD:** `GET`
```
/api/notifications/filter/read
```

### View a specific notification
**METHOD:** `GET`
```
/api/notifications/{id}
```

**Errors:**
1. 404: Notification not found for this user.

### Mark a notification as read
**METHOD:** `POST`
```
/api/notifications/{id}/mark-as-read
```

**Response:**
```json
{
  "success": true,
  "notifications": {}
}
```

**Errors:**
1. 404: Notification does not belong to the user or does not exist.

---

## Important Notification Rules

- Only notifications of the authenticated user can be viewed.
- It is not possible to access notifications of other users.
- Notifications are returned in descending order by date.
- A notification that has already been read will not be marked as unread again.

---

## Common Error Messages

| Code | Message | Cause |
|---|---|---|
| **404** | PQR not found | The provided ID does not exist in the database. |
| **422** | This PQR has already been responded to | Attempting to respond to a closed or already addressed PQR. |
| **410** | This link has expired | The response UUID exceeded the time limit (7 days). |
| **500** | Error generating the response | Internal failure in DomPDF or write permission issues on disk. |
