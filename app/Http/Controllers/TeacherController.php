<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\Classes;
use App\Models\Session;
use App\Models\Student;
use App\Models\StudentClass;
use App\Models\StudentSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Support\Facades\Mail as FacadesMail;
use Mail;
use Str;
use Illuminate\Validation\Rule;
use PhpParser\Node\Expr\Cast\Object_;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        if ($request->system_teacher) {
            $model = Teacher::find($request->id);
            if ($request->system_teacher == 'false') {
                $model->system_teacher = 0;
                $model->first_password = null;
            } else {
                $str = Str::slug($model->name);
                $listStr = explode('-', $str);
                $name = end($listStr);
                // dd($listStr);
                foreach ($listStr as $v) {
                    if ($v !== end($listStr))  $name .= substr($v, 0, 1);
                }
                $model->referral_code = $name .    substr($model->phone, -3);

                $model->system_teacher = $request->system_teacher;
                $model->first_password = 'vee123';
                $data = [
                    'name' => $model->name,
                    'email' => $model->email,
                ];
                $email = $model->email;
                Mail::send('teachers.send_mail',  $data,  function ($message) use ($email) {
                    // dd($email);
                    $message->from('manhhung17062001@gmail.com', 'VietElite');
                    $message->to($email, 'VietElite');
                    $message->subject('Đăng ký thành viên hệ thống');
                    // $message->cc('john@johndoe.com', 'John Doe');
                    // $message->bcc('john@johndoe.com', 'John Doe');
                    // $message->replyTo('john@johndoe.com', 'John Doe');
                    // $message->priority(3);
                    // $message->attach('pathToFile');
                });
            }
            $model->password = null;
            $model->save();


            // dd($request);
        }
        $teachers = Teacher::all();
        return view('teachers.index', compact('teachers'));
    }


    public function editForm($id)
    {
        $teacher = Teacher::find($id);
        return view('teachers.edit', compact('teacher'));
    }
    public function saveEdit($id, Request $request)
    {
        if(!Auth::check()){
            return redirect(route('login'));
        }
        $request->validate(
            [
                'name' => 'required',
                'email' => [
                    'required', 'email',
                    Rule::unique('teacher')->ignore($id)

                ],
                'phone' => [
                    'required', 'digits:10',
                    Rule::unique('teacher')->ignore($id)

                ],
                'address' => 'required',
                'domain' => 'required'
            ],
            [
                'name.required' => 'Vui lòng nhập tên',
                'email.required' => 'Vui lòng nhập email',
                'email.email' => 'Vui lòng nhập email phù hợp',
                'email.unique' => 'Email đã tồn tại',
                'phone.required' => 'Vui lòng nhập số điện thoại',
                'phone.unique' => 'Số điện thoại đã tồn tại',
                'phone.digits' => 'Số điện thoại không hợp lệ',
                'address.required' => 'Vui lòng nhập địa chỉ',
                'domain.required' => 'Vui lòng nhập môn học',


            ]
        );
        $model = Teacher::find(Auth::id());
        // dd($model);
        $model->fill($request->all());
        $model->save();
        return redirect(route('teacher.index'));
    }
    public function updatePasswordForm($id)
    {
        // dd($id);
        return view('teachers.updatePassword');
    }
    public function updatePassword($id, Request $request)
    {
        // dd($_POST);
        // $user = auth()->user();
        $model = Teacher::find($id);
        $request->validate([
            'password' => 'required',
            'newpass' => 'required',
            'test_newpass' => 'required|same:newpass'
        ], [
            'password.required' => 'vui lòng nhập mật khẩu',
            'newpass.required' => 'Vui lòng nhập mật khẩu mới',
            'test_newpass.required' => 'Nhập lại mật khẩu mới',
            'test_newpass.same' => 'Mật khẩu chưa trùng khớp'
        ]);
        if ($model->first_password) {
            if (Hash::check($request->password, Hash::make($model->first_password))) {
                $model->password = Hash::make($request->newpass);
                $model->first_password = null;
                $model->save();
                return redirect('/logout');
            } else {
                return back()->with('msg', 'Mật khẩu bạn nhập chưa đúng');
            }
        } else {
            if (Hash::check($request->password, $model->password)) {
                $model->password = Hash::make($request->newpass);
                $model->first_password = null;
                $model->save();
                return redirect(route('teacher.index'));
            } else {
                return back()->with('msg', 'Mật khẩu bạn nhập chưa đúng 1');
            }
        }
    }





    public function teacherClass($id)
    {
        $day = date('w') - 1;
        $week_start = date('Y-m-d', strtotime('-' . $day . ' days'));
        $week_end = date('Y-m-d', strtotime('+' . (6 - $day) . ' days'));

        $sessions = Session::where('teacher_id', $id)->where('from', '>=', $week_start)->where('from', '<=', $week_end)
            ->select('classes.id as id', 'class_id', 'name', 'from', 'year', 'content', 'student_number')
            ->join('classes', 'class_id', 'classes.id')
            ->get()->toArray();

        $teacher = Teacher::find($id);
        return view('teachers.teacher_class', compact('sessions', 'teacher'));
    }

    // public function myClasses()
    // {
    //     $day = date('w') - 1;
    //     $week_start = date('Y-m-d', strtotime('-' . $day . ' days'));
    //     $week_end = date('Y-m-d', strtotime('+' . (6 - $day) . ' days'));

    //     $sessions = Session::where('teacher_id', Auth::user()->id)->where('from', '>=', $week_start)->where('from', '<=', $week_end)
    //         ->select('classes.id as id', 'class_id', 'name', 'from', 'year', 'content', 'student_number')
    //         ->join('classes', 'class_id', 'classes.id')
    //         ->get()->toArray();
    //     $teacher = Teacher::find(Auth::user()->id);
    //     return view('teachers.teacher_class', compact('sessions', 'teacher'));
    // }

    public function classStudent($class_id)
    {
        $class = Classes::find($class_id);
        $students = StudentClass::where('class_id', $class_id)
            ->select('students.id as id', 'class_id', 'fullname', 'phone', 'class_id')
            ->join('students', 'student_id', 'students.id')
            ->get();
        // dd($students);
        return view('students.student_class', compact('students', 'class'));
    }
    public  function formatName()
    {
        $str = Str::slug('hà mạnh hùng');
        $listStr = explode('-', $str);
        $name = end($listStr);
        foreach ($listStr as $v) {
            if ($v !== end($listStr)) $name .= substr($v, 0, 1);
        }
        return response()->json($name);
    }
    public function studentAttempt($student_id)
    {
        $student = Student::find($student_id);
        $attempts = StudentSession::where('student_session.student_id', $student_id)
            ->join('lms_attempts', 'student_session.id', 'lms_attempts.student_session')
            ->select('lms_attempts.id as id', 'title', 'score_domain_1', 'score_domain_2', 'score_domain_3', 'quizz_code', 'finish_time', 'start_time')
            ->join('lms_quizzes', 'lms_attempts.quiz_id', 'lms_quizzes.id')
            ->get();
        // dd($attempts);   
        return view('attempts.attempt', compact('attempts', 'student'));
    }
    public function classOnDay(Request $request)
    {
        $teacher = Teacher::where('phone', $request->phone)->first();

        if (!$teacher) {
            return back();
        }

        $day = date('Y-m-d');
        $sessions = Session::whereDate('from', $day)->where('teacher_id', $teacher->id)
            ->join('classes', 'sessions.class_id', 'classes.id')
            ->join('center', 'sessions.center_id', 'center.id')
            ->select('classes.code as class_code', 'classes.id as class_id', 'center.name as center_name', 'from', 'to', 'sessions.id as id', 'ss_number')
            ->get();
        return view('classes.classonday', compact('sessions', 'teacher'));
        // dd($sessions);

        //  dd($sessions);


    }

    public function studentsOnSession($session_id)
    {
        $session = Session::find($session_id)->load('classes');
// dd($session->classes()->first()->code);
        if ($session) {
            $students = $session->students()->get();

            // $students->load(['entrances' => function ($query, $class_id) {
            //     return $query->where('class_id', $class_id);
            // }]);
            // dd($session,$students,$students[0]->entrance(44,3608)->toSql());
            return view('classes.students_on_session',compact('students','session'));
            
        }
    }
}// thử xem b