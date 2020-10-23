<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Paper;
use App\Transaction;
use App\Tag;
use App\Account;
use App\Session;
use App\TransactionSession;

use DB;
class PaperController extends Controller
{
    //
    protected function jsDate($date){
        $date = substr($date, 0, strpos($date, '('));
        return strtotime($date);
    }
    protected function addTransaction($transaction, $paper_id){

        $input['credit'] = $transaction['credit']['id'];
        $input['debit'] = $transaction['debit']['id'];
        $input['amount'] = $transaction['amount'];
        $input['time'] = date('Y-m-d H:i:m', strtotime($transaction['time']));
        $input['content'] = ($transaction['content'])?$transaction['content']:NULL;
        $input['student_id'] = ($transaction['student'])?$transaction['student']['value']:NULL;
        $input['class_id'] = ($transaction['selected_class']) ? $transaction['selected_class']['value']:NULL;
        $input['session_id'] = ($transaction['selected_session']) ? $transaction['selected_session']['value']:NULL;
        $input['user'] = auth()->user()->id;
        $input['paper_id'] = $paper_id;
        $t = Transaction::create($input);
        
        $tags = [];
        foreach($transaction['tags'] as $tag){
            if(array_key_exists('__isNew__', $tag)){
                $tag = Tag::create(['name'=>$tag['value']]);
                $t->tags()->attach($tag->id);
            }
            else{
                $t->tags()->attach($tag['value']);
            }
        }
        return response()->json($transaction);
    }
    protected function createPayment(Request $request){
        $rules  = [
            'name' => 'required',
            'amount' => 'required',
            'payment_time' => 'required',
            'center' => 'required'
        ];
        $this->validate($request, $rules);

        $max_payment_number = Paper::where('center_id', $request->center['value'])->max('payment_number')!="" ? Paper::where('center_id', $request->center['value'])->max('payment_number') : 0;
        $p['payment_number'] = $max_payment_number + 1;
        $p['center_id'] = $request->center['value'];
        $p['type'] = 'payment';
        $p['name'] = $request->name;
        $p['description'] = $request->description;
        $p['amount'] = $request->amount;
        $p['user_created_id'] = auth()->user()->id;
        $p['note'] = $request->note;
        $p['created_at'] = date('Y-m-d', strtotime($request->payment_time));
        $p['status'] = NULL;
        $p['address'] = $request->address;

        //Create new Payment
        $payment = Paper::create($p);
        $payment->created_at = date('Y-m-d', strtotime($request->payment_time));
        $payment->save();
        foreach($request->transactions as $transaction){
            $this->addTransaction($transaction, $payment->id);
        }
        return response()->json($payment);
    }
    protected function editPayment(Request $request){
        $rules = [
            'payment_id' => 'required',
            'center' => 'required'
        ];
        $this->validate($request, $rules);
        $payment = Paper::find($request->payment_id);
        if($payment){
            $payment->name = $request->name;
            $payment->amount = $request->amount;
            $payment->address = $request->address;
            $payement->description = $request->description;
            $payment->created_at = date('Y-m-d', strtotime($request->payment_time));
            if($payment->center_id != $request->center['value']){
                $max_payment_number = Paper::where('center_id', $request->center['value'])->max('payment_number')!="" ? Paper::where('center_id', $request->center['value'])->max('payment_number') : 0;
                $payment->payment_number = $max_payment_number + 1;
                $payment->center_id = $request->center['value'];
            }
            $payment->save();
            if($request->transaction_count == 0){
                $t = Transaction::where('paper_id', $request->payment_id)->forceDelete();
            }
            foreach($request->transactions as $t){
                //edit existing transactions
                if(array_key_exists('id', $t)){
                    $td = Transaction::find($t['id']);
                    if($td){
                        $td->debit = $t['debit']['value'];
                        $td->credit = $t['credit']['value'];
                        $td->amount = $t['amount'];
                        $td->time = date('Y-m-d H:i:m', strtotime($t['time']));
                        $td->content = $t['content'];
                        $td->student_id = $t['student']['value'];
                        $td->class_id = $t['selected_class']['value'];
                        $td->session_id = $t['selected_session']['value'];
                        // $td->
                        $tags = array_column($t['tags'], 'value');
                        $td->tags()->sync($tags);
                        $td->save();                        
                    }
                }
                //Create new transaction
                else{
                    $this->addTransaction($t, $request->payment_id);
                }
            }
        }
        return response()->json($request);
    }
    protected function deletePayment(Request $request){
        $rules = [
            'payment_id' => 'required',
        ];
        $this->validate($request, $rules);
        $p = Paper::find($request->payment_id);
        if($p){
            $p->forceDelete();
            $transactions = Transaction::where('paper_id', $request->payment_id)->get();
            foreach($transactions as $t){
                $t->forceDelete();
            }
        }
    }
    protected function getPayment(){
        $result = [];
        $payments = Paper::Select('papers.id as id', 'payment_number','type','papers.name as name','description','amount',DB::raw("DATE_FORMAT(papers.created_at, '%d/%m/%Y') as time_formated"),'papers.status as status',
                                    'users.name as uname','papers.address as address','center.name as ctname', 'center.id as ctid')->where('type', 'payment')
                                    ->leftJoin('users','papers.user_created_id','users.id')
                                    ->leftJoin('center', 'papers.center_id', 'center.id')->orderBy('papers.created_at', 'DESC')
                                    ->get();
        foreach($payments as $key => $p){
            $transaction_result = [];       
            $result[$key] = $p;     

            $transactions = $p->transactions()->select(
                'transactions.id as id','transactions.amount' ,DB::raw("DATE_FORMAT(transactions.time, '%d/%m/%Y') as time_formated"),'transactions.time','transactions.content','transactions.created_at',
                'debit_account.id as debit_id','debit_account.level_2 as debit_level_2', 'debit_account.name as debit_name', 'debit_account.type as debit_type',
                'credit_account.id as credit_id','credit_account.level_2 as credit_level_2', 'credit_account.name as credit_name', 'credit_account.type as credit_type',
                'students.id as sid', 'students.fullname as sname','students.dob', 
                'classes.id as cid', 'classes.code as cname', 'sessions.id as ssid', 'sessions.date as session_date ',
                'users.id as uid','users.name as uname', 'paper_id'               
            )
            ->leftJoin('accounts as debit_account','transactions.debit','debit_account.id')
            ->leftJoin('accounts as credit_account','transactions.credit','credit_account.id')
            ->leftJoin('students','transactions.student_id','students.id')
            ->leftJoin('classes','transactions.class_id','classes.id')
            ->leftJoin('sessions', 'transactions.session_id','sessions.id')            
            ->leftJoin('users', 'transactions.user', 'users.id')->orderBy('transactions.id', 'DESC')
            ->get();

            $x = $transactions->toArray();
            foreach($transactions as $k => $t){
                $tags = $t->tags()->get();
                $transaction_result[$k] = $x[$k];
                $transaction_result[$k]['tags'] = $tags->toArray();
            }
            
            $result[$key]['transactions'] = $transaction_result;
        }
        return response()->json($result);
    }

    
    protected function createReceipt(Request $request){
        $rules  = [
            'name' => 'required',
            'amount' => 'required',
            'receipt_time' => 'required',
        ];
        foreach($request->transactions as $key => $transaction){
            if($key == 0){
                $acc = Account::find($transaction['debit']['id']);
                if($acc->level_1 == '111'){
                    $p['method'] = 'TM';
                    $max_receipt_number = Paper::where('center_id', $request->center['value'])->where('method', 'TM')->max('receipt_number')!="" ? Paper::where('center_id', $request->center['value'])->where('method', 'TM')->max('receipt_number') : 0;
                    $p['receipt_number'] = $max_receipt_number + 1;
                }
                if($acc->level_1 == '112'){
                    $p['method'] = 'NH';
                    $max_receipt_number = Paper::where('center_id', $request->center['value'])->where('method', 'NH')->max('receipt_number')!="" ? Paper::where('center_id', $request->center['value'])->where('method', 'NH')->max('receipt_number') : 0;
                    $p['receipt_number'] = $max_receipt_number + 1;
                }
            }
            else break;
        }
        $this->validate($request, $rules);
        
        $p['center_id'] = $request->center['value'];
        $p['type'] = 'receipt';
        $p['name'] = $request->name;
        $p['description'] = $request->description;
        $p['amount'] = $request->amount;
        $p['user_created_id'] = auth()->user()->id;
        $p['note'] = $request->note;
        $p['created_at'] = date('Y-m-d', strtotime($request->receipt_time));
        $p['status'] = NULL;
        $p['address'] = $request->address;

        //Create new Receipt
        $receipt = Paper::create($p);
        $receipt->created_at = date('Y-m-d', strtotime($request->receipt_time));
        $receipt->save();
        
        foreach($request->transactions as $key => $transaction){           
            $this->addTransaction($transaction, $receipt->id);
        }
        return response()->json($receipt);
    }
    protected function editReceipt(Request $request){
        $rules = [
            'receipt_id' => 'required',
        ];
        $this->validate($request, $rules);
        $receipt = Paper::find($request->receipt_id);
        if($receipt){
            $receipt->name = $request->name;
            $receipt->amount = $request->amount;
            $receipt->address = $request->address;
            $receipt->description = $request->description;
            $receipt->created_at = date('Y-m-d', strtotime($request->receipt_time));
            $receipt->save();
            if($request->transaction_count == 0){
                $t = Transaction::where('paper_id', $request->receipt_id)->forceDelete();
            }
            foreach($request->transactions as $t){
                //edit existing transactions
                if(array_key_exists('id', $t)){
                    $td = Transaction::find($t['id']);
                    if($td){    
                        $account = Account::find($t['debit']['value']);
                        if($account->level_1 == '111'){
                            $method = 'TM';
                            
                        }
                        if($account->level_1 == '112'){
                            $method = 'NH';
                        }
                        if($receipt->method != $method){
                            $receipt->method = $method;
                            $max_receipt_number = Paper::where('center_id', $request->center['value'])->where('method', $method)->max('receipt_number')!="" ? Paper::where('center_id', $request->center['value'])->where('method', $method)->max('receipt_number') : 0;
                            $receipt->receipt_number = $max_receipt_number + 1;
                            $receipt->save();
                        }
                        
                        $td->debit = $t['debit']['value'];
                        $td->credit = $t['credit']['value'];
                        $td->amount = $t['amount'];
                        $td->time = date('Y-m-d H:i:m', strtotime($t['time']));
                        $td->content = $t['content'];
                        $td->student_id = $t['student']['value'];
                        $td->class_id = $t['selected_class']['value'];
                        // $td->session_id = $t['selected_session']['value'];
                        // $td->
                        $tags = array_column($t['tags'], 'value');
                        $td->tags()->sync($tags);
                        $td->save();                        
                    }
                }
                //Create new transaction
                else{
                    $this->addTransaction($t, $request->receipt_id);
                }
            }
        }
        return response()->json($request);
    }
    protected function deleteReceipt(Request $request){
        $rules = [
            'receipt_id' => 'required',
        ];
        $this->validate($request, $rules);
        $p = Paper::find($request->receipt_id);
        if($p){
            $p->forceDelete();
            $transactions = Transaction::where('paper_id', $request->receipt_id)->get();
            foreach($transactions as $t){
                $t->forceDelete();
            }
        }
    }
    protected function getReceipt(Request $request){
        $rules = [
            'page' => 'required',
            'per_page' => 'required',
        ];
        $this->validate($request, $rules);
        $offset = $request->page * ($request->per_page);
        $result = ['data' => []];
        $receipts = [];
        $transactions = null;
        $result['page'] = $request->page;
        
        if(empty($request->filter)){
            $result['page'] = $request->page;
            $result['total'] = Paper::where('type','receipt')->count();
            $receipts = Paper::Select('papers.id as id', 'receipt_number','type','papers.name as name','papers.method','description','amount',DB::raw("DATE_FORMAT(papers.created_at, '%d/%m/%Y') as time_formated"),'papers.created_at' ,'papers.status as status',
                                    'users.name as uname','papers.address as address' , 'center.name as ctname', 'center.code as code', 'center.id as ctid')->where('type', 'receipt')
                                    ->leftJoin('users','papers.user_created_id','users.id')
                                    ->leftJoin('center', 'papers.center_id', 'center.id')->orderBy('papers.created_at', 'DESC')->offset($offset)->limit($request->per_page)
                                    ->get();           
        }
        else{
            $result['page'] = $request->page;
            // print_r($request->filter);
            $receipt = Paper::query();
            $receipt->receiptNumber($request->filter)
                ->receiptName($request->filter) 
                ->receiptDescription($request->filter)
                ->receiptAddress($request->filter)
                ->receiptMethod($request->filter)
                ->receiptCenter($request->filter)
                ->receiptDate($request->filter);

            $result['total'] = ($receipt->count());
            $receipts =  $receipt->Select('papers.id as id','papers.method', 'receipt_number','type','papers.name as name','description','amount',DB::raw("DATE_FORMAT(papers.created_at, '%d/%m/%Y') as time_formated"),'papers.created_at','papers.status as status',
                'users.name as uname','papers.address as address' , 'center.name as ctname', 'center.id as ctid','center.code as code')->where('type', 'receipt')
                ->leftJoin('users','papers.user_created_id','users.id')
                ->leftJoin('center', 'papers.center_id', 'center.id')->orderBy('papers.created_at', 'DESC')->offset($offset)->limit($request->per_page)
                ->get();
        }
        
        foreach($receipts as $key => $p){
            $transaction_result = [];       
            $result['data'][$key] = $p;     

            $transactions = $p->transactions()->select(
                'transactions.id as id','transactions.amount' ,DB::raw("DATE_FORMAT(transactions.time, '%d/%m/%Y') as time_formated"),'transactions.time','transactions.content','transactions.created_at',
                'debit_account.id as debit_id','debit_account.level_2 as debit_level_2', 'debit_account.level_1 as debit_level_1', 'debit_account.name as debit_name', 'debit_account.type as debit_type',
                'credit_account.id as credit_id','credit_account.level_2 as credit_level_2', 'credit_account.name as credit_name', 'credit_account.type as credit_type',
                'students.id as sid', 'students.fullname as sname','students.dob',
                'classes.id as cid', 'classes.code as cname', 'sessions.id as ssid', 'sessions.date as session_date ',
                'users.id as uid','users.name as uname', 'paper_id'
            )
                ->leftJoin('accounts as debit_account','transactions.debit','debit_account.id')
                ->leftJoin('accounts as credit_account','transactions.credit','credit_account.id')
                ->leftJoin('students','transactions.student_id','students.id')
                ->leftJoin('classes','transactions.class_id','classes.id')
                ->leftJoin('sessions', 'transactions.session_id','sessions.id')
                ->leftJoin('users', 'transactions.user', 'users.id')->orderBy('transactions.id', 'DESC')
                ->get();
            $x = $transactions->toArray();
            $pt = Paper::find($p->id);
            // if(sizeof($x) != 0){
            //     if($x[0]['debit_level_1'] == '111'){
            //         $p->method = 'TM';
            //         $p->save();
            //     }
            //     if($x[0]['debit_level_1'] == '112'){
            //         $p->method = 'NH';
            //         $p->save();
            //     }
            // }
            // else{
            //     $result['data'][$key]['debit_code'] = '';
            // }
            foreach($transactions as $k => $t){
                $tags = $t->tags()->get();
                $transaction_result[$k] = $x[$k];
                $transaction_result[$k]['tags'] = $tags->toArray();
            }
            $result['data'][$key]['transactions'] = $transaction_result;
        }
        return response()->json($result);
    }
    public function regenerateId(){
        $receipts = Paper::where('type', 'receipt')->where('method', 'TM')->orderBy('receipt_number', 'ASC')->get();
        $ty = 1;       $tdh = 1;       $dq = 1;       $ptt = 1;
        foreach($receipts as $key => $value){
            if($value->center_id == 5){
                $value->receipt_number = $ty;
                $ty++;
            }
            if($value->center_id == 2){
                $value->receipt_number = $tdh;
                $tdh++;
            }
            if($value->center_id == 4){
                $value->receipt_number = $dq;
                $dq++;
            }
            if($value->center_id == 3){
                $value->receipt_number = $ptt;
                $ptt++;
            }            
            $value->save();            
        }
        $receipts = Paper::where('type', 'receipt')->where('method', 'NH')->orderBy('receipt_number', 'ASC')->get();
        $ty = 1;       $tdh = 1;       $dq = 1;       $ptt = 1;
        foreach($receipts as $key => $value){
            if($value->center_id == 5){
                $value->receipt_number = $ty;
                $ty++;
            }
            if($value->center_id == 2){
                $value->receipt_number = $tdh;
                $tdh++;
            }
            if($value->center_id == 4){
                $value->receipt_number = $dq;
                $dq++;
            }
            if($value->center_id == 3){
                $value->receipt_number = $ptt;
                $ptt++;
            }            
            $value->save();            
        }
        $receipts = Paper::where('type', 'receipt')->where('method','!=' ,'NH')->where('method','!=' ,'TM')->orderBy('receipt_number', 'ASC')->get();
        foreach($receipts as $key => $value){
            $value->receipt_number = $key;
            $value->save();            
        }
    }
    public function convert_number_to_words($number) {
            $hyphen      = ' ';
            $conjunction = '  ';
            $separator   = ' ';
            $negative    = 'âm ';
            $decimal     = ' phẩy ';
            $dictionary  = array(
            0                   => 'không',
            1                   => 'một',
            2                   => 'hai',
            3                   => 'ba',
            4                   => 'bốn',
            5                   => 'năm',
            6                   => 'sáu',
            7                   => 'bảy',
            8                   => 'tám',
            9                   => 'chín',
            10                  => 'mười',
            11                  => 'mười một',
            12                  => 'mười hai',
            13                  => 'mười ba',
            14                  => 'mười bốn',
            15                  => 'mười năm',
            16                  => 'mười sáu',
            17                  => 'mười bảy',
            18                  => 'mười tám',
            19                  => 'mười chín',
            20                  => 'hai mươi',
            30                  => 'ba mươi',
            40                  => 'bốn mươi',
            50                  => 'năm mươi',
            60                  => 'sáu mươi',
            70                  => 'bảy mươi',
            80                  => 'tám mươi',
            90                  => 'chín mươi',
            100                 => 'trăm',
            1000                => 'nghìn',
            1000000             => 'triệu',
            1000000000          => 'tỷ',
            1000000000000       => 'nghìn tỷ',
            1000000000000000    => 'nghìn triệu triệu',
            1000000000000000000 => 'tỷ tỷ'
            );
        if (!is_numeric($number)) {
            return false;
        }
        if (($number >= 0 && (int) $number < 0) || (int) $number < 0 - PHP_INT_MAX) {
            // overflow
            trigger_error(
            'convert_number_to_words only accepts numbers between -' . PHP_INT_MAX . ' and ' . PHP_INT_MAX,
            E_USER_WARNING
            );
            return false;
        }
        if ($number < 0) {
            return $negative . convert_number_to_words(abs($number));
        }
        $string = $fraction = null;
            if (strpos($number, '.') !== false) {
            list($number, $fraction) = explode('.', $number);
        }
        switch (true) {
        case $number < 21:
            $string = $dictionary[$number];
        break;
        case $number < 100:
            $tens   = ((int) ($number / 10)) * 10;
            $units  = $number % 10;
            $string = $dictionary[$tens];
            if ($units) {
                $string .= $hyphen . $dictionary[$units];
            }
        break;
        case $number < 1000:
            $hundreds  = $number / 100;
            $remainder = $number % 100;
            $string = $dictionary[$hundreds] . ' ' . $dictionary[100];
            if ($remainder) {
                $string .= $conjunction . $this->convert_number_to_words($remainder);
            }
        break;
        default:
            $baseUnit = pow(1000, floor(log($number, 1000)));
            $numBaseUnits = (int) ($number / $baseUnit);
            $remainder = $number % $baseUnit;
            $string = $this->convert_number_to_words($numBaseUnits) . ' ' . $dictionary[$baseUnit];
            if ($remainder) {
                $string .= $remainder < 100 ? $conjunction : $separator;
                $string .= $this->convert_number_to_words($remainder);
            }
            break;
        }
        if (null !== $fraction && is_numeric($fraction)) {
            $string .= $decimal;
            $words = array();
            foreach (str_split((string) $fraction) as $number) {
                $words[] = $dictionary[$number];
            }
            $string .= implode(' ', $words);
        }
            return $string;
    }
    protected function printPaper($id){
        
        $paper = Paper::Where('papers.id', $id)->Select('papers.id as id','receipt_number', 'payment_number','type','papers.name as name','description','amount','papers.created_at as created_at','papers.status as status',
            'users.name as uname','papers.address as address','center.name as ctname', 'center.id as ctid','papers.method')
        ->leftJoin('users','papers.user_created_id','users.id')
        ->leftJoin('center', 'papers.center_id', 'center.id')
        ->first()->toArray();
        $paper['amount_str'] =  $this->convert_number_to_words($paper['amount']);
        $paper['amount'] = number_format($paper['amount'], 0, '', ',');
        $t = explode('-',  explode(' ', $paper['created_at'])[0]);
        $paper['time'] = 'Ngày '.$t[2]. ' tháng '.$t[1]. ' năm '.$t[0];
        return view('paper.print', compact('paper'));
        // return response()->json($paper);
    }
    protected function gatherFee(Request $request){
        $rules = [
            'students' => 'required',
            'center'=>'required',
            'name' => 'required',
            'account' => 'required',
            'total_amount' => 'required',
            'description' => 'required',
        ];
        $this->validate($request, $rules);
              
        $account = Account::find($request->account);
        if($account->level_1 == '111'){
            $p['method'] = 'TM';
            $max_receipt_number = Paper::where('center_id', $request->center)->where('method', 'TM')->max('receipt_number')!="" ? Paper::where('center_id', $request->center)->where('method', 'TM')->max('receipt_number') : 0;
            $p['receipt_number'] = $max_receipt_number + 1;
        }
        if($account->level_1 == '112'){
            $p['method'] = 'NH';
            $max_receipt_number = Paper::where('center_id', $request->center)->where('method', 'NH')->max('receipt_number')!="" ? Paper::where('center_id', $request->center)->where('method', 'NH')->max('receipt_number') : 0;
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
        foreach($request->students as $student){
            $sumOfMonth = array();
            $transactions = $this->generateFee([$student['sid']], false, true,'2010-01-01', '2099-01-01');
            
            foreach($transactions as $key => $v){
                if($v['id'] > 0){
                    $month = $v['month'];
                    $cid = (array_key_exists('cid', $v))?($v['cid'])? $v['cid'] : '-1' :'-1';
                    $sumOfMonth[$month]['total_amount'][] = $v['amount'];
                    if($cid == '-1'){
                        $sumOfMonth[$month]['other_amount'][] = $v['amount'];
                    }else{
                        $sumOfMonth[$month]['class'][$cid]['debit'] = $request->account;
                        $sumOfMonth[$month]['class'][$cid]['credit'] = Account::where('level_2', '131')->first()->id;
                        $sumOfMonth[$month]['class'][$cid]['time'] = date('Y-m-t', strtotime('01-'.$v['month']));
                        $sumOfMonth[$month]['class'][$cid]['content'] = 'Thu học phí '. $v['month'];
                        $sumOfMonth[$month]['class'][$cid]['student_id'] = $student['sid'];
                        $sumOfMonth[$month]['class'][$cid]['class_id'] = (array_key_exists('cid', $v))?$v['cid']:NULL;
                        $sumOfMonth[$month]['class'][$cid]['session_id'] = NULL;
                        $sumOfMonth[$month]['class'][$cid]['user'] = auth()->user()->id;
                        $sumOfMonth[$month]['class'][$cid]['paper_id'] = $p->id;
                        $sumOfMonth[$month]['class'][$cid]['amount'][] = $v['amount'];
                    }
                    
                }
            }
            
            foreach($sumOfMonth as $key => $sum){
                if(array_sum($sum['total_amount']) > 0){
                    $other_fee = array_key_exists('other_amount', $sum) ? array_sum($sum['other_amount']) : 0;
                    foreach($sum['class'] as $cid => $c){
                        $c['amount'] = array_sum($c['amount']) + $other_fee;
                        if($c['amount'] > 0){
                            if($total_amount > 0){
                                if($c['amount'] <= $total_amount){
                                    $total_amount -= $c['amount'];                                
                                }
                                else{
                                    $c['amount'] = $total_amount;
                                    $total_amount = 0;
                                }
                                $lastClass = $c;
                                Transaction::create($c);    
                            }
                            $other_fee = 0;
                        }
                        else{
                            $other_fee = $c['amount'];
                        }
                    }
                }
                        
            }            
        }  
        if($total_amount > 0){
            $lastClass['amount'] = $total_amount;
            Transaction::create($lastClass);    
        }
        return response()->json(200);
        
    }
    protected function generateFee($student_id, $show_all, $show_detail, $from, $to){
        // $student = Student::find($student_id);
        // $classes = $student->classes;
        
        $acc = Account::where('level_2','131')->first();
        $result = [];
        $id = -1;
        
        $transactions = Transaction::whereIn('student_id', $student_id)->whereBetween('time', [$from ,$to])
                            ->Select(
                                'transactions.id as id','transactions.amount' ,'transactions.time','transactions.paper_id','transactions.content','transactions.created_at',
                                'debit_account.id as debit','debit_account.level_2 as debit_level_2', 'debit_account.name as debit_name', 'debit_account.type as debit_type',
                                'credit_account.id as credit','credit_account.level_2 as credit_level_2', 'credit_account.name as credit_name', 'credit_account.type as credit_type',
                                'students.id as sid', 'students.fullname as sname','students.dob', 
                                'classes.id as cid', 'classes.code as cname', 'sessions.id as ssid', 'sessions.date as session_date ',
                                'users.id as uid','users.name as uname'
                            )
                            ->leftJoin('accounts as debit_account','transactions.debit','debit_account.id')
                            ->leftJoin('accounts as credit_account','transactions.credit','credit_account.id')
                            ->leftJoin('students','transactions.student_id','students.id')
                            ->leftJoin('classes','transactions.class_id','classes.id')
                            ->leftJoin('sessions', 'transactions.session_id','sessions.id')
                            ->leftJoin('users', 'transactions.user', 'users.id')->orderBy('classes.id','DESC')->orderBy('transactions.time', 'ASC')
                            ->get();
        
        foreach($transactions as $key => $t){
            $month = Date('m-Y', strtotime($t->time));     
            $detail_amount = TransactionSession::where('transaction_id', $t->id)->get();
            $detail = '';
            setlocale(LC_MONETARY,"vi_VN");
           
            foreach($detail_amount as $key => $da){
                $session = Session::find($da->session_id);
                if($session){
                    $date = date('d/m', strtotime($session->date));
                    $detail = $detail. 'Ngày ' . $date .': '. number_format($da->amount) . " + ";
                }
            }
            if($t->paper_id != NULL){

                $paper = Paper::find($t->paper_id);
                $detail = "PT".$paper->receipt_number."+";
            }
            if(!array_key_exists($month, $result)){
                // echo $month."<br>";
                $result[$month]['amount'] = ($t->debit == $acc->id) ? $t->amount : (($t->credit == $acc->id) ? -$t->amount : 0);
                $result[$month]['count_transaction'] = 1;
                $result[$month]['id'] = --$id;
                $result[$month]['parent_id'] = '';                    
                $tarray = $t->toArray();
                $tarray['month'] = $month;
                $tarray['parent_id'] = $id;
                $tarray['amount'] = ($t->debit == $acc->id) ? $t->amount : (($t->credit == $acc->id) ? -$t->amount : 0) ;
                $tarray['time'] = Date('d/m/Y', strtotime($t->time));
                $tarray['detail'] = $detail;
                if($show_detail){
                    array_push($result, $tarray);
                }                
                $result[$month]['time'] = Date('d/m/Y', strtotime($t->time));
                $result[$month]['month'] = $month;
                $result[$month]['content'] = 'Tổng tiền tháng '.$month;
                $result[$month]['detail'] = '';
                $result[$month]['cname'] = '';

            }
            else{
                $result[$month]['amount'] = $result[$month]['amount'] + (($t->debit == $acc->id) ? $t->amount : (($t->credit == $acc->id) ? -$t->amount : 0));
                $tarray = $t->toArray();
                $tarray['month'] = $month;
                $result[$month]['count_transaction'] ++ ;
                $tarray['amount'] = ($t->debit == $acc->id) ? $t->amount : (($t->credit == $acc->id) ? -$t->amount : 0) ;
                $tarray['parent_id'] = $result[$month]['id'];
                $tarray['time'] = Date('d/m/Y', strtotime($t->time));
                $tarray['detail'] = $detail;
                $result[$month]['detail'] = '';
                if($show_detail){
                    array_push($result, $tarray);
                }
            }
        }
        $neutral = [];
        if($show_all){
            foreach($result as $r){
                if($r['amount'] == 0){
                    array_push($neutral, $r['id'] );
                }
            }
        }
        $result = array_filter($result, function($v, $k) use ($neutral){
            return (!in_array($v['parent_id'] , $neutral));
        }, ARRAY_FILTER_USE_BOTH);
        //Check số dư kỳ trước
        $remainTransactions = Transaction::whereIn('student_id', $student_id)->where('time', '<' , $from)->get();
        $totalRemain = 0;
        foreach($remainTransactions as $t){
            $totalRemain += (($t->debit == $acc->id) ? $t->amount : (($t->credit == $acc->id) ? -$t->amount : 0));
        }
        $result['remain'] = ['amount' => $totalRemain, 'id' => '-1999', 'detail' => 'Học phí kỳ trước', 'month'=>'','time'=>'','content'=>'Số dư kỳ trước'];
        // print_r($result);

        return array_values($result);
    }
    
}