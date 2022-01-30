<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Objective;
class ObjectiveController extends Controller
{
    //
    protected function addObjective(Request $request){
        $rules = ['content' => 'required', 'grade' => 'required'];
        $this->validate($request, $rules);

        $input['content'] = $request->content;
        $input['grade'] = $request->grade;
        $input['user_id'] = auth()->user()->id;

        $obj = Objective::create($input);
        $obj->name = auth()->user()->name;
        return response()->json($obj);

    }
    protected function getObjective(){
        $obj = Objective::leftJoin('users', 'user_id', 'users.id')->select('objectives.id','content', 'name', 'objectives.created_at', 'grade')->get();
        return response()->json($obj);
    }
    protected function editObjective(Request $request){
        $rules = ['content' => 'required', 'grade' => 'required', 'id' => 'required'];
        $this->validate($request, $rules);
        
        $obj = Objective::find($request->id);
        if($obj){
            $obj->content = $request->content;
            $obj->grade = $request->grade;

            $obj->save();
        }
    }
    protected function deleteObjective(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $obj = Objective::find($request->id);
        if($obj){
            $obj->forceDelete();
        }
    }
    protected function getByGrade(Request $request){
        $rules = ['grade' => 'required'];
        $this->validate($request, $rules);

        $grade = $request->grade['value'];
        $obj = Objective::where('grade', $grade)->get();
        return response()->json($obj);
        
    }
}
