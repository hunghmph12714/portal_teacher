<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Discount;
use App\StudentClass;
use App\Session;
use App\StudentSession;
use App\Classes;
use App\Account;
use App\Transaction;
use App\Student;
class DiscountController extends Controller
{
    //
    protected $fillable = ['id','student_class_id','active_at','expired_at','percentage','amount','max_use','status'];

    protected function getDiscount(Request $request){
        $discounts = Discount::Select('active_at','expired_at','percentage','amount','max_use','discounts.status','discounts.id as did',
                                'students.id as sid', 'students.fullname as sname', 'students.dob', 
                                'parents.id as pid', 'parents.fullname as pname', 
                                'classes.id as cid', 'classes.code', 'student_class.id as scid')
                            ->whereNull('discounts.class_id')
                            ->leftJoin('student_class', 'discounts.student_class_id', 'student_class.id')
                            ->leftJoin('students', 'student_class.student_id', 'students.id')
                            ->leftJoin('classes', 'student_class.class_id', 'classes.id')
                            ->leftJoin('parents', 'students.parent_id', 'parents.id')
                            ->get()->toArray();
        foreach($discounts as $key => $d){
            $discounts[$key]['student'] = ['label' => $d['sname'], 'value' => $d['sid']];
            $discounts[$key]['class'] = ['label' => $d['code'], 'value'=>$d['cid']];
        }
        return response()->json($discounts);
    }
    protected function createDiscount(Request $request){
        $rules = [
            'student' => 'required',
            'class' => 'required',
            // 'expired_at' => 'required',
        ];
        $this->validate($request, $rules);

        //Check student in class
        $c = StudentClass::where('student_id', $request->student['sid'])->where('class_id', $request->class['value'])->first();
        if($c){
            $input['student_class_id'] = $c->id;
            $input['active_at'] = explode('T', $request->active_at)[0];
            $input['expired_at'] = explode('T', $request->expired_at)[0];
            $input['percentage'] = $request->percentage ? $request->percentage : NULL;
            $input['amount'] = $request->amount ? $request->amount : NULL;
            $input['status'] = $request->status;
            $input['max_use'] = $request->max_use;
            // print_r($input);
            $discount = Discount::create($input);
            
            if($discount->status == 'active'){
                
            }
            
        }else{
            return response()->json('Học sinh không học lớp này !', 421);
        }
    }
    protected function editDiscount(Request $request){
        $rules = [
            'did'=>'required',
            'active_at' => 'required',
            'expired_at' => 'required',            
            'max_use' => 'required'
        ];
        $this->validate($request, $rules);
        
        
        $c = StudentClass::where('student_id', $request->student['value'])->where('class_id', $request->class['value'])->first();
        if($c){
            $d = Discount::find($request->did);
            if($d){
                $d->active_at = explode('T', $request->active_at)[0];
                $d->expired_at = explode('T', $request->expired_at)[0];
                $d->percentage = $request->percentage;
                $d->amount = $request->amount;
                $d->max_use = $request->max_use;
                $d->status = $request->status;
                $d->student_class_id = $c->id;
                $d->save();
                return response()->json('ok', 200);
                
            }
        }else{
            return response()->json('Học sinh không học lớp này !', 421);
        }
        
    }
    protected function deleteDiscount(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $discount = Discount::find($request->id);
        if($discount){
            $discount->forceDelete();
            return response()->json('ok');
        }

    }
    protected function applyDiscount2($discount, $student_id){
        $session = Session::find($session_id);
        if($session){
            $discount = Discount::where('class_id', $session->class_id)->whereNull('student_class_id')
                ->where('active_at','<=',$session->date)->where('expired_at', '>=', $session->date)->get();
            foreach($discount as $d){
                $t['debit'] = Account::Where('level_2', '511')->first()->id;
                $t['credit'] = Account::Where('level_2', '131')->first()->id;
                $t['amount'] = abs($d->amount);
                $t['time'] = Date('Y-m-d', strtotime($session->date));
                $t['student_id'] = $student_id; 
                $t['class_id'] = $d->class_id;
                $t['user'] = auth()->user()->id;
                $t['content'] = $d->content;
                Transaction::create($t);
            }
        }
    }
    protected function applyDiscount($discount_id){
        $discount = Discount::find($discount_id);
        if($discount){
            $student_class = StudentClass::find($discount->student_class_id);
            if($student_class){
                $acc = Account::where('level_2','131')->first();
        $result = [];
        $id = -1;
        
        $transactions = Transaction::Where('student_id', $student_id)->where()
                            ->Select(
                                'transactions.id as id','transactions.amount' ,'transactions.time','transactions.content','transactions.created_at',
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
                            ->leftJoin('users', 'transactions.user', 'users.id')->orderBy('transactions.time', 'ASC')
                            ->get();
        
        foreach($transactions as $key => $t){
            $month = Date('m-Y', strtotime($t->time));                
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
                if($show_detail){
                    array_push($result, $tarray);
                }                
                $result[$month]['time'] = Date('d/m/Y', strtotime($t->time));
                $result[$month]['month'] = $month;
                $result[$month]['content'] = 'Tổng tiền tháng '.$month;
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
                if($show_detail){
                    array_push($result, $tarray);
                }             
            }
        }
                
            }
        }
    }
    protected function createAdjustFee(Request $request){
        $rules = ['code' => 'required'];
        $this->validate($request, $rules);
        if($request->amount && $request->percentage){
            return response()->json('Chọn số tiền hoặc phần trăm', 402);
        }
        foreach($request->code as $c){
            if(array_key_exists('value', $c)){
                $input['class_id'] = $c['value'];
            }
            $input['active_at'] = date('Y-m-d', strtotime($request->active_at));
            $input['expired_at'] = date('Y-m-d', strtotime($request->expired_at));
            $input['content'] = $request->content;
            $input['amount'] = $request->amount ? $request->amount : NULL;
            $input['percentage'] = $request->percentage ? $request->percentage : NULL;            
            $input['status'] = 'active';
            $discount = Discount::create($input);

        }       

        return response()->json('ok', 200);
    }
    protected function getAdjustFee(){
        $discounts = Discount::Select('active_at','expired_at','percentage','amount','max_use','discounts.status','discounts.id as did', 'content',
                                'classes.id as cid', 'classes.code')
                            ->whereNull('discounts.student_class_id')
                            ->leftJoin('classes', 'discounts.class_id', 'classes.id')
                            ->get()->toArray();
        foreach($discounts as $key => $d){
            $discounts[$key]['class'] = ['label' => $d['code'], 'value'=>$d['cid']];
        }
        return response()->json($discounts);
    }
   
    protected function editAdjustFee(Request $request){
        $rules = [
            'did'=>'required',
            'active_at' => 'required',
            'expired_at' => 'required',            
        ];
        $this->validate($request, $rules);
        $d = Discount::find($request->did);
        if($d){
            $d->active_at = date('Y-m-d', strtotime($request->active_at));
            $d->expired_at = date('Y-m-d', strtotime($request->expired_at));
            $d->amount = $request->amount;
            $d->percentage = $request->percentage;
            $d->content = $request->content;
            if(!is_string($request->code)){
                $d['class_id'] = $request->code['value'];
            }
            $d->save();
            return response()->json('ok', 200);
            
        }
        
    }
    protected function deleteAdjustFee(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $discount = Discount::find($request->id);
        if($discount){
            $discount->forceDelete();
            return response()->json('ok');
        }

    }
}
