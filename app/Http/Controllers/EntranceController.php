<?php

namespace App\Http\Controllers;

use DB;
use App\Entrance;
use App\Student;
use App\Step;
use App\Relationship;
use App\Status;
use App\Parents;
use App\StudentClass;
use App\Session;
use App\StudentSession;
use App\Classes;
use App\Transaction;
use App\Discount;
use App\Account;
use App\Source;
use App\Medium;
use App\Comment;
use App\EntranceStatus;
use App\EntranceStat;
use Illuminate\Http\Request;

class EntranceController extends Controller
{
    //
    protected function EntranceLose()
    {
        $file = fopen(public_path() . "/student_ptt.csv", "w");
        fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
        $first_line = [
            'Họ tên', 'Ngày sinh', 'Họ tên PH', 'Số điện thoại', 'Email', 'Ngày tiếp nhận', 'Ngày kiểm tra', 'Kết quả', 'Note', 'Khoá học ĐK', 'Cơ sở'
        ];
        fputcsv($file, $first_line);

        $entrances = Entrance::whereIn('status_id', [3, 4, 6, 8, 10])
            ->select(
                'students.fullname as studentname',
                'students.dob',
                'parents.fullname',
                'parents.phone',
                'parents.email',
                'entrances.created_at',
                'entrances.test_time',
                'test_score',
                'steps.name as step',
                'entrances.note',
                'courses.name as course',
                'center.code'
            )
            ->leftJoin('students', 'entrances.student_id', 'students.id')
            ->leftJoin('center', 'entrances.center_id', 'center.id')
            ->leftJoin('courses', 'entrances.course_id', 'courses.id')
            ->leftJoin('parents', 'students.parent_id', 'parents.id')
            ->leftJoin('steps', 'entrances.step_id', 'steps.id')
            ->get();
        foreach ($entrances->toArray() as $e) {
            fputcsv($file, array_values($e));
            echo "<pre>";
            print_r(array_values($e));
        }
        return response('/public/student_ptt.csv');

        //        echo "<pre>";
        // print_r($entrances->toArray());
    }
    protected function handleCreateEntrance($student_id, $center_id, $course_id, $test_time, $note, $medium_id)
    {
        // protected $fillable = ['student_id','course_id','center_id','test_time',
        // 'test_answers','test_score','test_note','note','priority','step_id','step_updated_at','status_id'];
        $input['student_id'] = $student_id;
        $input['center_id'] = $center_id;
        $input['course_id'] = $course_id;
        $input['test_time'] = $test_time;
        $input['note'] = $note;
        $s = Student::find($student_id);
        $input['priority'] = ($r = Relationship::find($s->relationship_id)) ? $r->weight : 0;

        $init_step = Step::where('type', 'Quy trình đầu vào')->orderBy('order', 'asc')->first();

        $input['step_id'] = ($init_step->id) ? $init_step->id : null;
        $input['step_updated_at'] = date("Y-m-d H:i:s");

        $init_status = Status::where('type', 'Quy trình đầu vào')->orderBy('id', 'asc')->first();
        $input['status_id'] = ($init_status->id) ? $init_status->id : null;
        //Get medium
        $medium = Medium::find($medium_id);
        if ($medium) {
            $input['medium_id'] = $medium->id;
            $input['source_id'] = $medium->source_id;
        }
        $new_entrance = Entrance::create($input);
        return $new_entrance;
    }
    protected function handleCreateStudent($parent_id, $request)
    {
        $s['parent_id'] = $parent_id;
        $s['relationship_id'] = ($request['selected_relationship'] == "") ? "" : $request['selected_relationship']['value'];
        $s['fullname'] = $request['student_name']['value'];
        $s['school'] = ($request['student_school'] == '') ? '' : $request['student_school']['label'];
        $s['grade'] = $request['student_grade'];
        $s['email'] = $request['student_email'];
        $s['phone'] = $request['student_phone'];
        $s['dob'] = $request['student_dob'];
        $s['gender'] = $request['student_gender'];

        return Student::create($s);
    }
    protected function handleUpdateStudent($student_id, $request)
    {
        // $s['parent_id'] = $parent_id;
        $s['relationship_id'] = $request['selected_relationship']['value'];
        $s['fullname'] = $request['student_name']['label'];
        $s['school'] = $request['student_school']['label'];
        $s['grade'] = $request['student_grade'];
        $s['email'] = $request['student_email'];
        $s['phone'] = $request['student_phone'];
        $s['dob'] = $request['student_dob'];
        $s['gender'] = $request['student_gender'];

        return Student::find($student_id)->update($s);
    }
    protected function createEntrance(Request $request)
    {
        //Validation
        $rules = [
            'student_name' => 'required',
            'parent_name' => 'required',
            'parent_phone' => 'required',
            'entrance_center' => 'required',
        ];
        $messages = [
            'student_name.required' => 'Vui lòng điền tên học sinh',
            'parent_name.required' => 'Vui lòng điền tên phụ huynh',
            'parent_email.required' => 'Vui lòng điền email phụ huynh',
            'parent_email.email' => 'Email không hợp lệ',
            'parent_phone.required' => 'Vui lòng điền số điện thoại phụ huynh',
            'entrance_center.required' => 'Vui lòng chọn cơ sở đăng ký',
        ];
        $this->validate($request, $rules, $messages);
        $request = $request->toArray();
        $request['entrance_date'] = ($request['entrance_date']) ? date('Y-m-d H:i:m', $request['entrance_date']) : null;
        $request['student_dob'] = ($request['student_dob']) ? date('Y-m-d', $request['student_dob']) : null;
        $p = [];
        $p['fullname'] = $request['parent_name'];
        $p['relationship_id'] = ($request['selected_relationship'] == "") ? "" : $request['selected_relationship']['value'];
        $p['phone'] = $request['parent_phone']['label'];
        $p['email'] = $request['parent_email'];
        $p['note'] = $request['parent_note'];
        $p['alt_fullname'] = $request['parent_alt_name'];
        $p['alt_email'] = $request['parent_alt_email'];
        $p['alt_phone'] = $request['parent_alt_phone'];
        $sid = NULL;
        //Check parent exist
        if ($request['parent_phone']['__isNew__']) {
            // New parent
            $parent = Parents::create($p);
            if ($request['student_name']['__isNew__']) { // New Student
                //Create new student
                $student = $this->handleCreateStudent($parent->id, $request);
                //Create Entrance
                $sid = $student->id;
            }
        } else {
            //Existed parent
            //Update parent \
            $par = Parents::find($request['parent_phone']['value']);
            $p['relationship_id'] = $par->relationship_id;

            Parents::find($request['parent_phone']['value'])->update($p);
            if ($request['student_name']['__isNew__']) { // New Student
                //Create new student
                $parent_id = $request['parent_phone']['value'];
                $student = $this->handleCreateStudent($parent_id, $request);
                //Create Entrance
                $sid = $student->id;
            } else {
                $student_id = $request['student_name']['value'];
                $this->handleUpdateStudent($student_id, $request);
                $sid = $student_id;
            }
        }
        //check mdiu
        $medium_id = (is_array($request['source'])) ? $request['source']['value'] : NULL;
        foreach ($request['entrance_courses'] as $entrance_course) {
            $new_entrance = $this->handleCreateEntrance($sid, $request['entrance_center']['value'], $entrance_course['value'], $request['entrance_date'], $request['entrance_note'], $medium_id);
        }
        if (sizeof($request['entrance_courses']) == 0) {
            $new_entrance = $this->handleCreateEntrance($sid, $request['entrance_center']['value'], NULL, NULL, $request['entrance_note'], $medium_id);
        }
        return response()->json('ok');
    }


    protected function getEntrance(Request $request)
    {
        $rules = [
            'center_id' => 'required',
            'course_id' => 'required',
            'step_id' => 'required',
            'user_id' => 'required',
            'student_id' => 'required',
        ];
        $this->validate($request, $rules);

        // Filter by only step
        $step_id = $request->step_id;
        if ($step_id == -1) {
            //Get all entrance
            $entrances = Entrance::all();
            return response()->json($entrances);
        }
        // $entrances = Entrance::where('step_id', $request->step)

    }
    protected function getSource()
    {
        $sources = Source::where('campaign_id', 1)->get();
        $result = [];
        foreach ($sources as $key => $source) {
            $mediums = Medium::where('source_id', $source->id)->select('name as label', 'id as value', 'source_id')->get();
            $result[] = [
                'label' => $source->name,
                'options' => $mediums->toArray(),
            ];
        }
        return response()->json($result);
    }
    protected function getEntranceByStep($step, $centers, $from, $to)
    {
        $completed = Status::where('name', 'Đã xử lý')->first()->id;
        $lost = Status::where('name', 'Mất')->first()->id;
        $delay = Status::where('name', 'Chờ')->first()->id;
        $entrances = Entrance::Select(
            'entrances.id as eid',
            'entrances.test_time',
            'entrances.test_results',
            DB::raw('DATE_FORMAT(test_time, "%d/%m/%Y %h:%i %p") AS test_time_formated'),
            'test_answers',
            'test_score',
            'test_note',
            'entrances.note as note',
            'priority',
            'entrances.created_at as created_at',
            'students.id as sid',
            'students.fullname as sname',
            DB::raw('DATE_FORMAT(dob, "%d/%m/%Y") AS dob'),
            'students.grade',
            'students.email as semail',
            'students.phone as sphone',
            'students.gender',
            'students.school',
            'parents.id as pid',
            'parents.fullname as pname',
            'parents.phone as phone',
            'parents.email as pemail',
            'relationships.name as rname',
            'relationships.id as rid',
            'parents.alt_fullname as alt_pname',
            'parents.alt_email as alt_pemail',
            'parents.alt_phone as alt_phone',
            'parents.note as pnote',
            'relationships.color as color',
            DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
            'courses.id as course_id',
            'center.name as center',
            'center.id as center_id',
            'steps.name as step',
            'steps.id as step_id',
            'status.name as status',
            'status.id as status_id',
            'classes.id as class_id',
            'classes.code as class',
            'enroll_date',
            'message',
            'step_updated_at',
            'attempts',
            DB::raw('CONCAT(sources.name," ",mediums.name)  AS source')
        )->where('entrances.step_id', $step)
            ->where('entrances.created_at', '>=', $from)
            ->where('entrances.created_at', '<=', $to)

            ->where('entrances.status_id', '!=', $completed)
            ->where('entrances.status_id', '!=', $lost)
            ->where('entrances.status_id', '!=', $delay)
            ->whereIn('entrances.center_id', $centers)
            ->leftJoin('students', 'student_id', 'students.id')->join('parents', 'students.parent_id', 'parents.id')
            ->leftJoin('sources', 'source_id', 'sources.id')->leftJoin('mediums', 'medium_id', 'mediums.id')
            ->leftJoin('relationships', 'parents.relationship_id', 'relationships.id')
            ->leftJoin('courses', 'course_id', 'courses.id')->leftJoin('center', 'center_id', 'center.id')
            ->leftJoin('steps', 'step_id', 'steps.id')->leftJoin('status', 'status_id', 'status.id')
            ->leftJoin('classes', 'class_id', 'classes.id')->orderBy('entrances.status_id', 'asc')
            ->orderBy('priority', 'desc')->orderBy('created_at', 'desc')->get()->toArray();
        foreach ($entrances as $key => $entrance) {
            if (!auth()->user()->can('read_phone')) {
                $entrances[$key]['phone'] = '******' . substr($entrance['phone'], 6);
            }
            if (!auth()->user()->can('read_email')) {
                $entrances[$key]['pemail'] = '******' . substr($entrance['pemail'], 6);
            }
        }
        return $entrances;
    }
    protected function getEntranceByStatus($status, $centers)
    {
        $entrances = Entrance::Select(
            'entrances.id as eid',
            'entrances.test_time',
            'entrances.test_results',
            DB::raw('DATE_FORMAT(test_time, "%d/%m/%Y %h:%i %p") AS test_time_formated'),
            'test_answers',
            'test_score',
            'test_note',
            'entrances.note as note',
            'priority',
            'entrances.created_at as created_at',
            'students.id as sid',
            'students.fullname as sname',
            DB::raw('DATE_FORMAT(dob, "%d/%m/%Y") AS dob'),
            'students.grade',
            'students.email as semail',
            'students.phone as sphone',
            'students.gender',
            'students.school',
            'parents.id as pid',
            'parents.fullname as pname',
            'parents.phone as phone',
            'parents.email as pemail',
            'relationships.name as rname',
            'relationships.id as rid',
            'parents.alt_fullname as alt_pname',
            'parents.alt_email as alt_pemail',
            'parents.alt_phone as alt_phone',
            'parents.note as pnote',
            'relationships.color as color',
            DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
            'courses.grade as grade',
            'courses.id as course_id',
            'center.name as center',
            'center.id as center_id',
            'steps.name as step',
            'steps.id as step_id',
            'status.name as status',
            'status.id as status_id',
            'classes.id as class_id',
            'classes.code as class',
            'enroll_date',
            'message',
            'step_updated_at',
            'attempts',
            DB::raw('CONCAT(sources.name," ",mediums.name)  AS source')
        )->where('entrances.status_id', $status)
            ->whereIn('entrances.center_id', $centers)
            ->leftJoin('students', 'student_id', 'students.id')->join('parents', 'students.parent_id', 'parents.id')
            ->leftJoin('sources', 'source_id', 'sources.id')->leftJoin('mediums', 'medium_id', 'mediums.id')
            ->leftJoin('relationships', 'parents.relationship_id', 'relationships.id')
            ->leftJoin('courses', 'course_id', 'courses.id')->leftJoin('center', 'center_id', 'center.id')
            ->leftJoin('steps', 'step_id', 'steps.id')->leftJoin('status', 'status_id', 'status.id')
            ->leftJoin('classes', 'class_id', 'classes.id')->orderBy('entrances.status_id', 'asc')
            ->orderBy('priority', 'desc')->orderBy('created_at', 'desc')->get();
        return $entrances;
    }
    protected function getEntranceInit(Request $request)
    {
        $rules = ['centers' => 'required'];
        $this->validate($request, $rules);
        $from = date('Y-m-d', $request->from / 1000);
        $to = date('Y-m-d 23:59:59', $request->to / 1000);

        $centers = explode('_', $request->centers);
        // $entrances = Entrance::all();
        return response()->json($this->getEntranceByStep(1, $centers, $from, $to));
    }
    protected function getEntranceAppointment(Request $request)
    {
        $rules = ['centers' => 'required'];
        $this->validate($request, $rules);

        $from = date('Y-m-d', $request->from / 1000);
        $to = date('Y-m-d 23:59:59', $request->to / 1000);
        $centers = explode('_', $request->centers);
        return response()->json($this->getEntranceByStep(2, $centers, $from, $to));
    }
    protected function getEntranceResult(Request $request)
    {
        $rules = ['centers' => 'required'];
        $this->validate($request, $rules);

        $from = date('Y-m-d', $request->from / 1000);
        $to = date('Y-m-d 23:59:59', $request->to / 1000);
        $centers = explode('_', $request->centers);
        return response()->json($this->getEntranceByStep(3, $centers, $from, $to));
    }
    protected function getEntranceInform(Request $request)
    {
        $rules = ['centers' => 'required'];
        $this->validate($request, $rules);

        $from = date('Y-m-d', $request->from / 1000);
        $to = date('Y-m-d 23:59:59', $request->to / 1000);
        $centers = explode('_', $request->centers);
        $entrances = $this->getEntranceByStep(4, $centers, $from, $to);
        foreach ($entrances as &$e) {
            $e['deadline'] = date('d-m-Y', strtotime($e['step_updated_at'] . "+1 days"));
            $e['deadline_formated'] = date('Y-m-d', strtotime($e['step_updated_at'] . "+1 days"));
        }
        return response()->json($entrances);
    }
    protected function getEntranceFinal(Request $request)
    {
        $rules = ['centers' => 'required'];
        $this->validate($request, $rules);

        $from = date('Y-m-d', $request->from / 1000);
        $to = date('Y-m-d 23:59:59', $request->to / 1000);
        $centers = explode('_', $request->centers);
        $entrances = $this->getEntranceByStep(5, $centers, $from, $to);
        return response()->json($entrances);
    }
    protected function getEntranceDelay(Request $request)
    {
        $rules = ['centers' => 'required'];
        $this->validate($request, $rules);

        $centers = explode('_', $request->centers);
        $status = Status::where('name', 'Chờ')->first();
        $entrances = $this->getEntranceByStatus($status->id, $centers);
        return response()->json($entrances);
    }
    protected function getEntranceLost(Request $request)
    {
        $rules = ['centers' => 'required'];
        $this->validate($request, $rules);

        $centers = explode('_', $request->centers);
        $status = Status::where('name', 'Mất')->first();
        $entrances = $this->getEntranceByStatus($status->id, $centers);
        return response()->json($entrances);
    }

    protected function editEntrance(Request $request)
    {
        $rules = ['student_id' => 'required', 'entrance_id' => 'required'];
        $this->validate($request, $rules);

        // Edit Student and Parent
        $student = Student::find($request->student_id);
        if ($student) {
            // $student->relationship_id = $request->selected_relationship['value'];
            $student->fullname = $request->student_name['label'];
            $student->school = $request->student_school['label'];
            $student->grade = $request->student_grade;
            $student->email = $request->student_email;
            $student->phone = $request->student_phone;
            $student->dob = ($request->student_dob) ? date('Y-m-d', strtotime($request->student_dob)) : null;
            $student->gender = $request->student_gender;
            $student->parent_id = $request->parent_id;
            $student->save();
        }
        //Check parent exist
        if ($request->parent_phone['__isNew__']) {
            $r = $request->toArray();
            $p = [];
            $p['fullname'] = $r['parent_name'];
            $p['relationship_id'] = $r['selected_relationship']['value'];
            $p['phone'] = $r['parent_phone']['label'];
            $p['email'] = $r['parent_email'];
            $p['note'] = $r['parent_note'];
            $p['alt_fullname'] = $r['parent_alt_name'];
            $p['alt_email'] = $r['parent_alt_email'];
            $p['alt_phone'] = $r['parent_alt_phone'];
            $parent = Parents::create($p);
            $student->parent_id = $parent->id;
            $student->save();
        }
        if ($request->parent_changed && !$request['parent_phone']['__isNew__']) {
            $p = Parents::find($request->parent_id);
            if ($p) {
                // $p->relationship_id = $request->selected_relationship['value'];
                $p->fullname = $request->parent_name;
                $p->phone = $request->parent_phone['label'];
                $p->email = $request->parent_email;
                $p->note = $request->parent_note;
                $p->alt_fullname = $request->parent_alt_name;
                $p->alt_email = $request->parent_alt_email;
                $p->alt_phone = $request->parent_alt_phone;
                $p->save();
            }
        }
        //Edit Entrance
        if ($request->entrance_changed) {
            $e = Entrance::find($request->entrance_id);
            if ($e) {
                $e->center_id = $request->entrance_center['value'];
                $e->course_id = $request->entrance_courses['value'];
                $e->test_time = ($request->entrance_date) ? date('Y-m-d H:i:m', strtotime($request->entrance_date)) : null;

                $e->note = $request->entrance_note;
                //Status changed                
                if ($e->status_id != $request->entrance_status['value']) {
                    $e->status_id = $request->entrance_status['value'];
                    $e->status()->attach([
                        $e->status_id => ['active' => '1', 'user_id' => auth()->user()->id]
                    ]);
                }
                //Check step changed
                if ($e->step_id != $request->entrance_step['value']) {
                    $e->step_updated_at = date('Y-m-d H:i:s');
                    $e->step_id = $request->entrance_step['value'];
                }
                $e->test_score = $request->test_score;
                $e->test_note = $request->test_note;
                //Check if student enrolled or not 
                if ($e->enroll_date == NULL && $e->class_id == NULL && $request->enroll_date && $request->entrance_classes) {
                    $e->enroll_date = date('Y-m-d', strtotime($request->enroll_date));
                    $e->class_id = $request->entrance_classes['value'];
                    $e->save();
                    //Enroll student to class
                    $this->enrollStudent($e->class_id, $e->student_id, $e->enroll_date);
                } else {
                    $e->save();
                }
            }
        }
    }
    protected function enrollStudent($class_id, $student_id, $entrance_date)
    {
        //Enroll Student to class

        $enroll['student_id'] = $student_id;
        $enroll['class_id'] = $class_id;
        $enroll['entrance_date'] = $entrance_date;
        print_r($enroll);
        $check = StudentClass::where('student_id', $student_id)->where('class_id', $class_id)->first();
        if ($check) {
            $old_entrance_date = date('Y-m-d', strtotime($check->entrance_date));
            $new_entrance_date = date('Y-m-d', strtotime($entrance_date));
            if ($new_entrance_date > $old_entrance_date) {
                $sessions = Session::whereBetween('date', [$old_entrance_date, $new_entrance_date])->get();
                foreach ($sessions as $s) {
                    // Bo khoi diem danh
                    $s->students()->detach([$student_id]);
                    //Bo hoc phi
                    $transactions = $s->transactions()->where('student_id', $student_id)->get();
                    foreach ($transactions as $transaction) {
                        $ts = TransactionSession::where('transaction_id', $transaction->id)->where('session_id', $session->id)->first();
                        $ts->forceDelete();
                    }
                }
            }
        } else {
            echo "test";
            $sc = StudentClass::create($enroll);
        }
    }
    protected function uploadTest(Request $request)
    {
        $rules = ['entrance_id' => 'required'];
        $this->validate($request, $rules);

        $entrance = Entrance::find($request->entrance_id);
        $answers = '';
        if ($entrance) {
            for ($i = 0; $i < $request->count; $i++) {
                if ($request->has('image' . $i)) {
                    $ans = $request->file('image' . $i);
                    $name = $entrance->id . "_answer" . $i . "_" . time();
                    $ans->move(public_path() . "/images/answers/", $name . "." . $ans->getClientOriginalExtension());
                    $path = "/public/images/answers/" . $name . "." . $ans->getClientOriginalExtension();
                    if ($i == 0) {
                        $answers = $path;
                    } else {
                        $answers = $answers . "," . $path;
                    }
                }
            }
            $entrance->test_answers = $answers;
            $entrance->save();
        }
    }
    protected function deleteEntrance(Request $request)
    {
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $entrance = Entrance::find($request->id)->forceDelete();
        return response()->json(200);
    }
    protected function sendMessage(Request $request)
    {
        $rules = ['entrance_id' => 'required', 'message' => 'required'];
        $this->validate($request, $rules);
        $entrance = Entrance::find($request->entrance_id);

        $time = strtotime(date('d-m-Y H:i:m'));

        $user = auth()->user()->name;
        if ($entrance) {
            $r = ($entrance->message) ? $entrance->message : [];
            array_push($r, ['time' => $time, 'user' => $user, 'content' => $request->message]);
            $entrance->message = $r;
            $entrance->save();
            return response()->json($r);
        }
    }
    protected function setFail1(Request $request)
    {
        $rules = ['id' => 'required', 'status' => 'required'];
        $this->validate($request, $rules);

        $entrance = Entrance::find($request->id);
        if ($entrance) {
            if ($request->status == 'Mất' || $request->status == 'Chờ' || $request->status == 'Đang xử lý') {
                $status = Status::where('name', $request->status)->first();
                $entrance->status_id = $status->id;
            } else {
                switch ($request->type) {
                    case 'fail1':
                        $entrance->status_id = 4;
                        break;
                    case 'lost':
                        $entrance->status_id = 5;
                        break;

                    case 'fail2':
                        $entrance->status_id = 6;
                        break;

                    case 'lostKT':
                        $entrance->status_id = 7;
                        break;

                    case 'fail3':
                        $entrance->status_id = 8;
                        break;

                    case 'lostKQ':
                        $entrance->status_id = 9;
                        break;
                    case 'fail4':
                        $entrance->status_id = 10;
                        break;

                    case 'lost4':
                        $entrance->status_id = 3;
                        break;

                    default:
                        # code...
                        break;
                }
            }

            $entrance->status()->attach([$entrance->status_id => ['active' => '1', 'user_id' => auth()->user()->id, 'comment' => $request->comment, 'reason' => $request->reason]]);
            $entrance->save();
        }

        return response()->json('ok');
    }
    protected function initEdit(Request $request)
    {
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $entrance = Entrance::find($request->id);
        if ($entrance) {
            $entrance->note = $request->note;
            $entrance->status_id = $request->status['value'];
            $entrance->center_id = $request->entrance_center['value'];
            $entrance->save();
            foreach ($request->appointments as $key => $appointment) {
                if ($appointment['course']) {
                    if ($key != 0) {
                        $entrance = $entrance->replicate();
                    }
                    $entrance->course_id = $appointment['course']['value'];
                    $entrance->test_time = date('Y-m-d H:i:s', strtotime($appointment['date']));
                    $entrance->step_id = 2;
                    $entrance->step_updated_at = date('Y-m-d H:i:s');
                    $entrance->user_created = auth()->user()->id;
                    $entrance->save();
                } else continue;
            }
        }
    }
    protected function createComment(Request $request)
    {
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $entrance = Entrance::find($request->id);
        if ($entrance) {
            $comment['entrance_id'] = $entrance->id;
            $comment['content'] = $request->note;
            $comment['user_id'] = auth()->user()->id;
            $comment['method'] = $request->method;
            $comment['step_id'] = $entrance->step_id;
            Comment::create($comment);
        }
        return response()->json('ok');
    }
    protected function getMessage(Request $request)
    {
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $entrance = Entrance::find($request->id);
        if ($entrance) {
            $comments = $entrance->comments()->select(
                'entrance_comments.id as id',
                'users.id as uid',
                'users.avatar',
                'method',
                'content',
                'users.name',
                'entrance_comments.created_at',
                DB::raw('DATE_FORMAT(entrance_comments.created_at, "%d-%m-%Y %H:%i") AS created_at_formated'),
                'steps.name as sname'
            )
                ->leftJoin('users', 'entrance_comments.user_id', 'users.id')
                ->leftJoin('steps', 'entrance_comments.step_id', 'steps.id')->orderBy('created_at', 'DESC')->get();
            return response()->json($comments->toArray());
        }
    }
    protected function deleteMessage(Request $request)
    {
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $m = Comment::find($request->id);
        if ($m) {
            $m->forceDelete();
        }
    }
    protected function appointmentEdit(Request $request)
    {
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $entrance = Entrance::find($request->id);
        if ($entrance) {
            $answers = null;
            for ($i = 0; $i < $request->count_answers; $i++) {
                if ($request->has('image' . $i)) {
                    $ans = $request->file('image' . $i);
                    $name = $entrance->id . "_answer" . $i . "_" . time();
                    $ans->move(public_path() . "/images/answers/", $name . "." . $ans->getClientOriginalExtension());
                    $path = "/public/images/answers/" . $name . "." . $ans->getClientOriginalExtension();
                    if ($i == 0) {
                        $answers = $path;
                    } else {
                        $answers = $answers . "," . $path;
                    }
                }
            }
            if ($answers) {
                $entrance->test_answers = $answers;
            }
            $results = null;
            for ($i = 0; $i < $request->count_results; $i++) {
                if ($request->has('results' . $i)) {
                    $ans = $request->file('results' . $i);
                    $name = $entrance->id . "_answer" . $i . "_" . time();
                    $ans->move(public_path() . "/images/answers/results/", $name . "." . $ans->getClientOriginalExtension());
                    $path = "/public/images/answers/results/" . $name . "." . $ans->getClientOriginalExtension();
                    if ($i == 0) {
                        $results = $path;
                    } else {
                        $results = $results . "," . $path;
                    }
                }
            }
            if ($results) {
                $entrance->test_results = $results;
            }

            if ($request->score) {
                $entrance->test_score = $request->score;
                $entrance->test_note = $request->note;

                $entrance->step_id = 4;
                $entrance->step_updated_at = date('Y-m-d H:i:s');
            } else {
                $entrance->step_updated_at = date('Y-m-d H:i:s');
                $entrance->step_id = 3;
            }
            $entrance->save();
        }
    }
    protected function increaseInform(Request $request)
    {
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $entrance = Entrance::find($request->id);
        if ($entrance) {
            $entrance->attempts++;
            switch ($entrance->attempts) {
                case 1:
                    # code...
                    $entrance->step_updated_at = date('Y-m-d H:i:s');
                    break;
                case 2:
                    # code...
                    $entrance->step_updated_at = date('Y-m-d H:i:s', strtotime('tomorrow'));
                    break;
                case 2:
                    # code...
                    $entrance->step_updated_at = date('Y-m-d H:i:s', strtotime('tomorrow'));
                    break;

                default:
                    # code...
                    break;
            }
            $entrance->save();
        }
    }
    protected function enrollClass(Request $request)
    {
        $rules = ['id' => 'required', 'enroll_date' => 'required', 'class' => 'required'];
        $this->validate($request, $rules);

        $entrance = Entrance::find($request->id);
        if ($entrance) {
            $entrance->class_id = $request->class['value'];
            $entrance->enroll_date = date('Y-m-d', strtotime($request->enroll_date));
            $entrance->step_id = 5;
            $entrance->save();
        }
    }
    protected function confirmClass(Request $request)
    {
        $rules = ['id' => 'required', 'class' => 'required', 'enroll_date' => 'required'];
        $this->validate($request, $rules);
        $entrance = Entrance::find($request->id);
        if ($entrance) {
            $entrance->class_id = $request->class['value'];
            $entrance->enroll_date = date('Y-m-d', strtotime($request->enroll_date));
            $entrance->save();
            $this->enrollStudent($entrance->class_id, $entrance->student_id, $entrance->enroll_date);
        }
    }
    protected function completeEntrance(Request $request)
    {
        $rules = ['eid' => 'required'];
        $this->validate($request, $rules);
        $entrance = Entrance::find($request->eid);
        if ($entrance) {
            $status = Status::where('name', 'Đã xử lý')->first();

            $entrance->status_id = $status->id;
            $entrance->save();
            $this->enrollStudent($entrance->class_id, $entrance->student_id, $entrance->enroll_date);
        }
    }
    protected function getCompleted(Request $request)
    {
        $status = Status::where('name', 'Đã xử lý')->first()->id;
        $entrances = Entrance::Select(
            'entrances.id as eid',
            'entrances.test_time',
            'entrances.test_results',
            DB::raw('DATE_FORMAT(test_time, "%d/%m/%Y %h:%i %p") AS test_time_formated'),
            'test_answers',
            'test_score',
            'test_note',
            'entrances.note as note',
            'priority',
            'entrances.created_at as created_at',
            'students.id as sid',
            'students.fullname as sname',
            DB::raw('DATE_FORMAT(dob, "%d/%m/%Y") AS dob'),
            'students.grade',
            'students.email as semail',
            'students.phone as sphone',
            'students.gender',
            'students.school',
            'parents.id as pid',
            'parents.fullname as pname',
            'parents.phone as phone',
            'parents.email as pemail',
            'relationships.name as rname',
            'relationships.id as rid',
            'parents.alt_fullname as alt_pname',
            'parents.alt_email as alt_pemail',
            'parents.alt_phone as alt_phone',
            'parents.note as pnote',
            'relationships.color as color',
            DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
            'courses.id as course_id',
            'center.name as center',
            'center.id as center_id',
            'steps.name as step',
            'steps.id as step_id',
            'status.name as status',
            'status.id as status_id',
            'classes.id as class_id',
            'classes.code as class',
            'enroll_date',
            'message',
            'step_updated_at',
            'attempts',
            DB::raw('CONCAT(sources.name," ",mediums.name)  AS source'),
            'entrances.center_id as center_id',
            'center.code'
        )
            ->where('entrances.status_id', $status)
            ->leftJoin('students', 'student_id', 'students.id')->join('parents', 'students.parent_id', 'parents.id')
            ->leftJoin('sources', 'source_id', 'sources.id')->leftJoin('mediums', 'medium_id', 'mediums.id')
            ->leftJoin('relationships', 'parents.relationship_id', 'relationships.id')
            ->leftJoin('courses', 'course_id', 'courses.id')->leftJoin('center', 'center_id', 'center.id')
            ->leftJoin('steps', 'step_id', 'steps.id')->leftJoin('status', 'status_id', 'status.id')
            ->leftJoin('classes', 'class_id', 'classes.id')->orderBy('entrances.status_id', 'asc')
            ->orderBy('priority', 'desc')->orderBy('created_at', 'desc')->get();

        if ($request->center_id && $request->center_id != []) {
            $center_id = array_column($request->center_id, 'value');
            // dd( $entrances->whereIn('emtrances.center_id',$center_id));

            $e = $entrances->whereIn('center_id', $center_id);
            // dd( $e);
            return  $e;
        }

        return $entrances;
    }
    protected function unCompleted(Request $request)
    {
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $entrance = Entrance::find($request->id);
        if ($entrance) {
            $entrance->status_id = 1;
            $entrance->save();
        }
    }
    protected function getStats($center_id, $step_id, $from, $to)
    {
        $step_id = $step_id + 1;
        $centers = explode('_', $center_id);
        $result = [
            'total' => 0,
            'total_remain' => 0,
            'total_today' => 0,
            'total_completed' => 0,
            'total_delay' => 0,
            'total_lost' => 0,
        ];

        $step = Step::find($step_id);
        $from = date('Y-m-d', $from / 1000);
        $to = date('Y-m-d', $to / 1000);
        if ($step) {
            $next_step = Step::where('type', 'Quy trình đầu vào')->where('order', $step->order + 1)->first();
            $status = Status::where('name', 'Đang xử lý')->first();
            $status_lost = Status::where('name', 'Mất')->first()->id;
            $status_complete = Status::where('name', 'Đã xử lý')->first()->id;
            $status_delay = Status::where('name', 'Chờ')->first()->id;
            foreach ($centers as $center) {
                // echo $center;
                if ($next_step && $status) {
                    $today = date('Y-m-d 00:00:00');
                    $result['test'] = Entrance::Where('entrances.created_at', '>=', $from)->where('entrances.created_at', '<=', $to)->where('center_id', $center)->where('step_id', $step_id)->where('status_id', '!=', $status_lost)->where('status_id', '!=', $status_complete)->get();
                    $result['total'] += Entrance::Where('entrances.created_at', '>=', $from)->where('entrances.created_at', '<=', $to)->where('center_id', $center)->where('step_id', $step_id)->where('status_id', '!=', $status_lost)->where('status_id', '!=', $status_complete)->where('status_id', '!=', $status_delay)
                        ->join('students', 'student_id', 'students.id')->join('parents', 'students.parent_id', 'parents.id')->count();
                    // $result['total_remain'] += Entrance::Where('entrances.created_at', '>=', $from)->where('entrances.created_at', '<=', $to)->where('center_id', $center)->where('step_id', $step_id)->where('step_updated_at','<', $today)->where('status_id', '!=', $status_lost)->where('status_id', '!=', $status_complete)
                    //     ->join('students','student_id','students.id')->join('parents','students.parent_id','parents.id')->count();
                    $result['total_today'] += Entrance::Where('entrances.created_at', '>=', $from)->where('entrances.created_at', '<=', $to)->where('center_id', $center)->where('step_id', $step_id)->where('entrances.step_updated_at', '>', $today)->where('status_id', '!=', $status_lost)->where('status_id', '!=', $status_complete)->where('status_id', '!=', $status_delay)
                        ->join('students', 'student_id', 'students.id')->join('parents', 'students.parent_id', 'parents.id')->count();
                    $total_completed = Entrance::Where('entrances.created_at', '>=', $from)->where('entrances.created_at', '<=', $to)->where('center_id', $center)->where('step_id', $next_step->id)->where('step_updated_at', '>', $today)->where('status_id', '!=', $status_lost)->where('status_id', '!=', $status_complete)->where('status_id', '!=', $status_delay)
                        ->join('students', 'student_id', 'students.id')->join('parents', 'students.parent_id', 'parents.id')->count();
                    $result['total_completed'] += $total_completed;

                    $result['total_today'] += Entrance::Where('entrances.created_at', '>=', $from)->where('entrances.created_at', '<=', $to)->where('center_id', $center)->where('step_id', $next_step->id)->where('step_updated_at', '>', $today)->where('status_id', '!=', $status_lost)->where('status_id', '!=', $status_complete)->where('status_id', '!=', $status_delay)
                        ->where('entrances.created_at', '>', $today)->join('students', 'student_id', 'students.id')->join('parents', 'students.parent_id', 'parents.id')->count();
                    $result['total_remain'] = $result['total'] + $result['total_completed'] - $result['total_today'];
                    $result['total_delay'] += Entrance::where('center_id', $center)->where('step_id', $step_id)->where('status_id', $status_delay)->count();
                    $result['total_lost'] += Entrance::where('center_id', $center)->where('step_id', $step_id)->where('status_id', $status_lost)->count();
                }
                if (!$next_step) {
                    $today = date('Y-m-d 00:00:00');
                    $status = Status::where('name', 'Đã xử lý')->first()->id;

                    $result['total'] += Entrance::Where('entrances.created_at', '>=', $from)->where('entrances.created_at', '<=', $to)->where('center_id', $center)->where('step_id', $step_id)->where('status_id', '!=', $status)->where('status_id', '!=', $status_delay)
                        ->join('students', 'student_id', 'students.id')->join('parents', 'students.parent_id', 'parents.id')->count();

                    $result['total_today'] += Entrance::Where('entrances.created_at', '>=', $from)->where('entrances.created_at', '<=', $to)->where('center_id', $center)->where('step_id', $step_id)->where('entrances.step_updated_at', '>', $today)->where('status_id', '!=', $status)->where('status_id', '!=', $status_delay)
                        ->join('students', 'student_id', 'students.id')->join('parents', 'students.parent_id', 'parents.id')->count();
                    $total_completed = Entrance::Where('entrances.created_at', '>=', $from)->where('entrances.created_at', '<=', $to)->where('center_id', $center)->where('step_id', $step_id)->where('step_updated_at', '>', $today)->where('status_id', '==', $status)
                        ->join('students', 'student_id', 'students.id')->join('parents', 'students.parent_id', 'parents.id')->count();
                    $result['total_completed'] += $total_completed;
                    $result['total_today'] += Entrance::Where('entrances.created_at', '>=', $from)->where('entrances.created_at', '<=', $to)->where('center_id', $center)->where('step_id', $step_id)->where('step_updated_at', '>', $today)->where('entrances.created_at', '>', $today)->where('status_id', '!=', $status)->where('status_id', '!=', $status_delay)
                        ->join('students', 'student_id', 'students.id')->join('parents', 'students.parent_id', 'parents.id')->count();
                    $result['total_remain'] = $result['total'] + $result['total_completed'] - $result['total_today'];
                    $result['total_delay'] += Entrance::where('center_id', $center)->where('step_id', $step_id)->where('status_id', $status_delay)->count();
                    $result['total_lost'] += Entrance::where('center_id', $center)->where('step_id', $step_id)->where('status_id', $status_lost)->count();
                }
            }
        }



        return response()->json($result);
    }
    protected function getDetailStats($center_id)
    {
        // $centers = Center::where('id', '!=', 1)->get();
        $today = date('Y-m-d 00:00:00');
        $result = [
            'init_remain' => 0, 'init_today' => 0, 'init_completed' => 0, 'init_total' => 0, 'init_1' => 0, 'init_2' => 0, 'init_3' => 0,
            'appointment_remain' => 0, 'appointment_today' => 0, 'appointment_completed' => 0, 'appointment_total' => 0, 'appointment_1' => 0, 'appointment_2' => 0, 'appointment_3' => 0,
            'result_remain' => 0, 'result_today' => 0, 'result_completed' => 0, 'result_total' => 0, 'result_1' => 0, 'result_2' => 0, 'result_3' => 0,
            'inform_remain' => 0, 'inform_today' => 0, 'inform_completed' => 0, 'inform_total' => 0, 'inform_1' => 0, 'inform_2' => 0, 'inform_3' => 0, 'inform_4' => 0,
            'final_remain' => 0, 'final_today' => 0, 'final_completed' => 0, 'final_total' => 0, 'final_1' => 0, 'final_2' => 0, 'final_3' => 0,
        ];

        //init
        $init = $this->getStats($center_id, 0)->original;
        $result['init_remain'] = $init['total_remain'];
        $result['init_today'] = $init['total_today'];
        $result['init_completed'] = $init['total_completed'];
        $result['init_total'] = $init['total'];
        $result['init_delay'] = $init['total_delay'];
        $result['init_lost'] = $init['total_lost'];
        $init = $this->getEntranceByStep(1, [$center_id])->toArray();

        foreach ($init as $i) {
            $date = date('Y-m-d H:i:s', strtotime($i['created_at']));
            if ($i['status'] == 'Thất bại 1') {
                $result['init_3']++;
                continue;
            }
            if ($date >= $today) {
                $result['init_1']++;
            } else $result['init_2']++;
        }
        // print_r("<pre>");
        // print_r($init->toArray());

        //appointment
        $appointment = $this->getStats($center_id, 1)->original;
        $result['appointment_remain'] = $appointment['total_remain'];
        $result['appointment_today'] = $appointment['total_today'];
        $result['appointment_completed'] = $appointment['total_completed'];
        $result['appointment_total'] = $appointment['total'];
        $result['appointment_delay'] = $appointment['total_delay'];
        $result['appointment_lost'] = $appointment['total_lost'];
        $appointment = $this->getEntranceByStep(2, [$center_id])->toArray();

        foreach ($appointment as $i) {
            $date = date('Y-m-d H:i:s', strtotime($i['test_time']));
            if ($i['status'] == 'Thất bại 2') {
                $result['appointment_3']++;
                continue;
            }
            if ($date >= $today) {
                $result['appointment_1']++;
            } else $result['appointment_2']++;
        }
        //result
        $r = $this->getStats($center_id, 2)->original;
        $result['result_remain'] = $r['total_remain'];
        $result['result_today'] = $r['total_today'];
        $result['result_completed'] = $r['total_completed'];
        $result['result_total'] = $r['total'];
        $result['result_delay'] = $r['total_delay'];
        $result['result_lost'] = $r['total_lost'];

        $r = $this->getEntranceByStep(3, [$center_id])->toArray();

        foreach ($r as $i) {
            $date = date('Y-m-d H:i:s', strtotime($i['step_updated_at']));
            if ($i['status'] == 'Thất bại 3') {
                $result['result_3']++;
                continue;
            }
            if ($date >= $today) {
                $result['result_1']++;
            } else $result['result_2']++;
        }
        //inform
        $inform = $this->getStats($center_id, 3)->original;
        $result['inform_remain'] = $inform['total_remain'];
        $result['inform_today'] = $inform['total_today'];
        $result['inform_completed'] = $inform['total_completed'];
        $result['inform_total'] = $inform['total'];
        $result['inform_delay'] = $inform['total_delay'];
        $result['inform_lost'] = $inform['total_lost'];
        $r = $this->getEntranceByStep(4, [$center_id])->toArray();

        foreach ($r as $i) {
            if ($i['status'] == 'Thất bại 4') {
                $result['inform_4']++;
                continue;
            }
            switch ($i['attempts']) {
                case 0:
                    $result['inform_1']++;
                    break;

                case 1:
                    $result['inform_2']++;
                    break;

                case 2:
                    $result['inform_3']++;
                    break;

                case 3:
                    $result['inform_4']++;
                    break;

                default:
                    # code...
                    break;
            }
        }
        //final
        $final = $this->getStats($center_id, 4)->original;
        $result['final_remain'] = $final['total_remain'];
        $result['final_today'] = $final['total_today'];
        $result['final_completed'] = $final['total_completed'];
        $result['final_total'] = $final['total'];
        $result['final_delay'] = $final['total_delay'];
        $result['final_lost'] = $final['total_lost'];
        $r = $this->getEntranceByStep(5, [$center_id])->toArray();

        foreach ($r as $i) {
            $date = date('Y-m-d H:i:s', strtotime($i['step_updated_at']));
            if ($i['status'] == 'Thất bại 5') {
                $result['final_3']++;
                continue;
            }
            if ($date >= $today) {
                $result['final_1']++;
            } else $result['final_2']++;
        }
        return $result;
    }
    public function exportEntranceStats()
    {
        $e = EntranceStat::Join('center', 'entrance_stats.center_id', 'center.id')->where('created_at', '>', '2022-04-01')->orderBy('created_at', 'DESC')->get();

        $fp = fopen(public_path() . '/entrance.csv', 'w');
        $first_line = ['', '', 'Bước 1', '', '', '', '', '', '', '', '', '', 'Bước 2', '', '', '', '', '', '', '', '', '', 'Bước 3', '', '', '', '', '', '', '', '', '', 'Bước 4', '', '', '', '', '', '', '', '', '', '', 'Bước 5', '', '', '', '', '', '', '', ''];
        $second_line = [
            'Ngày', 'Cơ sở', 'Đầu ngày', 'Mới', 'Xử lý', 'Cuối ngày', '24H', 'Quá 24H', 'OUT', 'Chờ', 'Mất', '', 'Đầu ngày', 'Mới', 'Xử lý', 'Cuối ngày', 'Sắp KT', 'Quá hạn', 'Out', 'Chờ', 'Mất', '', 'Đầu ngày', 'Mới', 'Xử lý', 'Cuối ngày',
            'Ktra 48H', 'Quá 48H', 'Không chấm', 'Chờ', 'Mất', '', 'Đầu ngày', 'Mới', 'Xử lý', 'Cuối ngày', 'Chưa liên lạc', 'Lần 1', 'Lần 2', 'Lần 3', 'Chờ', 'Mất', '', 'Đầu ngày', 'Mới', 'Xử lý', 'Cuối ngày', 'Sắp N.Học', 'Quá hạn N.Học', 'Thất bại', 'Chờ', 'Mất',
        ];
        fprintf($fp, chr(0xEF) . chr(0xBB) . chr(0xBF));
        fputcsv($fp, $first_line);
        fputcsv($fp, $second_line);
        $j = 0;

        foreach ($e as $i) {
            $result = [
                $i->date, $i->code,
                $i->init_remain, $i->init_today, $i->init_completed, $i->init_total, $i->init_1, $i->init_2, $i->init_3, $i->init_delay, $i->init_lost, '',
                $i->appointment_remain, $i->appointment_today, $i->appointment_completed, $i->appointment_total, $i->appointment_1, $i->appointment_2, $i->appointment_3, $i->appointment_delay, $i->appointment_lost, '',
                $i->result_remain, $i->result_today, $i->result_completed, $i->result_total, $i->result_1, $i->result_2, $i->result_3, $i->result_delay, $i->result_lost, '',
                $i->inform_remain, $i->inform_today, $i->inform_completed, $i->inform_total, $i->inform_1, $i->inform_2, $i->inform_3, $i->inform_4, $i->inform_delay, $i->inform_lost, '',
                $i->final_remain, $i->final_today, $i->final_completed, $i->final_total, $i->final_1, $i->final_2, $i->final_3, $i->final_delay, $i->final_lost, '',
            ];
            fputcsv($fp, $result);
            if ($j == 5) {
                $j = 0;
                fputcsv($fp, []);
            }
            $j++;
        }
        return redirect('/public/entrance.csv');
        // foreach()
        // return $e;
        // $fp = fopen('entrance.csv', 'w');
        // foreach($classes as $c){
        //     $students = $c->students;
        //     foreach($students as $s){
        //         $parent = Parents::find($s->parent_id);
        //         if($parent){
        //             $result = [$c->code, $s->fullname, $s->dob, $parent->email, $parent->phone, $parent->fullname, $s->detail['status']];
        //             fputcsv($fp, $result);
        //         }                
        //     }
        // }
    }
}
