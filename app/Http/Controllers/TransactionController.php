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
use Mail;

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
        $rules = ['data' => 'required'];
        $this->validate($request, $rules);
        $result = [];

        $months = [];
        $data = [];
        $student = Student::find($request->student_id);
        $student_name = $student->fullname;
        $sum_amount = 0;
        $content = '';
        $classes = [];
        $max_date = date('Y-m-d', strtotime('01-01-1999'));
        $center_id = 0;
        foreach($request->data as $key => $d){
            if($d['id'] < 0) continue;
            $date = date('Y-m-d', strtotime('01-'.$d['month']));
            if($date > $max_date){
                $max_date = $date;
            }
            //Class
            if(!in_array($d['cname'], $classes)){
                array_push($classes, $d['cname']);
            }
            $transaction = Transaction::find($d['id']);
            $center_id = Classes::find($transaction->class_id)->center_id;
            $sessions = $transaction->sessions()->count();
            
            $t['cname'] = $d['cname'];
            $t['content'] = $d['content'];
            $t['sl'] = ($sessions != 0) ? $sessions : 1;
            $t['dg'] = ($sessions != 0) ? $d['amount']/$sessions : $d['amount'];
            $t['amount'] = $d['amount'];
            $sum_amount += $d['amount'];
            if(!array_key_exists($d['month'], $data)){
                array_push($months , date('m', strtotime($date)));
                $data[$d['month']][0] = $t;
            }
            else{
                $data[$d['month']][] = $t;
            }
        }
        $logs = $student->fee_email_note ?  json_decode($student->fee_email_note):new \stdClass();
        $logs->sent_user = auth()->user()->name;
        $logs->sent_time = strtotime(date('d-m-Y H:i:m'));
        $student->fee_email_note = json_encode($logs);
        $student->save();

        $max_date = date('d/m/Y', strtotime($max_date. ' + 9 days'));
        $classes = implode(',', $classes);
        $months = implode(',', $months);
        $title = '[VIETELITE] THÔNG BÁO HỌC PHÍ LỚP '.$classes. ' tháng '.$months. " năm học 2020-2021";
        $content = $classes.'_'.$this->vn_to_str($student_name).'_HP'.$months;
        // print_r($data);d
        

        $result = ['data' => $data, 'title' => $title, 'classes' => $classes,
         'max_date' => $max_date, 'student' => $student_name, 'sum_amount' => $sum_amount, 'content' => $content, 'center_id' => $center_id];
        
        $d = ['result' => $result];
        $to_email = $request->pemail;        
        $to_name = '';
        
        try{
            Mail::send('emails.tbhp',$d, function($message) use ($to_name, $to_email, $result) {
                $message->to($to_email, $to_name)
                        ->to('webmaster@vietelite.edu.vn')
                        ->subject($result['title'])
                        ->replyTo('ketoan.cs1@vietelite.edu.vn', 'Phụ huynh hs '.$result['student']);
                $message->from('info@vietelite.edu.vn','VIETELITE EDUCATION CENTER');
            });
            return response()->json(200);
        }
        catch(\Exception $e){
            // Get error here
            return response()->json(418);
        }
    }
    function vn_to_str ($str){
 
        $unicode = array(
         
        'a'=>'á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ',
         
        'd'=>'đ',
         
        'e'=>'é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ',
         
        'i'=>'í|ì|ỉ|ĩ|ị',
         
        'o'=>'ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ',
         
        'u'=>'ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự',
         
        'y'=>'ý|ỳ|ỷ|ỹ|ỵ',
         
        'A'=>'Á|À|Ả|Ã|Ạ|Ă|Ắ|Ặ|Ằ|Ẳ|Ẵ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ',
         
        'D'=>'Đ',
         
        'E'=>'É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ',
         
        'I'=>'Í|Ì|Ỉ|Ĩ|Ị',
         
        'O'=>'Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ',
         
        'U'=>'Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự',
         
        'Y'=>'Ý|Ỳ|Ỷ|Ỹ|Ỵ',
         
        );
         
        foreach($unicode as $nonUnicode=>$uni){
         
        $str = preg_replace("/($uni)/i", $nonUnicode, $str);
         
        }
        $str = str_replace(' ','_',$str);
         
        return $str;
         
        }
}
