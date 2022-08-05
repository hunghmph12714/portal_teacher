<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserLoginRegister;
use App\Http\Requests\UserRegister;
use App\Models\Teacher;
use App\Models\User;
use CreatePersonalAccessTokensTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function authDemo(UserLoginRegister $request)
    {
        $request->validated();
        // dd($request);
        return response()->json(['qf' => 'ưefawf'], 200);
    }
    public function register(UserRegister $request)
    {
        // dd($request);
        $teacher = Teacher::create($request->all());
        $teacher->password=Hash::make($request->password);
        $teacher->save();
        $token= $teacher->createToken('hung')->accessToken;
        return response()->json(['user'=>$teacher,'token'=>$token],200);  
    }
    public function login(UserLoginRegister $request)
    {
        if (Auth::attempt(['phone' => $request->phone, 'password' => $request->password])) {
            // $token=CreatePersonalAccessTokensTable
            return response()->json(Auth::user(), 200);
        }
        return response()->json(['loi' => "Khong dang nhap duoc"], 200,);
    }
    public function getMe()
    {
$user=auth()->user();
// return response()->json(['3r'=>'qừ'],200);
return response()->json($user,200);
    }
}
