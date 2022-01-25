<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Schools;
use App\Parents;
use App\Student;
use App\Classes;
use App\Account;
use App\Transaction;
use App\Center;
use App\Session;
use App\Teacher;
use App\Entrance;
use App\StudentSession;
use App\Tag;
use App\Paper;
use App\StudentClass;
use App\TransactionSession;
use Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Jobs\SendEventNotify;
use App\Jobs\SendEventReminder;
use GuzzleHttp\Client;

class StudentController extends Controller
{
    //
    protected function get4()
    {
        $toan = Classes::where('code', 'LIKE', '%T%')->where('code', 'LIKE', '%4.%')->where('year', '2021')->get();
        $van = Classes::where('code', 'LIKE', '%V%')->where('code', 'LIKE', '%4.%')->where('year', '2021')->get();
        $anh = Classes::where('code', 'LIKE', '%A%')->where('code', 'LIKE', '%5.%')->where('year', '2021')->get();
        $toan_student = [];
        $van_student = [];
        $anh_student = [];
        foreach ($toan as $t) {
            $toan_student = array_merge($toan_student, array_column($t->activeStudents()->select('students.id')->get()->toArray(), 'id'));
        }
        foreach ($van as $v) {
            $van_student = array_merge($van_student, array_column($v->activeStudents()->select('students.id')->get()->toArray(), 'id'));
        }
        foreach ($anh as $a) {
            $anh_student = array_merge($anh_student, array_column($a->activeStudents()->select('students.id')->get()->toArray(), 'id'));
        }
        $tva = sizeof(array_intersect($toan_student, $anh_student, $van_student));
        echo "<pre>";
        print_r(array_intersect($toan_student, $anh_student));
        echo "<pre>";
        print_r(array_intersect($toan_student, $anh_student, $van_student));
        $tv = sizeof(array_intersect($toan_student, $van_student)) - $tva;
        $ta = sizeof(array_intersect($toan_student, $anh_student)) - $tva;
        $av = sizeof(array_intersect($anh_student, $van_student)) - $tva;
        echo "Toán: " . (sizeof($toan_student) - $tva - $tv - $ta) . "<br/>";
        echo "Văn: " . (sizeof($van_student) - $tva - $tv - $av) . "<br/>";
        echo "Anh: " . (sizeof($anh_student) - $tva - $ta - $av) . "<br/>";
        echo "Toán Anh: " . ($ta) . "<br/>";
        echo "Toán Văn: " . ($tv) . "<br/>";
        echo "Anh Văn: " . ($av) . "<br/>";
        echo "Toán Văn Anh: " . ($tva) . "<br/>";
    }
    // protected function get9(){
    //     $toan = Classes::where('code', 'LIKE', '%T%')->where('code', 'LIKE', '%9.%')->where('year', '2021')->where('center_id', 2)->get();
    //     $van = Classes::where('code', 'LIKE', '%V%')->where('code', 'LIKE', '%9.%')->where('year', '2021')->where('center_id', 2)->get();
    //     $anh = Classes::where('code', 'LIKE', '%A%')->where('code', 'LIKE', '%9.%')->where('year', '2021')->where('center_id', 2)->get();
    //     $toan_student = [];
    //     $van_student = [];
    //     $anh_student = [];
    //     foreach($toan as $t){
    //         $toan_student =array_merge($toan_student, array_column($t->activeStudents()->select('students.id')->get()->toArray(), 'id')) ;
    //     }
    //     foreach($van as $v){
    //         $van_student = array_merge($van_student, array_column($v->activeStudents()->select('students.id')->get()->toArray(), 'id')) ;
    //     }
    //     foreach($anh as $a){
    //         $anh_student = array_merge($anh_student, array_column($a->activeStudents()->select('students.id')->get()->toArray(), 'id')) ;
    //     }
    //     $tva = sizeof(array_intersect($toan_student, $anh_student, $van_student));
    //     echo "<pre>";
    //     print_r(array_intersect($toan_student, $anh_student));
    //     echo "<pre>";
    //     print_r(array_intersect($toan_student, $anh_student, $van_student));
    //     $tv = sizeof(array_intersect($toan_student, $van_student))-$tva;
    //     $ta = sizeof(array_intersect($toan_student, $anh_student))-$tva;
    //     $av = sizeof(array_intersect($anh_student, $van_student))-$tva;
    //     echo "Toán: ".(sizeof($toan_student)-$tva-$tv-$ta)."<br/>";
    //     echo "Văn: ".(sizeof($van_student)-$tva-$tv-$av)."<br/>";
    //     echo "Anh: ".(sizeof($anh_student)-$tva-$ta-$av)."<br/>";
    //     echo "Toán Anh: ".($ta)."<br/>";
    //     echo "Toán Văn: ".($tv)."<br/>";
    //     echo "Anh Văn: ".($av)."<br/>";
    //     echo "Toán Văn Anh: ".($tva)."<br/>";
    // }
    // protected function get5(){
    //     $toan = Classes::where('code', 'LIKE', '%T%')->where('code', 'LIKE', '%5.%')->where('year', '2021')->get();
    //     $van = Classes::where('code', 'LIKE', '%V%')->where('code', 'LIKE', '%5.%')->where('year', '2021')->get();
    //     $anh = Classes::where('code', 'LIKE', '%A%')->where('code', 'LIKE', '%5.%')->where('year', '2021')->get();
    //     $toan_student = [];
    //     $van_student = [];
    //     $anh_student = [];
    //     foreach($toan as $t){
    //         $toan_student =array_merge($toan_student, array_column($t->activeStudents()->select('students.id')->get()->toArray(), 'id')) ;
    //     }
    //     foreach($van as $v){
    //         $van_student = array_merge($van_student, array_column($v->activeStudents()->select('students.id')->get()->toArray(), 'id')) ;
    //     }
    //     foreach($anh as $a){
    //         $anh_student = array_merge($anh_student, array_column($a->activeStudents()->select('students.id')->get()->toArray(), 'id')) ;
    //     }
    //     $tva = sizeof(array_intersect($toan_student, $anh_student, $van_student));
    //     $tv = sizeof(array_intersect($toan_student, $van_student))-$tva;
    //     $ta = sizeof(array_intersect($toan_student, $anh_student))-$tva;
    //     $av = sizeof(array_intersect($anh_student, $van_student))-$tva;
    //     echo "Toán: ".(sizeof($toan_student)-$tva-$tv-$ta)."<br/>";
    //     echo "Văn: ".(sizeof($van_student)-$tva-$tv-$av)."<br/>";
    //     echo "Anh: ".(sizeof($anh_student)-$tva-$ta-$av)."<br/>";
    //     echo "Toán Anh: ".($ta)."<br/>";
    //     echo "Toán Văn: ".($tv)."<br/>";
    //     echo "Anh Văn: ".($av)."<br/>";
    //     echo "Toán Văn Anh: ".($tva)."<br/>";
    // }
    protected function removeStudent($id)
    {
        $student = Student::find($id);
        $student->forceDelete();

        $sc = StudentClass::where('student_id', $id)->forceDelete();

        $ss = StudentSession::where('student_id', $id)->forceDelete();

        $t = Transaction::where('student_id', $id)->forceDelete();
    }
    protected function uploadAvatar(Request $request)
    {
        $rules = [
            "id" => "required",
            "croppedImage" => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:4096']
        ];
        $messages = [
            "required" => "Vui lòng tải ảnh",
            "image" => "Chỉ chấp nhận ảnh",
            "mimes" => "Chỉ chấp nhận định dạng jpeg, png, jpg, gif",
            "max:4096" => "Tối đa 4Mb"
        ];
        $this->validate($request, $rules, $messages);

        $student = Student::find($request->id);
        if (!$student) {
            return 0;
        }
        if (strpos($student->avatar, "/public/images/students/") !== false) {
            $old_avatar_file = ($student->avatar) ? explode('/', $student->avatar)[4] : "";
            // print_r($old_avatar_file);
            if (\File::exists(public_path() . "/images/avatars/" . $old_avatar_file)) {
                \File::delete(public_path() . "/images/avatars/" . $old_avatar_file);
            }
        }

        if ($request->has('croppedImage')) {
            $avatar = $request->file('croppedImage');
            $name = $student->id;
            $avatar->move(public_path() . "/images/students/", $name . ".jpeg");

            if ($student) {
                $student->avatar = "/public/images/students/" . $name . ".jpeg";
                $student->save();
            }
            // $user->avatar = "/public/images/images/students/".$name.".jpeg";
            // $user->save();
        }
        return response()->json($student);
    }
    protected function getStudent($id)
    {
        return view('welcome');
    }
    protected function getStudentById(Request $request)
    {
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $student = Student::where('students.id', $request->id)->select(
            'students.id as sid',
            'students.fullname as sname',
            'dob',
            'school',
            'grade',
            'students.email as semail',
            'students.phone as sphone',
            'gender',
            'parents.id as pid',
            'parents.fullname as pname',
            'parents.email as pemail',
            'parents.alt_fullname as pname2',
            'parents.alt_email as pemail2',
            'parents.phone as pphone',
            'parents.alt_phone as pphone2',
            'parents.note',
            'relationships.id as r_id',
            'relationships.name as r_name',
            'relationships.color',
            'students.avatar'
        )
            ->leftjoin('parents', 'students.parent_id', 'parents.id')
            ->leftJoin('relationships', 'parents.relationship_id', 'relationships.id')
            ->first();
        if (!auth()->user()->can('read_phone')) {
            $student->pphone = '******' . substr($student->pphone, 6);
        }
        if (!auth()->user()->can('read_email')) {
            $student->pemail = '******' . substr($student->pemail, 6);
        }
        if ($student) {
            $brothers = Student::where('id', '!=', $student->sid)->where('parent_id', $student->pid)->get();
            return response()->json($student);
        } else {
            return response()->json('Không tìm thấy học sinh', 412);
        }
    }
    protected function saveStudent(Request $request)
    {
        $rules = ['student' => 'required'];
        $this->validate($request, $rules);

        $s = $request->student;
        $student = Student::find($s['sid']);
        if ($student) {
            $student->fullname = $s['sname'];
            $student->dob = date('Y-m-d', strtotime($s['dob']));
            $student->gender = $s['gender'];
            $student->school = $s['school'];
            $student->grade = $s['grade'];
            $student->email = $s['semail'];
            $student->phone = $s['pphone'];
            $student->save();
        }
        $parent = Parents::find($s['pid']);
        if ($parent) {
            $parent->fullname = $s['pname'];
            $parent->alt_fullname = $s['pname2'];
            $parent->email = (strpos($s['pemail'], '***') !== false) ? $parent->email : $s['pemail'];

            $parent->phone = (strpos($s['pphone'], '***') !== false) ? $parent->phone : $s['pphone'];
            $parent->alt_email = $s['pemail2'];
            $parent->alt_phone = $s['pphone2'];
            $parent->relationship_id = $s['relationship']['value'];
            $parent->note = $s['note'];
            $parent->save();
        }
        return response()->json(200);
    }
    protected function getClass(Request $request)
    {
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $student = Student::find($request->id);
        if ($student) {
            $classes = $student->activeClasses;
            return response()->json($classes);
        }
    }
    public function findSchools($key)
    {
        $schools = Schools::where('name', 'LIKE', '%' . $key . '%')->limit(10)->get()->toArray();
        return response()->json($schools);
    }
    public function findStudents($key)
    {
        $s = [];
        if (strpos($key, '@') !== false) {
            $s = Parents::where('parents.email', 'LIKE', '%' . $key . '%')->select(
                'students.id as sid',
                'students.fullname as s_name',
                'students.fee_email_note',
                'school',
                'students.dob as dob',
                'students.grade as grade',
                'students.email as s_email',
                'students.phone as s_phone',
                'students.gender',
                'parents.id as pid',
                'parents.fullname as p_name',
                'parents.phone as p_phone',
                'parents.email as p_email',
                'parents.note',
                'parents.alt_fullname',
                'parents.alt_email',
                'parents.alt_phone',
                'relationships.id as r_id',
                'relationships.name as r_name',
                'relationships.color'
            )->leftJoin('students', 'parents.id', 'students.parent_id')
                ->leftJoin('relationships', 'parents.relationship_id', 'relationships.id')
                ->limit(20)->get()->toArray();
        } else if (ctype_digit($key)) {
            //check parent phone
            $s = Parents::where('parents.phone', 'LIKE', '%' . $key . '%')->select(
                'students.id as sid',
                'students.fullname as s_name',
                'students.fee_email_note',
                'school',
                'students.dob as dob',
                'students.grade as grade',
                'students.email as s_email',
                'students.phone as s_phone',
                'students.gender',
                'parents.id as pid',
                'parents.fullname as p_name',
                'parents.phone as p_phone',
                'parents.email as p_email',
                'parents.note',
                'parents.alt_fullname',
                'parents.alt_email',
                'parents.alt_phone',
                'relationships.id as r_id',
                'relationships.name as r_name',
                'relationships.color'
            )->leftJoin('students', 'parents.id', 'students.parent_id')
                ->leftJoin('relationships', 'parents.relationship_id', 'relationships.id')
                ->limit(20)->get()->toArray();
        } else {
            //check student full name
            $s = Student::where('students.fullname', 'LIKE', '%' . $key . '%')->select(
                'students.id as sid',
                'students.fullname as s_name',
                'school',
                'fee_email_note',
                'students.dob as dob',
                'students.grade as grade',
                'students.email as s_email',
                'students.phone as s_phone',
                'students.gender',
                'parents.id as pid',
                'parents.fullname as p_name',
                'parents.phone as p_phone',
                'parents.email as p_email',
                'parents.note',
                'parents.alt_fullname',
                'parents.alt_email',
                'parents.alt_phone',
                'relationships.id as r_id',
                'relationships.name as r_name',
                'relationships.color'
            )->leftJoin('parents', 'students.parent_id', 'parents.id')
                ->leftJoin('relationships', 'students.relationship_id', 'relationships.id')->orderBy('sid', 'DESC')
                ->limit(20)->get()->toArray();
        }
        foreach ($s as $key => $student) {
            $s[$key]['classes'] = Student::find($student['sid'])->classes;
            $s[$key]['entrance'] = '';
            $entrance = Entrance::where('student_id', $student['sid'])->select('steps.name', 'status.name as entrance_status')
                ->leftJoin('status', 'entrances.status_id', 'status.id')->leftJoin('steps', 'entrances.step_id', 'steps.id')->first();
            if ($entrance) {
                $s[$key]['entrance'] = $entrance->name;
                $s[$key]['entrance_status'] = $entrance->entrance_status;
            }
            if (!auth()->user()->can('read_phone')) {
                $s[$key]['p_phone'] = '******' . substr($s[$key]['p_phone'], 6);
            }
            if (!auth()->user()->can('read_email')) {
                $s[$key]['p_email'] = '******' . substr($s[$key]['p_email'], 6);
            }
        }
        return response()->json($s);
    }
    protected function getStudents(Request $request)
    {
        $rules = [
            'class_id' => 'required'
        ];
        $this->validate($request, $rules);
        $class_id = $request->class_id;
        $class = Classes::find($class_id);

        $result = [];
        if ($class && $class->type == 'class') {
            $students = $class->students()->orderBy('status')->get();
            $result = $students->toArray();
            foreach ($students as $key => $student) {
                $parent = Parents::where('parents.id', $student->parent_id)
                    ->select(
                        'parents.fullname as pname',
                        'relationships.name as rname',
                        'parents.phone as pphone',
                        'parents.email as pemail',
                        'parents.alt_fullname',
                        'parents.alt_email',
                        'parents.alt_phone',
                        'parents.note as pnote',
                        'relationships.color',
                        'relationships.id as rid'
                    )
                    ->leftJoin('relationships', 'parents.relationship_id', 'relationships.id')->first();
                $p = [];
                if ($parent) {
                    $p = $parent->toArray();
                    if (!auth()->user()->can('read_phone')) {
                        $p['pphone'] = '******' . substr($parent['pphone'], 6);
                    }
                    if (!auth()->user()->can('read_email')) {
                        $p['pemail'] = '******' . substr($parent['pemail'], 6);
                    }
                }
                $result[$key]['parent'] = $p;
            }
        }

        return response()->json($result);
    }
    protected function getStudentEvent(Request $request)
    {
        $rules = [
            'class_id' => 'required',
            'page' => 'required',
            'per_page' => 'required',
        ];
        $this->validate($request, $rules);

        $offset = $request->page * ($request->per_page);
        $result = ['data' => []];
        $result['page'] = $request->page;

        $class_id = $request->class_id;
        $class = Classes::find($class_id);
        if (empty($request->filter)) {
            $students = $class->studentsOffset($request->per_page, $offset)->orderBy('status')->get();
            $result['page'] = $request->page;
            $result['total'] = $class->students()->count();
            $result['data'] = $students->toArray();
        } else {
            foreach ($request->filter as $filter) {
                $students = $class->studentsOffset($request->per_page, $offset);
                $result['page'] = $request->page;

                if ($filter['column']['field'] == 'fullname') {
                    $students = $students->where('students.fullname', 'LIKE', '%' . $filter['value'] . '%')->orderBy('status')->get();
                    $result['data'] = $students->toArray();
                }
                if ($filter['column']['field'] == 'pname') {
                    $students = $students->parentFind($filter['value'])->orderBy('status')->get();
                    $result['data'] = $students->toArray();
                }
                if ($filter['column']['field'] == 'status') {
                    if (count($filter['value']) > 0) {
                        $students = $students->whereIn('status', $filter['value'])->orderBy('status')->get();
                    } else {
                        $students->orderBy('status')->get();
                    }
                    $result['data'] = $students->toArray();
                }
                $result['total'] = count($result['data']);
                // $students = $students->get();
            }
        }
        foreach ($students as $key => $student) {
            $parent = Parents::where('parents.id', $student->parent_id)
                ->select(
                    'parents.fullname as pname',
                    'relationships.name as rname',
                    'parents.phone as pphone',
                    'parents.email as pemail',
                    'parents.alt_fullname',
                    'parents.alt_email',
                    'parents.alt_phone',
                    'parents.note as pnote',
                    'relationships.color',
                    'relationships.id as rid',
                    'parents.password as passcode'
                )
                ->leftJoin('relationships', 'parents.relationship_id', 'relationships.id')->first();
            $p = [];
            if ($parent) {
                $p = $parent->toArray();
                if (!auth()->user()->can('read_phone')) {
                    $p['pphone'] = '******' . substr($parent['pphone'], 6);
                }
                if (!auth()->user()->can('read_email')) {
                    $p['pemail'] = '******' . substr($parent['pemail'], 6);
                }
            }
            $result['data'][$key]['parent'] = $p;
            $result['data'][$key]['sbd'] = $class->code . '' . $student['sc_id'];
            $result['data'][$key]['classes'] = $student->activeClasses;
            $acc_131 = Account::where('level_1', '131')->first();

            $debit = Transaction::where('student_id', $student->id)->where('class_id', $class->id)->where('debit', $acc_131->id)->sum('amount');
            $credit = Transaction::where('student_id', $student->id)->where('class_id', $class->id)->where('credit', $acc_131->id)->sum('amount');
            $result['data'][$key]['debit'] = $debit;
            $result['data'][$key]['credit'] = $credit;
            $sessions = $student->sessionsOfClass($class->id)->get()->toArray();
            $sessions_content = array_column($sessions, 'content');
            $result['data'][$key]['sessions_arr'] = $sessions;
            $result['data'][$key]['sessions'] = $sessions_content;
            $result['data'][$key]['sessions_str'] =  implode(',', $sessions_content);
        }
        return response()->json($result);
    }
    public function validPhone($phone)
    {
        if (preg_match("/[a-z]/i", $phone)) {
            return false;
        }
        if (strlen($phone) < 9 || $phone == "") {
            return false;
        } else {
            return '0' . explode('/', $phone)[0];
        }
    }
    protected function getFee(Request $request)
    {
        $rules = ['students' => 'required', 'show_all' => 'required'];
        $this->validate($request, $rules);
        $from = ($request->from) ? date('Y-m-01', strtotime($request->from)) : '2010-01-01';
        $to = ($request->to) ? date('Y-m-t 23:59:59', strtotime($request->to)) : '2099-01-01';

        $student_ids = array_column($request->students, 'sid');
        return response()->json($this->generateFee($student_ids, $request->show_all, true, $from, $to));
    }
    protected function generateFee($student_id, $show_all, $show_detail, $from, $to)
    {
        // $student = Student::find($student_id);
        // $classes = $student->classes;
        // print_r($from);
        // print_r($to);
        $acc = Account::where('level_2', '131')->first();
        $result = [];
        $id = -1;

        $transactions = Transaction::whereIn('student_id', $student_id)->whereBetween('time', [$from, $to])
            ->Select(
                'transactions.id as id',
                'transactions.amount',
                'transactions.time',
                'transactions.paper_id',
                'transactions.content',
                'transactions.created_at',
                'debit_account.id as debit',
                'debit_account.level_2 as debit_level_2',
                'debit_account.name as debit_name',
                'debit_account.type as debit_type',
                'credit_account.id as credit',
                'credit_account.level_2 as credit_level_2',
                'credit_account.name as credit_name',
                'credit_account.type as credit_type',
                'students.id as sid',
                'students.fullname as sname',
                'students.dob',
                'classes.id as cid',
                'classes.code as cname',
                'sessions.id as ssid',
                'sessions.date as session_date ',
                'users.id as uid',
                'users.name as uname',
                'transactions.center_id as center_id'
            )
            ->leftJoin('accounts as debit_account', 'transactions.debit', 'debit_account.id')
            ->leftJoin('accounts as credit_account', 'transactions.credit', 'credit_account.id')
            ->leftJoin('students', 'transactions.student_id', 'students.id')
            ->leftJoin('classes', 'transactions.class_id', 'classes.id')
            ->leftJoin('sessions', 'transactions.session_id', 'sessions.id')
            ->leftJoin('users', 'transactions.user', 'users.id')->orderBy('transactions.time', 'ASC')->orderBy('classes.id', 'DESC')
            ->get();

        foreach ($transactions as $key => $t) {
            if ($t->debit != $acc->id && $t->credit != $acc->id) continue;
            $month = Date('m-Y', strtotime($t->time));
            $detail_amount = TransactionSession::where('transaction_id', $t->id)->get();
            $detail = '';
            setlocale(LC_MONETARY, "vi_VN");

            foreach ($detail_amount as $key => $da) {
                $session = Session::find($da->session_id);
                if ($session) {
                    $date = date('d/m', strtotime($session->date));
                    $detail = $detail . 'Ngày ' . $date . ': ' . number_format($da->amount) . " + ";
                }
            }
            if ($t->paper_id != NULL) {

                $paper = Paper::find($t->paper_id);
                $detail = "PT" . $paper->receipt_number . "+";
            }
            if (!array_key_exists($month, $result)) {
                // echo $month."<br>";
                $result[$month]['amount'] = ($t->debit == $acc->id) ? $t->amount : (($t->credit == $acc->id) ? -$t->amount : 0);
                $result[$month]['count_transaction'] = 1;
                $result[$month]['id'] = --$id;
                $result[$month]['parent_id'] = '';
                $tarray = $t->toArray();
                $tarray['month'] = $month;
                $tarray['parent_id'] = $id;
                $tarray['amount'] = ($t->debit == $acc->id) ? $t->amount : (($t->credit == $acc->id) ? -$t->amount : 0);
                $tarray['time'] = Date('d/m/Y', strtotime($t->time));
                $tarray['detail'] = $detail;
                if ($show_detail) {
                    array_push($result, $tarray);
                }
                $result[$month]['time'] = Date('d/m/Y', strtotime($t->time));
                $result[$month]['month'] = $month;
                $result[$month]['content'] = 'Tổng tiền tháng ' . $month;
                $result[$month]['detail'] = '';
                $result[$month]['cname'] = '';
                $result[$month]['center_id'] = $t->center_id;
            } else {
                $result[$month]['amount'] = $result[$month]['amount'] + (($t->debit == $acc->id) ? $t->amount : (($t->credit == $acc->id) ? -$t->amount : 0));
                $tarray = $t->toArray();
                $tarray['month'] = $month;
                $result[$month]['count_transaction']++;
                $tarray['amount'] = ($t->debit == $acc->id) ? $t->amount : (($t->credit == $acc->id) ? -$t->amount : 0);
                $tarray['parent_id'] = $result[$month]['id'];
                $tarray['time'] = Date('d/m/Y', strtotime($t->time));
                $tarray['detail'] = $detail;
                $tarray['center_id'] = $t->center_id;
                $result[$month]['detail'] = '';
                if ($show_detail) {
                    array_push($result, $tarray);
                }
            }
        }
        $neutral = [];
        if ($show_all) {
            foreach ($result as $r) {
                if ($r['amount'] == 0) {
                    array_push($neutral, $r['id']);
                }
            }
        }
        $result = array_filter($result, function ($v, $k) use ($neutral) {
            return (!in_array($v['parent_id'], $neutral));
        }, ARRAY_FILTER_USE_BOTH);
        //Check số dư kỳ trước
        $remainTransactions = Transaction::whereIn('student_id', $student_id)->where('time', '<', $from)->get();
        $totalRemain = 0;
        foreach ($remainTransactions as $t) {
            $totalRemain += (($t->debit == $acc->id) ? $t->amount : (($t->credit == $acc->id) ? -$t->amount : 0));
        }
        $result['remain'] = ['amount' => $totalRemain, 'id' => '-1999', 'detail' => 'Học phí kỳ trước', 'month' => '', 'time' => '', 'content' => 'Học phí kỳ trước', 'cname' => ''];
        // print_r($result);

        return array_values($result);
    }

    protected function normalizeFee(Request $request)
    {
        $rules = ['student_ids' => 'required'];
        $this->validate($request, $rules);

        if (sizeof($request->student_ids) > 1) {
            return response()->json(433);
        } else {
            $student_ids = array_column($request->student_ids, 'sid');
            $result = $this->generateFee($student_ids, false, false, '2010-01-01', '2099-01-01');
            $student_id = $student_ids[0];
        }
        // return response()->json($this->generateFee($student_id, false, false));
        $this->normalize($result, $student_id);

        return response()->json('done');
    }
    protected function normalize($result, $student_id)
    {
        $negative_arr = array_filter($result, function ($a) {
            return ($a['amount'] < 0);
        });
        usort($negative_arr, function ($a, $b) {
            return $a['amount'] <=> $b['amount'];
        });
        $positive_arr = array_filter($result, function ($a) {
            return $a['amount'] > 0;
        });
        usort($positive_arr, function ($a, $b) {
            return strtotime(str_replace('/', '-', $a['time'])) - strtotime(str_replace('/', '-', $b['time']));
        });
        $result = array_merge($negative_arr, $positive_arr);
        // print_r($result);
        //Tags
        $tag = Tag::where('name', 'Chuyển HP')->first();
        if (!$tag) {
            $tag = Tag::create(['name' => 'Chuyển HP']);
        }
        // print_r($result);
        $result = array_values(array_filter($result, function ($v, $k) {
            // return (!in_array($v['parent_id'] , $neutral));
            return ($v['id'] < 0);
        }, ARRAY_FILTER_USE_BOTH));
        foreach ($result as $key => &$r) {
            if ($r['id'] < 0) {
                print_r($r);
                if ($r['amount'] < 0 && $r['count_transaction'] > 1) {
                    //Tao giao dich can doi 
                    $t['debit'] = Account::where('level_2', '131')->first()->id;
                    $t['credit'] = Account::where('level_2', '1111')->first()->id;
                    $t['amount'] = -$r['amount'];
                    $t['time'] = date('Y-m-t', strtotime('01-' . $r['month']));
                    $t['student_id'] = $student_id;
                    $t['content'] = 'Chuyển học phí dư có';
                    $t['user'] = auth()->user()->id;
                    $t['center_id'] = $r['center_id'];
                    $transfer = Transaction::create($t);

                    $transfer->tags()->attach([$tag->id]);
                    $dt['debit'] = Account::where('level_2', '1111')->first()->id;
                    $dt['credit'] = Account::where('level_2', '131')->first()->id;
                    $dt['center_id'] = $r['center_id'];
                    $dt['amount'] = -$r['amount'];
                    if ($key == sizeof($result) - 1) {
                        $dt['time'] = date('Y-m-d', strtotime("+1 month", strtotime('28-' . $r['month'])));
                        $result[$key]['amount'] = 0;
                    } else {
                        $dt['time'] = date('Y-m-t', strtotime('01-' . $result[$key + 1]['month']));
                        $result[$key + 1]['amount'] += $r['amount'];
                        $result[$key]['amount'] = 0;
                        $result[$key + 1]['count_transaction']++;
                    }
                    $dt['student_id'] = $student_id;
                    $dt['content'] = 'Học phí thừa kì trước';
                    $dt['user'] = auth()->user()->id;
                    $receipt  = Transaction::create($dt);

                    $receipt->tags()->attach([$tag->id]);
                }
            }
        }
    }
    protected function gatherFee(Request $request)
    {
        $rules = [
            'students' => 'required',
            'center' => 'required',
            'name' => 'required',
            'account' => 'required',
            'total_amount' => 'required',
            'description' => 'required',
        ];
        $this->validate($request, $rules);

        $account = Account::find($request->account);
        if ($account->level_1 == '1111') {
            $p['method'] = 'TM';
            $max_receipt_number = Paper::where('center_id', $request->center)->where('method', 'TM')->max('receipt_number') != "" ? Paper::where('center_id', $request->center)->where('method', 'TM')->max('receipt_number') : 0;
            $p['receipt_number'] = $max_receipt_number + 1;
        }
        if ($account->level_1 == '112') {
            $p['method'] = 'NH';
            $max_receipt_number = Paper::where('center_id', $request->center)->where('method', 'NH')->max('receipt_number') != "" ? Paper::where('center_id', $request->center)->where('method', 'NH')->max('receipt_number') : 0;
            $p['receipt_number'] = $max_receipt_number + 1;
        }
        $p['center_id'] = $request->center;
        $p['type'] = 'receipt';
        $p['name'] = $request->name;
        $p['description'] = $request->description;
        $p['amount'] = $request->total_amount;
        $p['user_created_id'] = auth()->user()->id;
        $p['note'] = '';
        $p['created_at'] = date('Y-m-d');
        $p['status'] = NULL;
        $p['address'] = '';
        $p = Paper::create($p);
        $total_amount = $request->total_amount;
        $lastClass = [];
        foreach ($request->students as $student) {
            $sumOfMonth = array();
            $transactions = $this->generateFee([$student['sid']], false, true, '2010-01-01', '2099-01-01');
            $this->normalize($transactions, $student['sid']);
            foreach ($transactions as $key => $v) {
                if ($v['id'] > 0) {
                    $month = $v['month'];
                    $cid = (array_key_exists('cid', $v)) ? ($v['cid']) ? $v['cid'] : '-1' : '-1';
                    $sumOfMonth[$month]['total_amount'][] = $v['amount'];
                    if ($cid == '-1') {
                        $sumOfMonth[$month]['other_amount'][] = $v['amount'];
                    } else {
                        $sumOfMonth[$month]['class'][$cid]['debit'] = $request->account;
                        $sumOfMonth[$month]['class'][$cid]['credit'] = Account::where('level_2', '131')->first()->id;
                        $sumOfMonth[$month]['class'][$cid]['time'] = date('Y-m-t', strtotime('01-' . $v['month']));
                        $sumOfMonth[$month]['class'][$cid]['content'] = 'Thu học phí ' . $v['month'];
                        $sumOfMonth[$month]['class'][$cid]['student_id'] = $student['sid'];
                        $sumOfMonth[$month]['class'][$cid]['class_id'] = (array_key_exists('cid', $v)) ? $v['cid'] : NULL;
                        $sumOfMonth[$month]['class'][$cid]['session_id'] = NULL;
                        $sumOfMonth[$month]['class'][$cid]['user'] = auth()->user()->id;
                        $sumOfMonth[$month]['class'][$cid]['paper_id'] = $p->id;
                        $sumOfMonth[$month]['class'][$cid]['amount'][] = $v['amount'];
                    }
                }
            }

            foreach ($sumOfMonth as $key => $sum) {
                if (array_sum($sum['total_amount']) > 0) {
                    $other_fee = array_key_exists('other_amount', $sum) ? array_sum($sum['other_amount']) : 0;
                    foreach ($sum['class'] as $cid => $c) {
                        $c['amount'] = array_sum($c['amount']) + $other_fee;
                        if ($c['amount'] > 0) {
                            if ($total_amount > 0) {
                                if ($c['amount'] <= $total_amount) {
                                    $total_amount -= $c['amount'];
                                } else {
                                    $c['amount'] = $total_amount;
                                    $total_amount = 0;
                                }
                                $lastClass = $c;
                                Transaction::create($c);
                            }
                            $other_fee = 0;
                        } else {
                            $other_fee = $c['amount'];
                        }
                    }
                }
            }
        }
        if ($total_amount > 0) {
            $lastClass['amount'] = $total_amount;
            Transaction::create($lastClass);
        }
        return response()->json(200);
    }

    protected function gatherEvent(Request $request)
    {
        $rules = [
            'students' => 'required',
            'center' => 'required',
            'name' => 'required',
            'account' => 'required',
            'total_amount' => 'required',
            'description' => 'required',
        ];
        $this->validate($request, $rules);
        $p = null;

        if ($request->total_amount > 0) {
            $account = Account::find($request->account);
            if ($account->level_1 == '1111') {
                $p['method'] = 'TM';
                $max_receipt_number = Paper::where('center_id', $request->center)->where('method', 'TM')->max('receipt_number') != "" ? Paper::where('center_id', $request->center)->where('method', 'TM')->max('receipt_number') : 0;
                $p['receipt_number'] = $max_receipt_number + 1;
            }
            if ($account->level_1 == '112') {
                $p['method'] = 'NH';
                $max_receipt_number = Paper::where('center_id', $request->center)->where('method', 'NH')->max('receipt_number') != "" ? Paper::where('center_id', $request->center)->where('method', 'NH')->max('receipt_number') : 0;
                $p['receipt_number'] = $max_receipt_number + 1;
            }
            $p['center_id'] = $request->center;
            $p['type'] = 'receipt';
            $p['name'] = $request->name;
            $p['description'] = $request->description;
            $p['amount'] = $request->total_amount;
            $p['user_created_id'] = auth()->user()->id;
            $p['note'] = '';
            $p['created_at'] = date('Y-m-d');
            $p['status'] = NULL;
            $p['address'] = '';
            $p = Paper::create($p);
        } else {
            $student = $request->students[0];
            $t = Transaction::where('student_id', $student['id'])->where('class_id', $student['class_id'])->whereNotNull('paper_id')->first();
            if ($t) {
                $p = Paper::find($t->paper_id);
            }
        }
        $total_amount = $request->total_amount;
        foreach ($request->students as $student) {
            if (array_key_exists('class_id', $student)) {
                $result['is_vee'] = true;
            } else $result['is_vee'] = false;
            if ($student['debit'] - $student['credit'] > 0) {

                $t['debit'] = $request->account;
                $t['credit'] = Account::where('level_2', '131')->first()->id;
                $t['time'] = date('Y-m-t', strtotime($student['entrance_date']));
                $t['content'] = $request->description;
                $t['student_id'] = $student['id'];
                $t['class_id'] = (array_key_exists('class_id', $student)) ? $student['class_id'] : NULL;
                $t['session_id'] = NULL;
                $t['user'] = auth()->user()->id;
                $t['paper_id'] = $p->id;
                $t['amount'] = $student['debit'] - $student['credit'];
                Transaction::create($t);
                $t['debit'] = Account::where('level_2', '3387')->first()->id;
                $t['credit'] = Account::where('level_2', '5112')->first()->id;
                $t['paper_id'] = null;
                Transaction::create($t);
            }


            //Change trạng thái xác nhận
            $student_event = StudentClass::where('student_id', $student['id'])->where('class_id', $student['class_id'])->first();
            if ($student_event) {
                $student_event->status = 'active';
                $student_event->save();


                $class = Classes::find($student['class_id']);
                $sessions = Session::where('class_id', $student['class_id'])->get();
                foreach ($sessions as $session) {
                    $ss = StudentSession::where('student_id', $student['id'])->where('session_id', $session->id)->first();
                    if ($ss) {
                        $ss->attendance = 'present';
                        $ss->save();
                    }
                }
            }
            $parent = Parents::find($student['parent_id']);
            if ($parent) {
                //Phu huynh chua co password
                if (!$parent->password) {
                    $pass = Str::random(5);
                    $parent->password = Hash::make($pass);
                    $parent->ftp = $pass;
                    $parent->save();
                }
                //Phu huynh da co password
                //Gui email thong bao xac nhan dong tien + thong bao SBD + Ma tra cuu
                else {
                    if (!$parent->ftp) {
                        $pass = 'Password đã được phụ huynh đổi';
                    } else {
                        $pass = $parent->ftp;
                    }
                }
                // $pass = Str::random(4);
                // $parent->password = Hash::make($pass);
                // $parent->ftp =$pass;
                $parent->save();
                $result['phone'] = $parent->phone;
                $result['event_name'] = $class->name;
                $result['sbd'] = $student['sbd'];
                $result['pass'] = $pass;
                $result['student_name'] = $student['fullname'];
                $result['total_fee'] = $t['amount'];
                $result['receipt_number'] = ($p) ? $p->center_id . "" . $p->method . "" . $p->receipt_number : '';
                $to_email = $parent->email;
                $to_name = '';
                $mail = 'thithu@vietelite.edu.vn';
                $password = 'Boc24038';
                $d = ['result' => $result];
                //Send Email
                //Send Zns
                $body = [
                    'phone' => '+84' . ltrim($result['phone'], '0'),
                    'template_id' => '201880',
                    'template_data' => [
                        'event_name' => $result['event_name'],
                        'fee' => $result['total_fee'],
                        'receipt_number' => $result['receipt_number'],
                        'sbd' => $result['sbd'],
                        'passcode' => $result['pass'],
                    ],
                ];
                $client = new Client();
                $zns_api = 'https://business.openapi.zalo.me/message/template?access_token=iKGMLgs70XEzHX9KfuO64RT06rIgcNr4q28h1f-7TqU36Jm9mBv85g888Yp7p5WyXNHG2UdvGnkNH1SEp-P7CuPI4pwOodnn-WuAJE6cI6kuPHTCoDbnNfH9DahwY4HEgoq9QyxjQsIhSWWZpUru08TlEKQVx5K8XqmlCVNqN2lbHHjic_TsI8jQPdRLrIfFoLXBRQo29own8N8nmViQDg1s2pN5p4eCdruvDFoVMGM_6Kf4puOrKP43IdVJi3r7kW5SGR-H4Ldj3G1dYerXFTit4Wp0Y0TBAFSbTwgT0XK';
                $response = $client->request('POST', $zns_api, [
                    \GuzzleHttp\RequestOptions::JSON => $body
                ]);
                // echo $response->getbody();

                $backup = Mail::getSwiftMailer();
                // Setup your outlook mailer
                $transport = new \Swift_SmtpTransport('smtp-mail.outlook.com', 587, 'tls');
                $transport->setUsername($mail);
                $transport->setPassword($password);
                // Any other mailer configuration stuff needed...

                $outlook = new \Swift_Mailer($transport);

                // Set the mailer as gmail
                Mail::setSwiftMailer($outlook);

                // Send your message
                Mail::send('emails.events.confirm-fee', $d, function ($message) use ($to_name, $to_email, $result, $mail) {
                    $message->to($to_email, $to_name)
                        ->to('webmaster@vietelite.edu.vn')
                        ->subject($result['student_name'] . " - Thông tin số báo danh")
                        ->replyTo($mail, 'Phụ huynh hs ' . $result['student_name']);
                    $message->from($mail, 'VIETELITE EDUCATION CENTER');
                });

                // Restore your original mailer
                Mail::setSwiftMailer($backup);
                try {
                } catch (\Exception $e) {
                    // Get error here
                    return response()->json(418);
                }
            }
            //
        }

        //Change trạng thái xác nhận
        return response()->json(200);
    }
    public function printFee(Request $request)
    {
        $rules = ['student_id' => 'required', 'from' => 'required', 'to' => 'required'];
        $this->validate($request, $rules);
        $result = [];

        $months = [];
        $data = [];
        $student = Student::find($request->student_id);
        $student_name = $student->fullname;
        $sum_amount = 0;
        $content = '';
        $classes = [];
        $max_date = date('Y-m-d');
        $center_id = 0;
        foreach ($request->data as $key => $d) {
            if ($d['id'] < 0 && $d['id'] != -1999) continue;
            $date = date('Y-m-d', strtotime('01-' . $d['month']));
            //Class
            $transaction = Transaction::find($d['id']);
            $tag = Tag::where('name', "Học phí")->first()->id;
            if ($d['id'] == -1999) {
                $t['content'] = $d['content'];
                $t['sl'] = 1;
                $t['dg'] = $d['amount'];
                $t['session_fee'] = [];
            } else {
                if (!in_array($d['cname'], $classes)) {
                    array_push($classes, $d['cname']);
                }
                $t_tag = $transaction->tags()->first();
                $t['content'] = '';
                if ($t_tag) {
                    if ($t_tag->id == $tag) {
                        if ($t['content'] != "") {
                            $t['content'] = $t['content'] . ', ' . date('m', strtotime('01-' . $d['month']));
                        } else {
                            $t['content'] = 'Học phí tháng ' . date('m', strtotime('01-' . $d['month']));
                        }
                    } else {
                        $t['content'] = $d['content'];
                    }
                } else {
                    $t['content'] = $d['content'];
                }
                if ($d['cname'] == "") $t['content'] = $d['content'];
                $class = Classes::find($transaction->class_id);
                if ($class) {
                    $center_id = $class->center_id;
                }
                $sessions_count = $transaction->sessions()->count();
                $sessions = $transaction->sessions()->select('sessions.fee')->get()->toArray();
                // echo "<pre>";
                // print_r($sessions);
                $sessions = array_column(array_column($sessions, 'pivot'), 'amount');
                // echo $transaction->id; 

                $t['cname'] = ($d['cname'] != '') ? $d['cname'] : '-';
                $t['session_fee'] = $sessions;
                $t['sl'] = ($sessions_count != 0) ? $sessions_count : 1;
                $t['dg'] = ($sessions_count != 0) ? $d['amount'] / $sessions_count : $d['amount'];
            }
            $t['amount'] = $d['amount'];
            $sum_amount += $d['amount'];

            if (!array_key_exists($d['cname'], $data)) {
                array_push($months, date('m', strtotime($date)));
                $data[$d['cname']][0] = $t;
            } else {
                $check = false;
                foreach ($data[$d['cname']] as $cl => $dt) {
                    if ($dt['dg'] == $t['dg']) {
                        $data[$d['cname']][$cl]['content'] = $data[$d['cname']][$cl]['content'] . ' , ' . date('m', strtotime('01-' . $d['month']));
                        $data[$d['cname']][$cl]['sl'] += $t['sl'];
                        $data[$d['cname']][$cl]['session_fee'] = array_merge($data[$d['cname']][$cl]['session_fee'], $t['session_fee']);
                        $data[$d['cname']][$cl]['amount'] += $t['amount'];
                        $check = true;
                        break;
                    }
                }
                if (!$check) {
                    $data[$d['cname']][] = $t;
                }
            }
        }
        //Content
        $logs = $student->fee_email_note ?  json_decode($student->fee_email_note) : new \stdClass();
        $logs->sent_user = auth()->user()->name;
        $logs->sent_time = strtotime(date('d-m-Y H:i:m'));
        $student->fee_email_note = json_encode($logs);
        $student->save();

        $classes = implode(', ', $classes);
        $months = implode(', ', $months);
        $months = date('m', strtotime($request->from)) . ' - ' . date('m', strtotime($request->to));
        $title = '[VIETELITE] THÔNG BÁO HỌC PHÍ LỚP ' . $classes . ' tháng ' . $months . ' năm học 2021-2022';
        $content = $classes . '_' . $this->vn_to_str($student_name);
        // print_r($data);d
        $max_date = date('d/m/Y', strtotime(date('Y-m-01', strtotime($request->from)) . ' + 9 days'));
        if (date('Y-m-d', strtotime(str_replace('/', '-', $max_date))) < date('Y-m-d')) {
            $max_date = date('d/m/Y', strtotime(date('Y-m-d') . '+ 2 days'));
        }
        $result = [
            'data' => $data, 'title' => $title, 'classes' => $classes,
            'max_date' => $max_date, 'student' => $student_name, 'sum_amount' => $sum_amount, 'content' => $content, 'center_id' => $center_id
        ];
        $center = Center::find($center_id);
        $result['center_address'] = ($center) ? $center->address : '';
        $result['center_phone'] = ($center) ? $center->phone : '';
        // echo "<pre>";
        // print_r($result);
        foreach ($result['data'] as $key => $fees) {
            foreach ($fees as $c => $fee) {
                $result['data'][$key][$c]['session_fee'] = $this->summaryArray($fee['session_fee']);
            }
        }
        return view('fee.a5', compact('result'));
    }

    public function sendEmail(Request $request)
    {
        $rules = ['data' => 'required', 'from' => 'required', 'to' => 'required'];
        $this->validate($request, $rules);
        $result = [];
        $months = [];
        $data = [];
        $student = Student::find($request->student_id);
        $parent_email = Parents::find($student->parent_id)->email;
        $student_name = $student->fullname;
        $sum_amount = 0;
        $content = '';
        $classes = [];
        $max_date = date('Y-m-d');
        $center_id = 0;

        foreach ($request->data as $key => $d) {
            if ($d['id'] < 0 && $d['id'] != '-1999') continue;
            //Class
            $date = date('Y-m-d', strtotime('01-' . $d['month']));

            if (!in_array($d['cname'], $classes)) {
                array_push($classes, $d['cname']);
            }
            $transaction = Transaction::find($d['id']);
            if ($d['id'] == -1999) {
                if ($d['amount'] > 0) {
                    $t['content'] = "Học phí thiếu kỳ trước";
                } else {
                    $t['content'] = "Học phí thừa kỳ trước";
                }
                $t['sl'] = 1;
                $t['dg'] = $d['amount'];
                $t['session_fee'] = [];
                $t['cname'] = '';
            } else {
                $class = Classes::find($transaction->class_id);
                if ($class) {
                    $center_id = $class->center_id;
                }
                $sessions_count = $transaction->sessions()->count();
                $sessions = $transaction->sessions()->select('sessions.fee')->get()->toArray();
                // echo "<pre>";
                // print_r($sessions);
                $t['session_fee'] = array_column(array_column($sessions, 'pivot'), 'amount');

                $t['cname'] = $d['cname'];
                $t['content'] = $d['content'];
                $t['sl'] = ($sessions_count != 0) ? $sessions_count : 1;
                $t['dg'] = ($sessions_count != 0) ? $d['amount'] / $sessions_count : $d['amount'];
            }
            $t['amount'] = $d['amount'];
            $sum_amount += $d['amount'];
            if (!array_key_exists($d['month'], $data)) {
                array_push($months, date('m', strtotime($date)));
                $data[$d['month']][0] = $t;
            } else {
                $data[$d['month']][] = $t;
            }
        }
        // print_r($data);
        //aadf
        $logs = $student->fee_email_note ?  json_decode($student->fee_email_note) : new \stdClass();
        $logs->sent_user = auth()->user()->name;
        $logs->sent_time = strtotime(date('d-m-Y H:i:m'));
        $student->fee_email_note = json_encode($logs);
        $student->save();

        if ($center_id == 3) {
            $max_date = date('d/m/Y', strtotime(date('Y-m-01', strtotime($request->from)) . ' + 5 days'));
        } else {
            $max_date = date('d/m/Y', strtotime(date('Y-m-01', strtotime($request->from)) . ' + 9 days'));
        }

        if (date('Y-m-d', strtotime(str_replace('/', '-', $max_date))) < date('Y-m-d')) {
            $max_date = date('d/m/Y', strtotime(date('Y-m-d') . '+ 2 days'));
        }
        $classes = implode(',', $classes);
        $months = date('m', strtotime($request->from)) . ' - ' . date('m', strtotime($request->to));
        $title = '[VIETELITE] THÔNG BÁO HỌC PHÍ LỚP ' . $classes . ' tháng ' . $months . ' năm học 2021-2022';

        $center = Center::find($center_id);
        $center_code = "";
        if ($center) {
            $center_code = $center->code;
        }
        $content = $center_code . '' . $student->id . '_' . $this->vn_to_str($student_name) . '_T' . str_replace(' - ', '', $months);


        $result = [
            'data' => $data, 'title' => $title, 'classes' => $classes,
            'max_date' => $max_date, 'student' => $student_name, 'sum_amount' => $sum_amount, 'content' => $content,
            'center_id' => $center_id, 'note' => $request->note, 'months' => $months
        ];
        foreach ($result['data'] as $key => $fees) {
            foreach ($fees as $c => $fee) {
                $result['data'][$key][$c]['session_fee'] = $this->summaryArray($fee['session_fee']);
            }
        }
        if ($request->preview) {
            return view('emails.tbhp', compact('result'));
        } else {
            $result['max_date'] = $request->max_date;
            $d = ['result' => $result];
            $to_email = $parent_email;
            $to_name = '';
            $mail = 'ketoantrungyen@vietelite.edu.vn';
            $password = 'V33du2020';
            if ($center_id == 5) {
                $mail = 'ketoantrungyen@vietelite.edu.vn';
                $password = 'V33du2020';
            }

            if ($center_id == 2 || $center_id == 4) {
                $mail = 'ketoancs1@vietelite.edu.vn';
                $password = 'V33du2020';
            }
            if ($center_id == 3) {
                $mail = 'cs.phamtuantai@vietelite.edu.vn';
                $password = 'Dum33181';
            }
            // try{
            $backup = Mail::getSwiftMailer();

            // // Setup your outlook mailer
            $transport = new \Swift_SmtpTransport('smtp-mail.outlook.com', 587, 'tls');
            $transport->setUsername($mail);
            $transport->setPassword($password);
            // // Any other mailer configuration stuff needed...

            $outlook = new \Swift_Mailer($transport);

            // // Set the mailer as gmail
            Mail::setSwiftMailer($outlook);
            // print_r($backup);
            // Send your message
            Mail::send('emails.tbhp', $d, function ($message) use ($to_name, $to_email, $result, $mail) {
                $message->to($to_email, $to_name)
                    ->to('webmaster@vietelite.edu.vn')
                    ->subject($result['title'])
                    ->replyTo($mail, 'Phụ huynh hs ' . $result['student']);
                $message->from($mail, 'VIETELITE EDUCATION CENTER');
            });

            // Restore your original mailer
            Mail::setSwiftMailer($backup);
            return response()->json(200);

            // }
            // catch(\Exception $e){
            //     // Get error here
            //     return response()->json(418);
            // }
        }

        // echo "<pre>";
        // print_r($result);


    }
    protected function summaryArray($arr)
    {
        // [a,a,a,b,c,d,b] => "3*a + 2*b + 1*c + 1*d"   
        $count_array = array_count_values($arr);
        $tmpArr = array();

        foreach ($count_array as $key => $val) {
            $tmpArr[] = number_format($key) . "*" . $val;
        }
        $result = implode(' + ', $tmpArr);
        return $result;
    }
    protected function importStudent()
    {
        if (($handle = fopen(public_path() . "/hs.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 100000000, "|")) !== FALSE) {
                $num = count($data);
                $parent_phone = $this->validPhone($data[4]);
                if ($parent_phone) {
                    //Check parent exist 
                    $p = Parents::where('phone', $parent_phone)->orWhere('alt_phone', '0' . $parent_phone)
                        ->first();
                    if ($p) { //Parent existed
                        //Check student exist
                        $dob = ($data[1] == "") ? NULL : date('Y-m-d', strtotime(str_replace('/', '-', $data[1])));
                        $s = Student::where('parent_id', $p->id)->where('dob', $dob)->first();
                        if ($s) { //student exists 
                            continue;
                        } else {
                            //Create new student
                            $student['parent_id'] = $p->id;
                            $student['fullname'] = $data[0];
                            $student['id'] = $data[9];
                            $student['dob'] = ($data[1] == "") ? NULL : date('Y-m-d', strtotime(str_replace('/', '-', $data[1])));
                            $student['school'] = $data[2];
                            $student['relationship_id'] = 1;
                            Student::create($student);
                        }
                    } else {
                        //Create new parent
                        $parent['fullname'] = $data[3];
                        $parent['phone'] = $parent_phone;
                        $parent['email'] = $data[5];
                        $parent['alt_fullname'] = $data[6];
                        $parent['alt_email'] = $data[8];
                        $parent['alt_phone'] = $this->validPhone($data[7]);
                        $parent['realtionship_id'] = 1;
                        $p = Parents::create($parent);
                        // echo "<pre>";
                        // print_r($parent);
                        // echo "</pre>";
                        //Create new student       
                        $student['parent_id'] = $p->id;
                        $student['fullname'] = $data[0];
                        $student['id'] = $data[9];
                        $student['dob'] = ($data[1] == "") ? NULL : date('Y-m-d', strtotime(str_replace('/', '-', $data[1])));
                        $student['school'] = $data[2];
                        $student['relationship_id'] = 1;
                        Student::create($student);
                    }
                }
            }
            fclose($handle);
        }
    }
    protected function hsk9()
    {
        $classes = Classes::where('year', '2020')->where('code', 'LIKE', '%9%')->get();
        $result = [];
        foreach ($classes as $c) {
            if ($c->code == 'TC5.9') continue;
            $students = $c->students;
            $r = [];
            foreach ($students as $s) {
                //Check exist
                $check = 1;
                foreach ($result as $key => $r) {
                    if (in_array($s->id, $r)) {
                        $result[$key][4] = $r[4] . "," . $c->code;
                        $result[$key][5] = $r[5] . "," . $s->detail['drop_time'];
                        $check = 0;
                        break;
                    }
                }
                //else
                if ($check == 1) {
                    $p = Parents::find($s->parent_id);
                    $result[] = [$s->id, 'https://center.vietelite.edu.vn/' . $s->avatar, $s->fullname, $s->dob, $c->code, $s->detail['drop_time'], $p->email, $p->alt_email];
                }
            }
        }
        $file = fopen(public_path() . "/hsk9.csv", "w");
        fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
        foreach ($result as $r) {
            fputcsv($file, $r);
        }
        return redirect("/public/hsk9.csv");
    }
    protected function csv()
    {
        $arr = [];
        $parent = Parents::all();
        $file = fopen(public_path() . "/contacts.csv", "w");
        foreach ($parent as $p) {
            $arr = [];
            array_push($arr, $p->fullname);
            array_push($arr, $p->phone);
            array_push($arr, $p->alt_fullname);
            array_push($arr, $p->alt_phone);
            array_push($arr, $p->email);
            $student = Student::where('parent_id', $p->id)->get();
            foreach ($student as $s) {
                $classes = $s->activeClasses()->get()->toArray();
                if (sizeof($classes) > 0) {
                    array_push($arr, $s->fullname);
                    array_push($arr, $s->dob);
                    array_push($arr, $s->school);
                    $class_str = "";
                    foreach ($classes as $class) {
                        $class_str = $class_str . "," . $class['code'];
                    }
                    array_push($arr, $class_str);
                }
            }
            fputcsv($file, $arr);
        }
        fclose($file);
    }
    protected function misaUpload()
    {
        $arr = ['1', '0'];
        $int = 0;

        $students = Student::where('misa_upload', '0')->get();
        $file = fopen(public_path() . "/misa_student.csv", "w");
        fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
        $first_line = ['Là tổ chức/cá nhân', 'Là nhà cung cấp', 'Mã khách hàng (*)', 'Tên khách hàng (*)', 'Địa chỉ', 'Mã số thuế', 'Điện thoại', 'Điện thoại di động', 'Fax', 'Email'];
        fputcsv($file, $first_line);

        foreach ($students as $s) {
            $arr = ['1', '0'];
            array_push($arr, 'KH' . str_pad($s->id, 5, '0', STR_PAD_LEFT));
            $classes = $s->activeClasses()->select('code')->get();
            $classes = implode(',', array_column($classes->toArray(), 'code'));
            array_push($arr, $s->fullname);
            array_push($arr, $classes);
            array_push($arr, '');
            array_push($arr, '');


            $parent = Parents::find($s->parent_id);
            if ($parent) {
                array_push($arr, $parent->phone);
                array_push($arr, '');
                array_push($arr, $parent->email);
            }
            $s->misa_upload = '1';
            $s->save();
            fputcsv($file, $arr);
        }
        return response('/public/misa_student.csv');
    }
    protected function chuanHoa()
    {
        $students = Student::all();
        foreach ($students as $s) {
            $checks = Student::where('fullname', $s->fullname)->where('parent_id', $s->parent_id)->where('id', '!=', $s->id)->get();
            foreach ($checks as $c) {
                $c->forceDelete();
            }
        }
    }
    public function normalPhone()
    {
        $parents = Parents::all();
        foreach ($parents as $p) {

            if (strpos($p->phone, '(') !== false) {
            }
            $p->phone = str_replace('(', '', str_replace(')', '', str_replace('-', '', str_replace(' ', '', $p->phone))));
            $p->save();
        }
    }
    public function testMail()
    {
        $ids = [1, 2];
        $datas = [];
        foreach ($ids as $key => $id) {
            $data = [];
            $student_session = StudentSession::find($id);
            if ($student_session) {
                $data['student'] = Student::find($student_session->student_id);
                $data['parent'] = Parents::find($data['student']->parent_id);
                $data['session'] = Session::find($student_session->session_id);
                $data['class'] = Classes::find($data['session']->class_id)->code;
                $data['center'] = Center::find($data['session']->center_id);
                $data['teacher'] = Teacher::find($data['session']->teacher_id)->name;
                $data['student_session'] = $student_session;
            }
            $datas[$key]  =  $data;
        }
        $d = array('datas' => $datas);
        return view('emails.thht', compact('datas'));
    }
    public function checkPhone(Request $request)
    {
        $rules = ['phone' => 'required', 'student_name' => 'required'];
        $this->validate($request, $rules);

        $parent = Parents::where('phone', $request->phone)->first();
        if ($parent) {
            $student = Student::where('parent_id', $parent->id)->where('fullname', 'LIKE', '%' . $request->student_name . '%')->first();
            if ($student) {
                $classes = $student->activeClasses()->select('code', 'classes.id')->get();
                if ($classes->count() > 0) {
                    return response()->json($classes->toArray());
                }
                return response()->json('Không tìm thấy lớp học tại VietElite', 401);
            } else {
                return response()->json('Không tìm thấy học sinh, vui lòng kiểm tra lại họ tên học sinh', 401);
            }
        } else {
            return response()->json('Không tìm thấy số điện thoại, vui lòng nhập số điện thoại đã đăng ký học cho học sinh tại VietElite', 401);
        }
    }
    public function registerEvent(Request $request)
    {
        $rules = ['phone' => 'required'];
        $this->validate($request, $rules);

        $query = ['utm_medium' => '', 'utm_source' => '', 'utm_campaign' => ''];
        $url = parse_url($request->url);
        if (array_key_exists('query', $url)) {
            parse_str($url['query'], $query);
        }
        //Check học sinh có trong hệ thống
        $result = [];
        $parent = Parents::where('phone', $request->phone)->orWhere('alt_phone', $request->phone)->first();

        if (!$parent) {
            $p['phone'] = $request->phone;
            $p['fullname'] = 'PH ' . $request->student_name;
            $p['email'] = $request->email;
            $p['relationship_id'] = 1;
            $parent = Parents::create($p);

            $st['parent_id'] = $parent->id;
            $st['fullname'] = $request->student_name;
            $st['dob'] = date('Y-m-d', strtotime($request->dob));
            $st['school'] = ($request->school) ? $request->school['label'] : '';
            $student = Student::create($st);
        } else {
            $student = Student::where('parent_id', $parent->id)->where('fullname', 'LIKE', '%' . $request->student_name . '%')->first();
            if (!$student) {
                $st['parent_id'] = $parent->id;
                $st['fullname'] = $request->student_name;
                $st['dob'] = date('Y-m-d', strtotime($request->dob));
                $st['school'] = ($request->school) ? $request->school['label'] : '';
                $student = Student::create($st);
            }
        }

        //Kiểm tra học sinh đã đăng ký sự kiện chưa
        $check_event = StudentClass::where('student_id', $student->id)->where('class_id', $request->selected_event)->first();
        $event = Classes::find($request->selected_event);
        if (!$event) {
            return response()->json('Không tìm thấy sự kiện', 403);
        }
        if (!$check_event) {
            //Them hoc sinh vao event
            // $student->classes()->attach([$request->selected_event]);
            $input['student_id'] = $student->id;
            $input['class_id'] = $request->selected_event;
            $input['entrance_date'] = date('Y-m-d');
            $input['status'] = 'waiting';
            if (array_key_exists('fbclid', $query)) {
                $input['source'] = 'Fb';
                $input['medium'] = 'direct';
                $input['name'] = 'direct';
            } else {
                $input['medium'] = $query['utm_medium'];
                $input['source'] = $query['utm_source'];
                $input['name'] = $query['utm_campaign'];
            }
            $check_event = StudentClass::create($input);
        }
        $product_ids = [];
        $total_amount = 0;
        $product_count = 0;
        foreach ($request->products as $product) {
            if ($product['active'] == 1) {
                $product_count++;
                $check = StudentSession::where('student_id', $student->id)->where('session_id', $product['id'])->first();
                if (!$check) {
                    // add student to event 
                    // $student->
                    $input_ss['student_id'] = $student->id;
                    $input_ss['session_id'] = $product['id'];
                    $ss = StudentSession::create($input_ss);
                    $amount = $product['fee'];
                    if (sizeof($request->classes) > 0) {
                        $amount -= $product['fee'] / 100 * $product['percentage'];
                    }
                    $total_amount += $amount;
                    $product_ids[$product['id']] = ['amount' => $amount];
                    //   
                    $result['product'][] = $product;
                }
            }
        }

        $result['student']['name'] = $student->fullname;
        $result['student']['id'] = $student->id;
        $result['student']['dob'] = date('d/m/Y', strtotime($student->dob));
        $result['student']['school'] = $student->school;
        $result['parent']['name'] = $parent->fullname;
        $result['parent']['email'] = $parent->email;
        $result['parent']['phone'] = $parent->phone;

        $result['event']['name'] = $event->name;
        $result['event']['open_date'] = $event->open_date;
        $result['total_fee'] = $total_amount;
        foreach ($request->locations as $location) {
            if ($location['active']) {
                $result['location'] = $location['label'];
            }
        }
        $result['ck_content'] = $this->vn_to_str($student->fullname) . " " . $result['parent']['phone'];
        if ($total_amount != 0) {
            $t['debit'] = Account::Where('level_2', '131')->first()->id;
            $t['credit'] = Account::Where('level_2', '3387')->first()->id;
            $t['amount'] = $total_amount;
            $t['time'] = Date('Y-m-d');
            $t['student_id'] = $student->id;
            $t['class_id'] = $request->selected_event;
            $t['user'] = '-1';
            $t['content'] = 'Lệ phí thi thử';
            $created_transaction = Transaction::create($t);
            $created_transaction->tags()->syncWithoutDetaching([7]);
            $created_transaction->sessions()->syncWithoutDetaching($product_ids);
            // return response()->json('Đăngd ký thành công, vui lòng kiểm tra hòm thư đến', 200);
        } else {
            return response()->json('Đã đăng ký, vui lòng kiểm tra hòm thư đến.', 402);
        }

        $to_email = $request->email;
        $to_name = '';
        $mail = "thithu@vietelite.edu.vn";
        $password = "Boc24038";
        $d = ['result' => $result];

        SendEventNotify::dispatch($result, $to_email, $to_name);
        $product_str = implode(', ', array_column($request->products, 'content'));
        if (strlen($product_str) > 10)
            $product_str = substr($product_str, 0, 25) . '...';
        $body = [
            'phone' => '+84' . ltrim($result['parent']['phone'], '0'),
            'template_id' => '219155',
            'template_data' => [
                'student_name' => $result['student']['name'],
                'student_id' => 'HS' . $result['student']['id'],
                'event_name' => $result['event']['name'],
                'date' => date('d/m/Y', strtotime($result['event']['open_date'])),
                'dob' => $result['student']['dob'],
                'products' => $product_count . ' bài',
                'fee' => $result['total_fee'],
                'created_date' => date('H:i:s d/m/Y'),
            ],
        ];
        $client = new Client();
        $zns_api = 'https://business.openapi.zalo.me/message/template?access_token=iKGMLgs70XEzHX9KfuO64RT06rIgcNr4q28h1f-7TqU36Jm9mBv85g888Yp7p5WyXNHG2UdvGnkNH1SEp-P7CuPI4pwOodnn-WuAJE6cI6kuPHTCoDbnNfH9DahwY4HEgoq9QyxjQsIhSWWZpUru08TlEKQVx5K8XqmlCVNqN2lbHHjic_TsI8jQPdRLrIfFoLXBRQo29own8N8nmViQDg1s2pN5p4eCdruvDFoVMGM_6Kf4puOrKP43IdVJi3r7kW5SGR-H4Ldj3G1dYerXFTit4Wp0Y0TBAFSbTwgT0XK';
        $response = $client->request('POST', $zns_api, [
            \GuzzleHttp\RequestOptions::JSON => $body
        ]);
        echo $response->getbody();

        return response()->json(200);
        try {
        } catch (\Exception $e) {
            // Get error here
            return response()->json(418);
        }
        //Thêm học sinh vào event

    }
    protected function getChart($session_id, $current_score)
    {
        $current_score = (float) $current_score;
        $session = Session::find($session_id);
        $students = $session->students;
        $label = [];
        $result = [];
        $max = 0;
        // $max
        //Label 
        foreach ($students as $key => $s) {
            if ($s->pivot['max_score'] && count($label) == 0) {
                for ($i = 0; $i < $s->pivot['max_score']; $i++) {
                    $label[] = $i . "-" . ($i + 1);
                }
                $max = $s->pivot['max_score'];
                break;
            }
        }
        if (count($label) == 0) {
            $label = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10'];
            $max = 10;
        }
        foreach ($label as $key => $l) {
            $result[$key] = 0;
        }
        $max_score = 0;
        $min_score = 100;
        $sum = 0;
        $count = 0;
        $avg = 0;
        $rank = sizeof($students);
        foreach ($students as $key => $s) {
            if ($s->pivot['score'] > 0 && $s->pivot['score'] <= $max) {
                $score = ((int)$s->pivot['score']);
                $real_score = (float)$s->pivot['score'];
                if (is_numeric($real_score)) {
                    $count++;
                    $sum += $real_score;
                    $max_score = ($max_score < $real_score) ? $real_score : $max_score;
                    $min_score = ($min_score > $real_score) ? $real_score : $min_score;
                }
                if (!is_numeric($real_score) || $real_score < $current_score) {
                    $rank--;
                }
                if ($score == $max) {
                    $result[$max - 1]++;
                } else {
                    $result[$score]++;
                }
            } else {
                $rank--;
            }
            if ($count != 0) {
                $avg = round($sum / $count);
            }
        }
        return ['chart' => ['label' => $label, 'data' => $result], 'max' => $max_score, 'min' => $min_score, 'avg' => $avg, 'rank' => $rank . '/' . sizeof($students)];
    }
    protected function getResult(Request $request)
    {
        $rules = ['sbd' => 'required', 'passcode' => 'required'];
        $this->validate($request, $rules);

        $week = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        $class_code = substr($request->sbd, 0, 5);
        $student_class_id = substr($request->sbd, 5);

        $event = Classes::where('code', $class_code)->first();
        $studentClass = StudentClass::find($student_class_id);
        if (!$event || !$studentClass) {
            return response()->json('Số báo danh không đúng, Vui lòng kiểm tra lại!', 401);
        }
        $result = [];
        if ($studentClass) {
            $student = Student::find($studentClass->student_id);
            $parent = Parents::find($student->parent_id);
            if ($parent->password != $request->passcode) {
                return response()->json('Mã bảo mật không đúng', 401);
            } else {
                $result['student'] = [
                    'fullname' => $student->fullname,
                    'dob' => date('d/m/Y', strtotime($student->dob)),
                    'school' => $student->school,
                    'phone' => $parent->phone, 'email' => $parent->email, 'sbd' => $request->sbd
                ];
                $sessions = $student->sessionsOfClass($event->id)->select('room.name as location', 'content', 'from', 'to', 'sessions.id', 'document')->leftJoin('room', 'sessions.room_id', 'room.id')->get();

                foreach ($sessions as $s) {
                    $getChart = $this->getChart($s->id, $s['pivot']['score']);
                    $date = $week[date('w', strtotime($s->from))] . ", " . date('d/m/Y', strtotime($s->from));
                    $from = date('h:i', strtotime($s->from));
                    $to = date('h:i', strtotime($s->to));
                    $result['sessions'][] = [
                        'code' => $request->sbd,
                        'content' => $s['content'], 'location' => $s['location'],
                        'sbd' => $s['pivot']['btvn_score'],
                        'room' => $s['pivot']['btvn_comment'], 'score' => $s['pivot']['score'],
                        'comment' => $s['pivot']['comment'], 'time' => $from . " - " . $to, 'date' => $date,
                        'chart' => $getChart['chart'], 'document' => $s->document,
                        'max' => $getChart['max'], 'min' => $getChart['min'], 'avg' => $getChart['avg'],
                        'rank' => $getChart['rank']

                    ];
                }
            }
        }
        return response()->json($result);
    }
    protected function sendReminder(Request $request)
    {
        $rules = ['class_id' => 'required', 'sessions' => 'required'];
        $this->validate($request, $rules);

        $week = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

        $class = Classes::find($request->class_id);
        $students = $class->activeStudents;
        foreach ($students as $student) {
            $result = [];
            $parent = Parents::find($student->parent_id);
            $sessions = $student->sessionsOfClass($class->id)->get();
            $result['student_name'] = $student->fullname;
            $result['pass'] = $parent->password;
            $mail_to = $parent->email;
            $result['code'] = $class->code . '' . $student['sc_id'];
            foreach ($sessions as $session) {
                if (in_array($session->id, $request->sessions)) {
                    $ss = $session->pivot;
                    if ($ss['btvn_comment']) {
                        $loc = explode('.', $ss['btvn_comment']);
                        if (sizeof($loc) == 2) {
                            $room = $loc[1];
                            $address = $loc[0];
                        } else {
                            $room = $loc[0];
                            $address = $loc[0];
                        }
                        switch ($address) {
                            case 'TDH':
                                $loc = '33 ngõ 91 Trần Duy Hưng, Trung Hòa, Cầu Giấy';
                                break;

                            case 'DQ':
                                $loc = 'Số 2 ngõ 44 Đỗ Quang, Trung Hòa, Cầu Giấy';
                                # code...
                                break;

                            case 'TY':
                                $loc = 'Số 23 Lô 14A Trung Yên 11, Trung Hòa, Cầu Giấy';
                                # code...
                                break;

                            case 'PTT':
                                $loc = '5 ngõ 3 Phạm Tuấn Tài, Dịch Vọng Hậu, Cầu Giấy';
                                # code...
                                break;

                            default:
                                # code...
                                break;
                        }
                        $from = date('G:i', strtotime($session->from));
                        $to = date('G:i', strtotime($session->to));
                        $date = $week[date('w', strtotime($session->from))] . ", " . date('d/m/Y', strtotime($session->from));
                        $result['event_name'] = $class->name . " - " . $date;
                        $time = str_replace(':', 'h', $from . '-' . $to);
                        $result['product'][] = [
                            'content' => $session->content,
                            'sbd' => $ss['btvn_score'],
                            'room' => $room,
                            'address' => $loc,
                            'date' => $date,
                            'time' => $time,
                        ];
                    } else continue;
                }
            }
            // echo "<pre>";
            // print_r($result);
            if (array_key_exists('product', $result)) {
                // SendEventReminder::dispatch($result, $mail_to, '');
                return view('emails.events.reminder', compact('result'));
            }
        }
        return response()->json('queued');
    }
    function vn_to_str($str)
    {

        $unicode = array(

            'a' => 'á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ',

            'd' => 'đ',

            'e' => 'é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ',

            'i' => 'í|ì|ỉ|ĩ|ị',

            'o' => 'ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ',

            'u' => 'ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự',

            'y' => 'ý|ỳ|ỷ|ỹ|ỵ',

            'A' => 'Á|À|Ả|Ã|Ạ|Ă|Ắ|Ặ|Ằ|Ẳ|Ẵ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ',

            'D' => 'Đ',

            'E' => 'É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ',

            'I' => 'Í|Ì|Ỉ|Ĩ|Ị',

            'O' => 'Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ',

            'U' => 'Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự',

            'Y' => 'Ý|Ỳ|Ỷ|Ỹ|Ỵ',

        );

        foreach ($unicode as $nonUnicode => $uni) {

            $str = preg_replace("/($uni)/i", $nonUnicode, $str);
        }
        // $str = str_replace(' ','_',$str);

        return $str;
    }
    public function deleteId($id)
    {
        $student = Student::find($id);
        if ($student) {
            $transactions = Transaction::where('student_id', $id)->get();
            foreach ($transactions as $t) {
                $t->forceDelete();
            }
            $sc = StudentClass::where('student_id', $id)->get();
            foreach ($sc as $x) {
                $x->forceDelete();
            }
            $ss = StudentSession::where('student_id', $id)->get();
            foreach ($ss as $x) {
                $x->forceDelete();
            }
            $parent = Parents::find($student->parent_id);
            $parent->forceDelete();
            $student->forceDelete();
        }
    }
    // public function normalizeDb(){
    //     $parents = Parents::all();
    //     foreach($parents as $p){
    //         //Normalize phone
    //         // if(strlen($p->phone )> 0){
    //         //     if($p->phone[0] != 0){
    //         //         print_r($p->phone."<br>");
    //         //         $check_p = Parents::where('phone', '0'.$p->phone)->first();
    //         //         if($check_p){
    //         //             print('Trùng sđth phụ huynh: '. $check_p->phone.'<br>');
    //         //         }
    //         //         else{
    //         //             $p->phone = '0'.$p->phone;
    //         //             $p->save();
    //         //         }
    //         //     }
    //         // }
    //         $students = $p->students()->select('students.fullname','students.id')->get();

    //         $unique_students = array_unique(array_column($students->toArray(), 'fullname'));
    //         if(count($students) > 1 && count($students) > count($unique_students)){
    //             echo "<br>";
    //             foreach($students as $student){
    //                 // print_r($student->fullname. " - ");
    //                 $classes = $student->classes;
    //                 if(count($classes) == 0){
    //                     print_r($student->fullname. " - ");
    //                 }
    //             }
    //         }

    //     }
    // }

}
