<?php
// importations
use Illuminate\Support\Facades\Notification;
use App\Models\User;
use Spatie\Permission\Models\Role;
use App\Models\Sheet_number;

//render of registration
test('Registration screen can be rendered', function () {
    $response = $this->get('/register');
    $response->assertStatus(200);
});

//registration of apprentice
test('apprentice can register, is left pending and redirected to login', function () {
    Role::firstOrCreate(['name' => 'Aprendiz']);
    Role::firstOrCreate(['name' => 'Instructor']);
    $sheet = Sheet_number::create([
        'number' => '123456',
        'active' => true,
        'state' => 'active'
    ]);

    $response = $this->post('/register', [
        'type_document' => 'CC',
        'document_number' => '123456789',
        'name' => 'aprendiz',
        'email' => 'aprendiz@test.com',
        'role' => 'Aprendiz',
        'technical_sheet_id' => $sheet->id,
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertDatabaseHas('users', [
        'email' => 'aprendiz@test.com',
        'status' => 'pending',
    ]);

    $user = User::where('email', 'aprendiz@test.com')->first();
    $this->assertTrue($user->hasRole('Aprendiz'));

    $this->assertGuest();
    $response->assertRedirect('/login');
    $response->assertSessionHas('status', 'Aprendiz. Tu cuenta sera revisada por el instructor de la ficha que seleccionaste');
});


//notification to instructor when an apprentice registers
test('instructor receives notification when an apprentice registers', function () {
    Notification::fake();

    Role::firstOrCreate(['name' => 'Aprendiz']);
    $roleInstructor = Role::firstOrCreate(['name' => 'Instructor']);
    $sheet = Sheet_number::create([
        'number' => '123456',
        'active' => true,
        'state' => 'active'
    ]);

    $instructor = User::factory()->create([
        'type_document' => 'CC',
        'document_number' => '111111111',
    ]);
    $instructor->assignRole($roleInstructor);
    $instructor->sheetNumbers()->attach($sheet);

    $this->post('/register', [
        'type_document' => 'CC',
        'document_number' => '123456789',
        'name' => 'aprendiz',
        'email' => 'aprendiz@test.com',
        'role' => 'Aprendiz',
        'technical_sheet_id' => $sheet->id,
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);
    //verify that the instructor receives the notification
    Notification::assertSentTo(
        [$instructor],
        \App\Notifications\NewUserRegistered::class
    );
});



?>