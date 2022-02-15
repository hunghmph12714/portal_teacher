<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|s
*/

use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuizConfigController;
use App\Http\Controllers\QuizController;
// use Illuminate\Routing\Route;

Route::get('/', function () {
    return view('welcome');
});
// Route::get('/student-4', 'StudentController@get4');
// Route::get('/student-5', 'StudentController@get5');
// Route::get('/student-9', 'StudentController@get9');
Route::get('/ams/{khoi}/{id}', 'GuestController@Ams');
// Route::get('/ams/')
Route::get('/form-public', 'GuestController@formPublic');
Route::get('/form-public-simplified', 'GuestController@formPublicSimplified');
Route::post('/handle-simplified-form', 'GuestController@handleSimplifiedForm');
Route::post('/get/courses', 'GuestController@getCourses');
Route::post('/handle-form', 'GuestController@handleForm');
Route::get('/login', function () {
    return view('welcome');
})->name('login');
Route::post('/login', 'Auth\LoginController@authenticate');
Route::post('/logout', 'Auth\LoginController@logout')->name('logout');
Route::get('/check-auth', 'UserController@checkAuth');
Route::group(['middleware' => ['auth', 'cors']], function () {
    Route::get('/parent-export', 'StudentController@csv');
    Route::get('/dashboard', function () {
        return view('welcome');
    });
    Route::get('/events', function () {
        return view('welcome');
    });

    Route::get('/event/get', 'ClassController@getEvents');
    Route::post('/event-gather', 'StudentController@gatherEvent');
    Route::post('/event/create', 'ClassController@createEvent');
    Route::post('/event-analytics', 'ClassController@getAnalytics');
    Route::get('/event-mkt-analytics', 'ClassController@mktAnalytics');
    Route::post('/event/edit', 'ClassController@editEvent');
    Route::get('/event/get-class', 'ClassController@getClassName');
    Route::post('/event/add-product', 'SessionController@addProduct');
    Route::post('/event/edit-product', 'SessionController@editProduct');
    Route::post('/event/delete-product', 'SessionController@deleteProduct');
    Route::post('/event/get-students', 'SessionController@getStudentOfSession');
    Route::post('/event-student/get', 'StudentController@getStudentEvent');
    Route::post('/session-students', 'SessionController@getStudentOfProduct');
    Route::post('/event-upload-score', 'SessionController@uploadEventScore');
    Route::get('/event/{id}', function () {
        return view('welcome');
    });
    Route::post('/event-score-report', 'ClassController@getEventScore');
    Route::post('/session/send-reminder', 'StudentController@sendReminder');
    Route::group(['middleware' => ['admin']], function () {
        //USER MANAGEMENT
        Route::get('/settings/user', function () {
            return view('welcome');
        })->middleware(['permission:view_users']);
        Route::post('/settings/users/get', 'AdminSettingController@getUser')->middleware(['permission:view_users']);
        Route::post('/settings/users/create', 'AdminSettingController@createUser')->middleware(['permission:create_users']);
        Route::post('/settings/users/edit', 'AdminSettingController@editUser')->middleware(['permission:edit_users']);
        Route::post('/settings/users/disable', 'AdminSettingController@disableUser')->middleware(['permission:delete_users']);
        Route::post('/settings/users/edit-permission', 'AdminSettingController@editUserPermission')->middleware(['permission:assign_permission']);

        //ROLE MANAGEMENT
        Route::get('/settings/role', function () {
            return view('welcome');
        })->middleware(['permission:view_roles']);
        Route::post('/role/get', 'AdminSettingController@getRole')->middleware(['permission:view_roles']);
        Route::post('/role/create', 'AdminSettingController@createRole')->middleware(['permission:create_roles']);
        Route::post('/role/edit', 'AdminSettingController@editRole')->middleware(['permission:edit_roles']);
        Route::post('/role/delete', 'AdminSettingController@deleteRole')->middleware(['permission:delete_roles']);
        Route::post('/role/edit-permission', 'AdminSettingController@editRolePermission')->middleware(['permission:assign_roles']);

        //Permission Managenment
        Route::get('/permission/get', 'AdminSettingController@getPermission');
        Route::group(['middleware' => ['permission:view_settings']], function () {
            //CENTER MANAGEMENT
            Route::get('/centers', function () {
                return view('welcome');
            });

            Route::post('/center/create', 'CenterController@create');
            Route::post('/center/edit', 'CenterController@edit');
            Route::post('/center/delete', 'CenterController@delete');

            //TEACHER MANAGEMENT
            Route::get('/teachers', function () {
                return view('welcome');
            });
            Route::get('/get-teacher', 'TeacherController@index');
            Route::post('/teacher/create', 'TeacherController@create');
            Route::post('/teacher/edit', 'TeacherController@edit');
            Route::post('/techer/delete', 'TeacherController@delete');
            Route::post('/teacher/resign', 'TeacherController@resign');
            //BASE SALARY TEACHER
            Route::get('/get-base-salary', 'TeacherController@getBaseSalary');
            Route::get('/base-salary', function () {
                return view('welcome');
            });
            Route::post('/base-salary/create', 'TeacherController@createBaseSalary');
            Route::post('/base-salary/edit', 'TeacherController@editBaseSalary');
            Route::post('/base-salary/delete', 'TeacherController@deleteBaseSalary');
            //ROOM MANAGEMENT
            Route::get('/rooms', function () {
                return view('welcome');
            });
            Route::get('/get-room/{center}', 'ClassController@getRoomCenter');
            Route::post('/room/create', 'ClassController@createRoom');
            Route::post('/room/edit', 'ClassController@editRoom');
            Route::post('/room/delete', 'ClassController@deleteRoom');
            //Courese MANAGEMENT
            Route::get('/courses', function () {
                return view('welcome');
            });

            Route::post('/course/create', 'ClassController@createCourse');
            Route::post('/course/edit', 'ClassController@editCourse');
            Route::post('/course/delete', 'ClassController@deleteCourse');
            //Điều chỉnh học phí
            Route::get('/fee-adjust', function () {
                return view('welcome');
            });
            Route::post('/adjustfee/create', 'DiscountController@createAdjustFee');
            Route::get('/adjustfee/get', 'DiscountController@getAdjustFee');
            Route::post('/adjustfee/edit', 'DiscountController@editAdjustFee');
            Route::post('/adjustfee/delete', 'DiscountController@deleteAdjustFee');
            Route::post('/adjustfee/apply', 'SessionController@applyAdjustment');

            //SETTING-RELATIONSHIP
            Route::get('/settings/relationship', function () {
                return view('welcome');
            });
            Route::get('/relationship/get', 'AdminSettingController@getRelationship');
            Route::post('/relationship/create', 'AdminSettingController@createRelationship');
            Route::post('/relationship/edit', 'AdminSettingController@editRelationship');
            Route::post('/relationship/delete', 'AdminSettingController@deleteRelationship');
            //SETTING-STEP
            Route::get('/settings/step', function () {
                return view('welcome');
            });
            Route::post('/step/create', 'AdminSettingController@createStep');
            Route::post('/step/edit', 'AdminSettingController@editStep');
            Route::post('/step/delete', 'AdminSettingController@deleteStep');

            //SETTING-STATUS
            Route::get('/settings/status', function () {
                return view('welcome');
            });
            Route::post('/status/create', 'AdminSettingController@createStatus');
            Route::post('/status/edit', 'AdminSettingController@editStatus');
            Route::post('/status/delete', 'AdminSettingController@deleteStatus');
        });
        //OBJECTIVES MANAGEMENT
        Route::get('/muc-tieu', function () {
            return view('welcome');
        });
        Route::post('/objective/get', 'ObjectiveController@getObjective');
        Route::post('/objective/edit', 'ObjectiveController@editObjective');
        Route::post('/objective/delete', 'ObjectiveController@deleteObjective');
        Route::post('/objective/create', 'ObjectiveController@addObjective');
        Route::post('/objective/fetch-by-grade', 'ObjectiveController@getByGrade');

        Route::get('/get-center', 'CenterController@index');
        Route::post('/step/get', 'AdminSettingController@getStep');
        Route::post('/status/get', 'AdminSettingController@getStatus');
        Route::get('/get-rooms', 'ClassController@getRoom');
        Route::get('/get-courses', 'ClassController@getCourse');
        //Schools
        //Entrance
        Route::get('/entrance/create', function () {
            return view('welcome');
        });
        Route::get('/entrance/quick-create', function () {
            return view('welcome');
        });
        Route::get('/get-sources', 'EntranceController@getSource');
        Route::get('/entrance/list', function () {
            return view('welcome');
        });
        Route::get('/entrance/list/{center_id}/{step_id}',  function () {
            return view('welcome');
        });
        Route::get('/entrance/stats/{center_id}/{step_id}', 'EntranceController@getStats');
        Route::get('/entrance/stats/{center_id}', 'EntranceController@getDetailStats');

        Route::post('/entrance/create', 'EntranceController@createEntrance');
        Route::post('/entrance', 'EntranceController@getEntrance');

        Route::post('/entrance/get/init', 'EntranceController@getEntranceInit');
        Route::post('/entrance/get/appointment', 'EntranceController@getEntranceAppointment');
        Route::post('/entrance/get/result', 'EntranceController@getEntranceResult');
        Route::post('/entrance/get/inform', 'EntranceController@getEntranceInform');
        Route::post('/entrance/get/final', 'EntranceController@getEntranceFinal');
        Route::post('/entrance/get/delay', 'EntranceController@getEntranceDelay');
        Route::post('/entrance/get/lost', 'EntranceController@getEntranceLost');

        Route::post('/entrance/inform/increase', 'EntranceController@increaseInform');
        Route::post('/entrance/init/edit', 'EntranceController@initEdit');
        Route::post('/entrance/appointment/edit', 'EntranceController@appointmentEdit');

        Route::post('/entrance/step/fail', 'EntranceController@setFail1');
        Route::post('/entrance/comment/create', 'EntranceController@createComment');
        Route::post('/entrance/get-messages', 'EntranceController@getMessage');
        Route::post('/entrance/comment/delete', 'EntranceController@deleteMessage')->middleware(['permission:delete_comment']);;

        Route::post('/entrance/upload-test', 'EntranceController@uploadTest');
        Route::post('/entrance/edit', 'EntranceController@editEntrance');
        Route::post('/entrance/delete', 'EntranceController@deleteEntrance');
        Route::post('/entrance/send-message', 'EntranceController@sendMessage');

        Route::post('/entrance/enroll-class', 'EntranceController@EnrollClass');
        Route::post('/entrance/confirm', 'EntranceController@ConfirmClass');
        Route::post('/entrance/complete', 'EntranceController@completeEntrance');
        Route::get('/entrance/export-stat', 'EntranceController@exportEntranceStats');

        Route::get('/entrance/completed', function () {
            return view('welcome');
        });
        Route::post('/entrance/get/completed', 'EntranceController@getCompleted');
        Route::post('/entrance/un-complete', 'EntranceController@unCompleted');

        Route::get('/entrance/failed', function () {
            return view('welcome');
        });
        //Budgets
        Route::get('/budget', function () {
            return view('welcome');
        });

        Route::post('/budget/get', 'BudgetController@getBudget');
        Route::post('/budget/create', 'BudgetController@createBudget');
        Route::post('/budget/edit', 'BudgetController@editBudget');
        Route::post('/budget/delete', 'BudgetController@deleteBudget');
        Route::post('/budget/get-detail', 'BudgetController@getDetail');
        Route::post('/budget/add-account', 'BudgetController@addAccount');
        Route::post('/budget/stats', 'BudgetController@getStats');
        Route::get('/budget/{id}', 'BudgetController@statBudget');
        // Route::post('')
        //Accounts
        Route::get('/finaccount', function () {
            return view('welcome');
        });
        Route::post('/account/get', 'AccountController@getAccount');
        Route::post('/account/edit', 'AccountController@editAccount');
        Route::post('/account/delete', 'AccountController@deleteAccount');
        Route::post('/account/create', 'AccountController@addAccount');
        // Route::get('/account/importDb', 'AccountController@importDb');
        Route::post('/account/find', 'AccountController@findAccount');
        Route::get('/get-equity', 'AccountController@getEquity');

        //Transaction
        Route::get('/transaction', function () {
            return view('welcome');
        });
        Route::post('/transaction/add', 'TransactionController@addTransaction');
        Route::post('/transaction/edit', 'TransactionController@editTransaction');
        Route::post('/transaction/get', 'TransactionController@getTransaction');
        Route::post('/transaction/get-id', 'TransactionController@getTransactionbyId');
        Route::get('/transaction/test', 'TransactionController@getTransaction');
        Route::get('/transaction/generate', 'TransactionController@generate');
        Route::post('/transaction/delete', 'TransactionController@deleteTransaction');
        //Discount
        Route::get('/discount', function () {
            return view('welcome');
        });
        Route::get('/discount/get', 'DiscountController@getDiscount');
        Route::post('/discount/create', 'DiscountController@createDiscount');
        Route::post('/discount/edit', 'DiscountController@editDiscount');
        Route::post('/discount/delete', 'DiscountController@deleteDiscount');

        Route::get('/discount/generate', 'DiscountController@generateDiscount');
        Route::get('/discount/brief', 'DiscountController@briefDiscount');
        Route::get('/discount/id', 'DiscountController@id');

        Route::get('/discount/all', 'DiscountController@allDiscount');
        Route::get('/discount/gen/{class_id}', 'DiscountController@generateDiscountClass');
        //Paper 
        Route::get('/payment', function () {
            return view('welcome');
        });
        Route::post('/payment/get', 'PaperController@getPayment');
        Route::post('/payment/create', 'PaperController@createPayment');
        Route::post('/payment/edit', 'PaperController@editPayment');
        Route::post('/payment/add-transaction', 'PaperController@addPaymentTransaction');
        Route::post('/payment/delete', 'PaperController@deletePayment');

        //Receipt 
        Route::get('/receipt', function () {
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
        Route::get('/fee', function () {
            return view('welcome');
        });
        Route::post('/fee/gather', 'StudentController@gatherFee');
        Route::post('/fee/normalize', 'StudentController@normalizeFee');
        Route::post('/fee/send-email', 'StudentController@sendEmail');
        Route::post('/fee/print', 'StudentController@printFee');

        //Bao cao tai chinh 
        Route::get('/report/financial', function () {

            return view('welcome');
        });
        Route::get('/report/get-financial', 'ReportController@getFinancial');
        Route::get('/report/revenue', function () {
            return view('welcome');
        });
        Route::post('/report/get-revenue', 'ReportController@getRevenue');

        Route::get('/report/generate-revenue', 'ReportController@generateRevenue');
        Route::get('/report/delete-transaction', 'ReportController@deleteTransaction');
        //Bao cao dong tien
        Route::get('/report/cf', function () {
            return view('welcome');
        });
        Route::post('/report/cash-flow', 'ReportController@cashFlow');
        //so quy tien mat
        Route::get('/report/book', function () {
            return view('welcome');
        });
        Route::post('/report/cash-book', 'ReportController@cashBook');

        Route::get('/admin/dt', function () {
            return redirect('/report/revenue');
        });
        Route::get('/transaction/center', 'ReportController@fillCenter');
        //Events


        // check complete
        Route::get('check-complete/{quiz_id}', 'AttemptDetailController@checkComplete');
    });
    //Password Change
    //Import database 
    // Route::get('/import-db', 'ClassController@importDB');
    Route::get('/get-schools', 'ClassController@getSchool');

    //USER PROFILE

    Route::get(
        '/account',
        function () {
            return view('welcome');
        }
    );
    Route::get('/user', 'UserController@getUser');
    Route::post('/user/uploadAvatar', 'UserController@updateAvatar');
    Route::post('/user/update-profile', 'UserController@updateProfile');
    Route::post('/user/password', 'UserController@updatePassword');
    Route::get('/user/get-year', 'UserController@getYear');
    Route::post('/user/change-year', 'UserController@changeYear');
    Route::post('/user/class-permission', 'UserController@PermissionClass');
    Route::get('/settings', function () {
        return view('welcome');
    });


    //Class Management
    Route::get('/classes', function () {
        return view('welcome');
    });
    Route::get('/class/get/{center_id}/{course_id}', 'ClassController@getClass');
    Route::get('/class/get-all/{center_id}/{course_id}', 'ClassController@getAllClass');
    Route::post('/class/create', 'ClassController@createClass');
    Route::post('/class/edit', 'ClassController@editClass');
    Route::post('/class/deactive', 'ClassController@deactiveClass');
    Route::post('/class/delete', 'ClassController@deleteClass');
    Route::get('/class/:id', function () {
        return view('welcome');
    });
    //a

    Route::post('/class/report', 'ClassController@getReport');
    Route::post('/score/report', 'ClassController@getScoreReport');
    Route::get('/class/{class_id}', 'ClassController@detailClass');
    Route::post('/class/student', 'ClassController@detailStudentClass');
    Route::post('/class/find', 'ClassController@findClass');
    Route::get('/class/getbyid/{class_id}', 'ClassController@getClassById');
    Route::post('/class/add-student', 'ClassController@addStudentToClass');
    Route::post('/class/edit-student', 'ClassController@editStudentInClass');
    Route::post('/class/transfer-students', 'ClassController@transferStudents');
    Route::post('/class/drop-students', 'ClassController@dropStudents');

    Route::post('/class/active-student', 'ClassController@getActiveStudent');

    Route::post('/class/delete-student', 'ClassController@deleteStudent');
    Route::get('/center/report/{id}', 'ClassController@getCenterReport');


    //Student
    Route::post('/student/create', 'StudentController@createStudent');
    Route::get('/student/find/{key}', 'StudentController@findStudents');
    Route::post('/student/get', 'StudentController@getStudents');
    Route::get('/student/{id}', 'StudentController@getStudent');
    Route::post('/student/get-id', 'StudentController@getStudentById');
    Route::post('/student/save', 'StudentController@saveStudent');
    Route::post('/student/get-class', 'StudentController@getClass');
    Route::post('/student/uploadAvatar', 'StudentController@uploadAvatar');
    Route::get('/student/remove/{id}', 'StudentController@removeStudent');
    // Route::get('/student/import', 'StudentController@importStudent');
    //MISA
    Route::get('/misa', function () {
        return view('welcome');
    });
    Route::get('/misa/student', 'StudentController@misaUpload');
    Route::get('/misa/class', 'ClassController@misaUpload');

    Route::post('/misa/order', 'TransactionController@misaUploadOrder');

    Route::post('/misa/receipt/tm', 'PaperController@misaUploadReceiptTM');
    Route::post('/misa/receipt/nh', 'PaperController@misaUploadReceiptNH');

    Route::post('/misa/payment/tm', 'PaperController@misaUploadPaymentTM');
    Route::post('/misa/payment/nh', 'PaperController@misaUploadPaymentNH');

    Route::post('/misa/revenue', 'TransactionController@misaUploadRevenue');

    Route::post('/financial/revenue', 'TransactionController@FinancialRevenue');
    Route::post('/financial/liabilities', 'TransactionController@FinancialLia');
    Route::get('/financial/normalize', 'TransactionController@normalizeHP');
    //Parent
    Route::post('/parent/create', 'ParentController@createParent');
    Route::get('/parent/find/{key}', 'ParentController@findParent');
    //Session
    Route::post('/session/get-last', 'SessionController@getLastSession');
    Route::post('/session/get', 'SessionController@getSession');
    Route::post('/session/get-dashboard', 'SessionController@getDashboard');
    Route::post('/session/create', 'SessionController@createSession');
    Route::post('/session/delete', 'SessionController@deleteSession');
    Route::post('/session/edit', 'SessionController@editSession');
    Route::post('/session/add', 'SessionController@addSession');
    Route::post('/session/check-date', 'SessionController@checkDate');

    Route::post('/session/lock', 'SessionController@lockSession');
    Route::post('/session/unlock', 'SessionController@unlockSession');

    //Attendance
    Route::get('/attendance', function () {
        return view('welcome');
    });
    Route::post('/attendance/get', 'AttendanceController@getAttendance');
    Route::post('/attendance/edit', 'AttendanceController@editAttendance');
    Route::post('/attendance/cell-edit', 'AttendanceController@cellEdit');
    //Email
    Route::get('/send', 'StudentController@testMail');
    Route::post('/attendance/send-email', 'AttendanceController@sendEmail');
    Route::get('/e', function () {
        return view('emails.thht');
    });
    //Math 
    Route::get('/documents', function () {
        return view('welcome');
    });
    Route::post('/documents/create', 'DocumentController@create');
    Route::post('/documents/edit', 'DocumentController@edit');
    Route::post('/documents/delete', 'DocumentController@delete');
    Route::post('/documents/get', 'DocumentController@get');
    Route::post('/documents/bulk-create', 'DocumentController@bulkCreate');
    Route::post('/documents/confirm', 'DocumentController@confirm');
    Route::post('/documents/report', 'DocumentController@report');
    //Danh sach hoc sinh
    // Route::get('/student/list', 'ClassController@listStudent');
    // Route::get('/teacher/list', 'ClassController@listTeacher');
    Route::get('/tkb', 'ClassController@tkb');


    //LMS 
    Route::get('/khoa-hoc', function () {
        return view('welcome');
    });
    Route::get('/khoa-hoc/{id}',  function () {
        return view('welcome');
    });
    Route::post('/syllabus/get', 'SyllabusController@getSyllabus');
    Route::post('/syllabus/list', 'SyllabusController@listSyllabus');
    Route::post('/syllabus/create', 'SyllabusController@createSyllabus');
    Route::post('/syllabus/edit', 'SyllabusController@editSyllabus');

    Route::post('/syllabus/delete-chapter', 'SyllabusController@deleteChapter');
    Route::post('/chapter/delete-subject', 'SyllabusController@deleteSubject');
    Route::post('/subject/delete-topic', 'SyllabusController@deletetopic');
    // Route::post('/subject/')
    Route::get('/cau-hoi/tao-moi', function () {
        return view('welcome');
    });
    Route::post('/question/fetch-syllabus', 'SyllabusController@fetchSyllabus');
    Route::post('/question/get-single', 'QuestionController@getSingle');
    Route::post('/question/fetch-topic', 'SyllabusController@fetchTopic');
    Route::post('/question/filter', 'QuestionController@filter');
    Route::post('/question/create', 'QuestionController@create');
    Route::post('/question/edit', 'QuestionController@edit');
    Route::get('/cau-hoi/sua/{id}', function () {
        return view('welcome');
    });
    Route::get('/cau-hoi', function () {
        return view('welcome');
    });
    Route::post('/question/deactive', 'QuestionController@deactive');
    Route::post('/questions', 'QuestionController@get');
    Route::post('/attempt/upload-correction', [QuizController::class, 'correction']);

    //Quizz Config
    Route::get('/quiz-config', function () {
        return view('welcome');
    });
    Route::get('/quiz-config/get', 'QuizConfigController@get');
    Route::post('/quiz-config/get-id', 'QuizConfigController@getId');

    Route::get('/quiz-config/{id}', function () {
        return view('welcome');
    });
    Route::post('/quiz-config', 'QuizConfigController@create');
    Route::post('/quiz-config/edit', 'QuizConfigController@edit');

    Route::get('/cau-hinh-cau-hoi', function () {
        return view('welcome');
    });

    Route::post('/generate-quiz', 'QuizController@generateQuiz');
    Route::get('/gen-quiz', 'QuizController@genQuiz');
    // Route::get('/sub5', 'ClassController@subscribe');
    Route::get('/genSyllabus', 'SyllabusController@genSyllabus');
    Route::get('demo-question', [QuizController::class, 'configuration']);
    // Route::get('auto-config/{objective_id}/{toan}/{van}/{anh}', [QuizConfigController::class, 'autoConfig']);
    // Route::get('auto-config/{tva}', [QuizConfigController::class, 'autoConfigk9']);
    // Route::get('/quiz-k9', 'QuizController@genQuizNine');
    Route::get('/check-attempt', 'QuizController@checkAttempt');
    Route::get('/mark/{id}', function () {
        return view('welcome');
    });
});
//EVENT PUBLIC
Route::get('/event-table/{event_code}', 'SessionController@getProductTable');
Route::get('/school/find/{key}', 'StudentController@findSchools');
Route::get('/event-get-public', 'ClassController@getEventInfo');
Route::get('/event-get-location', 'ClassController@getLocationInfo');
Route::post('/event-get-product', 'SessionController@getProductInfo');
Route::post('/check-phone', 'StudentController@checkPhone');
Route::post('/event/dang-ky', 'StudentController@registerEvent');
//
Route::post('/event/result', 'ClassController@getResult');
Route::post('/event/attempt', 'ClassController@getAttempt');
Route::post('/event/mark', 'ClassController@submitMark');
Route::get('/events/attempt-null', 'QuizController@attemptNull');
Route::get('/events/mark-mc', 'QuizController@markMc');
Route::get('/events/sum-score', 'QuizController@sumScores');
Route::get('/event-form', function () {
    return view('welcome');
});
Route::get('/event-tra-cuu', function () {
    return view('welcome');
});

Route::post('/event-get-result', 'StudentController@getResult');
// Route::post('/event-mail', )
Route::get('/home', 'HomeController@index')->name('home');
// Route::get('/test', function(){
//     return view('home');
// });
// Route::get('/testtime',function(){
//     echo date('Y:m:d H:i:m', strtotime('2020-06-15T03:23:20.775Z'));
// });
// Route::get('/ta/{email}', 'UserController@createNewTa');
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
// Route::get('/test-mautic', 'ParentController@testMautic');
// Route::get('/delete-student/{id}', 'StudentController@deleteId');
// Route::get('/count-event', 'SessionController@countEvent');
// Route::get('/move-file', 'SessionController@moveFiles');
// Route::get('/normalize-db','StudentController@normalizeDb');
// Route::get('/kq-tra-cuu', 'GuestController@ketqua');
// Route::get('test-email', 'JobController@processQueue');
// Route::get('/duration', 'SessionController@setDuration');
// Route::get('/ex-student/k9', 'StudentController@hsk9');
// Route::get('/tra-cuu', function(){
//     $phone = '';
//     $sbd = '';
//     $result = '';
//     return view('form-tra-cuu', compact(['result', 'phone', 'sbd']));
// });
// Route::post('/tra-cuu', 'GuestController@traCuu');
// Route::get('/import-tra-cuu', 'GuestController@importtc');

Route::get('search', [QuestionController::class, 'filter']);
Route::get('tong-diem', [QuizController::class, 'sumScore']);