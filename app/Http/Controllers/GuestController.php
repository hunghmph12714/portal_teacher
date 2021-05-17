<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Schools;
use App\Center;
use App\Course;
use App\Parents;
use App\Student;
use App\Entrance;
use App\Relationship;
use App\Step;
use App\Status;
use App\Source;
use App\Medium;
use Illuminate\Support\Facades\Http;
use GuzzleHttp;

class GuestController extends Controller
{
    //
    public function testContact(){
        $students = Student::all();
        $url = "https://vietelite.bitrix24.com/rest/5/qi82s82j7jkk1uft/crm.contact.add.json?";
        $param = "ID=John&Họ tên HS=Smith&Ngày sinh=mail@example.com&Trường=WORK&Họ tên PH=555888&Phone=WORK&Email=&Phone 2=&Email 2=&NEW_PARAM=";
        $client = new GuzzleHttp\Client();
        $res = $client->get('https://vietelite.bitrix24.com/rest/5/qi82s82j7jkk1uft/crm.contact.add.json?ID=John&Họ tên HS=Smith&Ngày sinh=mail@example.com&Trường=WORK&Họ tên PH=555888&Phone=WORK&Email=&Phone 2=&Email 2=&NEW_PARAM=');
        echo $res->getStatusCode(); // 200
        echo $res->getBody();

    }
    public function formPublic(){
        // print_r($_SERVER['HTTP_REFERER']);
        $schools = Schools::Select('name')->get()->toArray();
        $schools = array_column($schools, 'name');
        $centers = Center::Select('name','id')->where('name','!=', 'VietElite Trụ sở điều hành')->get()->toArray();
        $arr = explode('/', $_SERVER['HTTP_REFERER']);
        $selected_grade = '';
        if(sizeof($arr) >= 4){
            switch ($arr[3]) {
                case 'tuyen-sinh-khoi-lop-3':
                    # code...
                    $selected_grade = '3';
                    break;
                
                case 'tuyen-sinh-khoi-lop-4':
                    # code...
                    $selected_grade = '4';
                    break;
                
                case 'tuyen-sinh-khoi-lop-5':
                    # code...
                    $selected_grade = '5';
                    break;
                
                case 'tuyen-sinh-khoi-lop-6':
                    # code...
                    $selected_grade = '6';
                    break;
                
                case 'tuyen-sinh-khoi-lop-7':
                    # code...
                    $selected_grade = '7';
                    break;
                
                case 'tuyen-sinh-khoi-lop-8':
                    # code...
                    $selected_grade = '8';
                    break;
                
                case 'tuyen-sinh-khoi-lop-9':
                    # code...
                    $selected_grade = '9';
                    break;
                
                case 'tuyen-sinh-khoi-lop-10':
                    # code...
                    $selected_grade = '10';
                    break;
                
                case 'tuyen-sinh-khoi-lop-11':
                    # code...
                    $selected_grade = '11';
                    break;
                case 'tuyen-sinh-khoi-lop-12':
                    # code...
                    $selected_grade = '12';
                    break;
                
                default:
                    # code...
                    break;
            }
        }
        // return $schools;
        return view('form-public', compact('schools','centers', 'selected_grade'));
    }
    public function formPublicSimplified(){
        $centers = Center::Select('name','id')->where('name','!=', 'VietElite Trụ sở điều hành')->get()->toArray();
        // return $schools;
        return view('form-public-simplified', compact('centers'));
    }
    
    public function getCourses(Request $request){
        $courses = Course::select('name','id','grade','domain')->where('grade', $request->grade)->where('showable',1)->get()->toArray();
        $result = [];
        foreach($courses as $key => $c){
            if(!array_key_exists($c['domain'], $result)){
                $result[$c['domain']] = [['id' => $c['id'], 'name' => $c['name'] . ' '. $c['grade']]];
            }else{
                $result[$c['domain']][] =  ['id' => $c['id'], 'name' => $c['name'] . ' '. $c['grade']];
            }
            // $courses[$key]['name'] = $c['name'] . ' '. $c['grade'];
        }
        return response()->json($result);
    }
    public function createEntrance($student, $center, $course, $note,  $source){
        $e['student_id'] = $student->id;
        $e['center_id'] = $center;
        $e['course_id'] = $course;
        $e['note'] = $note;
        $e['priority'] = Relationship::find($student->relationship_id)->weight;
        $init_step = Step::where('type','Quy trình đầu vào')->orderBy('order','asc')->first();
        
        // Check source
        $source_id = 1;
        $medium_id = 1;
        if($source['utm_source'] != ""){
            $utm_source = Source::where('campaign_id', '1')->where('name', $source['utm_source'])->first();
            if($utm_source){
                $source_id = $utm_source->id;
                //Check medium
                $utm_medium = Medium::where('source_id', $utm_source->id)->where('name', $source['utm_medium'])->first();
                if($utm_medium){
                    $medium_id = $utm_medium->id;
                }else{
                    $medium = Medium::create(['source_id' => $utm_source->id, 'name' => $source['utm_medium']]);
                    $medium_id = $medium->id;
                }   
            }else{
                $source = Source::create(['campaign_id' => 1, 'name' => $source['utm_source']]);
                $medium = Medium::create(['source_id' => $source->id, 'name' => $source['utm_medium']]);
                $source_id = $source->id;
                $medium_id = $medium->id;
            }
        }
        $e['source_id'] = $source_id; $e['medium_id'] = $medium_id;
        if($course){
            $e['step_id'] = 2;
        }else{
            $e['step_id'] = ($init_step->id) ? $init_step->id : null;
        }
        $e['step_updated_at'] = date("Y-m-d H:i:s");
        $init_status = Status::where('type', 'Quy trình đầu vào')->orderBy('id', 'asc')->first();
        $e['status_id'] = ($init_status->id) ? $init_status->id : null;
        Entrance::create($e);
    }
    public function handleForm(Request $request){
        $rules = [
            'pname' => 'required|string', 'sname'=>'required|string', 'pphone' => 'required|string', 'pemail'=> 'required|string'
        ];
        $this->validate($request, $rules);
        //Check nguồn dữ liệu
        $query = ['utm_medium' => '', 'utm_source'=>'', 'utm_campaign'=>''];
        // $url = parse_url($request->url);
        // if(array_key_exists('query',$url)){
        //     parse_str($url['query'], $query);
        // }
        // if(array_key_exists('utm_campaign', $query)){
        //     $source = ($query['utm_campaign'] == "") ? '' : $query['utm_campaign'] . " | ". $query['utm_source'] . " | " . $query['utm_medium'];
        // }else{
        //     $query = ['utm_medium' => '', 'utm_source'=>'', 'utm_campaign'=>''];
        // }
        //chuẩn hóa dữ liệu
        $pphone = str_replace('(','', str_replace(')','', str_replace('-','',$request->pphone)));
        $dob = date('Y-m-d', strtotime(str_replace('/','-', $request->dob)));

        //Check dữ liệu phụ huynh
        $p = Parents::where('phone', $pphone)->orWhere('alt_phone', $pphone)->first();
        if($p){// Phụ huynh đã tồn tại trong csdl
            //Check học sinh
            $s = Student::where('fullname', $request->sname)->where('dob', $dob)->first();
            if($s){//Đã tồn tại học sinh
                //Tạo mới ghi danh
                foreach($request->course as $c){
                    $this->createEntrance($s, $request->center, $c, $request->note, $query);
                }                
            }
            else{
                $student['fullname'] = $request->sname;
                $student['parent_id'] = $p->id;
                $student['dob'] = $dob;
                $student['school'] = $request->school;
                $student['relationship_id'] = $p->relationship_id;
                $student = Student::create($student);
                foreach($request->course as $c){
                    $this->createEntrance($student, $request->center, $c, $request->note,  $query);
                } 
            }
        }else{
            $relationship = Relationship::orderBy('weight', 'asc')->first();          
            $parent['fullname'] = $request->pname;
            $parent['phone'] = $pphone;
            $parent['email'] = $request->pemail;
            $parent['relationship_id'] = $relationship->id;
            $parent = Parents::create($parent);

            $student['fullname'] = $request->sname;
            $student['dob'] = $dob;
            $student['school'] = $request->school;
            $student['parent_id'] = $parent->id;
            $student['relationship_id'] = $relationship->id;
            $student = Student::create($student);

            foreach($request->course as $c){
                $this->createEntrance($student, $request->center, $c, $request->note,  $query);
            } 
        }
        return redirect('https://vietelite.edu.vn/dangkythanhcong/');
        // return response()->json($request->toArray());
    }
    public function handleSimplifiedForm(Request $request){
        $rules = [
            'sname' => 'required',
            'dob' => 'required',
            'pphone' => 'required',
            'pemail' => 'required',
            'g-recaptcha-response' => 'required|captcha'
        ];
        $messages = [
            'g-recaptcha-response.required' => 'Vui lòng xác nhận bạn không phải ROBOT'
        ];
        $this->validate($request, $rules, $messages);
        //Source query
        $query = ['utm_medium' => '', 'utm_source'=>'', 'utm_campaign'=>''];
        $url = parse_url($request->url);
        if(array_key_exists('query',$url)){
            parse_str($url['query'], $query);
        }
        //chuẩn hóa dữ liệu
        $pphone = str_replace('(','', str_replace(')','', str_replace('-','',$request->pphone)));
        $dob = date('Y-m-d', strtotime(str_replace('/','-', $request->dob)));

        //Check dữ liệu phụ huynh
        $p = Parents::where('phone', $pphone)->orWhere('alt_phone', $pphone)->first();
        if($p){// Phụ huynh đã tồn tại trong csdl
            //Check học sinh
            $s = Student::where('fullname', $request->sname)->where('dob', $dob)->first();
            if($s){//Đã tồn tại học sinh
                //Tạo mới ghi danh
                $this->createEntrance($s, $request->center, NULL, $request->note, $query);              
            }
            else{
                $student['fullname'] = $request->sname;
                $student['parent_id'] = $p->id;
                $student['dob'] = $dob;
                $student['school'] = $request->school;
                $student['relationship_id'] = $p->relationship_id;
                $student = Student::create($student);
                $this->createEntrance($student, $request->center, NULL, $request->note, $query);
            }
        }else{
            $relationship = Relationship::orderBy('weight', 'asc')->first();          
            $parent['fullname'] = $request->pname;
            $parent['phone'] = $pphone;
            $parent['email'] = $request->pemail;
            $parent['relationship_id'] = $relationship->id;
            $parent = Parents::create($parent);

            $student['fullname'] = $request->sname;
            $student['dob'] = $dob;
            $student['school'] = $request->school;
            $student['parent_id'] = $parent->id;
            $student['relationship_id'] = $relationship->id;
            $student = Student::create($student);
            $this->createEntrance($student, $request->center, NULL, $request->note, $query);
        }
        return redirect('https://vietelite.edu.vn/dangkythanhcong/');

    }
}
