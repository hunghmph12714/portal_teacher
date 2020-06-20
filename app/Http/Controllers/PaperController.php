<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Paper;
use App\Transaction;
use App\Tag;
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
        ];
        $this->validate($request, $rules);

        $max_payment_number = Paper::max('payment_number')!="" ? Paper::max('payment_number') : 0;
        $p['payment_number'] = $max_payment_number + 1;
        $p['type'] = 'payment';
        $p['name'] = $request->name;
        $p['description'] = $request->description;
        $p['amount'] = $request->amount;
        $p['user_created_id'] = auth()->user()->id;
        $p['note'] = $request->note;
        $p['created_at'] = date('Y-m-d', $this->jsDate($request->payment_time));
        $p['status'] = NULL;
        $p['address'] = $request->address;

        //Create new Payment
        $payment = Paper::create($p);
        foreach($request->transactions as $transaction){
            $this->addTransaction($transaction, $payment->id);
        }
        return response()->json($payment);
    }
    protected function editPayment(Request $request){
        $rules = [
            'payment_id' => 'required',
        ];
        $this->validate($request, $rules);
        $payment = Paper::find($request->payment_id);
        if($payment){
            $payment->name = $request->name;
            $payment->amount = $request->amount;
            $payment->address = $request->address;
            $payment->created_at = date('Y-m-d', strtotime($request->payment_time));
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
    protected function addPaymentTransaction(Request $request){

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
                                    'users.name as uname','papers.address as address')->where('type', 'payment')->leftJoin('users','papers.user_created_id','users.id')->get();
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

        $max_receipt_number = Paper::max('receipt_number')!="" ? Paper::max('receipt_number') : 0;
        $p['receipt_number'] = $max_receipt_number + 1;
        $p['type'] = 'receipt';
        $p['name'] = $request->name;
        $p['description'] = $request->description;
        $p['amount'] = $request->amount;
        $p['user_created_id'] = auth()->user()->id;
        $p['note'] = $request->note;
        $p['created_at'] = date('Y-m-d', $this->jsDate($request->receipt_time));
        $p['status'] = NULL;
        $p['address'] = $request->address;

        //Create new Receipt
        $receipt = Paper::create($p);
        foreach($request->transactions as $transaction){
            $this->addTransaction($transaction, $receipt->id);
        }
        return response()->json($receipt);
    }
    protected function editReceipt(Request $request){

    }
    protected function addReceiptTransaction(Request $request){

    }
    protected function deleteReceipt(Request $request){
        
    }
    protected function getReceipt(){
        $result = [];
        $receipts = Paper::Select('papers.id as id', 'receipt_number','type','papers.name as name','description','amount','papers.created_at as created_at','papers.status as status',
                                    'users.name as uname','papers.address as address')->where('type', 'receipt')->leftJoin('users','papers.user_created_id','users.id')->get();
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

}
