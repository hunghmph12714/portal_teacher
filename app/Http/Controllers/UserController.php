<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use Hash;
use App\User;
class UserController extends Controller
{
    //
    protected function checkAuth(){
        if(Auth::check()){
            $user = auth()->user();
            return response()->json(['auth' => true, 'user' => $user]);
        }
        else return response()->json(['auth' => false]);
    }
    function createUser(){
        $input['email'] = 'admin@vee.edu.vn';
        $input['password'] = Hash::make('abc123');
        $input['name'] = 'admin';
        User::create($input);
        return 'true';
    }
    protected function getUser(){
        $user = auth()->user();
        return response()->json($user);
    }
    protected function updateAvatar(Request $request){
        $rules = [
            "croppedImage" => ['required', 'image','mimes:jpeg,png,jpg,gif', 'max:4096']
        ];
        $messages = [
            "required" => "Vui lòng tải ảnh",
            "image" => "Chỉ chấp nhận ảnh",
            "mimes" => "Chỉ chấp nhận định dạng jpeg, png, jpg, gif",
            "max:4096" => "Tối đa 4Mb"
        ];
        $this->validate($request, $rules, $messages);

        $user = auth()->user();
        if(strpos($user->avatar, "/public/images/avatars") !== false){
            $old_avatar_file = ($user->avatar)?explode('/', $user->avatar)[4]:"";
            // print_r($old_avatar_file);
            if(\File::exists(public_path()."/images/avatars/".$old_avatar_file)){
                \File::delete(public_path()."/images/avatars/".$old_avatar_file);
            }
        }
        
        if($request->has('croppedImage')){
            $avatar = $request->file('croppedImage');
            $name = $user->id."_".time();
            $avatar->move(public_path()."/images/avatars/", $name.".jpeg");
            $user->avatar = "/public/images/avatars/".$name.".jpeg";
            $user->save();
        }
        return response()->json($user);
    }
    protected function updateProfile(Request $request){
        $user = auth()->user();
        if($user){
            $user->first_name = $request->first_name;
            $user->last_name = $request->last_name;
            $user->email = $request->email;
            $user->phone = $request->phone;
            $user->address = $request->address;
            $user->gender = $request->gender;
            $user->dob = $request->dob; 
            $jsDateTS = strtotime($request->dob. " +1 days");
            if ($jsDateTS !== false) 
                $user->dob =  date('Y-m-d', $jsDateTS );
            else 
                $user->dob = null;
            $user->save();
            return response()->json($user);
        }
    }
    protected function updatePassword(Request $request){
        $rules = [
            'current_password' => 'required',
            'password' => 'required|same:password',
            'confirm' => 'required|same:password',
        ];
        $this->validate($request, $rules);
        $user = auth()->user();
        $current_password = $user->password;
        if(Hash::check($request->current_password, $current_password))
        {           
            $user->password = Hash::make($request->password);
            $user->save();
            return response()->json('ok', 200);
        }
        else
        {           
            return response()->json('Sai mật khẩu', 400);   
        }
    }
}
