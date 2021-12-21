<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function loginForm()
    {
        return view('login.login');
    }
    public function postLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:teacher',
            'password' => 'required'
        ], [
            'email.required' => 'Vui lồng nhập email',
            'email.exists' => 'Thông tin tài khoản không đúng',
            'password.required' => 'Vui lòng mật khẩu'
        ]);
        $email = $request->email;
        $password = $request->password;

        $teacher = Teacher::where('email', 'like', $email)->get();
        if ($teacher && $teacher[0]->first_password == $request->password  && $teacher[0]->system_teacher == 1) {
            // dd($teacher[0]->system_teacher);
            // con
            if ($teacher[0]->first_password == true) {
                // dd($teacher[0]->first_password);
                return redirect(route('teacher.updatePassword', ['id' => $teacher[0]->id]));
            }
            return back()->with('message', 'Thông tin tài khoản không đúng hoặc tài khoản chưa được kích hoạt');
        }





        if (Auth::attempt(['email' => $email, 'password' => $password, 'system_teacher' => 1], $remember = true)) {
            return redirect(route('home'));
        }
        return back()->with('message', 'Thông tin tài khoản không đúng hoặc tài khoản chưa được kích hoạt');
    }
}