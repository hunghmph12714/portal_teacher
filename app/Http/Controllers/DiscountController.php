<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Discount;
use App\StudentClass;
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
            // print_r($input);
            $discount = Discount::create($input);
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

    protected function createAdjustFee(Request $request){
        $rules = ['code' => 'required'];
        $this->validate($request, $rules);

        if(array_key_exists('value', $request->code)){
            $input['class_id'] = $request->code['value'];
        }
        
        $input['active_at'] = date('Y-m-d', strtotime($request->active_at));
        $input['expired_at'] = date('Y-m-d', strtotime($request->expired_at));
        $input['content'] = $request->content;
        $input['amount'] = $request->amount ? $request->amount : NULL;
        $input['status'] = 'active';

        $discount = Discount::create($input);
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
