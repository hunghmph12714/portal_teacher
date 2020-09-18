<?php
//s
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Account;
use DB;
use App\Transaction;
use App\Tag;
use App\Student;
use App\Classes;
use App\StudentClass;
use App\Discount;
class TransactionController extends Controller
{
    //
    public function discountId(){
        $tag = Tag::where('name', "Miễn giảm")->first();
        $dc = Tag::where('name', "Điều chỉnh")->first();
        // $transactions = $tag->transactions()->whereNULL('discount_id')->get();
        // // $transactions = Transaction::whereHas('tags', function($query){
        // //     $query->where('name', 'Miễn giảm');
        // // })->get();
        // echo "<pre>";
        // print_r($transactions->toArray());
        // foreach($transactions as $t){
        //     $student_class = StudentClass::where('class_id', $t->class_id)->where('student_id', $t->student_id)->first()->id;
        //     $discount = Discount::where('student_class_id', $student_class)->first();
        //     if($discount){
        //         $t->discount_id = $discount->id;
        //         $t->save();
        //     }
           
        // }
        // $dieuchinh = $dc->transactions()->whereNULL('discount_id')->get();

        // echo "<pre>";
        // print_r($dieuchinh->toArray());
        // foreach($dieuchinh as $d){
        //     $date = date('Y-m-d', strtotime($d->time));
        //     $discount = Discount::where('class_id', $d->class_id)->where('active_at', '<=' ,$date)->first();
        //     if($discount){
        //         $d->discount_id = $discount->id;
        //         $d->save();
        //     }   
            
        // }
    }
    protected function addTransaction(Request $request){
        $rules = [
            'credit'=>'required',
            'debit'=>'required',
            'amount'=>'required',
            'time'=>'required',
        ];
        $this->validate($request, $rules);

        $input['credit'] = $request->credit['id'];
        $input['debit'] = $request->debit['id'];
        $input['amount'] = $request->amount;
        $input['time'] = date('Y-m-d H:i:m', strtotime($request->time));
        $input['content'] = ($request->content)?$request->content:NULL;
        $input['student_id'] = ($request->student)?$request->student['value']:NULL;
        $input['class_id'] = ($request->selected_class) ? $request->selected_class['value']:NULL;
        $input['session_id'] = ($request->selected_session) ? $request->selected_session['value']:NULL;
        $input['user'] = auth()->user()->id;
        $transaction = Transaction::create($input);
        
        $tags = [];
        foreach($request->tags as $tag){
            if(array_key_exists('__isNew__', $tag)){
                $tag = Tag::create(['name'=>$tag['value']]);
                $transaction->tags()->attach($tag->id);
            }
            else{
                $transaction->tags()->attach($tag['value']);
            }
        }
        return response()->json($transaction);

    }
    protected function getTransaction(Request $request){
        $rules = [
            'page' => 'required',
            'per_page' => 'required',
        ];
        $this->validate($request, $rules);
        $offset = $request->page * ($request->per_page);
        $result = ['data' => []];
        $transactions = null;
        if(empty($request->filter)){
            $result['page'] = $request->page;
            $result['total'] = Transaction::all()->count();
            $transactions = Transaction::Select(
                'transactions.id as id','transactions.amount' ,DB::raw("DATE_FORMAT(transactions.time, '%d/%m/%Y') as time_formated"),'transactions.time','transactions.content','transactions.created_at',
                'debit_account.id as debit_id','debit_account.level_2 as debit_level_2', 'debit_account.name as debit_name', 'debit_account.type as debit_type',
                'credit_account.id as credit_id','credit_account.level_2 as credit_level_2', 'credit_account.name as credit_name', 'credit_account.type as credit_type',
                'students.id as sid', 'students.fullname as sname','students.dob', 
                'classes.id as cid', 'classes.code as cname', 'sessions.id as ssid', 'sessions.date as session_date ',
                'users.id as uid','users.name as uname'
            )
                ->leftJoin('accounts as debit_account','transactions.debit','debit_account.id')
                ->leftJoin('accounts as credit_account','transactions.credit','credit_account.id')
                ->leftJoin('students','transactions.student_id','students.id')
                ->leftJoin('classes','transactions.class_id','classes.id')
                ->leftJoin('sessions', 'transactions.session_id','sessions.id')
                ->leftJoin('users', 'transactions.user', 'users.id')->orderBy('transactions.id', 'DESC')->offset($offset)->limit($request->per_page)
                ->get();
            
        }
        else{
            $result['page'] = $request->page;
            
            // print_r($request->filter);
            foreach($request->filter as $f){
                $sname = '';
                if($f['column']['field'] == 'sname'){     
                    $sname = $f['value'];               
                                                     
                }                
                $transactions = Transaction::Select(
                    'transactions.id as id','transactions.amount' ,DB::raw("DATE_FORMAT(transactions.time, '%d/%m/%Y') as time_formated"),'transactions.time','transactions.content','transactions.created_at',
                    'debit_account.id as debit_id','debit_account.level_2 as debit_level_2', 'debit_account.name as debit_name', 'debit_account.type as debit_type',
                    'credit_account.id as credit_id','credit_account.level_2 as credit_level_2', 'credit_account.name as credit_name', 'credit_account.type as credit_type',
                    'students.id as sid', 'students.fullname as sname','students.dob', 
                    'classes.id as cid', 'classes.code as cname', 'sessions.id as ssid', 'sessions.date as session_date ',
                    'users.id as uid','users.name as uname'
                )
                    ->whereHas('students', function($q) use($sname) {
                        $q->where('fullname', 'like', '%'.$sname.'%');
                    })
                    ->leftJoin('accounts as debit_account','transactions.debit','debit_account.id')
                    ->leftJoin('accounts as credit_account','transactions.credit','credit_account.id')
                    ->leftJoin('students','transactions.student_id','students.id')
                    ->leftJoin('classes','transactions.class_id','classes.id')
                    ->leftJoin('sessions', 'transactions.session_id','sessions.id')
                    ->leftJoin('users', 'transactions.user', 'users.id')->orderBy('transactions.id', 'DESC')->offset($offset)->limit($request->per_page)
                    ->get();
            }
        }
        if($transactions){
            $x = $transactions->toArray();
            foreach($transactions as $key => $t){
                $tags = $t->tags()->get();
                $result['data'][$key] = $x[$key];
                $result['data'][$key]['tags'] = $tags->toArray();
            }
        }
        
        return response()->json($result);
        
        
    }
    protected function getTransactionbyId(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $result = [];
        
        $transactions = Transaction::Where('transactions.id', $request->id)->Select(
                'transactions.id as id','transactions.amount' ,DB::raw("DATE_FORMAT(transactions.time, '%d/%m/%Y') as time_formated"),'transactions.time','transactions.content','transactions.created_at',
                'debit_account.id as debit_id','debit_account.level_2 as debit_level_2', 'debit_account.name as debit_name', 'debit_account.type as debit_type',
                'credit_account.id as credit_id','credit_account.level_2 as credit_level_2', 'credit_account.name as credit_name', 'credit_account.type as credit_type',
                'students.id as sid', 'students.fullname as sname','students.dob', 
                'classes.id as cid', 'classes.code as cname', 'sessions.id as ssid', 'sessions.date as session_date ',
                'users.id as uid','users.name as uname'
            )
            ->leftJoin('accounts as debit_account','transactions.debit','debit_account.id')
            ->leftJoin('accounts as credit_account','transactions.credit','credit_account.id')
            ->leftJoin('students','transactions.student_id','students.id')
            ->leftJoin('classes','transactions.class_id','classes.id')
            ->leftJoin('sessions', 'transactions.session_id','sessions.id')
            ->leftJoin('users', 'transactions.user', 'users.id')->orderBy('transactions.id', 'DESC')->take(100)
            ->get();
        $x = $transactions->toArray();
        foreach($transactions as $key => $t){
            $tags = $t->tags()->get();
            $result[$key] = $x[$key];
            $result[$key]['tags'] = $tags->toArray();
        }
        return response()->json($result);
    }
    protected function editTransaction(Request $request){
        $rules = ['transaction_id' => 'required'];
        $this->validate($request, $rules);
        $t = Transaction::find($request->transaction_id);
        if($t){
            $t->credit = $request->credit['id'];
            $t->debit = $request->debit['id'];
            $t->amount = $request->amount;
            $t->time = date('Y-m-d H:i:m', strtotime($request->time));
            $t->content = ($request->content)?$request->content:NULL;
            $t->student_id = ($request->student)?$request->student['value']:NULL;
            $t->class_id = ($request->selected_class) ? $request->selected_class['value']:NULL;
            $t->session_id = ($request->selected_session) ? $request->selected_session['value']:NULL;
            $t->user = auth()->user()->id;
            $t->save();
            
            $tags = [];
            foreach($request->tags as $tag){
                if(array_key_exists('__isNew__', $tag)){
                    $tag = Tag::create(['name'=>$tag['value']]);
                    $t->tags()->attach($tag->id);
                }
                else{
                    $t->tags()->syncWithoutDetaching($tag['value']);
                }
            }
            return response()->json($t);
        }
        
        
    }
    protected function deleteTransaction(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);
        
        $transaction = Transaction::find($request->id);
        if($transaction){
            $transaction->forceDelete();
        }
        return response()->json('ok');
    }
    public function generate(){
        for($i = 0 ; $i < 100000 ; $i++){
            $input['credit'] = 10;
            $input['debit'] = 86;
            $input['amount'] = 500000;
            $input['time'] = '2020-05-24 17:13:05';
            $input['content'] = 'Hoàn trả học phí tháng 5';
            $input['student_id'] = 5;
            $input['class_id'] = 1;
            $input['session_id'] = 24;
            $input['user'] = auth()->user()->id;
            $transaction = Transaction::create($input);
        }
    }
    public function changeContent(){
        $transactions = Transaction::where('content', 'LIKE', '%: %')->get();
        foreach($transactions as $t){
            $new_content = explode(':', $t->content)[0];
            $t->content = $new_content;
            $t->save();
        }
    }
    public function sendEmail(Request $request){
        $rules = ['student_session_id' => 'required'];
        $this->validate($request, $rules);
        
        $ids = $request->student_session_id;
        $datas = [];
        foreach($ids as $key=>$id){
            $data = [];
            $student_session = StudentSession::find($id);     
            $logs = $student_session->logs;
            $logs['sent_user'] = auth()->user()->name;
            $logs['sent_time'] = strtotime(date('d-m-Y H:i:m'));
            $student_session->logs = $logs;
            $student_session->save();
            if($student_session){
    
                $data['student'] = Student::find($student_session->student_id);
                $data['parent'] = Parents::find($data['student']->parent_id);
                
                $data['session'] = Session::find($student_session->session_id);
                $data['class'] = Classes::find($data['session']->class_id)->code;
    
                $data['center'] = Center::find($data['session']->center_id);
                $data['teacher'] = Teacher::find($data['session']->teacher_id)->name;
    
                $data['student_session'] = $student_session;
            }
            $datas[$key]  = $data;
        }
        $d = array('datas'=>$datas);
        // return view('emails.thht', compact('datas'));
        $to_email = $datas[0]['parent']->email;        
        $to_name = '';
        try{
            Mail::send('emails.thht', $d, function($message) use ($to_name, $to_email, $datas) {
                $message->to($to_email, $to_name)
                        ->to('webmaster@vietelite.edu.vn')
                        ->subject('[VIETELITE]Thông báo học phí '. $datas[0]['student']->fullname . ' lớp '. $datas[0]['class'])
                        ->replyTo($datas[0]['center']->email, 'Phụ huynh hs '.$datas[0]['student']->fullname);
                $message->from('info@vietelite.edu.vn','VIETELITE EDUCATION CENTER');
            });
            return response()->json(200);
        }
        catch(\Exception $e){
            // Get error here
            return response()->json(418);
        }
    }
}
