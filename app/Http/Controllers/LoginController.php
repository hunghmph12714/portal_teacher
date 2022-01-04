<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Contracts\Session\Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
// use PharIo\Manifest\Email;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
            'password' => 'required',
            'g-recaptcha-response' => 'required|captcha'
        ], [
            'email.required' => 'Vui lòng nhập email',
            'email.exists' => 'Thông tin tài khoản không đúng',
            'password.required' => 'Vui lòng mật khẩu',
            'g-recaptcha-response.required' => "Vui lòng xác minh rằng bạn không phải là rô bốt.",
            'g-recaptcha-response.captcha' => 'Lỗi Captcha! hãy thử lại sau hoặc liên hệ với quản trị viên trang web. ',

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
            return redirect(route('teacher.class', ['id' => Auth::user()->id]));
        }
        return back()->with('message', 'Thông tin tài khoản không đúng hoặc tài khoản chưa được kích hoạt');
    }





    public function forgotPasswordForm()
    {
        return view('login.forgot_password');
    }
    public function forgotPasswordSend(Request $request)
    {
        // dd($request);
        $request->validate(
            [
                'email' => 'required|email'
            ],
            [
                'email.required' => 'Vui lòng nhập email',
                'email.email' => 'Vui lòng nhập đúng định dạng email',
                // 'email.unique' => 'Email không tồn tại trên hệ thống'
            ]
        );
        $teacher = Teacher::where('email', 'like', $request->email)->get();
        // dd($teacher);
        if (!$teacher) {
            return back()->with('msg', 'Tài khoản không đúng hoặc chưa được đăng ký');
        }
        if (isset($teacher)) {
            if ($teacher[0]->system_teacher == 1) {
                $data = [
                    'name' => $teacher[0]->name,
                    'email' => $teacher[0]->email
                ];


                Mail::send('login.mail_forgot_password',  $data,  function ($message) {
                    $message->from('manhhung17062001@gmail.com', 'VietElite');
                    $message->to('manhhung17062001@gmail.com', 'VietElite');
                    $message->subject('Yêu cầu lấy lại mật khẩu');
                });
                return view('login.forgot_password', [
                    'msg' => 'Yeu cầu lấy lại mât khẩu thành công'
                ]);
            }
        }
        return back()->with('msg', 'Tài khoản không đúng hoặc chưa được đăng ký');
    }

    public function formloginZalo()
    {
        $verify = 0;
        $phone = null;
        return view('login.login_zalo', compact('verify', 'phone'));
    }

    protected function loginZalo(Request $request)
    {

        $request->validate([
            'phone' => 'required',
            'g-recaptcha-response' => 'required|captcha'
        ], [
            'phone.required' => 'Bạn phải nhập số điện thoại',
            'g-recaptcha-response.required' => "Vui lòng xác minh rằng bạn không phải là rô bốt.",
            'g-recaptcha-response.captcha' => 'Lỗi Captcha! hãy thử lại sau hoặc liên hệ với quản trị viên trang web. ',
        ]);
        //Check phone number
        $teacher = Teacher::where('phone', $request->phone)->first();
        if ($teacher && $teacher->system_teacher == 1) {

            if (!isset($request->otp)) {
                // dd($request->otp);
                // $sent_at = strtotime($request->sent_at);
                // Check thời gian cooldown
                // if ($teacher->send_otp_at) {
                //     if ($sent_at - strtotime($teacher->send_otp_at) < 150) {
                //         return back()->with('msg', 'Mã OTP chưa hết hiệu lực');
                //     }
                // }
                //              Gửi otp

                $otp = rand(1000, 9999);
                $phone = $teacher->phone;
                if ($phone[0] == '0') {
                    $phone = substr($phone, 1);
                }
                $body = [
                    'phone' => '+84' . $phone,
                    'template_id' => '201881',
                    'template_data' => [
                        'otp' => $otp
                    ],
                    'tracking_id' => $teacher->id
                ];
                $response = Http::post(
                    'https://business.openapi.zalo.me/message/template?access_token=iKGMLgs70XEzHX9KfuO64RT06rIgcNr4q28h1f-7TqU36Jm9mBv85g888Yp7p5WyXNHG2UdvGnkNH1SEp-P7CuPI4pwOodnn-WuAJE6cI6kuPHTCoDbnNfH9DahwY4HEgoq9QyxjQsIhSWWZpUru08TlEKQVx5K8XqmlCVNqN2lbHHjic_TsI8jQPdRLrIfFoLXBRQo29own8N8nmViQDg1s2pN5p4eCdruvDFoVMGM_6Kf4puOrKP43IdVJi3r7kW5SGR-H4Ldj3G1dYerXFTit4Wp0Y0TBAFSbTwgT0XK',
                    $body
                );
                // $response->message
                if ($response->message = "Success") {
                    $teacher->otp = $otp;
                    // $teacher->sent_at = date('Y-m-d h:i:s', $sent_at);
                    $teacher->save();
                    // $verify = 1;
                    $phone = $teacher->phone;
                    return view('login.verify_otp', compact('phone'));
                }
            }
        } else {
            return back()->with('msg', 'Số điện thoại không có trong hệ thống');
        }
    }

    public function verifyOTP(Request $request)
    {
        $request->validate(
            ['otp' => 'required'],
            ['otp.required' => 'Vui lòng nhập mã OTP']
        );
        dd($request);
        $teacher = Teacher::where('phone', $request->phone)->first();
        // dd($teacher);
        if ($teacher->otp == $request->otp && $teacher->phone == $request->phone) {
            Auth::loginUsingId($teacher->id);
            // dd(Auth::user());
            return redirect(route('teacher.class', ['id' => Auth::user()->id]));
        } else {

            // dd(2);
            $verify = 1;
            return back()->with('msg', 'Mã otp hoặc số điện thoại không hợp lệ', compact('verify'));
        }
    }
}