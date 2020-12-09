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
Route::webhooks('mailgun-hooks');
Route::get('/form-public','GuestController@formPublic');
Route::post('/get/courses', 'GuestController@getCourses');
Route::post('/handle-form', 'GuestController@handleForm');
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
    Route::group(['middleware' => ['admin']], function(){
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
        //Điều chỉnh học phí
            Route::get('/fee-adjust', function(){
                return view('welcome');
            });
            Route::post('/adjustfee/create', 'DiscountController@createAdjustFee');
            Route::get('/adjustfee/get', 'DiscountController@getAdjustFee');
            Route::post('/adjustfee/edit', 'DiscountController@editAdjustFee');
            Route::post('/adjustfee/delete', 'DiscountController@deleteAdjustFee');
            Route::post('/adjustfee/apply', 'SessionController@applyAdjustment');
            
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
            Route::post('/entrance/delete', 'EntranceController@deleteEntrance');
            Route::post('/entrance/send-message', 'EntranceController@sendMessage');
        //Accounts
            Route::get('/finaccount', function(){
                return view('welcome');
            });
            Route::post('/account/get','AccountController@getAccount');
            Route::post('/account/edit','AccountController@editAccount');
            Route::post('/account/delete', 'AccountController@deleteAccount');
            Route::post('/account/create', 'AccountController@addAccount');
            // Route::get('/account/importDb', 'AccountController@importDb');
            Route::post('/account/find', 'AccountController@findAccount');
            Route::get('/get-equity', 'AccountController@getEquity');
        //Transaction
            Route::get('/transaction', function(){
                return view('welcome');
            });
            Route::post('/transaction/add','TransactionController@addTransaction');
            Route::post('/transaction/edit', 'TransactionController@editTransaction');
            Route::post('/transaction/get','TransactionController@getTransaction');
            Route::post('/transaction/get-id', 'TransactionController@getTransactionbyId');
            Route::get('/transaction/test', 'TransactionController@getTransaction');
            Route::get('/transaction/generate', 'TransactionController@generate');
            Route::post('/transaction/delete', 'TransactionController@deleteTransaction');
        //Discount
            Route::get('/discount', function(){
                return view('welcome');
            });
            Route::get('/discount/get', 'DiscountController@getDiscount');
            Route::post('/discount/create', 'DiscountController@createDiscount');
            Route::post('/discount/edit', 'DiscountController@editDiscount');
            Route::post('/discount/delete', 'DiscountController@deleteDiscount');
        //Paper 
            Route::get('/payment', function(){
                return view('welcome');
            });
            Route::get('/payment/get', 'PaperController@getPayment');
            Route::post('/payment/create', 'PaperController@createPayment');
            Route::post('/payment/edit', 'PaperController@editPayment');
            Route::post('/payment/add-transaction', 'PaperController@addPaymentTransaction');
            Route::post('/payment/delete', 'PaperController@deletePayment');

        //Receipt 
            Route::get('/receipt', function(){
                return view('welcome');
            });
            Route::post('/receipt/get', 'PaperController@getReceipt');
            Route::post('/receipt/create', 'PaperController@createReceipt');
            Route::post('/receipt/edit', 'PaperController@editReceipt');
            Route::post('/receipt/add-transaction', 'PaperController@addReceiptTransaction');
            Route::post('/receipt/delete', 'PaperController@deleteReceipt');

            Route::get('/paper/print/{id}', 'PaperController@printPaper');
        //Tag
            Route::get('/tag/get', 'TagController@getTag');
        //Fee
            Route::post('/fee/get', 'StudentController@getFee');
            Route::get('/fee', function(){
                return view('welcome');
            });
            Route::post('/fee/gather', 'StudentController@gatherFee');
            Route::post('/fee/normalize', 'StudentController@normalizeFee');
            Route::post('/fee/send-email', 'StudentController@sendEmail');
            Route::post('/fee/print', 'StudentController@printFee');
        //Bao cao tai chinh 
            Route::get('/report/financial', function(){
                return view('welcome');
            });
            Route::get('/report/get-financial', 'ReportController@getFinancial');
            Route::get('/report/revenue', function(){
                return view('welcome');
            });
            // Route::get('/report/get-revenue', 'ReportController@getRevenue');
            Route::post('/report/get-revenue', 'ReportController@getRevenue');
            Route::get('/admin/dt', function(){
                return redirect('/report/revenue');
            });
            Route::get('/check/duplicate', 'ClassController@duplicate');
        //Events 
            
            Route::get('/events', function(){                
                return view('welcome');
            });
            Route::get('/event/get', 'ClassController@getEvents');
            Route::post('/event-gather', 'StudentController@gatherEvent');
            Route::post('/event/create', 'ClassController@createEvent');
            Route::post('/event/edit', 'ClassController@editEvent');
            Route::get('/event/get-class', 'ClassController@getClassName');
            Route::post('/event/add-product', 'SessionController@addProduct');
            Route::post('/event/edit-product', 'SessionController@editProduct');
            Route::post('/event/delete-product', 'SessionController@deleteProduct');
            Route::post('/event/get-students', 'SessionController@getStudentOfSession');
            Route::post('/session-students', 'SessionController@getStudentOfProduct');
            Route::post('/event-upload-score', 'SessionController@uploadEventScore');
            Route::get('/event/{id}', function(){
                return view('welcome');
            });
    });
    //Password Change
    //Import database 
    // Route::get('/import-db', 'ClassController@importDB');
    Route::get('/get-schools', 'ClassController@getSchool');
    
//USER PROFILE
    
    Route::get('/account', function () {
        return view('welcome');}
    );
    Route::get('/user', 'UserController@getUser');
    Route::post('/user/uploadAvatar', 'UserController@updateAvatar');
    Route::post('/user/update-profile', 'UserController@updateProfile');
    Route::post('/user/password', 'UserController@updatePassword');
    Route::get('/settings', function(){
        return view('welcome');
    });

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

    Route::post('/class/report', 'ClassController@getReport');
    Route::post('/score/report', 'ClassController@getScoreReport');
    Route::get('/class/{class_id}', 'ClassController@detailClass');
    Route::post('/class/student','ClassController@detailStudentClass');
    Route::post('/class/find', 'ClassController@findClass');
    Route::get('/class/getbyid/{class_id}', 'ClassController@getClassById');
    Route::post('/class/add-student', 'ClassController@addStudentToClass');
    Route::post('/class/edit-student', 'ClassController@editStudentInClass');

    Route::post('/class/active-student', 'ClassController@getActiveStudent');
    

    
//Student
    Route::post('/student/create', 'StudentController@createStudent');
    Route::get('/student/find/{key}' , 'StudentController@findStudents');
    Route::post('/student/get', 'StudentController@getStudents');    
    Route::get('/student/{id}', 'StudentController@getStudent');
    Route::post('/student/get-id', 'StudentController@getStudentById');
    Route::post('/student/save', 'StudentController@saveStudent');
    Route::post('/student/get-class', 'StudentController@getClass');
    // Route::get('/student/import', 'StudentController@importStudent');
//Parent
    Route::post('/parent/create', 'ParentController@createParent');
    Route::get('/parent/find/{key}', 'ParentController@findParent');
//Session
    Route::post('/session/get-last', 'SessionController@getLastSession');
    Route::post('/session/get', 'SessionController@getSession');
    Route::post('/session/create','SessionController@createSession');
    Route::post('/session/delete', 'SessionController@deleteSession');
    Route::post('/session/edit', 'SessionController@editSession');
    Route::post('/session/add', 'SessionController@addSession');
    Route::post('/session/check-date', 'SessionController@checkDate');

    
//Attendance
    Route::get('/attendance', function(){
        return view('welcome');
    });
    Route::post('/attendance/get', 'AttendanceController@getAttendance');
    Route::post('/attendance/edit', 'AttendanceController@editAttendance');
    Route::post('/attendance/cell-edit', 'AttendanceController@cellEdit');
//Email
    Route::get('/send', 'StudentController@testMail');
    Route::post('/attendance/send-email', 'AttendanceController@sendEmail');
    Route::get('/e', function(){
        return view('emails.thht');
    });
//Math 
    Route::get('/documents', function(){
        return view('welcome');
    });
    Route::post('/documents/create', 'DocumentController@create');
    Route::post('/documents/edit', 'DocumentController@edit');
    Route::post('/documents/delete', 'DocumentController@delete');
    Route::post('/documents/get', 'DocumentController@get');
//Danh sach hoc sinh
    // Route::get('/student/list', 'ClassController@listStudent');
    // Route::get('/teacher/list', 'ClassController@listTeacher');
});
//EVENT PUBLIC
Route::get('/event-table/{event_code}', 'SessionController@getProductTable');
Route::get('/school/find/{key}', 'StudentController@findSchools');
Route::get('/event-get-public', 'ClassController@getEventInfo');
Route::get('/event-get-location', 'ClassController@getLocationInfo');
Route::post('/event-get-product', 'SessionController@getProductInfo');
Route::post('/check-phone', 'StudentController@checkPhone');
Route::post('/event/dang-ky', 'StudentController@registerEvent');

Route::get('/event-form', function() { return view('welcome'); });
Route::get('/event-tra-cuu', function() { return view('welcome'); });
Route::post('/event-get-result', 'StudentController@getResult');
// Route::post('/event-mail', )
// Route::get('/home', 'HomeController@index')->name('home');
// Route::get('/test', function(){
//     return view('home');
// });
// Route::get('/testtime',function(){
//     echo date('Y:m:d H:i:m', strtotime('2020-06-15T03:23:20.775Z'));
// });
Route::get('/ta/{email}', 'UserController@createNewTa');
// Route::get('/delete/ts', 'SessionController@deleteTransactionSession');
// Route::get('/transaction/discount', 'TransactionController@discountId');
// Route::get('/transaction/content', 'TransactionController@changeContent');
// 
// Route::get('/regenerate', 'SessionController@reGenerateFee');
// Route::get('/delete-attendance', 'AttendanceController@delete');
// Route::get('/delete-fee', 'SessionController@deleteFee');
// Route::get('/create-ta', 'UserController@createTa');
// Route::get('/transaction/dif', 'TransactionController@dif');
// Route::get('/sc/drop', 'ClassController@fuckDrop');

// Route::get('/lnda', 'StudentController@lnda');
// Route::get('/receipt/id','PaperController@regenerateId');
// Route::get('/test-contact','GuestController@testContact');
// Route::get('/session-count', 'SessionController@sessionCount');