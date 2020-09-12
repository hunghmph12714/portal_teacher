<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use Hash;
use App\User;
class UserController extends Controller
{
    //
    protected function createTa(){
        $ta = ['vietha131298@gmail.com','lvd28102001@gmail.com','hoangtuannghiahn@gmail.com','tungdohp98@gmail.com','hathu070401@gmail.com','maintt240@gmail.com','minh1998yc@gmail.com','lycandylee4@gmail.com','linhseo2000@gmail.com','nguyenhue2112000@gmail.com','hongngo1404@gmail.com','tdnam1807@gmail.com','phungdieulinh198@gmail.com','linhnguyencp129@gmail.com','dothachthao26598@gmail.com','nguyenthingochnue@gmail.com','dangquynh230299@gmai.com','nguyenthengocphuong@gmail.com','thanhhanghnuek68@gmail.com','tranthiphuongthao1601@gmail.com','nguyenkhanhly18112000@gmail.com'];
$name = ['Nguyễn Việt Hà','Lê Việt Đức',
'Hoàng Tuấn Nghĩa',
'Đỗ Trung Tùng',
'Trần Thị Thu Hà',
'Nguyễn Thị Thanh Mai',
'Trần Tân Minh',
'Đoàn Thị Khánh Ly',
'Đàm Huyền Linh',
'Nguyễn Thị Huế',
'Ngô Thị Ánh Hồng',
'Trịnh Đức Nam',
'Phùng Diệu Linh',
'Nguyễn Thị Diệp Linh',
'Đỗ Thạch Thảo',
'Nguyễn Thị Ngọc',
'Đặng Thị Quỳnh',
'Nguyễn Thế Ngọc Phượng',
'Nguyễn Thị Thanh Hằng',
'Trần Thị Phương Thảo',
'Nguyễn Thị Khánh Ly'];

        foreach($ta as $key => $t){
            $input['email'] = $t;
            $input['password'] = Hash::make('12345Bay');
            
            $name_arr = explode(' ', $name[$key]);
            $input['first_name'] = $name_arr[0];
            $input['last_name'] = end($name_arr);
            $input['name'] = $name[$key];
            User::create($input);
        }


    }
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
    protected function createNewTa($email){
        $input['email'] = $email;
        $input['password'] = Hash::make('12345Bay');
        
        
        $input['first_name'] = 'Trợ';
        $input['last_name'] = 'Giảng';
        $input['name'] ='';
        User::create($input);
        return response()->json('ok');
    }
}
