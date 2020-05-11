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
// Route::get('/importdb', 'ClassController@importDB');
//LOG IN\
Route::get('/login', function () {
    return view('welcome');
})->name('login');
Route::post('/login', 'Auth\LoginController@login');
Route::post('/logout', 'Auth\LoginController@logout')->name('logout');
Route::get('/check-auth', 'UserController@checkAuth');

Route::group(['middleware' => ['auth']], function() {
    
    //Import database 
    // Route::get('/import-db', 'ClassController@importDB');
    Route::get('/get-schools', 'ClassController@getSchool');
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
//BASE SALARY TEACHER
    Route::get('/get-base-salary', 'TeacherController@getBaseSalary');
    Route::get('/base-salary', function(){
        return view('welcome');
    });
    Route::post('/base-salary/create', 'TeacherController@createBaseSalary');
    Route::post('/base-salary/edit', 'TeacherController@editBaseSalary');
    Route::post('/base-salary/delete', 'TeacherController@deleteBaseSalary');
//ROOM MANAGEMENT
    Route::get('/rooms', function(){
        return view('welcome');
    });
    Route::get('/get-rooms','ClassController@getRoom');
    Route::get('/get-room/{center}', 'ClassController@getRoomCenter');
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
    

//Class Management
    Route::get('/classes', function(){
        return view('welcome');
    });
    Route::get('/class/get/{center_id}/{course_id}','ClassController@getClass');
    Route::post('/class/create', 'ClassController@createClass');
    Route::post('/class/edit', 'ClassController@editClass');
    Route::post('/class/deactive', 'ClassController@deactiveClass');
    Route::post('/class/delete', 'ClassController@deleteClass');
    Route::get('/class/:id', function(){
        return view('welcome');
    });
    Route::get('/class/{class_id}', 'ClassController@detailClass');
//SETTING-RELATIONSHIP
    Route::get('/settings/relationship', function(){
        return view('welcome');
    });
    Route::get('/relationship/get', 'AdminSettingController@getRelationship'); 
    Route::post('/relationship/create', 'AdminSettingController@createRelationship');
    Route::post('/relationship/edit', 'AdminSettingController@editRelationship');
    Route::post('/relationship/delete', 'AdminSettingController@deleteRelationship');
//SETTING-STEP
    Route::get('/settings/step', function(){
        return view('welcome');
    });
    Route::post('/step/get', 'AdminSettingController@getStep'); 
    Route::post('/step/create', 'AdminSettingController@createStep');
    Route::post('/step/edit', 'AdminSettingController@editStep');
    Route::post('/step/delete', 'AdminSettingController@deleteStep');

//SETTING-STATUS
    Route::get('/settings/status', function(){
        return view('welcome');
    });
    Route::post('/status/get', 'AdminSettingController@getStatus'); 
    Route::post('/status/create', 'AdminSettingController@createStatus');
    Route::post('/status/edit', 'AdminSettingController@editStatus');
    Route::post('/status/delete', 'AdminSettingController@deleteStatus');
//Schools
    Route::get('/school/find/{key}', 'StudentController@findSchools');
//Entrance
    Route::get('/entrance/create', function(){
        return view('welcome');
    });
    Route::get('/entrance/list', function(){
        return view('welcome');
    });
    Route::post('/entrance/create', 'EntranceController@createEntrance');
    Route::post('/entrance', 'EntranceController@getEntrance');
    Route::get('/get-entrance/{step}', 'EntranceController@getEntranceByStep');
    Route::post('/entrance/upload-test', 'EntranceController@uploadTest');
    Route::post('/entrance/edit', 'EntranceController@editEntrance');
//Student
    Route::post('/student/create', 'StudentController@createStudent');
    Route::get('/student/find/{key}' , 'StudentController@findStudents');
    Route::post('/student/get', 'StudentController@getStudents');
//Parent
    Route::post('/parent/create', 'ParentController@createParent');
    Route::get('/parent/find/{key}', 'ParentController@findParent');
//Session
    Route::post('/session/get-last', 'SessionController@getLastSession');
    Route::post('/session/get', 'SessionController@getSession');
    Route::post('/session/create','SessionController@createSession');
    Route::post('/session/delete', 'SessionController@deleteSession');
    Route::post('/session/edit', 'SessionController@editSession');

//Attendance
    Route::get('/attendance', function(){
        return view('welcome');
    });
    Route::post('/attendance/get', 'AttendanceController@getAttendance');
    Route::post('/attendance/edit', 'AttendanceController@editAttendance');
});

// Auth::routes();
Route::get('/home', 'HomeController@index')->name('home');
Route::get('/test', function(){
    return view('home');
});