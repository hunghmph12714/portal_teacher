<?php

namespace App\Http\Controllers\Auth;
use Illuminate\Http\Request;
use Auth;
use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */

    protected $redirectTo = '/';
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    public function authenticate(Request $request)
    {

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password,  'isVerified' => 1])) {
            // Authentication passed...
            return redirect()->intended('/');
        }else{
            return response()->json('Mật khẩu không đúng hoặc tài khoản chưa được kích hoạt', 401);
        }
    }
}
