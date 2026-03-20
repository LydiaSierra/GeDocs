<?php
// importations
use Illuminate\Support\Facades\Notification;
use App\Models\User;
use Spatie\Permission\Models\Role;

//render of registration
test('Registration screen can be rendered', function () {
    $response = $this->get('/register');
    $response->assertStatus(200);
});

//registration of instructor
test('instructor can register, is left pending and redirected to login', function () {
    Role::firstOrCreate(['name' => 'Instructor']);
    Role::firstOrCreate(['name' => 'Admin']);

    $response = $this->post('/register', [
        'type_document' => 'CC',
        'document_number' => '123456789',
        'name' => 'Instructor',
        'email' => 'instructor@test.com',
        'role' => 'Instructor',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertDatabaseHas('users', [
        'email' => 'instructor@test.com',
        'status' => 'pending',
    ]);
    
    $user = User::where('email', 'instructor@test.com')->first();
    $this->assertTrue($user->hasRole('Instructor'));
    
    $this->assertGuest();
    $response->assertRedirect('/login');
    $response->assertSessionHas('status', 'Instructor. Tu cuenta sera revisada por el administrador');
});


//notification to admin when an instructor registers
test('admin receives notification when an instructor registers', function () {
    Notification::fake();

    Role::firstOrCreate(['name' => 'Instructor']);
    $roleAdmin = Role::firstOrCreate(['name' => 'Admin']);

    $admin = User::factory()->create([
        'type_document' => 'CC',
        'document_number' => '111111111',
    ]);
    $admin->assignRole($roleAdmin);

    $this->post('/register', [
        'type_document' => 'CC',
        'document_number' => '123456789',
        'name' => 'Instructor',
        'email' => 'instructor@test.com',
        'role' => 'Instructor',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);
    //verify that the admin receives the notification
    Notification::assertSentTo(
        [$admin],
        \App\Notifications\NewUserRegistered::class
    );
});

?>
