<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Support\Facades\Mail as FacadesMail;
use Mail;
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
        $model = Teacher::find($id);
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
        $model = User::find($id);
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
    public function teacher_class($teacher)

    {
        # code...
    }
}
