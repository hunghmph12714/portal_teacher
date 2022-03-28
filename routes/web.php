<?php

use App\Http\Controllers\AttemptController;
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

Route::get('login', [LoginController::class, 'loginForm'])->middleware('login')->name('login.form');
Route::get('forgotPassword', [LoginController::class, 'forgotPasswordForm'])->name('login.forgotPassword');
Route::post('forgotPassword', [LoginController::class, 'forgotPasswordSend']);


Route::post('login', [LoginController::class, 'postLogin'])->middleware('login')->name('login.post');

Route::get('loginZalo', [LoginController::class, 'formLoginZalo'])->name('login.formZalo');
Route::post('loginZalo', [LoginController::class, 'LoginZalo']);

Route::get('loginZaloOTP/{phone}', [LoginController::class, 'formOTP'])->name('login.formOTP');
Route::post('loginZaloOTP', [LoginController::class, 'verifyOTP']);



Route::prefix('teacher')->middleware('teacher')->group(function () {
    Route::get('/', [TeacherController::class, 'index'])->name('teacher.index');
    Route::get('/edit/{id}', [TeacherController::class, 'editForm'])->name('teacher.edit');
    Route::post('/edit/{id}', [TeacherController::class, 'saveEdit']);

    Route::post('/', [TeacherController::class, 'index']);
    // Route::get('/updatePassword/{id}', [TeacherController::class, 'updatePasswordForm'])->name('teacher.updatePassword');
    // Route::post('/updatePassword/{id}', [TeacherController::class, 'updatePassword']);
    Route::get('/class/{id}', [TeacherController::class, 'teacherClass'])->name('teacher.class');
    Route::get('/class/student/{class_id}', [TeacherController::class, 'classStudent'])->name('teacher.classStudent');

    // Route::get('/class/{id}', [SessionController::class, 'teacher_class']);
});
Route::get('teacher/updatePassword/{id}', [TeacherController::class, 'updatePasswordForm'])->name('teacher.updatePassword');
Route::post('teacher/updatePassword/{id}', [TeacherController::class, 'updatePassword']);

Route::get('demo', [TeacherController::class, 'formatName']);
Route::prefix('student')->group(function () {
    Route::get('attempt/{student_id}', [TeacherController::class, 'studentAttempt'])->name('student.attempt');
    Route::get('attempt-detail/{attempt_id}', [AttemptController::class, 'getAttempt'])->name('student.attempt_detail'); 
       Route::post('attempt-detail/{attempt_id}', [AttemptController::class, 'editAttempt']);

});

Route::get('/', function () {
    if(!empty(Auth::user()->id)){   
         return redirect(route('teacher.class', ['id' => Auth::user()->id]));
}else{
    return redirect(route('login.form'));
}
})->name('home');
Route::any('logout', function () {
    Auth::logout();
    return redirect(route('login.form'));
})->name('user.logout');
Route::get('/403', function () {
    return view('error_403');
})->name('error.403');