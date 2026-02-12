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

- [Descripción del proyecto](#descripción-del-proyecto) 
- [Características principales](#características-principales) 
- [Arquitectura y tecnologías](#arquitectura-y-tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación) 
- [Configuración del entorno]( #configuración-del-entorno) 
- [Ejecución del proyecto](#ejecución-del-proyecto) 
- [Estructura del proyecto](#estructura-del-proyecto) 
- [Comandos útiles](#comandos-útiles) 
- [Problemas comunes](#problemas-comunes)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Herramientas de desarrollo (DevDependencies)](#herramientas-de-desarrollo-devdependencies)
- [Scripts principales](#scripts-principales)
- [Api EndPoints](#api)  

## Descripción del proyecto 
# ROLES
## Crear Rol

# INSTALACIÓN

```
composer require spatie/laravel-permission
```
```
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
```
``` 
use Spatie\Permission\Models\Role;

Role::create(['name' => 'administrador']);
Role::create(['name' => 'instructor']);
Role::create(['name' => 'aprendiz']);
```
## Asignar un rol
```
$user = User::find(1);
$user->assignRole('Administrador');
```
## Asignar varios roles
```
$user->assignRole(['Admin', 'Instructor']);
```
## Remover un rol
```
$user->removeRole('Instructor');
```
## Reemplazar todos los roles
```
$user->syncRoles(['Instructor']);
```
## Obtener roles del usuario
```
$user->getRoleNames(); // devuelve una colección
```
## Verificar si el usuario tiene un rol
```
$user->hasRole('Admin'); // true o false
```
## Verificar si tiene cualquiera de varios roles
```
$user->hasAnyRole(['Admin', 'Instructor']);
```
## Verificar si tiene todos los roles
```
$user->hasAllRoles(['Admin', 'Instructor']);
```
## Asignar permiso
```
$user->givePermissionTo('crear usuarios');
```
## Verificar permiso
```
$user->can('crear usuarios');
```
# Middleware para proteger rutas:

## Restringir por rol
```
Route::get('/admin', function () {
    // ...
})->middleware('role:Admin');
```
o
```
 Route::middleware('role:Admin')->group(function () {
    // ... 
});
```
## Permitir varios roles
```
->middleware('role:Admin|Instructor');
```

## Restringir por permiso
```
->middleware('permission:crear usuarios');
```
## Obtener rol del usuario autenticado
```
auth()->user()->getRoleNames();
```

# Crear una notificación
```
php artisan make:notification WelcomeNotification
```

# Ejemplo básico:
```
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class WelcomeNotification extends Notification
{
    public function via($notifiable)
    {
        return ['mail', 'database']; // canales que deseas usar
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
```
$user->notifications;
```

## Solo las no leídas:
```
$user->unreadNotifications;
```

## Marcar una específica:
```
$notification->markAsRead();
```

## Marcar todas:
```
$user->unreadNotifications->markAsRead();
```

## Eliminar una notificación
```
$notification = auth()->user()->notifications()->find($id); // $id identifica la notificación (esto viene por ejemplo desde la URL).
$notification->delete();
```

## Enviar notificaciones a varios usuarios
```
Notification::send(User::role('administrador')->get(), new SystemAlertNotification());
```

## Enviar a una colección:
```
Notification::send($usuarios, new AlertNotification());
```

# API DE USUARIOS

## Visualizar todos los usuarios

### Si el usuario es de rol "Admin" ve todos los usuarios, si es de rol Instructor ve solo los "Aprendizes"
METHOD GET  

```
/api/users
```

## Visualizar un usuario

METHOD GET  

```
/api/users/{id del usuario}
```

## Crear Usuario
METHOD POST 
```
/api/users/ 
```
### Datos a ingresar

#### El rol se asigna automaticamente como Aprendiz

#### Solo el administrador puede crear usuarios
```
{
     "type_document": "CC",
     "document_number": "109600652",
     "name": "Usuario creado a mano", 
     "email": "usuariocreado@gmail.com",
     "password": "password"
}
```

## Actualizar usuario
METHOD PUT 
```
/api/users/{id del usuario}
```

## Cambiar el estado del usuario (active o pending)
METHOD UPDATE 
```
/api/users/status/{id el usuario}/{estado}
```

## Eliminar usuario
METHOD DELETE 
```
/api/users/{id del usuario}
```

## Filtrar Usuarios

###  se puede filtrar solo por  "name", "email", "document_number", "technical_sheet"
METHOD GET  
```
/api/users/filter?{nombre del filtro}={valor del frilto}
```

#### Ejemplo

```
/api/users/filter?document_number=102030
```

###  Buscar por varios filtros
METHOD GET  
```
/api/users/filter?{nombre del primer filtro}={valor del primer frilto}&{nombre del segundo filtro}={valor del segundo filtro}&{e.t.c}
```

#### Ejemplo

```
/api/users/filter?document_number=102030&email=andres@gmail.com&name=andres
```

# API DE FICHAS 

---


Todos los endpoints de Fichas requieren autenticación.  
La creación, actualización y eliminación solo está permitida para el rol **Admin**.

---


## Listar todas las fichas

### Retorna cada ficha junto con sus usuarios clasificados por rol:
-Instructor
-Aprendices
###

#### METHOD: GET
```
/api/sheets
```

### Respuesta esperada:
```
{
  "success": true,
  "sheets": [
    {
      "id": 1,
      "number": 2578923,
      "Instructor": [...],
      "Aprendices": [...]
    }
  ]
}
```

## Buscar ficha por número

#### METHOD: GET

```
/api/sheets/{numero_de_la_ficha}
```

### Ejemplo:
```
/api/sheets/2578
```

### Respuesta:
```
{
  "success": true,
  "message": "Ficha encontrada exitosamente",
  "sheet": [...]
}

```

## Crear una nueva ficha (Solo Admin)

### METHOD: POST
```

/api/sheets
```
### Body requerido:
```
{
  "number": 2578923
}
```

### Respuesta:
```
{
  "success": true,
  "message": "Ficha creada con exito",
  "ficha": { ... }
}
```

## Actualizar una ficha (Solo Admin)

### METHOD: PUT

```
/api/sheets/{id_de_la_ficha}
```

### Body permitido:
```
{
  "number": 555555
}
```


### Respuesta:
```
{
  "success": true,
  "message": "Ficha actualizada con exito"
}
```


## Eliminar una ficha (Solo Admin)

### METHOD: DELETE

```
/api/sheets/{id_de_la_ficha}
```

### Respuesta:
```
{
  "success": true,
  "message": "Ficha eliminada con exito"
}
```

## Agregar un usuario a una ficha

## Reglas de Validación

- **Forbidden (500):** No se permite agregar usuarios con rol `Admin`.
- **Forbidden (403):** Un Instructor no puede modificar fichas en las que no está asignado.
- **Conflict (409):** No se permite agregar un usuario que ya está vinculado a la ficha.


### METHOD: POST

```

/api/sheets/add/user/{numero_ficha}/{id_usuario}

```

### Ejemplo:
```

/api/sheets/add/user/2578923/15
```
### Respuesta si todo sale bien:

```
{
  "success": true,
  "message": "Usuario agregado correctamente a la ficha"
}
```


## Errores comunes:

1. **Ficha no encontrada → 404**

2. **Usuario no encontrado → 404**

3. **Usuario ya está en la ficha → 409**

4. **Instructor sin permiso sobre esta ficha → 403**

5. **No puedes agregar un Admin → 500**


## Eliminar un usuario de una ficha (Solo Admin)

### METHOD: DELETE

```

/api/sheets/delete/user/{numero_ficha}/{id_usuario}
```


### Ejemplo:
```

/api/sheets/delete/user/2578923/15
```

### Respuesta exitosa:

```
{
  "success": true,
  "message": "Usuario eliminado de la ficha con exito"
}
```

### Posibles errores:

1. **Ficha no encontrada → 404**

2. **Usuario no pertenece a la ficha → 404**

<br/>
<br/>

# API DE NOTIFICACIONES

---


**-Las notificaciones están asociadas al usuario autenticado.**
**-Todos los endpoints requieren auth:sanctum.**


---


## Obtener todas las notificaciones

### Retorna todas las notificaciones del usuario (leídas y no leídas), ordenadas desde la más reciente.

### METHOD: GET

```
/api/notifications
```

### Respuesta:
```
{
  "success": true,
  "notifications": [...]
}
```


## Obtener solo notificaciones no leídas

### METHOD: GET

```

/api/notifications/filter/unread
```
### Respuesta:
```
{
  "success": true,
  "enotifications": [...]
}
```

## Obtener solo notificaciones leídas

### METHOD: GET
```

/api/notifications/filter/read
```

### Respuesta:
```
{
  "success": true,
  "notifications": [...]
}
```

### Ver una notificación específica


### **Devuelve una sola notificación por su ID, pero solo si pertenece al usuario autenticado.**

### METHOD: GET

```
/api/notifications/{id}
```

### Respuesta:
```
{
  "success": true,
  "notification": { ... }
}
```


### **Errores:**

1. **404: Notificación no encontrada para este usuario.**


## Marcar una notificación como leída

### Marca una notificación específica como read.

### METHOD: POST
```

/api/notifications/{id}/mark-as-read
```

### Respuesta:
```
{
  "success": true,
  "notifications": { ... }
}
```

### **Errores:**

1. **404: La notificación no pertenece al usuario o no existe.**

# Reglas importantes
## Reglas:

**- Solo se pueden ver notificaciones del usuario autenticado.**
**- No es posible acceder a notificaciones de otros usuarios.**
**- Las notificaciones se devuelven en orden descendente por fecha.**
**- Una notificación ya leída no se vuelve a marcar como no leída.**