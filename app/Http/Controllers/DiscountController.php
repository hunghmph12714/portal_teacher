<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Discount;
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
        }
        return response()->json($discounts);
    }
    protected function addDiscount(Request $request){

    }
    protected function editDiscount(Request $requet){

    }
    protected function deleteDiscount(Request $request){

    }
}
