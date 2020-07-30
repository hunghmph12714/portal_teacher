<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Paper;
use App\Transaction;
use App\Tag;
use App\Account;
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
        $payments = Paper::Select('papers.id as id', 'payment_number','type','papers.name as name','description','amount','papers.created_at as created_at','papers.status as status',
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
        $this->validate($request, $rules);
        $max_receipt_number = Paper::where('center_id', $request->center['value'])->max('receipt_number')!="" ? Paper::where('center_id', $request->center['value'])->max('receipt_number') : 0;
        $p['receipt_number'] = $max_receipt_number + 1;
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
        foreach($request->transactions as $transaction){
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
    protected function getReceipt(){
        $result = [];
        $receipts = Paper::Select('papers.id as id', 'receipt_number','type','papers.name as name','description','amount','papers.created_at as created_at','papers.status as status',
                                    'users.name as uname','papers.address as address' , 'center.name as ctname', 'center.id as ctid')->where('type', 'receipt')
                                    ->leftJoin('users','papers.user_created_id','users.id')
                                    ->leftJoin('center', 'papers.center_id', 'center.id')->orderBy('papers.created_at', 'DESC')
                                    ->get();
        foreach($receipts as $key => $p){
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
            'users.name as uname','papers.address as address','center.name as ctname', 'center.id as ctid')
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
            'transactions' => 'required',
            'student' => 'required',
            'center'=>'required',
            'name' => 'required',
            'account' => 'required',
        ];
        $this->validate($request, $rules);
        $total_amount = 0;
        $description = [];
        $classes = "";
        foreach($request->transactions as $key => $value){
            if($value['id'] > 0){
                $t = [];
                $total_amount += $value['amount'];
                if(!array_key_exists($value['cname'], $description)){
                    $description[$value['cname']] = [$value['month']];
                }    
                else{
                    if(!in_array($value['month'], $description[$value['cname']])) 
                    {
                        array_push($description[$value['cname']], $value['month']);
                    }
                }
            }
        }
        $classes = array_keys($description);
        $des = "";
        foreach($description as $class => $month){
            $des = $des. $class. ': '. implode(', ', $month). " - ";
        }
        $max_receipt_number = Paper::where('center_id', $request->center)->max('receipt_number')!="" ? Paper::where('center_id', $request->center)->max('receipt_number') : 0;
        $p['receipt_number'] = $max_receipt_number + 1;
        $p['center_id'] = $request->center;
        $p['type'] = 'receipt';
        $p['name'] = $request->name;
        $p['description'] = 'Thu học phí '.$request->student['name']['label']. ' lớp: '.$des;

        $p['amount'] = $total_amount;
        $p['user_created_id'] = auth()->user()->id;
        $p['note'] = '';
        $p['created_at'] = date('Y-m-d');
        $p['status'] = NULL;
        $p['address'] = '';
        // print_r($p);
        $p = Paper::create($p);
        $sumOfMonth = array();      
        $randomClass = '';  
        foreach($request->transactions as $key => $v){
            if($v['id'] > 0){
                $month = $v['month'];
                $cid = (array_key_exists('cid', $v))?($v['cid'])? $v['cid'] : '-1' :'-1';
                $sumOfMonth[$month]['total_amount'][] = $v['amount'];
                if($cid == '-1'){
                    $sumOfMonth[$month]['other_amount'][] = $v['amount'];
                }else{
                    $sumOfMonth[$month]['class'][$cid]['amount'][] = $v['amount'];
                    $sumOfMonth[$month]['class'][$cid]['debit'] = $request->account;
                    $sumOfMonth[$month]['class'][$cid]['credit'] = Account::where('level_2', '131')->first()->id;
                    $sumOfMonth[$month]['class'][$cid]['time'] = date('Y-m-t', strtotime('01-'.$v['month']));
                    $sumOfMonth[$month]['class'][$cid]['content'] = 'Thu học phí '. $v['month'];
                    $sumOfMonth[$month]['class'][$cid]['student_id'] = $request->student['id'];
                    $sumOfMonth[$month]['class'][$cid]['class_id'] = (array_key_exists('cid', $v))?$v['cid']:NULL;
                    $sumOfMonth[$month]['class'][$cid]['session_id'] = NULL;
                    $sumOfMonth[$month]['class'][$cid]['user'] = auth()->user()->id;
                    $sumOfMonth[$month]['class'][$cid]['paper_id'] = $p->id;
                }
                
            }
        }
        print_r($sumOfMonth);
        foreach($sumOfMonth as $key => $sum){
            if(array_sum($sum['total_amount']) > 0){
                $other_fee = array_key_exists('other_amount', $sum) ? array_sum($sum['other_amount']) : 0;
                foreach($sum['class'] as $cid => $c){
                    $c['amount'] = array_sum($c['amount']) + $other_fee;
                    if($c['amount'] > 0){
                        Transaction::create($c);
                        $other_fee = 0;
                    }
                    else{
                        $other_fee = $c['amount'];
                    }
                }
            }
                    
        }
        return response()->json(200);
        
    }
    
}