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
use App\Tracuu;
use App\Question;
use App\Option;
use GuzzleHttp;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\EntranceExport;
use App\Exports\EntranceMktExport;
use App\Exports\EntranceSlExport;

// use App\Exports\EntranceSlExport;


class GuestController extends Controller
{
    //
    public function Ams($khoi, $id)
    {
        require_once('html_parser.php');
        // Create DOM from URL or file
        $html = file_get_html('http://teacher.vietelite.edu.vn/public/' . $khoi . '/' . $id . '.html', 'text/html');
        $opt = ['A', 'B', 'C', 'D'];
        // Find all images
        $k = 1;
        $answers = [];

        foreach ($html->find('#ctl00_ContentPlaceHolder1_ctl00_RadGrid1_ctl00 tbody tr') as  $element) {
            $question = [
                'grade' => $khoi,
                'domain' => 'Toán',
                'question_type' => 'mc',
                'content' => ''
            ];

            foreach ($element->find('.question .content') as $e) {
                echo "<hr>";
                echo '<b>Câu ' . $k . ': </b>' . $e . "<br>";
                $question['content'] = $e;
                echo "created question";
                $q = Question::create($question);
                $k++;
            }


            echo '<div style="margin-bottom: 25px;">';
            foreach ($element->find('.ans .content table tbody tr') as $cau => $a) {
                $options = [];
                foreach ($a->find('td') as $key => $ans) {
                    $options['question_id'] = $q->id;
                    if ($key == 0) {
                        if ($ans->find('img')) {
                            $options['weight'] = 1;
                            $answers[] = $ans->find('span')[0]->innertext;
                        }
                        continue;
                    }
                    $options['content'] = $ans->find('p')[0]->innertext;
                    // echo '<b>'.$opt[$cau] . ': </b>' . $ans->find('p')[0]->innertext.' ';
                    Option::create($options);
                }
            }
            echo '</div>';
        }
        foreach ($answers as $key => $value) {
            $i = $key + 1;
            echo "Câu " . $i . ": " . $value . " |  ";
        }
        // foreach($html->find('.rgMasterTable') as $key => $element){

        //     echo $element . '<br/>';

        // }    
    }
    public function importtc()
    {
        if (($handle = fopen(app_path() . "/tracuu.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 100000000, "|")) !== FALSE) {
                $input['sbd'] = $data[0];
                $input['ma_hs'] = $data[1];
                $input['result'] = $data[2];
                Tracuu::create($input);
                echo "<pre>";
                print_r($input);
            }
        }
    }
    public function traCuu(Request $request)
    {
        $rules = ['phone' => 'required', 'sbd' => 'required'];
        $this->validate($request, $rules);
        $phone = $request->phone;
        $sbd = $request->sbd;
        $result = '';
        $p = Parents::where('phone', $request->phone)->orwhere('alt_phone', $request->phone)->first();
        if ($p) {
            // if($p->tra_cuu){
            //     $result = $p->tra_cuu;
            //     return view('form-tra-cuu', compact(['result', 'phone', 'sbd']));
            // }
            $t = Tracuu::where('sbd', $request->sbd)->first();
            if ($t) {
                $result = $t->result;
                $p->tra_cuu = $t->result;
                $p->sbd = $t->sbd;
                $p->save();
            } else {
                $result = 'Không tìm thấy số báo danh';
            }
        } else {
            $result = 'Không tìm thấy số điện thoại đăng ký tại Vietelite';
        }
        return view('form-tra-cuu', compact(['result', 'phone', 'sbd']));
    }
    public function ketqua()
    {
        $parents = Parents::whereNotNull('tra_cuu')->get();
        $result = [];
        foreach ($parents as $p) {
            $students = $p->students;
            foreach ($students as $s) {
                if (date('Y', strtotime($s->dob)) == '2006') {

                    $classes = $s->classes;
                    $class = '';
                    foreach ($classes as $c) {
                        $class = $class . ',' . $c->code;
                    }
                    $result[] = [$s->fullname, $s->dob, $class, $p->sbd, $p->tra_cuu];
                }
            }
        }
        return view('result', compact(['result']));
    }
    public function testContact()
    {
        $students = Student::all();
        $url = "https://vietelite.bitrix24.com/rest/5/qi82s82j7jkk1uft/crm.contact.add.json?";
        $param = "ID=John&Họ tên HS=Smith&Ngày sinh=mail@example.com&Trường=WORK&Họ tên PH=555888&Phone=WORK&Email=&Phone 2=&Email 2=&NEW_PARAM=";
        $client = new GuzzleHttp\Client();
        $res = $client->get('https://vietelite.bitrix24.com/rest/5/qi82s82j7jkk1uft/crm.contact.add.json?ID=John&Họ tên HS=Smith&Ngày sinh=mail@example.com&Trường=WORK&Họ tên PH=555888&Phone=WORK&Email=&Phone 2=&Email 2=&NEW_PARAM=');
        echo $res->getStatusCode(); // 200
        echo $res->getBody();
    }
    public function formPublic()
    {
        // print_r($_SERVER['HTTP_REFERER']);
        $schools = Schools::Select('name')->get()->toArray();
        $schools = array_column($schools, 'name');
        $centers = Center::Select('name', 'id')->where('name', '!=', 'VietElite Trụ sở điều hành')->get()->toArray();
        $arr = explode('/', $_SERVER['HTTP_REFERER']);
        $selected_grade = '';
        if (sizeof($arr) >= 4) {
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
        return view('form-public', compact('schools', 'centers', 'selected_grade'));
    }
    public function formPublicSimplified()
    {
        $centers = Center::Select('name', 'id')->where('name', '!=', 'VietElite Trụ sở điều hành')->get()->toArray();
        // return $schools;
        return view('form-public-simplified', compact('centers'));
    }

    public function getCourses(Request $request)
    {
        $courses = Course::select('name', 'id', 'grade', 'domain')->where('grade', $request->grade)->where('showable', 1)->get()->toArray();
        $result = [];
        foreach ($courses as $key => $c) {
            if (!array_key_exists($c['domain'], $result)) {
                $result[$c['domain']] = [['id' => $c['id'], 'name' => $c['name'] . ' ' . $c['grade']]];
            } else {
                $result[$c['domain']][] =  ['id' => $c['id'], 'name' => $c['name'] . ' ' . $c['grade']];
            }
            // $courses[$key]['name'] = $c['name'] . ' '. $c['grade'];
        }
        return response()->json($result);
    }
    public function createEntrance($student, $center, $course, $note,  $source)
    {
        $e['student_id'] = $student->id;
        $e['center_id'] = $center;
        $e['course_id'] = $course;
        $e['note'] = $note;
        $e['priority'] = Relationship::find($student->relationship_id)->weight;
        $init_step = Step::where('type', 'Quy trình đầu vào')->orderBy('order', 'asc')->first();

        // Check source
        $source_id = 1;
        $medium_id = 1;
        if ($source['utm_source'] != "") {
            $utm_source = Source::where('campaign_id', '1')->where('name', $source['utm_source'])->first();
            if ($utm_source) {
                $source_id = $utm_source->id;
                //Check medium
                $utm_medium = Medium::where('source_id', $utm_source->id)->where('name', $source['utm_medium'])->first();
                if ($utm_medium) {
                    $medium_id = $utm_medium->id;
                } else {
                    $medium = Medium::create(['source_id' => $utm_source->id, 'name' => $source['utm_medium']]);
                    $medium_id = $medium->id;
                }
            } else {
                $source = Source::create(['campaign_id' => 1, 'name' => $source['utm_source']]);
                $medium = Medium::create(['source_id' => $source->id, 'name' => $source['utm_medium']]);
                $source_id = $source->id;
                $medium_id = $medium->id;
            }
        }
        $e['source_id'] = $source_id;
        $e['medium_id'] = $medium_id;
        if ($course) {
            $e['step_id'] = 1;
        } else {
            $e['step_id'] = ($init_step->id) ? $init_step->id : null;
        }
        $e['step_updated_at'] = date("Y-m-d H:i:s");
        $init_status = Status::where('type', 'Quy trình đầu vào')->orderBy('id', 'asc')->first();
        $e['status_id'] = ($init_status->id) ? $init_status->id : null;
        Entrance::create($e);
    }
    public function handleForm(Request $request)
    {
        $rules = [
            'pname' => 'required|string', 'sname' => 'required|string', 'pphone' => 'required|string', 'pemail' => 'required|string'
        ];
        $this->validate($request, $rules);
        //Check nguồn dữ liệu
        $query = ['utm_medium' => '', 'utm_source' => '', 'utm_campaign' => ''];
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
        $pphone = str_replace('(', '', str_replace(')', '', str_replace('-', '', $request->pphone)));
        $dob = date('Y-m-d', strtotime(str_replace('/', '-', $request->dob)));

        //Check dữ liệu phụ huynh
        $p = Parents::where('phone', $pphone)->orWhere('alt_phone', $pphone)->first();
        if ($p) { // Phụ huynh đã tồn tại trong csdl
            //Check học sinh
            $s = Student::where('fullname', $request->sname)->where('dob', $dob)->first();
            if ($s) { //Đã tồn tại học sinh
                //Tạo mới ghi danh
                foreach ($request->course as $c) {
                    $this->createEntrance($s, $request->center, $c, $request->note, $query);
                }
            } else {
                $student['fullname'] = $request->sname;
                $student['parent_id'] = $p->id;
                $student['dob'] = $dob;
                $student['school'] = $request->school;
                $student['relationship_id'] = $p->relationship_id;
                $student = Student::create($student);
                foreach ($request->course as $c) {
                    $this->createEntrance($student, $request->center, $c, $request->note,  $query);
                }
            }
        } else {
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

            foreach ($request->course as $c) {
                $this->createEntrance($student, $request->center, $c, $request->note,  $query);
            }
        }
        return redirect('https://vietelite.edu.vn/dangkythanhcong/');
        // return response()->json($request->toArray());
    }

    public function handleSimplifiedForm(Request $request)
    {
        // dd($request);
        $rules = [
            'pname' => 'required',

            // 'dob' => 'required',
            'pphone' => 'required',
            'pemail' => 'required',
            'g-recaptcha-response' => 'required|captcha'
        ];
        $messages = [
            'g-recaptcha-response.required' => 'Vui lòng xác nhận bạn không phải ROBOT'
        ];
        $this->validate($request, $rules, $messages);
        //Source query
        $query = ['utm_medium' => '', 'utm_source' => '', 'utm_campaign' => ''];
        $url = parse_url($request->url);
        if (array_key_exists('query', $url)) {
            parse_str($url['query'], $query);
        }
        //chuẩn hóa dữ liệu
        $pphone = str_replace('(', '', str_replace(')', '', str_replace('-', '', $request->pphone)));
        $dob = date('Y-m-d', strtotime(str_replace('/', '-', $request->dob)));

        //Check dữ liệu phụ huynh
        $p = Parents::where('phone', $pphone)->orWhere('alt_phone', $pphone)->first();
        if ($p) { // Phụ huynh đã tồn tại trong csdl
            //Check học sinh
            // $s = Student::where('fullname', $request->sname)->where('dob', $dob)->first();
            // if ($s) { //Đã tồn tại học sinh
            //     //Tạo mới ghi danh
            //     $this->createEntrance($s, $request->center, NULL, $request->note, $query);
            // } else {

            $student['fullname'] = "Con của PH" . $request->pname;
            $student['parent_id'] = $p->id;
            $student['dob'] = $dob;
            $student['school'] = $request->school;
            $student['relationship_id'] = 5;
            $student = Student::create($student);
            $this->createEntrance($student, 1, NULL, $request->note, $query);
            // }1
        } else {
            $relationship = Relationship::orderBy('weight', 'asc')->first();
            $parent['fullname'] = $request->pname;
            $parent['phone'] = $pphone;
            $parent['email'] = $request->pemail;
            $parent['relationship_id'] = $relationship->id;
            $parent = Parents::create($parent);


            $student['fullname'] = "Con của PH" . $request->pname;
            $student['parent_id'] = $parent->id;
            // $student['dob'] = $dob;
            // $student['school'] = $request->school;
            $student['relationship_id'] = 5;
            $student = Student::create($student);
            $this->createEntrance($student, 2, NULL, $request->note, $query);
        }
        return redirect('https://vietelite.edu.vn/dangkythanhcong/');
    }


    public function filter()
    {
        // $start_time, $finish_time, $center_id
        // dd($start_time);
        $center_id = 4;
        $start_time = '2022-05-17';
        $finish_time = '2022-05-18';
        $entrances = Entrance::whereBetween('entrances.created_at', [$start_time, $finish_time])
            ->join('students', 'entrances.student_id', 'students.id')
            ->join('parents', 'students.parent_id', 'parents.id')
            ->join('steps', 'entrances.step_id', 'steps.id')
            ->join('status', 'entrances.status_id', 'status.id')
            ->get();
    }
    public function export_list(Request $request)
    {
        //    dd($request);
        $data = [
            'start_time' => $request->start_time,
            'finish_time' => $request->finish_time,
            'center_id' => $request->center_id,
        ];
        return Excel::download(new EntranceExport($data), 'Báo cáo MKT-TGD.xlsx');
        // return Excel::download(new StudentExport, 'student.xlsx');

    }

    // public function soLieu_export()
    // {
    //     //    dd($request);
    //     // $data = [
    //     //     'start_time' => $request->start_time,
    //     //     'finish_time' => $request->finish_time,
    //     //     'center_id' => $request->center_id,
    //     // ];
    //     return Excel::download(new EntranceMktExport(), 'Báo cáo MKT-TGD.xlsx');
    //     // return Excel::download(new StudentExport, 'student.xlsx');

    // }

    public function export_list_mkt()
    {
        // dd(1);
        $data = [
            'start_time' =>'2022-01-01 00:00:01',
            'finish_time' => '2022-07-08 00:00:01',
            // 'center_id' => $request->center_id,
        ];
        return Excel::download(new EntranceExport(   $data), 'entrance_mkt.xlsx');
    }
}
