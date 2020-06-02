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
                            ->join('student_class', 'discounts.student_class_id', 'student_class.id')
                            ->join('students', 'student_class.student_id', 'students.id')
                            ->join('classes', 'student_class.class_id', 'classes.id')
                            ->join('parents', 'students.parent_id', 'parents.id')
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
    protected function editDiscount(Request $requet){

    }
    protected function deleteDiscount(Request $request){

    }
}
