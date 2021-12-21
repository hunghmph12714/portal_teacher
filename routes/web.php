<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('login', [LoginController::class, 'loginForm'])->name('login.form');
Route::post('login', [LoginController::class, 'postLogin'])->name('login.post');


Route::prefix('teacher')->group(function () {
    Route::get('/', [TeacherController::class, 'index'])->name('teacher.index');
    Route::get('/edit/{id}', [TeacherController::class, 'editForm'])->name('teacher.edit');
    Route::post('/edit/{id}', [TeacherController::class, 'saveEdit']);

    Route::post('/', [TeacherController::class, 'index']);
    Route::get('/updatePassword/{id}', [TeacherController::class, 'updatePasswordForm'])->name('teacher.updatePassword');
    Route::post('/updatePassword/{id}', [TeacherController::class, 'updatePassword']);
    Route::get('/class/{id}', [TeacherController::class, 'teacher_class'])->name('teacher.class');
    // Route::get('/class/{id}', [SessionController::class, 'teacher_class']);
});



Route::get('/', function () {
    return view('home');
})->name('home');
Route::any('logout', function () {
    Auth::logout();
    return redirect(route('login.form'));
})->name('user.logout');
