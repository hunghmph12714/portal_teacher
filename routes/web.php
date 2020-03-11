<?php

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


Route::get('/', function () {
    return view('welcome');
});
//LOG IN
Route::get('/login', function () {
    return view('welcome');
})->name('login');
Route::post('/login', 'Auth\LoginController@login');
Route::post('/logout', 'Auth\LoginController@logout')->name('logout');
Route::get('/check-auth', 'UserController@checkAuth');

Route::group(['middleware' => ['auth']], function() {
    
    Route::get('/dashboard', function () {
        return view('welcome');
    });
    //USER PROFILE
    
    Route::get('/account', function () {
        return view('welcome');}
    );
    Route::get('/user', 'UserController@getUser');
    Route::post('/user/uploadAvatar', 'UserController@updateAvatar');
    Route::post('/user/update-profile', 'UserController@updateProfile');
    //CENTER MANAGEMENT
    Route::get('/centers', function(){
        return view('welcome');
    });
    Route::get('/get-center', 'CenterController@index'); 
    Route::post('/center/create', 'CenterController@create');
    Route::post('/center/edit', 'CenterController@edit');
    Route::post('/center/delete', 'CenterController@delete');

    //TEACHER MANAGEMENT
    Route::get('/teachers', function(){
        return view('welcome');
    });
    Route::get('/get-teacher', 'TeacherController@index');
    Route::post('/teacher/create', 'TeacherController@create');
    Route::post('/teacher/edit', 'TeacherController@edit');
    Route::post('/techer/delete', 'TeacherController@delete');
    Route::post('/teacher/resign', 'TeacherController@resign');
    //TEACHER MIN Salary
    Route::get('/get-base-salary', 'TeacherController@getBaseSalary');
    Route::get('/base-salary', function(){
        return view('welcome');
    });

    //ROOM MANAGEMENT
    Route::get('/rooms', function(){
        return view('welcome');
    });
    Route::get('/get-rooms','ClassController@getRoom');
    Route::post('/room/create', 'ClassController@createRoom');
    Route::post('/room/edit', 'ClassController@editRoom');
    Route::post('/room/delete', 'ClassController@deleteRoom');
    //Courese MANAGEMENT
    Route::get('/courses', function(){
        return view('welcome');
    });
    Route::get('/get-courses','ClassController@getCourse');
    Route::post('/course/create', 'ClassController@createCourse');
    Route::post('/course/edit', 'ClassController@editCourse');
    Route::post('/course/delete', 'ClassController@deleteCourse');


    Route::post('/base-salary/create', 'TeacherController@createBaseSalary');
    Route::post('/base-salary/edit', 'TeacherController@editBaseSalary');
    Route::post('/base-salary/delete', 'TeacherController@deleteBaseSalary');
});

// Auth::routes();
Route::get('/home', 'HomeController@index')->name('home');
