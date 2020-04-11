<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Parents;
class ParentController extends Controller
{
    //
    protected function findParent($key){
        $s = Parents::where('parents.phone', 'LIKE', '%'.$key.'%')->select(            
            'parents.id as pid', 'parents.fullname', 'parents.phone','parents.email','parents.note','parents.alt_fullname','parents.alt_email','parents.alt_phone',
            'relationships.id as rid','relationships.name as r_name','relationships.color')
        ->leftJoin('relationships', 'parents.relationship_id', 'relationships.id')->limit(10)->get()->toArray();
        return response()->json($s);
    }
}
