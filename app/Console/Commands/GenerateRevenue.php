<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Session;
use App\Student;
use App\Transaction;
use App\Account;
use App\StudentSession;
class GenerateRevenue extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'revenue:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate revenue every day';

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
        $today = date('Y-m-d');
        $sessions = Session::where('status', '0')->where('date', $today)->get();
            foreach($sessions as $session){
                $students = $session->students()->wherePivot('checked', '0')->get();
                // echo "<pre>";
                // print_r($students->toArray());
                foreach($students as $student){
                    $revenue = 0;
                    $acc_131 = Account::where('level_2', '131')->first()->id;                
                    $fee = $session->transactions()->where('student_id', $student->id)->get();
                    foreach($fee as $f){
                        if($f->debit == $acc_131){
                            $revenue += $f->pivot['amount'];
                        }
                        if($f->credit == $acc_131){
                            $revenue -= $f->pivot['amount'];
                        }
                    }
                    if($revenue > 0){
                        $input['debit'] = Account::where('level_2', '3387')->first()->id;
                        $input['credit'] = Account::where('level_2', '511')->first()->id;
                        $input['amount'] = $revenue;
                        $input['center_id'] = $session->center_id;
                        $input['time'] = $session->date;
                        $input['content'] = 'Doanh thu lớp học';
                        $input['class_id'] = $session->class_id;
                        $input['student_id'] = $student->id;
                        $input['session_id'] = $session->id;
                        $input['created_at'] = $session->date;
                        $input['updated_at'] = $session->date;
                        $input['center_id'] = $session->center_id;
                        $input['refer_transaction'] = -1;
                        Transaction::create($input);
                        // echo "<pre>";
                        // print_r($input);
                    }
                    // print_r($student->pivot['id']);
                    $ss = StudentSession::find($student->pivot['id']);
                    if($ss){
                        $ss->checked = 1; 
                        $ss->save();
                    }
                    $session->status = '1';
                    $session->save();
                }
            }
    }
}
