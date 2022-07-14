<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use Hash;
use App\User;
use Illuminate\Support\Facades\Http;

class UserController extends Controller
{
    //
    protected function createTa()
    {
        $ta = ['vietha131298@gmail.com', 'lvd28102001@gmail.com', 'hoangtuannghiahn@gmail.com', 'tungdohp98@gmail.com', 'hathu070401@gmail.com', 'maintt240@gmail.com', 'minh1998yc@gmail.com', 'lycandylee4@gmail.com', 'linhseo2000@gmail.com', 'nguyenhue2112000@gmail.com', 'hongngo1404@gmail.com', 'tdnam1807@gmail.com', 'phungdieulinh198@gmail.com', 'linhnguyencp129@gmail.com', 'dothachthao26598@gmail.com', 'nguyenthingochnue@gmail.com', 'dangquynh230299@gmai.com', 'nguyenthengocphuong@gmail.com', 'thanhhanghnuek68@gmail.com', 'tranthiphuongthao1601@gmail.com', 'nguyenkhanhly18112000@gmail.com'];
        $name = [
            'Nguyễn Việt Hà', 'Lê Việt Đức',
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
            'Nguyễn Thị Khánh Ly'
        ];

        foreach ($ta as $key => $t) {
            $input['email'] = $t;
            $input['password'] = Hash::make('12345Bay');

            $name_arr = explode(' ', $name[$key]);
            $input['first_name'] = $name_arr[0];
            $input['last_name'] = end($name_arr);
            $input['name'] = $name[$key];
            User::create($input);
        }
    }
    protected function checkAuth()
    {
        if (Auth::check()) {
            $user = auth()->user();
            $permissions = $user->getAllPermissions();
            $rules = [];
            foreach ($permissions as $p) {
                $rules[] = [
                    'action' => $p->name,
                    'subject' => $p->subject
                ];
            }
            return response()->json([
                'auth' => true,
                'user' => $user,
                'role' => $user->getRoleNames(),
                'ability' => $user->ability(),
                'rules' => $rules
            ]);
        } else return response()->json(['auth' => false]);
    }
    function createUser()
    {
        $input['email'] = 'admin@vee.edu.vn';
        $input['password'] = Hash::make('abc123');
        $input['name'] = 'admin';
        $input['isVerified'] = 1;
        User::create($input);
        return 'true';
    }
    protected function getUser()
    {
        $user = auth()->user();
        return response()->json($user);
    }
    protected function updateAvatar(Request $request)
    {
        $rules = [
            "croppedImage" => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:4096']
        ];
        $messages = [
            "required" => "Vui lòng tải ảnh",
            "image" => "Chỉ chấp nhận ảnh",
            "mimes" => "Chỉ chấp nhận định dạng jpeg, png, jpg, gif",
            "max:4096" => "Tối đa 4Mb"
        ];
        $this->validate($request, $rules, $messages);

        $user = auth()->user();
        if (strpos($user->avatar, "/public/images/avatars") !== false) {
            $old_avatar_file = ($user->avatar) ? explode('/', $user->avatar)[4] : "";
            // print_r($old_avatar_file);
            if (\File::exists(public_path() . "/images/avatars/" . $old_avatar_file)) {
                \File::delete(public_path() . "/images/avatars/" . $old_avatar_file);
            }
        }

        if ($request->has('croppedImage')) {
            $avatar = $request->file('croppedImage');
            $name = $user->id . "_" . time();
            $avatar->move(public_path() . "/images/avatars/", $name . ".jpeg");
            $user->avatar = "/public/images/avatars/" . $name . ".jpeg";
            $user->save();
        }
        return response()->json($user);
    }
    protected function updateProfile(Request $request)
    {
        $user = auth()->user();
        if ($user) {
            $user->first_name = $request->first_name;
            $user->last_name = $request->last_name;
            $user->email = $request->email;
            $user->phone = $request->phone;
            $user->address = $request->address;
            $user->gender = $request->gender;
            $user->dob = $request->dob;
            $jsDateTS = strtotime($request->dob . " +1 days");
            if ($jsDateTS !== false)
                $user->dob =  date('Y-m-d', $jsDateTS);
            else
                $user->dob = null;
            $user->save();
            return response()->json($user);
        }
    }
    protected function updatePassword(Request $request)
    {
        $rules = [
            'current_password' => 'required',
            'password' => 'required|same:password',
            'confirm' => 'required|same:password',
        ];
        $this->validate($request, $rules);
        $user = auth()->user();
        $current_password = $user->password;
        if (Hash::check($request->current_password, $current_password)) {
            $user->password = Hash::make($request->password);
            $user->save();
            return response()->json('ok', 200);
        } else {
            return response()->json('Sai mật khẩu', 400);
        }
    }
    protected function createNewTa($email)
    {
        $input['email'] = $email;
        $input['password'] = Hash::make('12345Bay');


        $input['first_name'] = 'Trợ';
        $input['last_name'] = 'Giảng';
        $input['name'] = '';
        User::create($input);
        return response()->json('ok');
    }
    protected function getYear()
    {
        $user = auth()->user()->wp_year;
        return response()->json($user);
    }
    protected function changeYear(Request $request)
    {
        $rules = ['year' => 'required'];
        $this->validate($request, $rules);

        $user = auth()->user();
        $user->wp_year = $request->year;
        $user->save();
        return response()->json('ok');
    }
    protected function PermissionClass(Request $request)
    {
        $rules = ['user_id' => 'required'];
        $this->validate($request, $rules);

        $class_ids = $request->selectedClasses ? array_column($request->selectedClasses, 'value') : [];
        print_r($request->user_id);
        $user = User::find($request->user_id);
        if ($user) {
            $user->classes()->sync($class_ids);
        }
    }

    public function sendSMS()
    {
        $sdt = '84949871388,84989555708,84902156626,84913397413,84983389989,84912599779,84985322489,84983499668,84902026805,84888961204,84912067430,84986354687,84965505088,84904334789,84917306268,84903409949,84985639084,84961863335,84989339973,84374649763,84912357305,84972995935,84912145977,84973745713,84947640845,84934663648,84912506650,84985504493,84985667563,84983191425,84989098887,84966653999,84906295056,84933339555,84988068067,84989987580,84942938383,84869528666,84912374471,84962141980,84989290210,84912444614,84903269116,84977709286,84904211755,84982031886,84912469341,84988717188,84912424632,84936368548,84912004008,84912212129,84852482007,84912932529,84903202266,84912291686,84983109368,84968566379';
        $sdt = explode(',', $sdt);
        foreach ($sdt as $key => $value) {
            # code...
            $phone = '+'.$value;
            $app_client = new \GuzzleHttp\Client();
            $url = "https://api.pushbullet.com/v2/ephemerals";

            $products_data = [
                'push' => [
                    "conversation_iden" => $phone,
                    "message" => "VietElite xac nhan thong tin dang ky tham du Gala “Shine Your Way 2022” cua Quy phu huynh. Su kien bat dau vao 8h30 ngay 10/7/2022 (Chu nhat), tai Hoi truong Tang 5, 101 Nguyen Chi Thanh, Dong Da, Ha Noi (truong DH Van Hoa-Nghe thuat Quan Doi). Tran trong kinh moi!",
                    "package_name" => "com.pushbullet.android",
                    "source_user_iden" => "ujximIlKHng",
                    "target_device_iden" => "ujximIlKHngsjBLri71GSq",
                    "type" => "messaging_extension_reply"
                ],  
                'type' => 'push'
            ];
            $header = [
                'Access-token' => 'o.CEv04POi3kdeCRC6oc5ih6lNPlbTLeZZ',
                'Content-Type' => 'application/json'
            ];
            // $r = $app_client->request('POST', $url, [
            //     'json' => $data,
            //     'headers' => ['Authorization' => 'Bearer ' . $token],
            // ]);
            $response = $app_client->request('POST', $url,  ['json' => $products_data, 'headers'=>$header]);

            // $response = Http::post('https://api.pushbullet.com/v2/ephemerals',);
            echo $phone.": ok <br>";
        }
        
    }
}
