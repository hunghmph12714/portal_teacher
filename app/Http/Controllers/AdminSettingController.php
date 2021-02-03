<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Relationship;
use App\Step;
use App\Role;
use App\User;
use App\Status;
use Spatie\Permission\Guard;
use App\Permission;
use Illuminate\Support\Str;
use Hash;
use Mail;
class AdminSettingController extends Controller
{
//Setting Relationship
    protected function getRelationship(){
        $relationships = Relationship::all();
        return response()->json($relationships);
    }
    protected function createRelationship(Request $request){
        $rules = [
            'name' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ',
        ];
        $this->validate($request, $rules, $message);

        $input = $request->toArray();
        $s = Relationship::create($input);
        return response()->json($s);
    }
    protected function editRelationship(Request $request){
        $rules = [            
            'id' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);

        $relationship = Relationship::find($request->id);
        if($relationship){
            $relationship->name = $request->newData['name'];
            $relationship->color = $request->newData['color'];
            $relationship->weight = $request->newData['weight'];
            $relationship->save();
        }
        else{
            return response()->json(422);
        }
        return response()->json(200);
    }
    protected function deleteRelationship(Request $request){
        $rules = [
            'id' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);

        $relationship = Relationship::find($request->id);
        if($relationship){
            $relationship->forceDelete();
        }
        else{
            return response()->json(422);
        }
        return response()->json(200);
    }
//Setting Step
    protected function getStep(Request $request){
        if($request->type == -1){
            $steps = Step::orderBy('type','asc')->orderBy('order','asc')->get()->toArray();
            return response()->json($steps);
        }
        else{
            $steps = Step::where('type', $request->type)->orderBy('order','asc')->get()->toArray();
            
            return response()->json($steps);
        }
        
    }
    protected function createStep(Request $request){
        $rules = [
            'name' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);
        $user = auth()->user();
        $input = $request->toArray();
        $input['user_created'] = $user->id;
        $s = Step::create($input);
        return response()->json($s);
    }
    protected function editStep(Request $request){
        $rules = [
            'id' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);        
        $step = Step::find($request->id);
        $request = $request->newData;
        if($step){
            $step->type = $request['type'];
            $step->order = $request['order'];
            $step->duration = $request['duration'];
            $step->document = ($request['document'])? $request['document'] : null;
            $step->name = $request['name'];
            $step->save();
        }
        else{
            return response()->json(422);
        }
        return response()->json(200);
    }
    protected function deleteStep(Request $request){
        $rules = [
            
            'id' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);

        $step = Step::find($request->id);
        if($step){
            $step->forceDelete();
        }
        else{
            return response()->json(422);
        }
        return response()->json(200);
    }
//Setting Roles
    protected function getRole(Request $request){
        if($request->type == -1){
            $roles = Role::all();
            $result = [];
            foreach($roles as $key => $role){
                $result[] = $role;
                $result[$key]['permissions'] = $role->permissions;
                
            }
            return response()->json($result);
        }
        else{
            $roles = Role::where('type', $request->name)->orderBy('order','asc')->get()->toArray();
            
            return response()->json($roles);
        }
    }
    protected function createRole(Request $request){
        $rules = [
            'name' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);
        // $user = auth()->user();
        $guard = Guard::getDefaultName(static::class);
        

        $input = $request->toArray();
        $input['guard_name'] = $guard;
        // $input['user_created'] = $user->id;
        $s = Role::create($input);
        return response()->json($s);
    }
    protected function editRole(Request $request){
        $rules = [
            'id' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);        
        $role = Role::find($request->id);
        $request = $request->newData;
        if($role){
            $role->department = $request['department'];
            $role->note = $request['note'];
            $role->name = $request['name'];
            $role->save();
        }
        else{
            return response()->json(422);
        }
        return response()->json(200);
    }
    protected function deleteRole(Request $request){
        $rules = [
            
            'id' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);

        $step = Role::find($request->id);
        if($step){
            $step->forceDelete();
        }
        else{
            return response()->json(422);
        }
        return response()->json(200);
    }
    protected function editRolePermission(Request $request){
        $rules = ['role_id' => 'required', 'permissions' => 'required'];
        $role = Role::find($request->role_id);
        // print_r($request->permissions);
        $selected_permission = [];
        foreach($request->permissions as $permission){
            foreach($permission as $p){
                foreach($p as $perm){
                    if(array_key_exists('checked', $perm)){
                        if($perm['checked']){
                            $selected_permission[] = $perm['id'];
                        }
                    }
                }
            }
        }
        $permissions = Permission::whereIn('id', $selected_permission)->get();
        // print_r($permissions->toArray());
        $role->syncPermissions($permissions);
        return response()->json('ok');
    }
//User Settings
    protected function getUser(){
        $all_user = User::all();
        $users = [];
        foreach($all_user as $key => $user){
            $user->dob = date('d/m/Y', strtotime($user->dob));
            $users[$key] = $user;
            $user_role = $user->roles()->first();
            if($user_role){
                
                $users[$key]['roles'] = $user_role->id;
                $users[$key]['department'] = $user_role->department;
            }else{
                $users[$key]['roles'] = '';
                $users[$key]['department'] = '';
            }
        }
        $roles = Role::orderBy('name')->get();
        $all_roles = [];
        foreach($roles as $role){
            $all_roles[$role->id] = $role->name;
        }
        return response()->json(['users' => $users, 'roles' => $all_roles]);
    }
    protected function createUser(Request $request){
        $rules = ['name' => 'required', 'email' => 'required', 'roles' => 'required'];
        $this->validate($request, $rules);

        $input['name'] = $request->name;
        $name = explode(' ', $request->name);
        $input['last_name'] = $name[0];
        $input['first_name'] = $name[sizeof($name) - 1];
        $input['email'] = $request->email;
        $input['email_verified_at'] = date("Y-m-d H:i:s");;
        $input['dob'] = ($request->dob)?date("Y-m-d", strtotime($request->dob)): NULL;
        $input['gender'] = $request->gender;
        $rand = Str::random(8);
        $input['password'] = Hash::make($rand);
        $user = User::create($input);
        
        $role = Role::find($request->roles);
        $user->assignRole($role);

        $result = $user->toArray();
        $result['roles'] = $user->roles()->first()->id;       


        //Mail cho nhan vien
        $datas['name'] = $user->name;
        $to_email = $user->email;
        $to_name = $user->name;
        $datas['email'] = $to_email;
        $datas['password'] = $rand;
        $datas['url'] = 'https://center.vietelite.edu.vn/login';
        $d = array('datas' => $datas);
        Mail::send('emails.settings.notify_email', $d, function($message) use ($to_name, $to_email, $datas) {
            $message->to($to_email, $to_name)
                    ->to('webmaster@vietelite.edu.vn')
                    ->subject('[VIETELITE] THÔNG TIN ĐĂNG NHẬP CENTER');
            $message->from('info@vietelite.edu.vn','VIETELITE EDUCATION CENTER');
        });

        return response()->json($result);
    }
    protected function editUser(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $user = User::find($request->id);
        if($user){
            $data = $request->newData;
            $user->name = $data['name'];
            $user->dob = $data['dob']?date('Y-m-d', strtotime($data['dob'])) : NULL;
            $user->email = $data['email'];
            $user->gender = $data['gender'];
            $role = Role::find($data['roles']);
            $user->save();
            $user->syncRoles($role);
        }
        return response()->json(200);
    }
//Permission settings
    protected function getPermission(Request $request){
        $permissions = Permission::all()->toArray();
        
        $result = [];
        $checked_result = [];
        $key = 0;
        foreach($permissions as $permission){
            if(array_key_exists($permission['subject'], $checked_result)){
                $result[$checked_result[$permission['subject']]][$permission['subject']][] = $permission;
            }else{
                $result[][$permission['subject']][0] = $permission;
                $checked_result[$permission['subject']] = $key;
                $key++;
            }
        }
        return response()->json($result);
    }
//Setting Status
    protected function getStatus(Request $request){
        if($request->type == -1){
            $s = Status::orderBy('type','asc')->get()->toArray();
            return response()->json($s);
        }
        else{
            $s = Status::where('type', $request->type)->get()->toArray();
            return response()->json($s);
        }
    }
    protected function createStatus(Request $request){
        $rules = [
            'name' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);
        $input = $request->toArray();
        $user = auth()->user();
        $input['user_created'] = $user->id;
        $s = Status::create($input);
        return response()->json($s);
    }
    protected function editStatus(Request $request){
        $rules = [
            'id' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);
        $request = $request->newData;
        $status = Status::find($request->id);
        if($status){
            $status->type = $request['type'];            
            $status->name = $request['name'];
            $status->save();
        }
        else{
            return response()->json(422);
        }
        return response()->json(200);
    }
    protected function deleteStatus(Request $request){
        $rules = [
            
            'id' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);

        $status = Status::find($request->id);
        if($status){
            $status->forceDelete();
        }
        else{
            return response()->json(422);
        }
        return response()->json(200);
    }
}
