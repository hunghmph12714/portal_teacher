<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Entrance;
use App\Status;
use App\Step;
use App\Center;
use App\EntranceStat;
use App\Student;
use DB;
class everyHour extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'entrance:stat';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Entrance stats every hour';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        //
        $centers = Center::where('id', '!=', 1)->get();
        foreach($centers as $c){
            $r = $this->getDetailStats($c->id);
            $r['center_id'] = $c->id;
            $r['date'] = date('Y-m-d');
            $check = EntranceStat::where('center_id', $c->id)->where('date', date('Y-m-d'))->first();
            if($check){
                EntranceStat::where('id', $check->id)->update($r);
            }else{
                EntranceStat::create($r);
            }
        }
    } 
    
    protected function getDetailStats($center_id){
        // $centers = Center::where('id', '!=', 1)->get();
        $today = date('Y-m-d 00:00:00');
        $result = [
            'init_remain' => 0, 'init_today' => 0, 'init_completed' => 0, 'init_total' => 0, 'init_1' => 0, 'init_2' => 0, 'init_3' => 0,
            'appointment_remain' => 0, 'appointment_today' => 0, 'appointment_completed' => 0, 'appointment_total' => 0, 'appointment_1' => 0, 'appointment_2' => 0, 'appointment_3' => 0,
            'result_remain' => 0, 'result_today' => 0, 'result_completed' => 0, 'result_total' => 0, 'result_1' => 0, 'result_2' => 0, 'result_3' => 0,
            'inform_remain' => 0, 'inform_today' => 0, 'inform_completed' => 0, 'inform_total' => 0, 'inform_1' => 0, 'inform_2' => 0, 'inform_3' => 0, 'inform_4'=> 0,
            'final_remain' => 0, 'final_today' => 0, 'final_completed' => 0, 'final_total' => 0, 'final_1' => 0, 'final_2' => 0, 'final_3' => 0,
        ];

        //init
        $init = $this->getStats($center_id, 0)->original;
        $result['init_remain'] = $init['total_remain'];
        $result['init_today'] = $init['total_today'];
        $result['init_completed'] = $init['total_completed'];
        $result['init_total'] = $init['total'];
        $init = $this->getEntranceByStep(1, [$center_id])->toArray();

        foreach($init as $i){
            $date = date('Y-m-d H:i:s', strtotime($i['created_at']));
            if($i['status'] == 'Thất bại 1'){
                $result['init_3']++;
                continue;
            }else{
                if($date >= $today){
                    $result['init_1']++;
                }else $result['init_2']++;
            }
            
        }
        // print_r("<pre>");
        // print_r($init->toArray());

        //appointment
        $appointment = $this->getStats($center_id, 1)->original;
        $result['appointment_remain'] = $appointment['total_remain'];
        $result['appointment_today'] = $appointment['total_today'];
        $result['appointment_completed'] = $appointment['total_completed'];
        $result['appointment_total'] = $appointment['total'];
        $appointment = $this->getEntranceByStep(2, [$center_id])->toArray();

        foreach($appointment as $i){
            $date = date('Y-m-d H:i:s', strtotime($i['test_time']));
            if($i['status'] == 'Thất bại 2'){
                $result['appointment_3']++;
                continue;
            }
            if($date >= $today){
                $result['appointment_1']++;
            }else $result['appointment_2']++;
        }
        //result
        $r = $this->getStats($center_id, 2)->original;
        $result['result_remain'] = $r['total_remain'];
        $result['result_today'] = $r['total_today'];
        $result['result_completed'] = $r['total_completed'];
        $result['result_total'] = $r['total'];

        $r = $this->getEntranceByStep(3, [$center_id])->toArray();

        foreach($r as $i){
            $date = date('Y-m-d H:i:s', strtotime($i['step_updated_at']));
            if($i['status'] == 'Thất bại 3'){
                $result['result_3']++;
                continue;
            }
            if($date >= $today){
                $result['result_1']++;
            }else $result['result_2']++;
        }
        //inform
        $inform = $this->getStats($center_id, 3)->original;
        $result['inform_remain'] = $inform['total_remain'];
        $result['inform_today'] = $inform['total_today'];
        $result['inform_completed'] = $inform['total_completed'];
        $result['inform_total'] = $inform['total'];
        $r = $this->getEntranceByStep(4, [$center_id])->toArray();

        foreach($r as $i){
            if($i['status'] == 'Thất bại 4'){
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
        $r = $this->getEntranceByStep(5, [$center_id])->toArray();

        foreach($r as $i){
            $date = date('Y-m-d H:i:s', strtotime($i['step_updated_at']));
            if($i['status'] == 'Thất bại 5'){
                $result['final_3']++;
                continue;
            }
            if($date >= $today){
                $result['final_1']++;
            }else $result['final_2']++;
        }
        return $result;

    }
    protected function getStats($center_id, $step_id){
        $step_id = $step_id + 1;
        $centers = explode('_', $center_id);
        $result = [
            'total' => 0,
            'total_remain' => 0,
            'total_today' => 0,
            'total_completed' => 0,
        ];

        $step = Step::find($step_id);
        if($step){
            $next_step = Step::where('type', 'Quy trình đầu vào')->where('order', $step->order+1)->first();
            $status = Status::where('name','Đang xử lý')->first();
            $status_lost = Status::where('name', 'Mất')->first()->id;
            $status_complete = Status::where('name', 'Đã xử lý')->first()->id;
            foreach($centers as $center){
                // echo $center;
                if($next_step && $status){
                    $today = date('Y-m-d 00:00:00');
                    $result['test'] = Entrance::Where('center_id', $center)->where('step_id', $step_id)->where('status_id', '!=', $status_lost)->where('status_id', '!=', $status_complete)->get();
                    $result['total'] += Entrance::Where('center_id', $center)->where('step_id', $step_id)->where('status_id', '!=', $status_lost)->where('status_id', '!=', $status_complete)
                        ->join('students','student_id','students.id')->join('parents','students.parent_id','parents.id')->count();
                    // $result['total_remain'] += Entrance::Where('center_id', $center)->where('step_id', $step_id)->where('step_updated_at','<', $today)->where('status_id', '!=', $status_lost)->where('status_id', '!=', $status_complete)
                    //     ->join('students','student_id','students.id')->join('parents','students.parent_id','parents.id')->count();
                    $result['total_today'] += Entrance::Where('center_id', $center)->where('step_id', $step_id)->where('entrances.step_updated_at', '>' ,$today)->where('status_id', '!=', $status_lost)->where('status_id', '!=', $status_complete)
                        ->join('students','student_id','students.id')->join('parents','students.parent_id','parents.id')->count();
                    $total_completed = Entrance::Where('center_id', $center)->where('step_id', $next_step->id)->where('step_updated_at','>', $today)->where('status_id', '!=', $status_lost)->where('status_id', '!=', $status_complete)
                        ->join('students','student_id','students.id')->join('parents','students.parent_id','parents.id')->count();
                    $result['total_completed'] += $total_completed;

                    $result['total_today'] += Entrance::Where('center_id', $center)->where('step_id', $next_step->id)->where('step_updated_at','>', $today)->where('status_id', '!=', $status_lost)->where('status_id', '!=', $status_complete)
                        ->where('entrances.created_at', '>' ,$today)->join('students','student_id','students.id')->join('parents','students.parent_id','parents.id')->count();
                    $result['total_remain'] = $result['total'] + $result['total_completed'] - $result['total_today'];
                }
                if(!$next_step){
                    $today = date('Y-m-d 00:00:00');
                    $status = Status::where('name', 'Đã xử lý')->first()->id;
                    
                    $result['total'] += Entrance::Where('center_id', $center)->where('step_id', $step_id)->where('status_id', '!=', $status)
                        ->join('students','student_id','students.id')->join('parents','students.parent_id','parents.id')->count();
                    
                    $result['total_today'] += Entrance::Where('center_id', $center)->where('step_id', $step_id)->where('entrances.step_updated_at', '>' ,$today)->where('status_id', '!=', $status)
                        ->join('students','student_id','students.id')->join('parents','students.parent_id','parents.id')->count();
                    $total_completed = Entrance::Where('center_id', $center)->where('step_id', $step_id)->where('step_updated_at','>', $today)->where('status_id', '==', $status)
                        ->join('students','student_id','students.id')->join('parents','students.parent_id','parents.id')->count();
                    $result['total_completed'] += $total_completed;
                    $result['total_today'] += Entrance::Where('center_id', $center)->where('step_id', $step_id)->where('step_updated_at','>', $today)->where('entrances.created_at', '>' ,$today)->where('status_id', '!=', $status)
                        ->join('students','student_id','students.id')->join('parents','students.parent_id','parents.id')->count();
                    $result['total_remain'] = $result['total'] + $result['total_completed'] - $result['total_today'];
                }
            }
        }
        
        
        
        return response()->json($result);
    }
    protected function getEntranceByStep($step, $centers){
        $status = Status::where('name', 'Đã xử lý')->first()->id;
        $entrances = Entrance::Select(
            'entrances.id as eid','entrances.test_time','entrances.test_results',DB::raw('DATE_FORMAT(test_time, "%d/%m/%Y %h:%i %p") AS test_time_formated'),'test_answers','test_score','test_note','entrances.note as note','priority','entrances.created_at as created_at',
            'students.id as sid', 'students.fullname as sname',DB::raw('DATE_FORMAT(dob, "%d/%m/%Y") AS dob'),'students.grade','students.email as semail','students.phone as sphone','students.gender','students.school',
            'parents.id as pid', 'parents.fullname as pname', 'parents.phone as phone', 'parents.email as pemail','relationships.name as rname', 'relationships.id as rid',
            'parents.alt_fullname as alt_pname', 'parents.alt_email as alt_pemail', 'parents.alt_phone as alt_phone','parents.note as pnote',
            'relationships.color as color',DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),'courses.id as course_id','center.name as center','center.id as center_id','steps.name as step','steps.id as step_id','status.name as status','status.id as status_id',
            'classes.id as class_id', 'classes.code as class', 'enroll_date', 'message', 'step_updated_at', 'attempts'
            ,DB::raw('CONCAT(sources.name," ",mediums.name)  AS source')
        )->where('entrances.step_id', $step)
        ->where('entrances.status_id', '!=', $status)
        ->whereIn('entrances.center_id', $centers)
        ->leftJoin('students','student_id','students.id')->join('parents','students.parent_id','parents.id')
        ->leftJoin('sources', 'source_id', 'sources.id')->leftJoin('mediums', 'medium_id', 'mediums.id')
        ->leftJoin('relationships','parents.relationship_id','relationships.id')
        ->leftJoin('courses','course_id','courses.id')->leftJoin('center','center_id','center.id')
        ->leftJoin('steps','step_id','steps.id')->leftJoin('status','status_id','status.id')
        ->leftJoin('classes','class_id','classes.id')->orderBy('entrances.status_id','asc')
        ->orderBy('priority','desc')->orderBy('created_at','desc')->get();
        return $entrances;
    }
}
