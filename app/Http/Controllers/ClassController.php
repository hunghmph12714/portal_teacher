<?php

namespace App\Http\Controllers;

use DB;
use App\Room;
use App\Session;
use App\Course;
use App\Classes;
use Carbon\Carbon;
use App\Schools;
use App\Student;
use App\Parents;
use App\StudentClass;
use App\Transaction;
use App\Account;
use App\Tag;
use App\StudentSession;
use App\Teacher;
use App\Center;
use Illuminate\Http\Request;
use App\UserClass;
use App\Attempt;
use App\AttemptDetail;
use App\Quiz;
use App\Question;
use App\Option;
use App\Criteria;
use App\Objective;

class ClassController extends Controller
{
    // Phòng học
    protected function subscribe()
    {
        $classes = Classes::where('code', 'LIKE', '%5.%')->where('year', 2021)->get();
        $event = Classes::where('code', 'KS6D1')->first();
        foreach ($classes as $class) {
            $students = $class->activeStudents;
            foreach ($students as $s) {
                $check = StudentClass::where('student_id', $s->id)->where('class_id', $event->id)->first();
                if (!$check) {
                    StudentClass::create([
                        'student_id' => $s->id,
                        'class_id' => $event->id,
                        'status' => 'active',
                        'entrance_date' => '2022-01-17'
                    ]);
                }
            }
        }
    }
    protected function getRoom()
    {
        $room = Room::all()->toArray();
        return response()->json($room);
    }
    protected function getRoomCenter($center)
    {
        $rooms = Room::where('center_id', $center)->get()->toArray();
        return response()->json($rooms);
    }
    protected function createRoom(Request $request)
    {
        $rules = ['name' => 'required'];
        $this->validate($request, $rules);

        $input = $request->toArray();
        $room = Room::create($input);
        return response()->json($room);
    }
    protected function editRoom(Request $request)
    {
        $rules = ['id' => 'required', 'newData' => 'required'];
        $this->validate($request, $rules);

        $room = Room::find($request->id);
        $newRoom = $request->newData;
        if ($room) {
            $room->name = $newRoom['name'];
            $room->center_id = $newRoom['center_id'];
            $room->status = $newRoom['status'];
            $room->save();
            return response()->json(200);
        } else {
            return response()->json('Không tìm thấy phòng học', 402);
        }
    }
    protected function deleteRoom(Request $request)
    {
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $room = Room::find($request->id)->forceDelete();
        return response()->json(200);
    }
    // Khóa học
    protected function getCourse()
    {
        $courses = Course::orderBy('grade', 'ASC')->orderBy('name', 'ASC')->get()->toArray();
        return response()->json($courses);
    }
    protected function createCourse(Request $request)
    {
        $rules = ['name' => 'required', 'grade' => 'required'];
        $this->validate($request, $rules);

        $input = $request->toArray();
        $course = Course::create($input);
        return response()->json($course);
    }
    protected function editCourse(Request $request)
    {
        $rules = ['id' => 'required', 'newData' => 'required'];
        $this->validate($request, $rules);

        $course = Course::find($request->id);
        $newCourse = $request->newData;
        if ($course) {
            $course->name = $newCourse['name'];
            $course->grade = $newCourse['grade'];
            $course->document = $newCourse['document'];
            $course->domain = $newCourse['domain'];
            $course->fee = $newCourse['fee'];
            $course->class_per_week = $newCourse['class_per_week'];
            $course->session_per_class = $newCourse['session_per_class'];
            $course->showable = $newCourse['showable'];
            $course->save();
            return response()->json(200);
        } else {
            return response()->json('Không tìm thấy khóa học', 402);
        }
    }
    protected function deleteCourse(Request $request)
    {
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $room = Course::find($request->id)->forceDelete();
        return response()->json(200);
    }
    // Lớp học
    protected function handleCreateStudent($parent_id, $request)
    {
        $s['parent_id'] = $parent_id;
        $s['relationship_id'] = $request['selected_relationship']['value'];
        $s['fullname'] = $request['student_name']['value'];
        $s['school'] = $request['student_school']['label'];
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
    protected function addStudentToClass(Request $request)
    {
        //Validation
        $rules = [
            'student_name' => 'required',
            'parent_name' => 'required',
            'parent_email' => 'required | email',
            'parent_phone' => 'required',
            'status' => 'required',
        ];
        $messages = [
            'student_name.required' => 'Vui lòng điền tên học sinh',
            'parent_name.required' => 'Vui lòng điền tên phụ huynh',
            'parent_email.required' => 'Vui lòng điền email phụ huynh',
            'parent_email.email' => 'Email không hợp lệ',
            'parent_phone.required' => 'Vui lòng điền số điện thoại phụ huynh',
            'status.required' => 'Vui lòng điền trạng thái'
        ];
        $this->validate($request, $rules, $messages);
        $request = $request->toArray();
        $request['student_dob'] = ($request['student_dob']) ? date('Y-m-d', strtotime($request['student_dob'])) : null;
        $p = [];
        $p['fullname'] = $request['parent_name'];
        $p['relationship_id'] = ($request['selected_relationship'] != "") ? $request['selected_relationship']['value'] : null;
        $p['phone'] = $request['parent_phone']['label'];
        $p['email'] = $request['parent_email'];
        $p['note'] = $request['parent_note'];
        $p['alt_fullname'] = $request['parent_alt_name'];
        $p['alt_email'] = $request['parent_alt_email'];
        $p['alt_phone'] = $request['parent_alt_phone'];
        $student_id = NULL;
        //Check parent exist
        if ($request['parent_phone']['__isNew__']) {
            // New parent
            $parent = Parents::create($p);

            if ($request['student_name']['__isNew__']) { // New Student
                //Create new student
                $student = $this->handleCreateStudent($parent->id, $request);
                $student_id = $student->id;
                //Add student to Class
            }
        } else {
            //Existed parent
            //Update parent 
            Parents::find($request['parent_phone']['value'])->update($p);
            if ($request['student_name']['__isNew__']) { // New Student
                //Create new student
                $parent_id = $request['parent_phone']['value'];
                $student = $this->handleCreateStudent($parent_id, $request);
                $student_id = $student->id;
                //Add student to Class

                //Generate fee   
            } else {
                $student_id = $request['student_name']['value'];
                $this->handleUpdateStudent($student_id, $request);

                //Add student to Class

                //Generate fee
            }
        }
        if ($student_id) {
            $checkExisting = StudentClass::where('class_id', $request['class_id'])->where('student_id', $student_id)->first();
            if ($checkExisting) {
                return response()->json('Học sinh đã tồn tại trong lớp', 418);
            } else {
                $sc['student_id'] = $student_id;
                $sc['class_id'] = $request['class_id'];
                $sc['status'] = $request['status'];
                $sc['entrance_date'] = date('Y-m-d', strtotime($request['active_date']));

                $sc = StudentClass::create($sc);
            }
        }
        return response()->json('ok');
    }
    protected function editStudentInClass(Request $request)
    {
        $rules = ['class_id' => 'required', 'student_id' => 'required'];
        $this->validate($request, $rules);
        //Edit student and parent info
        $student = Student::find($request->student_id);
        if ($student) {
            $student->relationship_id = $request->selected_relationship['value'];
            $student->fullname = $request->student_name['label'];
            $student->school = $request->student_school['label'];
            $student->grade = $request->student_grade;
            $student->email = $request->student_email;
            $student->phone = $request->student_phone;
            $student->dob = ($request->student_dob) ? date('Y-m-d', strtotime($request->student_dob)) : null;
            $student->gender = $request->student_gender;
            $student->parent_id = $request->parent_id;
            $student->aspiration = $request->aspiration;
            $student->aspiration_result = $request->aspiration_result;
            $student->save();
            // print_r($student->toArray());
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
        if (!$request->parent_phone['__isNew__']) {
            $p = Parents::find($request->parent_id);
            if ($p) {
                $p->relationship_id = $request->selected_relationship['value'];
                $p->fullname = $request->parent_name;
                $p->email = (strpos($request->parent_email, '***') !== false) ? $p->email : $request->parent_email;
                $p->phone = (strpos($request->parent_phone['label'], '***') !== false) ? $p->phone : $request->parent_phone['label'];
                $p->note = $request->parent_note;
                $p->alt_fullname = $request->parent_alt_name;
                $p->alt_email = $request->parent_alt_email;
                $p->alt_phone = $request->parent_alt_phone;
                $p->save();
            }
        }

        //Edit status a
        $class = Classes::find($request->class_id);
        if ($class->type == 'class') {
            $sc = StudentClass::where('student_id', $request->student_id)->where('class_id', $request->class_id)->first();

            if ($sc) {
                $sc->status = $request->status;
                $sc->entrance_date = date('Y-m-d', strtotime($request->active_date));
                if ($sc->status == 'transfer') {
                    if (!$request->transfer_date || !$request->new_active_date || !$request->transfer_class || !array_key_exists('value', $request->transfer_class)) {
                        return response()->json('Vui lòng điền đầy đủ *', 442);
                    }
                    $sc->transfer_date = date('Y-m-d', strtotime($request->new_active_date));
                    // print_r(date('Y-m-d', strtotime($request->transfer_date)) );
                    $sc->drop_time = ($request->transfer_date) ?  date('Y-m-d', strtotime($request->transfer_date)) : date('Y-m-d');
                    $stats = ($sc->stats) ? $sc->stats : [];
                    $stats['transfer_reason'] = $request->transfer_reason;
                    $sc->stats = $stats;
                    //Check exsisting studnet in class 
                    $check_sc = StudentClass::where('student_id', $request->student_id)->where('class_id', $request->transfer_class['value'])->first();
                    if ($check_sc) {
                        return response()->json('Học sinh đã tồn tại trong lớp mới', 442);
                    } else {
                        $new_sc['student_id'] = $request->student_id;
                        $new_sc['class_id'] = $request->transfer_class['value'];
                        $new_sc['status'] = 'active';
                        $new_sc['entrance_date'] = date('Y-m-d', strtotime($request->new_active_date));
                        $new_sc = StudentClass::create($new_sc);
                    }
                }
                if ($request->status == 'droped') {
                    $sc->status = $request->status;
                    $sc->drop_time = ($request->drop_date) ? date('Y-m-d', strtotime($request->drop_date)) : date('Y-m-d');
                    // print_r($sc->drop_time);
                    $stats = ($sc->stats) ? $sc->stats : [];
                    $stats['drop_reason'] = $request->drop_reason;
                    $sc->stats = $stats;
                }
                if ($request->status == 'retain') {
                    // $sc->status = $request->status;
                    if ($request->retain_end) {
                        $sc->status = 'active';
                    }
                    $sc->retain_time = date('Y-m-d', strtotime($request->retain_start));
                    $sc->retain_end = date('Y-m-d', strtotime($request->retain_end));
                }
                $sc->save();
            }
        }
        if ($class->type == 'event') {
            $all_sessions = Session::where('class_id', $class->id)->get()->toArray();
            $current_ids = array_column($all_sessions, 'id');
            if ($request->selected_sessions) {

                $session_ids = array_column($request->selected_sessions, 'value');
                $student->sessions()->syncWithoutDetaching($current_ids);

                $diff = array_diff($current_ids, $session_ids);
                $student->sessions()->detach($diff);
            } else {
                $student->sessions()->detach($current_ids);
            }
        }
    }
    protected function transferStudents(Request $request)
    {
        foreach ($request->students as $student) {
            $student_id = $student['student_id'];
            $sc = StudentClass::where('student_id', $student_id)->where('class_id', $request->class_id)->first();
            $sc->status = $request->status;
            if (!$request->transfer_date || !$request->new_active_date || !$request->transfer_class || !array_key_exists('value', $request->transfer_class)) {
                return response()->json('Vui lòng điền đầy đủ *', 442);
            }
            $sc->transfer_date = date('Y-m-d', strtotime($request->new_active_date));
            $sc->drop_time = ($request->transfer_date) ?  date('Y-m-d', strtotime($request->transfer_date)) : date('Y-m-d');
            $stats = ($sc->stats) ? $sc->stats : [];
            $stats['transfer_reason'] = $request->transfer_reason;
            $sc->stats = $stats;
            //Check exsisting studnet in class 
            $check_sc = StudentClass::where('student_id', $student_id)->where('class_id', $request->transfer_class['value'])->first();
            if ($check_sc) {
                return response()->json('Học sinh đã tồn tại trong lớp mới', 442);
            } else {

                $new_sc['student_id'] = $student_id;
                $new_sc['class_id'] = $request->transfer_class['value'];
                $new_sc['status'] = 'active';
                $new_sc['entrance_date'] = date('Y-m-d', strtotime($request->new_active_date));
                StudentClass::create($new_sc);
            }
            $sc->save();
        }
    }
    protected function dropStudents(Request $request)
    {
        foreach ($request->students as $student) {
            $student_id = $student['student_id'];
            $sc = StudentClass::where('student_id', $student_id)->where('class_id', $request->class_id)->first();
            if ($sc) {
                if ($sc->status == 'active') {
                    $sc->status = $request->status;
                    if (!$request->drop_date) {
                        return response()->json('Vui lòng điền đầy đủ *', 442);
                    }
                    $sc->drop_time = ($request->drop_date) ?  date('Y-m-d', strtotime($request->drop_date)) : date('Y-m-d');
                    $stats = ($sc->stats) ? $sc->stats : [];
                    $sc->stats = $stats;

                    $sc->save();
                }
            }
        }
    }

    protected function getClass($center_id, $course_id)
    {
        $center_operator = ($center_id == '-1') ? '!=' : '=';
        $center_value = ($center_id == '-1') ? NULL : $center_id;
        $course_operator = ($course_id == '-1') ? '!=' : '=';
        $course_value = ($course_id == '-1') ? NULL : $course_id;

        $wp_year = auth()->user()->wp_year;

        $result = auth()->user()->classes()->where('center_id', $center_operator, $center_value)->where('course_id', $course_operator, $course_value)->where('classes.year', $wp_year)->where('classes.type', 'class')->select(
            'classes.id as id',
            'classes.name as name',
            'classes.code as code',
            'center.name as center',
            DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
            'student_number',
            'open_date',
            'classes.active as status',
            'classes.cost',
            'config',
            'classes.fee as fee',
            'online_id',
            'password',
            'droped_number',
            'waiting_number'
        )->leftJoin('center', 'classes.center_id', 'center.id')->leftJoin('courses', 'classes.course_id', 'courses.id')->get();
        $classes = $result->toArray();
        foreach ($result as $key => $class) {
            $last_session = $class->sessions->last();
            if ($last_session) {
                $classes[$key]['last_session'] = $last_session->date;
            } else {
                $classes[$key]['last_session'] = '';
            }
        }
        return response()->json($classes);
    }
    protected function getAllClass($center_id, $course_id)
    {
        // $center_operator = ($center_id == '-1') ? '!=' : '=';
        // $center_value = ($center_id == '-1') ? NULL : $center_id;
        // $course_operator = ($course_id == '-1') ? '!=' : '=';
        // $course_value = ($course_id == '-1') ? NULL : $course_id;

        $wp_year = auth()->user()->wp_year;

        // $result = Classes::where('center_id', $center_operator, $center_value)->where('course_id', $course_operator, $course_value)->where('classes.year', $wp_year)->select(
        $result = Classes::where('classes.year', $wp_year)->select(
            'classes.id as id',
            'classes.name as name',
            'classes.code as code',
            'center.name as center',
            DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
            'student_number',
            'open_date',
            'classes.active as status',
            'classes.cost',
            'config',
            'classes.fee as fee',
            'online_id',
            'password',
            'droped_number',
            'waiting_number'
        )->leftJoin('center', 'classes.center_id', 'center.id')->leftJoin('courses', 'classes.course_id', 'courses.id')->get();
        $classes = $result->toArray();
        foreach ($result as $key => $class) {
            $last_session = $class->sessions->last();
            if ($last_session) {
                $classes[$key]['last_session'] = $last_session->date;
            } else {
                $classes[$key]['last_session'] = '';
            }
        }
        return response()->json($classes);
    }
    protected function getClassById($class_id)
    {
        $result = Classes::where('classes.id', $class_id)->select(
            'classes.id as id',
            'classes.name as name',
            'classes.code as code',
            'center.name as center',
            DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
            'student_number',
            'open_date',
            'classes.active as status',
            'classes.cost',
            'config',
            'classes.fee as fee'
        )->leftJoin('center', 'classes.center_id', 'center.id')->leftJoin('courses', 'classes.course_id', 'courses.id')->first();
        return response()->json($result);
    }
    protected function createClass(Request $request)
    {
        $rules = [
            'code' => 'required',
            'name' => 'required',
            'fee' => 'required',
            'center_id' => 'required',
            'course_id' => 'required',
        ];
        $this->validate($request, $rules);
        $request = $request->toArray();
        $request['open_date'] = date('Y-m-d', $request['open_date']);
        $year = date('Y', strtotime($request['open_date']));
        $p_year = $year - 1;
        $this_year = date('Y-m-d', strtotime('15-05-' . $year));
        $previous_year = date('Y-m-d', strtotime('15-05-' . $p_year));
        $request['year'] = $year;
        if ($request['open_date'] < $this_year && $request['open_date'] > $previous_year) $request['year'] = $p_year;
        $class = Classes::create($request);

        $result = Classes::where('classes.id', $class->id)->select(
            'classes.id as id',
            'classes.name as name',
            'classes.code',
            'center.name as center',
            DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
            'student_number',
            'open_date',
            'classes.active as status',
            'online_id',
            'password',
            'config',
            'classes.fee as fee'
        )->leftJoin('center', 'classes.center_id', 'center.id')->leftJoin('courses', 'classes.course_id', 'courses.id')->first()->toArray();
        return response()->json($result);
        // echo date("Y-m-d\TH:i:s\Z", $request->open_date/1000);
    }
    protected function editClass(Request $request)
    {
        $rules = [
            'class_id' => 'required',
            'code' => 'required',
            'name' => 'required',
            'fee' => 'required',
            'center_id' => 'required',
            'course_id' => 'required',
        ];
        $this->validate($request, $rules);

        $class = Classes::find($request->class_id);
        if ($class) {
            $class->code = $request->code;
            $class->config = $request->config;
            $class->name = $request->name;
            $class->fee = $request->fee;
            $class->center_id = $request->center_id;
            $class->course_id = $request->course_id;
            $class->cost = $request->cost;
            $class->open_date = date('Y-m-d', strtotime($request->open_date));
            $year = date('Y', strtotime($class->open_date));
            $p_year = $year - 1;
            $this_year = date('Y-m-d', strtotime('15-05-' . $year));
            $previous_year = date('Y-m-d', strtotime('15-05-' . $p_year));
            $class->year = $year;
            if ($class->open_date < $this_year && $class->open_date > $previous_year) $class->year  = $p_year;

            $class->online_id = $request->online_id;
            $class->password = $request->password;
            $class->save();
            $result = Classes::where('classes.id', $class->id)->select(
                'classes.id as id',
                'classes.name as name',
                'classes.code',
                'center.name as center',
                DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
                'student_number',
                'open_date',
                'classes.active as status',
                'online_id',
                'password',
                'cost',
                'config',
                'classes.fee as fee'
            )->leftJoin('center', 'classes.center_id', 'center.id')->leftJoin('courses', 'classes.course_id', 'courses.id')->first()->toArray();
            return response()->json($result);
        }
    }
    protected function deleteClass(Request $request)
    {
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $room = Classes::find($request->id)->forceDelete();
        return response()->json(200);
    }
    //Class Detail
    protected function detailClass($class_id)
    {
        $user_id = auth()->user()->id;
        $uc = UserClass::where('user_id', $user_id)->where('class_id', $class_id)->first();
        if ($uc) {
            return view('welcome');
        } else {
            return view('unauthorised');
        }
        // return view('welcome');
        // return $class_id;
    }
    protected function detailStudentClass(Request $request)
    {
        $rules = ['student_id' => 'required'];
        $this->validate($request, $rules);
        $student = Student::find($request->student_id);
        if ($student) {
            $classes = $student->classes;
            return response()->json($classes);
        }
    }
    protected function findClass(Request $request)
    {
        $rules = ['student_id' => 'required'];
        $this->validate($request, $rules);

        $student = Student::find($request->student_id);
        if ($student) {
            $classes = $student->classes;
            return response()->json($classes);
        }
        // $results = Classes::where('code','LIKE', '%'.$request->key.'%')->get();
        // return response()->json($results);
    }
    //Event
    protected function getClassName()
    {
        $classes = Classes::select('code', 'id')->get();
        return response()->json($classes->toArray());
    }
    protected function getEvents()
    {

        $result = Classes::where('classes.type', 'event')->select(
            'classes.id as id',
            'classes.name as name',
            'classes.code as code',
            'center.name as center',
            DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
            'student_number',
            'open_date',
            'classes.active as status',
            'config',
            'classes.fee as fee',
            'online_id',
            'password',
            'droped_number',
            'waiting_number',
            'classes.note'
        )->leftJoin('center', 'classes.center_id', 'center.id')->leftJoin('courses', 'classes.course_id', 'courses.id')->get();
        $classes = $result->toArray();
        // print_r($classes);
        return response()->json($classes);
    }
    protected function createEvent(Request $request)
    {
        $rules = [
            'code' => 'required',
            'name' => 'required',
        ];
        $this->validate($request, $rules);
        $request = $request->toArray();
        $request['open_date'] = date('Y-m-d', strtotime($request['open_date']));
        $resquest['fee'] = 0;
        $request['center_id'] = -1;
        $request['course_id'] = -1;
        $request['type'] = 'event';
        $class = Classes::create($request);

        $result = Classes::where('classes.id', $class->id)->select(
            'classes.id as id',
            'classes.name as name',
            'classes.code',
            'center.name as center',
            DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
            'student_number',
            'open_date',
            'classes.active as status',
            'online_id',
            'password',
            'config',
            'classes.fee as fee'
        )->leftJoin('center', 'classes.center_id', 'center.id')->leftJoin('courses', 'classes.course_id', 'courses.id')->first()->toArray();
        return response()->json($result);
    }
    protected function editEvent(Request $request)
    {
        $rules = [
            'class_id' => 'required',
            'code' => 'required',
            'name' => 'required',
        ];
        $this->validate($request, $rules);

        $class = Classes::find($request->class_id);
        if ($class) {
            $class->code = $request->code;
            $class->name = $request->name;
            $class->open_date = date('Y-m-d', strtotime($request->open_date));
            $class->note = $request->note;
            $class->save();
            $result = Classes::where('classes.id', $class->id)->select(
                'classes.id as id',
                'classes.name as name',
                'classes.code',
                'center.name as center',
                DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
                'student_number',
                'open_date',
                'classes.active as status',
                'online_id',
                'password',
                'config',
                'classes.fee as fee'
            )->leftJoin('center', 'classes.center_id', 'center.id')->leftJoin('courses', 'classes.course_id', 'courses.id')->first()->toArray();
            return response()->json($result);
        }
    }
    //HELPER
    public function importDB()
    {
        $row = 1;
        $mg = [];
        if (($handle = fopen(public_path() . "/css/maugiao.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 100000000, "|")) !== FALSE) {
                $num = count($data);
                for ($c = 0; $c < $num; $c++) {
                    $input = ['type' => 'MG', 'name' => $data[$c]];
                    $checkSchool = Schools::where('name', $data[$c])->first();
                    if (!$checkSchool) {
                        array_push($mg, $input);
                    } else {
                        echo "aa" . "<br>";
                    }
                }
            }
            fclose($handle);
        }
        $mg = Schools::insert($mg);
        $mg = [];
        if (($handle = fopen(public_path() . "/css/tieuhoc.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 100000000, "|")) !== FALSE) {
                $num = count($data);
                for ($c = 0; $c < $num; $c++) {
                    $input = ['type' => 'TH', 'name' => $data[$c]];
                    $checkSchool = Schools::where('name', $data[$c])->first();
                    if (!$checkSchool) {
                        array_push($mg, $input);
                    }
                }
            }
            fclose($handle);
        }
        $mg = Schools::insert($mg);
        $mg = [];
        if (($handle = fopen(public_path() . "/css/thcs.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 100000000, "|")) !== FALSE) {
                $num = count($data);
                for ($c = 0; $c < $num; $c++) {
                    $input = ['type' => 'THCS', 'name' => $data[$c]];
                    $checkSchool = Schools::where('name', $data[$c])->first();
                    if (!$checkSchool) {
                        array_push($mg, $input);
                    }
                }
            }
            fclose($handle);
        }
        $mg = Schools::insert($mg);
        $mg = [];
        if (($handle = fopen(public_path() . "/css/thpt.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 100000000, "|")) !== FALSE) {
                $num = count($data);
                for ($c = 0; $c < $num; $c++) {
                    $input = ['type' => 'THPT', 'name' => $data[$c]];
                    $checkSchool = Schools::where('name', $data[$c])->first();
                    if (!$checkSchool) {
                        array_push($mg, $input);
                    }
                }
            }
            fclose($handle);
        }
        $mg = Schools::insert($mg);
    }
    public function getSchool()
    {
        $schools = Schools::all()->toArray();
        echo "<pre>";
        print_r($schools);
        echo "<pre>";
    }
    public function listStudent()
    {
        $classes = Classes::where('student_number', '>', 0)->get();
        $fp = fopen('file.csv', 'w');
        foreach ($classes as $c) {
            $students = $c->students;
            foreach ($students as $s) {
                $parent = Parents::find($s->parent_id);
                if ($parent) {
                    $result = [$c->code, $s->fullname, $s->dob, $parent->email, $parent->phone, $parent->fullname, $s->detail['status']];
                    fputcsv($fp, $result);
                }
            }
        }
    }
    public function listTeacher()
    {
        $classes = Classes::where('student_number', '>', 0)->get();
        $fp = fopen('teachers.csv', 'w');
        foreach ($classes as $c) {
            // $students = $c->students;
            // foreach($students as $s){
            //     $parent = Parents::find($s->parent_id);
            //     if($parent){
            //         $result = [$c->code, $s->fullname, $s->dob, $parent->email, $parent->phone, $parent->fullname, $s->detail['status']];
            //         fputcsv($fp, $result);
            //     }                
            // }
            if (is_array($c->config)) {
                foreach ($c->config as $cc) {
                    $teacher_id = is_array($cc['teacher']) ? $cc['teacher']['value'] : 0;
                    $teacher = Teacher::find($teacher_id);
                    $tname = ($teacher) ? $teacher->name : '';
                    $temail = ($teacher) ? $teacher->email : '';
                    $tphone = ($teacher) ? $teacher->phone : '';

                    $date = (is_array($cc['date']) && array_key_exists('label', $cc['date'])) ? $cc['date']['label'] : 0;
                    $center = Center::find($c->center_id);
                    $center = ($center) ? $center->name : '';
                    $result = [$c->id, $c->code, $center, $date, $c->fee, $c->student_number, $c->droped_number, $c->waiting_number, $teacher_id, $tname, $temail, $tphone];
                    fputcsv($fp, $result);
                }
            }
        }
    }
    protected function getReport(Request $request)
    {
        $rules = ['class_id' => 'required', 'from' => 'required', 'to' => 'required'];
        $this->validate($request, $rules);

        $from = date('Y-m-d 00:00:00', strtotime($request->from));
        $to = date('Y-m-d 23:59:59', strtotime($request->to));
        $class_id = $request->class_id;
        $class = Classes::find($class_id);
        $sessions = Session::whereBetween('date', [$from, $to])->where('class_id', $class_id)->get();
        $result = [];
        if ($class) {
            //session            
            $students = $class->students;
            foreach ($students as $s) {
                $parent = Parents::find($s->parent_id);
                if (!$parent) {
                    continue;
                }
                $r['fullname'] = $s->fullname;
                $r['pname'] = $parent->fullname;
                $r['dob'] = date('d-m-Y', strtotime($s->dob));
                $r['phone'] = $parent->phone;
                $r['email'] = $parent->email;
                $r['id'] = $s->id;
                $r['status'] = $s->detail['status'];
                $r['entrance'] = $s->detail['entrance_date'];
                $r['drop'] = $s->detail['drop_time'];
                $transactions = Transaction::where('class_id', $class_id)->where('student_id', $s->id)->whereBetween('time', [$from, $to])->get();
                $r['hp'] = 0;
                $r['mg'] = 0;
                $r['dd'] = 0;
                $r['no'] = 0;
                $r['gc'] = 0;
                $r['cd'] = 0;
                $r['remain'] = 0;
                foreach ($transactions as $t) {
                    //hp 
                    $acc_no = Account::where('level_2', '131')->first()->id;
                    $dtcth = Account::where('level_2', '3387')->first()->id;
                    $dt = Account::where('level_2', '511')->first()->id;

                    // print_r($t->debit);
                    // Học phí
                    $tag = $t->tags()->first();

                    if ($t->debit == $acc_no) {
                        $r['hp'] += $t->amount;
                    }
                    // Điều chỉnh học phí
                    if (($t->debit == $dtcth) && $t->credit == $acc_no) {
                        $r['hp'] -= $t->amount;
                    }
                    // Miễn giảm
                    if (($t->debit == $dt) && $t->credit == $acc_no) {
                        $r['mg'] += $t->amount;
                    }
                    //DD
                    $acc = Account::where('type', 'equity')->get('id')->toArray();

                    if (in_array($t->debit, array_column($acc, 'id')) && $t->credit == $acc_no) {
                        $r['dd'] += $t->amount;
                    }
                    //giữ chỗ
                    // $tag = Tag::where('name', 'Giữ chỗ')->first()->id;
                    // $t_tag = $t->tags->toArray();
                    // if($t_tag){
                    //     foreach($t_tag as $tt){
                    //         if($tt['id'] == $tag){
                    //             $r['gc'] += $t->amount;
                    //         }
                    //     }
                    // }

                    //Số dư kì trước
                    $debit = Transaction::where('class_id', $class_id)->where('student_id', $s->id)->where('time', '<', $from)->where('debit', $acc_no)->sum('amount');
                    $credit = Transaction::where('class_id', $class_id)->where('student_id', $s->id)->where('time', '<', $from)->where('credit', $acc_no)->sum('amount');
                    $r['remain'] = $debit - $credit;
                }
                $r['attendance'] = [];
                $r['cd'] = $r['hp'] - $r['mg'] + $r['remain'];
                $r['no'] = $r['cd'] - $r['dd'];

                //Attendance
                foreach ($sessions as $ss) {
                    $attendance = StudentSession::where('session_id', $ss->id)->where('student_id', $s->id)->first();
                    if ($attendance) {
                        switch ($attendance->attendance) {
                            case 'present':
                                # code...
                                $r['attendance'][] = 'x';
                                break;
                            case 'late':
                                # code...
                                $r['attendance'][] = 'x';
                                break;
                            case 'absence':
                                # code...
                                $r['attendance'][] = 'p';
                                break;
                            case 'n_absence':
                                # code...
                                $r['attendance'][] = 'kp';
                                break;
                            case 'holding':
                                # code...
                                $r['attendance'][] = '-';
                                break;
                            default:
                                # code...
                                break;
                        }
                    } else {
                        $r['attendance'][] = '-';
                    }
                }
                $result[] = $r;
            }
        }
        return response()->json(['students' => $result, 'sessions' => $sessions->toArray()]);
    }
    protected function getCenterReport($id)
    {
        $center = Center::find($id);
        $year = auth()->user()->wp_year;
        if ($center) {
            $classes = Classes::where('center_id', $id)->where('year', $year);
            $class_count = $classes->count();
            $classes = $classes->get();
            $arr_student = [];
            $sum_student = 0;
            foreach ($classes as $class) {
                if ($year < 2021) {
                    $students = $class->students;
                } else {
                    $students = $class->activeStudents;
                }
                foreach ($students as $student) {
                    if ($year < 2021) {
                        if (
                            date('Y-m-d', strtotime($student['detail']['entrance_date'])) > date('Y-m-d', strtotime('2020/10/31'))
                            || date('Y-m-d', strtotime($student['detail']['entrance_date'])) < date('Y-m-d', strtotime('2020/07/01'))
                        ) continue;
                    }
                    $sum_student++;
                    if (!in_array($student->id, $arr_student)) {
                        $arr_student[] = $student->id;
                    }
                }
            }
            print_r("Tổng số lớp: " . $class_count);
            echo "<br>";
            print_r("Tổng lượt học: " . $sum_student);
            echo "<br>";
            print_r("Tổng học sinh: " . count($arr_student));
        }
    }
    protected function getScoreReport(Request $request)
    {
        $rules = ['class_id' => 'required'];
        $this->validate($request, $rules);
        $class_id = $request->class_id;
        if ($request->from == -1) {
            $from = '1999-01-01 00:00:00';
        } else $from = date('Y-m-d 00:00:00', strtotime($request->from));
        if ($request->to == -1) {
            $to = '2100-01-01 00:00:00';
        } else $to = date('Y-m-d 23:59:59', strtotime($request->to));

        $class = Classes::find($class_id);
        $sessions = Session::Select('sessions.id', 'teacher.name', 'sessions.date')->whereBetween('date', [$from, $to])->where('class_id', $class_id)->leftJoin('teacher', 'sessions.teacher_id', 'teacher.id')->orderBy('sessions.date')->get();
        $result = [];
        if ($class) {
            $students = $class->students;
            foreach ($students as $s) {
                $parent = Parents::find($s->parent_id);
                if (!$parent) {
                    continue;
                }
                $r['fullname'] = $s->fullname;
                $r['pname'] = $parent->fullname;
                $r['dob'] = date('d-m-Y', strtotime($s->dob));
                $r['phone'] = $parent->phone;
                $r['email'] = $parent->email;

                $r['attendance'] = [];
                $r['score'] = [];
                $r['id'] = $s->id;
                $r['status'] = $s->detail['status'];
                //Attendance
                foreach ($sessions as $ss) {
                    // $attendance = StudentSession::where('session_id', $ss->id)->where('student_id', $s->id)->first();
                    // print_r($ss->student($s->id)->get()->toArray());

                    if ($ss->student($s->id)->first()) {
                        $attendance = $ss->student($s->id)->first()['pivot'];
                    } else $attendance = null;
                    // print_r($attendance->toArray());
                    if ($attendance) {
                        switch ($attendance->attendance) {
                            case 'present':
                                # code...
                                $r['attendance'][] = 'x';
                                break;
                            case 'late':
                                # code...
                                $r['attendance'][] = 'x';
                                break;
                            case 'absence':
                                # code...
                                $r['attendance'][] = 'p';
                                break;
                            case 'n_absence':
                                # code...
                                $r['attendance'][] = 'kp';
                                break;
                            case 'holding':
                                # code...
                                $r['attendance'][] = '-';
                                break;
                            default:
                                # code...
                                break;
                        }
                        $r['score']['btvn_max'][] = $attendance->btvn_max;
                        $r['score']['btvn_complete'][]  = $attendance->btvn_complete;
                        $r['score']['btvn_score'][]  = $attendance->btvn_score;
                        $r['score']['max_score'][]  = $attendance->max_score;
                        $r['score']['score'][]  = $attendance->score;
                        $r['score']['comment'][] = $attendance->comment;
                        $r['score']['btvn_comment'][] = $attendance->btvn_comment;
                    } else {
                        $r['attendance'][] = '';
                        $r['score']['btvn_max'][] = '';
                        $r['score']['btvn_complete'][]  = '';
                        $r['score']['btvn_score'][]  = '';
                        $r['score']['max_score'][]  = '';
                        $r['score']['score'][]  = '';
                        $r['score']['comment'][] = '';
                        $r['score']['btvn_comment'][] = '';
                    }
                }
                $result[] = $r;
            }
        }
        return response()->json(['students' => $result, 'sessions' => $sessions->toArray()]);
    }
    protected function getEventScore(Request $request)
    {
        $rules = ['class_id' => 'required'];
        $this->validate($request, $rules);
        $class_id = $request->class_id;

        $class = Classes::find($class_id);
        $sessions = $class->sessions;
        $result = [];
        if ($class) {
            $students = $class->activeStudents()->orderBy('students.fullname')->get();
            foreach ($students as $s) {
                $parent = Parents::find($s->parent_id);
                if (!$parent) {
                    continue;
                }
                $r['fullname'] = $s->fullname;
                $r['pname'] = $parent->fullname;
                $r['dob'] = date('d-m-Y', strtotime($s->dob));
                $r['phone'] = $parent->phone;
                $r['email'] = $parent->email;
                $r['school'] = $s->school;
                $r['room'] = [];
                $r['score'] = [];
                $r['sbd'] = [];
                $r['id'] = $class->code . '' . $s['sc_id'];
                //Check center
                $active_class = $s->activeClasses;
                if (count($active_class) > 0) {
                    $c = Classes::find($active_class[0]->id);
                    switch ($c->center_id) {
                        case 2:
                        case 4:
                            # code...
                            $r['center'] = 'TDH-DQ';
                            break;
                        case 3:
                            # code...
                            $r['center'] = 'PTT';
                            break;
                        case 5:
                        case 1:
                            $r['center'] = 'TY';
                            # code...
                            break;
                        default:
                            # code...
                            break;
                    }
                } else {
                    $r['center'] = '';
                }
                $r['status'] = $s->detail['status'];
                //Attendance
                foreach ($sessions as $ss) {
                    $pivot = StudentSession::where('session_id', $ss->id)->where('student_id', $s->id)->first();
                    $r['score'][]  = ($pivot) ? ($pivot->score ? $pivot->score : '-') : '';
                    $r['room'][] = ($pivot) ? ($pivot->btvn_comment ? $pivot->btvn_comment : '-') : '';
                    $r['sbd'][] = ($pivot) ? ($pivot->btvn_score ? $pivot->btvn_score : '-') : '';
                }
                $result[] = $r;
            }
        }
        return response()->json(['students' => $result, 'sessions' => $sessions->toArray()]);
    }
    protected function getResult(Request $request)
    {
        $rules = ['event_id' => 'required'];
        $this->validate($request, $rules);

        $event = Classes::find($request->event_id);
        $result = [];
        if ($event) {
            $sessions = $event->sessions;
            foreach ($sessions as $key => $session) {
                $students = $session->students;
                $result[] = $session->toArray();
                $result[$key]['students'] = [];
                foreach ($students as $k => $student) {
                    //Get class
                    $ss = StudentSession::find($student->pivot['id']);
                    // $obj_ids = array($ss->objectives);
                    //     $objs = Objective::whereIn('id', $obj_ids)->get();
                    //     $student->objectives = implode(array_column($objs->toArray(), 'content'));

                    //Get Objective
                    // echo $ss->objec
                    if (!empty($ss->objectives)) {
                        $obj_ids = array($ss->objectives);
                        $objs = Objective::whereIn('id', $obj_ids)->get();
                        $student->objectives = implode(array_column($objs->toArray(), 'content'));
                    } else {
                        $objs = [];
                        $student->objectives = [];
                    }


                    $student->classes = $student->activeClasses()->get()->toArray();
                    $student->dob_format = date('d/m/Y', strtotime($student->dob));

                    $attempt = Attempt::where('student_session', $student->pivot['id'])->first();
                    $parent = Parents::find($student->parent_id);
                    if ($parent) {
                        $student->pname = $parent->fullname;
                        $student->pphone = $parent->phone;
                        $student->pemail = $parent->email;
                    }
                    //Chưa làm bài
                    if (!$attempt) {
                        $student->result_status = 'Chưa làm bài';
                        $result[$key]['students'][] = $student;
                    } else {
                        $attempt_detail = AttemptDetail::where('attempt_id', $attempt->id)->get();
                        $student->quiz_id = $attempt->quiz_id;
                        $student->start_time = date('d/m/Y H:i:s', strtotime($attempt->start_time));

                        $student->score_domain_1 = $attempt->score_domain_1;
                        $student->score_domain_2 = $attempt->score_domain_2;
                        $student->score_domain_3 = $attempt->score_domain_3;

                        if ($attempt_detail->first()) {
                            //Có bài làm
                            $student->result_status = 'Đã có bài';
                            $result[$key]['students'][] = $student;
                        } else {
                            $student->result_status = 'Chưa có bài';
                            $result[$key]['students'][] = $student;
                        }
                    }
                }
            }
        }
        return response()->json($result);
    }
    protected function getAttempt(Request $request)
    {
        $rules = ['ss_id' => 'required'];
        $this->validate($request, $rules);

        $ss = StudentSession::find($request->ss_id);

        if ($ss) {
            $student = Student::find($ss->student_id);
            $attempt = Attempt::where('student_session', $ss->id)->first();
            if ($attempt) {
                $quiz = Quiz::find($attempt->quiz_id);
                if ($quiz) {
                    $result = [];
                    //Thong tin hocj sinh
                    $result['student'] = $student->toArray();
                    $classes = $student->activeClasses()->get()->toArray();
                    $result['student']['classes'] = implode(',', array_column($classes, 'code'));
                    $result['quiz'] = $quiz;
                    $result['quiz']['duration'] = $quiz->duration;
                    $result['quiz']['attempt_id'] = $attempt->id;
                    $result['quiz']['correction_upload'] = $attempt->correction_upload;
                    if (!$result['quiz']['student_session_id']) {
                        $result['quiz']['student_session_id'] = $request->ss_id;
                    }
                    $result['questions'] = [];
                    $result['packages'] = [];
                    $questions = $quiz->questions()->get();
                    $once = true;
                    $ref_tmp = -2;
                    foreach ($questions as $key => $q) {

                        // Get topic
                        $topics = $q->topics;
                        $q->topics = $topics->toArray();

                        if (!array_key_exists($q->domain, $result['packages'])) {
                            if ($once) {
                                $result['packages'][$q->domain] = ['active' => true, 'question_number' => 1, 'subject' => $q->domain];
                                $once = false;
                            } else {
                                $result['packages'][$q->domain] = ['active' => false, 'question_number' => 1, 'subject' => $q->domain];
                            }
                        } else {
                            $result['packages'][$q->domain]['question_number']++;
                        }
                        $result['questions'][] = $q->toArray();
                        $result['questions'][$key]['s_index'] = $result['packages'][$q->domain]['question_number'];
                        // $result['questions'][$key]['options'] = [];
                        $result['questions'][$key]['content'] = str_replace('<p></p>', '<br/>', $result['questions'][$key]['content']);
                        if ($q->question_type == 'mc') {
                            foreach ($q->pivot['option_config'] as $option_id) {
                                $option = Option::find($option_id);
                                $result['questions'][$key]['options'][] = ['id' => $option->id, 'content' => $option->content];
                            }
                        }
                        if ($q->question_type == 'fib') {
                            for ($i = 1; $i < 20; $i++) {
                                # code...
                                $str = '{' . $i . '}';

                                $result['questions'][$key]['content'] = str_replace($str, '!@#', $result['questions'][$key]['content']);
                                // print_r($result['questions'][$key]['content']);
                            }
                        }


                        if ($q->complex == 'sub') {
                            if ($ref_tmp != $q->ref_question_id) {

                                $ref_tmp = $q->ref_question_id;
                                $main = Question::find($q->ref_question_id);
                                if ($main) {
                                    $result['questions'][$key]['main_content'] = $main->content;
                                    $result['questions'][$key]['main_statement'] = $main->statement;
                                }
                            }
                        }
                        $attempt_detail = AttemptDetail::where('question_id', $q->id)->where('attempt_id', $attempt->id)->first();
                        $result['questions'][$key]['a_essay'] = '';
                        $result['questions'][$key]['a_option'] = '';
                        $result['questions'][$key]['a_fib'] = '';
                        $result['questions'][$key]['done'] = true;
                        $result['questions'][$key]['score'] = NULL;
                        $result['questions'][$key]['comment'] = NULL;
                        $result['questions'][$key]['attempt_detail_id'] = NULL;
                        if ($attempt_detail) {
                            $result['questions'][$key]['a_essay'] = $attempt_detail->essay;
                            $result['questions'][$key]['a_option'] = $attempt_detail->options;
                            $result['questions'][$key]['a_fib'] = $attempt_detail->fib;
                            $result['questions'][$key]['score'] = $attempt_detail->score;
                            $result['questions'][$key]['comment'] = $attempt_detail->comment;
                            $result['questions'][$key]['done'] = true;
                            $result['questions'][$key]['attempt_detail_id'] = $attempt_detail->id;
                        }
                    }
                    $result['packages'] = array_values($result['packages']);
                    // Get Comment for domain
                    $criterias = Criteria::where('attempt_id', $attempt->id)->get();
                    $result['criterias'] = $criterias->toArray();
                    $result['upload'] = $attempt->upload;

                    //
                    return response()->json($result);
                }
            }
        }
    }
    protected function submitMark(Request $request)
    {
        $rules = ['questions' => 'required'];
        $this->validate($request, $rules);
        $attempt_id = 0;
        foreach ($request->questions as $q) {
            $ad = AttemptDetail::find($q['attempt_detail_id']);
            if ($ad) {
                $attempt_id = $ad->attempt_id;
                $ad->score = $q['score'];
                $ad->comment = $q['comment'];
                $ad->save();
            }
        }
        $this->sumScore($attempt_id);
        $result = [];
        foreach ($request->criterias as $c) {
            if ($c['id'] == -1) {
                $input['title'] = $c['title'];
                $input['content'] = $c['content'];
                $input['domain'] = $c['domain'];
                $input['attempt_id'] = $request->attempt_id;
                $result[] = Criteria::create($input);
            } else {
                $criteria = Criteria::find($c['id']);
                if ($criteria) {
                    $criteria->title = $c['title'];
                    $criteria->content = $c['content'];
                    $criteria->save();
                    $result[] = $criteria;
                }
            }
        }
        foreach ($request->removed_criterias as $rc) {
            $criteria = Criteria::find($rc['id']);
            if ($criteria) {
                $criteria->forceDelete();
            }
        }
        return response()->json($result);
    }
    public function select(array $array, $column)
    {
        $a = [];
        foreach ($array as $ss) {
            array_push($a, $ss[$column]);
        }
        return $a;
    }
    public function sumScore($attempt_id)
    {
        // $attempt_id = $request->attempt_id;
        // $attempt_id = 96;


        //hàm dùng chung


        $attempt = Attempt::find($attempt_id);
        if (!$attempt) {
            return back();
        }
        $attempt_detail = AttemptDetail::where('attempt_id', $attempt_id)
            ->join('lms_questions', 'lms_attempt_details.question_id', 'lms_questions.id')->distinct()->get();
        // dd($attempt_detail);

        $arr_domain =   array_unique($this->select($attempt_detail->toArray(), 'domain'));
        $i = 1;
        $data = [];
        foreach ($arr_domain as $d) {
            $a = $attempt_detail->where('domain', $d)->sum('score');
            $data = $data + ['score_domain_' . $i => $a];
            $i++;
        }
        // dd($data);
        $attempt->fill($data)->save();
        return $attempt;
        // dd('Thành công');
    }
    protected function reGenerateFee()
    {
        $classes = Classes::where('student_number', '>', 0)->get();
        foreach ($classes as $c) {
            // $sessions = Session::where('class_id', $c->id)->whereBetween()
            $students = $c->students;
            foreach ($students as $s) {

                $entrance_date = strtotime($s->detail['entrance_date']);
                $first_date = strtotime('01-08-2020');
                $from = date('Y-m-d', ($entrance_date > $first_date) ? $entrance_date : $first_date);
                $to = date('Y-m-d', strtotime('30-09-2020'));

                $sessions = Session::where('class_id', $c->id)->whereBetween('date', [$from, $to])->get();
                foreach ($sessions as $ss) {
                    if ($ss->fee == 0) {
                        echo $c->code;
                        echo "<pre>";
                        print_r($ss->toArray());
                        echo "<pre>";
                    }
                }
            }
        }
    }
    protected function getActiveStudent(Request $request)
    {
        $rules = ['class_id' => 'required'];
        $this->validate($request, $rules);
        $class = Classes::find($request->class_id);
        if ($request->has('session_date')) {
            $date = date('Y-m-d', strtotime($request->session_date));
            $students = $class->activeStudentsDate($date)->get();
        } else {
            $students = $class->activeStudents;
        }
        return response()->json($students);
    }
    protected function getEventInfo()
    {
        $events = Classes::where('type', 'event')->where('active', 1)->get();
        $result = [];
        foreach ($events as $event) {
            $products = Session::where('class_id', $event->id)->get();
            $result[] = $event;
        }
        return response()->json($result);
    }
    protected function getLocationInfo()
    {
        $events = Classes::where('type', 'event')->where('active', 1)->get();
        $result = [];
        foreach ($events as $event) {
            $rooms = Session::where('class_id', $event->id)->select('room_id', 'room.name')->leftJoin('room', 'sessions.room_id', 'room.id')->distinct('room_id')->get();
            foreach ($rooms as $r) {
                if (!in_array(['id' => $r->room_id, 'label' => $r->name], $result)) {
                    $result[] = ['id' => $r->room_id, 'label' => $r->name];
                }
            }
        }
        return response()->json($result);
    }
    public function getAnalytics(Request $request)
    {
        $rules = ['class_id' => 'required'];
        $this->validate($request, $rules);

        $class = Classes::find($request->class_id);
        $data_1 = [[
            'label' => 'Xác nhận',
            'backgroundColor' => '#36a2eb',
            'data' => [0, 0, 0, 0],
        ], [
            'label' => 'Chưa xác nhận',
            'backgroundColor' => '#ff6384',
            'data' => [0, 0, 0, 0],
        ]];
        $data_2 = [[
            'label' => 'Xác nhận',
            'backgroundColor' => '#36a2eb',
            'data' => [0, 0, 0, 0],
        ], [
            'label' => 'Chưa xác nhận',
            'backgroundColor' => '#ff6384',
            'data' => [0, 0, 0, 0],
        ]];
        $data_3 = [
            'labels' => [],
            'datasets' => [
                ['label' => 'CS Trung Yên', 'fill' => false, 'borderColor' => '#36a2eb', 'data' => []],
                ['label' => 'CS Phạm Tuấn Tài', 'fill' => false, 'borderColor' => '#ff6384', 'data' => []],
                ['label' => 'CS TDH-DQ', 'fill' => false, 'borderColor' => '#E230FA', 'data' => []],
                ['label' => 'Ngoài TT', 'fill' => false, 'borderColor' => '#30FA80', 'data' => []],
                ['label' => 'Tổng', 'fill' => false, 'borderColor' => 'red', 'data' => []],
            ]
        ];
        $labels_3 = [];
        if ($class && $class->type = 'event') {
            $students = $class->studentsByEntranceTime;
            foreach ($students as $student) {
                // Ngày đăng ký
                $time = date('d/m', strtotime($student->detail['entrance_date']));
                if (!array_key_exists($time, $labels_3)) {
                    $labels_3[$time] = [0, 0, 0, 0, 0];
                }
                //Số môn đăng ký
                $sessions = $student->sessionsOfClass($class->id)->count();
                $center = 3;
                //Check học sinh đang học tại trung tâm nào
                $active_class = $student->activeClasses;
                if (!count($active_class) == 0) {
                    $c = Classes::find($active_class[0]->id);
                    switch ($c->center_id) {
                        case 2:
                        case 4:
                            $center = 2;
                            break;

                        case 3:
                            # code...
                            $center = 1;
                            break;

                        case 5:
                        case 1:
                            $center = 0;
                            # code...
                            break;
                        default:
                            # code...
                            break;
                    }
                }
                switch ($student->detail['status']) {
                    case 'active':
                        $data_1[0]['data'][$center]++;
                        $data_2[0]['data'][$center] += $sessions;
                        break;

                    case 'waiting':
                        # code...
                        $data_1[1]['data'][$center]++;
                        $data_2[1]['data'][$center] += $sessions;
                        break;

                    default:
                        # code...
                        break;
                }
                $labels_3[$time][$center] += $sessions;
                $labels_3[$time][4] += $sessions;
            }
            $i = 0;
            foreach ($labels_3 as $time => $value) {
                $data_3['labels'][] = $time;
                $data_3['datasets'][0]['data'][] = $value[0];
                $data_3['datasets'][1]['data'][] = $value[1];
                $data_3['datasets'][2]['data'][] = $value[2];
                $data_3['datasets'][3]['data'][] = $value[3];
                $data_3['datasets'][4]['data'][] = $value[4];
            }
        }
        return response()->json(['data_1' => $data_1, 'data_2' => $data_2, 'data_3' => $data_3]);
    }
    public function mktAnalytics()
    {
        $class_id = 185;
        $class = Classes::find($class_id);
        if ($class) {
            $sessions = $class->sessions;
            foreach ($sessions as $session) {
                $students = $session->students();
                foreach ($students as $stud) {
                }
            }
        }
    }
    public function tkb()
    {
        $firstday = date('Y-m-d', strtotime("this week"));
        $lastday = date('Y-m-d', strtotime($firstday . ' + 6 days'));
        $sessions = Session::whereIn('date', [$firstday, $lastday])->get();

        echo "<pre>";
        print_r($sessions->toArray());
        echo "</pre>";
    }
    protected function misaUpload()
    {
        $arr = [];
        $classes = Classes::all();
        $file = fopen(public_path() . "/misa_class.csv", "w");
        fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
        $first_line = ['Mã(*)', 'Tên (*)', 'Tính chất', 'Đơn vị tính chính', 'TK doanh thu', 'TK chi phí'];
        fputcsv($file, $first_line);
        foreach ($classes as $c) {
            $arr = [];

            array_push($arr, $c->id);
            array_push($arr, $c->year . "_" . $c->code);
            array_push($arr, 2);
            array_push($arr, 'Ca');
            array_push($arr, '3387');
            array_push($arr, '632');
            fputcsv($file, $arr);

            // $c->misa_upload = 1;
            // $c->save();
        }
        return response('/public/misa_class.csv');
    }
    protected function deleteStudent(Request $request)
    {
        // $sc = StudentClass::Where('class_id', $request->class_id)->where('student_id', $request->id)->
        StudentClass::find($request->sc_id)->forceDelete();
    }
    public function studentPtt()
    {
        $file = fopen(public_path() . "/student_ptt.csv", "w");
        fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
        $first_line = [
            'Họ tên', 'Ngày sinh', 'Họ tên PH', 'Số điện thoại', 'Email', 'Lớp Vee', 'Ngày gia nhập'
        ];
        fputcsv($file, $first_line);
        $arr_student_id = [];
        $result = [];
        $i = 2;
        while ($i < 10) {
            # code...
            // echo $i;
            $classes = Classes::where('code', 'like', '%.%' . $i)->where('year', 2021)->get();

            foreach ($classes as $c) {
                $d =  $c->activeStudents()->get();
                foreach ($d  as $s) {
                    if (in_array($s->id, $arr_student_id) == false) {
                        $parent = Parents::find($s->parent_id);
                        if ($parent) {
                            $result[] = [$s->fullname, $s->dob, $parent->fullname, $parent->phone, $parent->email, $c->code, date('d/m/Y', strtotime($s->created_at))];
                        } else {
                            $result[] = [$s->fullname, $s->dob, '', '', '', $c->code, $s->created_at];
                        }
                        array_push($arr_student_id, $s->id);
                    } else {
                        foreach ($result as $key => $r) {
                            if ($r[0] == $s->fullname && $r[1] == $s->dob) {
                                $result[$key][5] = $result[$key][5] . ',' . $c->code;
                            }
                        }
                    }
                }
                // $arr_student = $arr_student + $d->toArray();
            }
            $i += 2;
        }
        foreach ($result as $r) {
            fputcsv($file, $r);
        }
        return response('/public/student_ptt.csv');
    }
    public function autoRegister()
    {
        $classes = Classes::where('code', 'like', '%9.%')->where('year', 2021)->get();
        $arr_student_id = [];
        foreach ($classes as $c) {
            $d =  $c->activeStudents()->get();
            foreach ($d  as $s) {
                if (in_array($s->id, $arr_student_id) == false) {
                    $data = [
                        'student_id' => $s->id,
                        'class_id' => 405,
                        'entrance_date' => '2022-03-12',
                        'status' => 'active'
                    ];
                    $a = StudentClass::create($data);

                    array_push($arr_student_id, $s->id);
                }
            }
            // $arr_student = $arr_student + $d->toArray();
        }
        dd($arr_student_id);
    }
}
