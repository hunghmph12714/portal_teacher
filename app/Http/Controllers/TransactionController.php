<?php
//s
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Account;
use DB;
use App\Transaction;
use App\Tag;
use App\Student;
use App\Parents;
use App\Classes;
use App\StudentClass;
use App\StudentSession;
use App\Discount;
use App\Session;
use App\Center;
use App\TransactionSession;
use Mail;
use App\Paper;
use Swift_SmtpTransport;

class TransactionController extends Controller
{
    //
    function dif(){
        $acc = Account::where('level_2', 131)->first()->id;
        $transactions = Transaction::where('debit', $acc)->get();
        foreach($transactions as $t){
            $ts = TransactionSession::where('transaction_id', $t->id)->sum('amount');
            if($ts != $t->amount){
                echo "<pre>";
                print_r($t->toArray());
            }
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
    public function normalizeHP(){
        $chuyenhp = Tag::where('name', 'Chuyển HP')->first();
        $transactions = $chuyenhp->transactions;
        // $transactions = Transaction::where('center_id', '-1')->get();
        $equities = Account::where('type', 'equity')->get()->toArray();
        $equities = array_column($equities, 'id');
        
        foreach($transactions as $t){
            $from = date('Y-m-01 00:00:00', strtotime($t->time));
            $to = date('Y-m-t 23:59:59', strtotime($t->time));
            $rt = Transaction::where('student_id', $t->student_id)->whereNotNull('center_id')->whereBetween('time', [$from, $to])->first();
            if($rt){
                $t->center_id = $rt->center_id;
                $t->save();
                echo $t->center_id."<br>";
            }
            
            // $t->center_id = 1;
            // $t->save();
        }
    }
    public function FinancialRevenueRange($from, $to, $centers){
        

        $ss = StudentSession::join('sessions', 'student_session.session_id', 'sessions.id')->whereBetween('sessions.date', [$from, $to])->whereIn('sessions.center_id', $centers)->count();
        $acc_131 = Account::where('level_2', '131')->first()->id;
        $acc_3387 = Account::where('level_2', '3387')->first()->id;
        $acc_511 = Account::where('level_1', '511')->first()->id;

        $equities = Account::where('type', 'equity')->get()->toArray();
        $equities = array_column($equities, 'id');
        $chuyenhp = Tag::where('name', 'Chuyển HP')->first();
        $tag_mg = Tag::where('name', 'Miễn giảm')->first();
        $tag_hp = Tag::where('name', 'Học phí')->first();

        $hpthua = $chuyenhp->transactions()->where('debit', $acc_131)->whereIn('transactions.center_id', $centers)->whereBetween('time', [$from, $to])->sum('amount');
        $hpkisau = $chuyenhp->transactions()->where('credit', $acc_131)->whereIn('transactions.center_id', $centers)->whereBetween('time', [$from, $to])->sum('amount');

        $doanhso = Transaction::where('debit', $acc_131)->whereIn('transactions.center_id', $centers)->whereBetween('time', [$from, $to])->sum('amount');
        $doanhso -= $hpthua;
       
        $miengiam = $tag_mg->transactions()->whereIn('transactions.center_id', $centers)->whereBetween('time', [$from, $to])->sum('amount');
        $thucthu = Paper::where('type','receipt')->whereIn('center_id', $centers)->whereBetween('created_at', [$from, $to])->sum('amount');
        $ttk = Transaction::where('credit', $acc_131)->whereIn('transactions.center_id', $centers)->whereBetween('time', [$from, $to])->sum('amount');
        $ttk -= $hpthua;
        $ttk -= $miengiam;
        return [date('m-Y', strtotime($from)), $ss ,number_format($doanhso), number_format($miengiam), number_format($doanhso-$miengiam) ,number_format($ttk) , number_format($doanhso-$miengiam-$ttk) , number_format($thucthu) , number_format($hpthua)];
    }
    
    protected function FinancialRevenue(Request $request){
        $user = auth()->user();
        $file = fopen(public_path()."/fin-revenue.csv","w");
        fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
        $first_line = ['Tháng', 'Lượt học/tháng' , 'Doanh số', 'Chiết khấu', 'Khoản phải thu', 'Thu trong kỳ', 'Nợ trong kỳ','Thu thực tế'];
        fputcsv($file, $first_line);
        
        if($request->center == -1){
            $centers = Center::all()->toArray();
            $center = array_column($centers, 'id');        
        }else{
            $center = [$request->center];
        }
        for($i = 1; $i <= 12; $i++){
            $from = date('Y-m-01 00:00:00', strtotime('01-'.$i.'-'.$user->wp_year));
            $to = date('Y-m-t 23:59:59', strtotime('01-'.$i.'-'.$user->wp_year));
            fputcsv($file, $this->FinancialRevenueRange($from, $to, $center));
        }
        // for($i = 1; $i <= 12; $i++){
        //     $from = date('Y-m-01', strtotime('01-'.$i.'-'.$user->wp_year + 1));
        //     $to = date('Y-m-t', strtotime('01-'.$i.'-'.$user->wp_year + 1));
        //     fputcsv($file, $this->FinancialRevenueRange($from, $to));
        // }
        return response('/public/fin-revenue.csv');

        // return redirect('/public/fin-revenue.csv');
 
    }
    public function FinancialLiabilities($from, $to, $result, $index, $centers){
        $year = date('Y', strtotime($from));
        $acc_131 = Account::where('level_2', '131')->first()->id;
        $acc_3387 = Account::where('level_2', '3387')->first()->id;
        $acc_511 = Account::where('level_1', '511')->first()->id;

        $equities = Account::where('type', 'equity')->get()->toArray();
        $equities = array_column($equities, 'id');
        $chuyenhp = Tag::where('name', 'Chuyển HP')->first();
        $tag_mg = Tag::where('name', 'Miễn giảm')->first();
        $tag_hp = Tag::where('name', 'Học phí')->first();
        $hpthua = $chuyenhp->transactions()->whereIn('transactions.center_id', $centers)->where('debit', $acc_131)->whereBetween('time', [$from, $to])->sum('amount');
        $hpkisau = $chuyenhp->transactions()->whereIn('transactions.center_id', $centers)->where('credit', $acc_131)->whereBetween('time', [$from, $to])->sum('amount');

        $doanhso = Transaction::where('debit', $acc_131)->whereIn('transactions.center_id', $centers)->whereBetween('time', [$from, $to])->sum('amount');
        $doanhso -= $hpthua;
    
        $miengiam = $tag_mg->transactions()->whereIn('transactions.center_id', $centers)->whereBetween('time', [$from, $to])->sum('amount');
        $phai_thu = $doanhso - $miengiam;
        
        
        for($i = 1; $i<= 12 ; $i++){
            
            if($i > date('m', strtotime($from))){
                break;
            }
            else{
                $tmp_from = date('Y-m-01 00:00:00', strtotime('01-'.$i.'-'.$year));
                $tmp_to = date('Y-m-t 23:59:59', strtotime('01-'.$i.'-'.$year));
                if($i == date('m', strtotime($from))){
                    
                    $f = date('Y-m-01', strtotime('01-01-'.$year));
                    $ttk = Transaction::where('credit', $acc_131)->whereIn('transactions.center_id', $centers)->whereBetween('time', [$tmp_from, $tmp_to])->where('created_at', '<=', $tmp_to)->sum('amount');
                    // $hpkisau = $chuyenhp->transactions()->where('credit', $acc_131)->whereBetween('time', [$from, $to])->where('transactions.created_at', '<=', $tmp_to)->sum('amount');
                    $result[$index][$i-1] = number_format($phai_thu - $ttk + $hpthua + $miengiam);
                    
                }
                else{
                    $ttk = Transaction::where('credit', $acc_131)->whereIn('transactions.center_id', $centers)->whereBetween('time', [$tmp_from, $tmp_to])->whereBetween('created_at', [$from, $to])->sum('amount');
                    // $hpkisau = $chuyenhp->transactions()->where('credit', $acc_131)->whereBetween('time', [$tmp_from, $tmp_to])->whereBetween('transactions.created_at', [$from, $to])->sum('amount');
                    $result[$index][$i-1] = number_format(intval(str_replace(',', '', $result[$index-1][$i-1])) - $ttk);
                }
                
            }
        }
        return $result;
    }
    protected function FinancialLia(Request $request){
        $result= [];
        $user = auth()->user();
        if($request->center == -1){
            $centers = Center::all()->toArray();
            $center = array_column($centers, 'id');        
        }else{
            $center = [$request->center];
        }
        $file = fopen(public_path()."/fin-liabilities.csv","w");
        fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
        $first_line = ['Tháng', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        fputcsv($file, $first_line);
        for($i = 1; $i <= 12; $i++){
            $result[$i-1] = [0,0,0,0,0,0,0,0,0,0,0,0];
            $from = date('Y-m-01 00:00:00', strtotime('01-'.$i.'-'.$user->wp_year));
            $to = date('Y-m-t 23:59:59', strtotime('01-'.$i.'-'.$user->wp_year));
            // fputcsv($file, $this->FinancialLiabilities($from, $to));
            $result = $this->FinancialLiabilities($from, $to, $result, $i-1, $center);
            
        }
        foreach($result as $key => $r){
            array_unshift($r, $key);
            fputcsv($file, $r);
        }
        
        return response('/public/fin-liabilities.csv');

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

        $acc511 = Account::where('level_2', '511')->first()->id;
        $acc3387 = Account::where('level_2', '3387')->first()->id;

        $transactions = null;
        if($request->budget_id){
            $result['page'] = $request->page;
            $result['total'] = Transaction::all()->count();
            $transactions = Transaction::Where('budget_id', $request->budget_id)->Select(
                'transactions.id as id','transactions.amount' ,DB::raw("DATE_FORMAT(transactions.time, '%d/%m/%Y') as time_formated"),'transactions.time','transactions.content',
                'debit_account.id as debit_id','debit_account.level_2 as debit_level_2', 'debit_account.name as debit_name', 'debit_account.type as debit_type',
                'credit_account.id as credit_id','credit_account.level_2 as credit_level_2', 'credit_account.name as credit_name', 'credit_account.type as credit_type',
                'students.id as sid', 'students.fullname as sname','students.dob', 
                'classes.id as cid', 'classes.code as cname', 'sessions.id as ssid', 'sessions.date as session_date ',
                'users.id as uid','users.name as uname','transactions.created_at as created_at'
            )
                ->leftJoin('accounts as debit_account','transactions.debit','debit_account.id')
                ->leftJoin('accounts as credit_account','transactions.credit','credit_account.id')
                ->leftJoin('students','transactions.student_id','students.id')
                ->leftJoin('classes','transactions.class_id','classes.id')
                ->leftJoin('sessions', 'transactions.session_id','sessions.id')
                ->leftJoin('users', 'transactions.user', 'users.id')->orderBy('created_at', 'DESC')->offset($offset)->limit($request->per_page)
                ->get();
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
        if(empty($request->filter)){
            $result['page'] = $request->page;
            $result['total'] = Transaction::Where('debit', '!=',$acc3387)->orwhere('credit','!=',$acc511)->count();
            $transactions = Transaction::Where('debit', '!=',$acc3387)->orwhere('credit','!=',$acc511)->Select(
                'transactions.id as id','transactions.amount' ,DB::raw("DATE_FORMAT(transactions.time, '%d/%m/%Y') as time_formated"),'transactions.time','transactions.content','transactions.created_at as created_at',
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
                ->leftJoin('users', 'transactions.user', 'users.id')->orderBy('created_at', 'DESC')->offset($offset)->limit($request->per_page)
                ->get();
        }
        else{
            $result['page'] = $request->page;
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
                    ->where(function($query) use ($acc3387, $acc511) {
                        $query->Where('debit_id', '!=',$acc3387)->orwhere('credit_id','!=',$acc511);
                    })
                    ->leftJoin('accounts as debit_account','transactions.debit','debit_account.id')
                    ->leftJoin('accounts as credit_account','transactions.credit','credit_account.id')
                    ->leftJoin('students','transactions.student_id','students.id')
                    ->leftJoin('classes','transactions.class_id','classes.id')
                    ->leftJoin('sessions', 'transactions.session_id','sessions.id')
                    ->leftJoin('users', 'transactions.user', 'users.id')->orderBy('transactions.created_at', 'DESC')->offset($offset)->limit($request->per_page)
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
    public function misaUploadOrder(Request $request){
        $rules = ['from' => 'required', 'to' => 'required'];
        $this->validate($request, $rules);
        $arr = [];
        $classes = Classes::where('type','class')->where('center_id', $request->center)->get();
        $acc_131 = Account::where('level_2', '131')->first()->id;
        $acc_3387 = Account::where('level_2', '3387')->first()->id;
        $acc_511 = Account::where('level_2', '511')->first()->id;
        $file = fopen(public_path()."/misa_order.csv","w");

        $from_d = date('Y-m-1', strtotime($request->from));
        $to_d = date('Y-m-t', strtotime($request->to));
        
        fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
        $first_line = ['Hiển thị trên sổ', 'Hình thức bán hàng', 'Phương thức thanh toán','Kiêm phiếu xuất kho', 'Lập kèm hóa đơn', 'Đã lập hóa đơn',
            'Ngày hạch toán (*)','Ngày chứng từ (*)','Số chứng từ (*)','Mã khách hàng','Tên khách hàng','Diễn giải','Mã hàng (*)','Tên hàng','Hàng khuyến mại',
            'TK Tiền/Chi phí/Nợ (*)','TK Doanh thu/Có (*)','ĐVT','Số lượng','Đơn giá sau thuế','Đơn giá','Thành tiền','Tỷ lệ CK (%)','Tiền chiết khấu','TK chiết khấu'];
        fputcsv($file, $first_line);
        
        // get the last so chung tu
        $ct_temp = Transaction::where('misa_upload', '1')->max('misa_id');
        $ct = $ct_temp ? $ct_temp+1 : 1;

        foreach($classes as $c){
            $students = $c->students;
            foreach($students as $s){
                $transactions = Transaction::Where(function($query) use ($acc_131, $c, $s, $from_d, $to_d){                
                    $query->where('debit', $acc_131)
                        ->WhereBetween('time',[$from_d, $to_d])
                        ->where('class_id', $c->id)
                        ->where('student_id', $s->id);
                })->orWhere(function($query)  use ($acc_131, $c, $s, $from_d, $to_d){
                    $query->where('credit', $acc_131)
                        ->WhereBetween('time',[$from_d, $to_d])
                        ->where('class_id', $c->id)
                        ->where('student_id', $s->id);
                })->get()->toArray(); 
                // echo "<pre>";
                // print_r($transactions);
                if(count($transactions) == 0 ) continue;
                
                for ($i= date('m', strtotime($from_d)); $i <= date('m', strtotime($to_d)) ; $i++) { 
                    # code...
                    $from = date('Y-m-01 00:00:00', strtotime('2021-'.$i.'-01'));
                    $to = date('Y-m-t 59:59:59', strtotime('2021-'.$i.'-01'));
                    // echo $from."<br/>";
                    // echo $to;
                    $arr = [0,0,0,0,0,0];
                    $hach_toan = date('m/d/Y');
                    $chung_tu = date('m/d/Y');
                    $so_chung_tu = 'BH';
                    $ma_kh = 'KH'.str_pad($s->id, 5, '0', STR_PAD_LEFT);
                    $ten_kh = $s->fullname;
                    $ma_hang = $c->id;
                    $ten_hang = $c->code;
                    $debit = '131';
                    $credit = '3387';
                    $des = "Học phí tháng 0".$i;
                    $amount = 0;
                    $discount = 0;
                    foreach($transactions as $t){
                        if($t['time'] >= $from && $t['time'] <= $to){
                            $hach_toan = date('m/d/Y', strtotime($t['time']));
                            $chung_tu = date('m/d/Y', strtotime($t['time']));

                            $so_chung_tu = $t['misa_id'] ? 'BH'.str_pad($t['misa_id'], 5, '0', STR_PAD_LEFT) : 'BH'.str_pad($ct, 5, '0', STR_PAD_LEFT);
                            if($t['debit'] == $acc_131 && $t['credit'] == $acc_3387){
                                $amount += $t['amount'];
                            }
                            if($t['debit'] == $acc_3387 || $t['debit'] == $acc_511){
                                $discount += $t['amount'];
                            }
                            $temp_t = Transaction::find($t['id']);
                            if($temp_t){
                                $temp_t->misa_upload = 1;
                                $temp_t->misa_upload_at = date('Y-m-d');
                                $temp_t->misa_id = $ct;
                                $temp_t->save();
                            }
                        }
                        else{
                            // echo $t['time']. "<br/>";
                        }
                    }
                    if($amount > 0){
                        $ct++;
                        array_push($arr, $hach_toan);
                        array_push($arr, $chung_tu);
                        array_push($arr, $so_chung_tu);
                        array_push($arr, $ma_kh);
                        array_push($arr, $ten_kh);
                        array_push($arr, $des);
                        array_push($arr, $ma_hang);
                        array_push($arr, $ten_hang);
                        
                        array_push($arr, 0);
                        array_push($arr, $debit);
                        array_push($arr, $credit);
                        array_push($arr, '');
                        array_push($arr, '1');
                        array_push($arr, '');
                        array_push($arr, $amount);
                        array_push($arr, $amount);
                        array_push($arr, ceil($discount/$amount*100));
                        array_push($arr, $discount);
                        array_push($arr, $credit);
                        
                        // echo "<pre>";
                        // print_r($arr);
                        fputcsv($file, $arr);
                    }
                    
                }
            }
        }
        return response('/public/misa_order.csv');

    }
    public function misaUploadRevenue(Request $request){
        $rules = ['from' => 'required', 'to' => 'required'];
        $this->validate($request, $rules);

        $arr = [];
        $acc_511 = Account::where('level_2', '511')->first()->id;
        $acc_3387 = Account::where('level_2', '3387')->first()->id;
        
        $from = date('Y-m-d', strtotime($request->from));
        $to = date('Y-m-d', strtotime($request->to));
        $arr = [];
        $file = fopen(public_path()."/misa_revenue.csv","w");
        fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
        $first_line = [ 'Hiển thị trên sổ', 'Ngày chứng từ (*)', 'Ngày hạch toán (*)', 'Số chứng từ (*)', 'Diễn giải', 'Hạn thanh toán', 'Diễn giải (Hạch toán)', 'TK Nợ (*)',
        'TK Có (*)', 'Số tiền', 'Đối tượng Nợ', 'Đối tượng Có', 'TK ngân hàng', 'Khoản mục CP', 'Đơn vị', 'Đối tượng THCP', 'Công trình', 'Hợp đồng bán', 'CP không hợp lý','Mã thống kê'];
        fputcsv($file, $first_line); 

        $transactions = Transaction::Where('credit',$acc_511)->where('debit', $acc_3387)->where('time','>=', $from)->where('time', '<', $to)->where('center_id', $request->center)->get();
        foreach($transactions as $t){
            $class = Classes::find($t->class_id);
            
            $arr = [''];
            array_push($arr, date('m-d-Y', strtotime($t->time)));
            array_push($arr, date('m-d-Y', strtotime($t->time)));
            array_push($arr, 'DT'.$t->id);
            array_push($arr, $t->content);
            array_push($arr, '');
            array_push($arr, '');
            array_push($arr, '3387');
            array_push($arr, '5111');
            array_push($arr, $t->amount);
            array_push($arr, 'KH'.str_pad($t->student_id, 5, '0', STR_PAD_LEFT));
            array_push($arr, '');
            array_push($arr, '');
            array_push($arr, '');
            array_push($arr, '');
            array_push($arr, '');
            array_push($arr, '');
            array_push($arr, '');
            array_push($arr, '');
            array_push($arr, $class->code);

            fputcsv($file, $arr);
        }

        return response('/public/misa_revenue.csv');

    }
}
