<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Relationship;
use App\Step;
use App\Status;
class AdminSettingController extends Controller
{
    //Setting Relationship
    protected function getRelationship(){
        $relationships = Relationship::all();
        return response()->json($relationships);
    }
    protected function createRelationship(Request $request){
        $rules = [
            'name' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ',
        ];
        $this->validate($request, $rules, $message);

        $input = $request->toArray();
        $s = Relationship::create($input);
        return response()->json($s);
    }
    protected function editRelationship(Request $request){
        $rules = [            
            'id' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);

        $relationship = Relationship::find($request->id);
        if($relationship){
            $relationship->name = $request->newData['name'];
            $relationship->color = $request->newData['color'];
            $relationship->weight = $request->newData['weight'];
            $relationship->save();
        }
        else{
            return response()->json(422);
        }
        return response()->json(200);
    }
    protected function deleteRelationship(Request $request){
        $rules = [
            'id' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);

        $relationship = Relationship::find($request->id);
        if($relationship){
            $relationship->forceDelete();
        }
        else{
            return response()->json(422);
        }
        return response()->json(200);
    }
    //Setting Step
    protected function getStep(){
        $steps = Step::orderBy('type','asc')->orderBy('order','asc')->get()->toArray();
        return response()->json($steps);
    }
    protected function createStep(Request $request){
        $rules = [
            'name' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);
        $user = auth()->user();
        $input = $request->toArray();
        $input['user_created'] = $user->id;
        $s = Step::create($input);
        return response()->json($s);
    }
    protected function editStep(Request $request){
        $rules = [
            'id' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);        
        $step = Step::find($request->id);
        $request = $request->newData;
        if($step){
            $step->type = $request['type'];
            $step->order = $request['order'];
            $step->duration = $request['duration'];
            $step->document = ($request['document'])? $request['document'] : null;
            $step->name = $request['name'];
            $step->save();
        }
        else{
            return response()->json(422);
        }
        return response()->json(200);
    }
    protected function deleteStep(Request $request){
        $rules = [
            
            'id' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);

        $step = Step::find($request->id);
        if($step){
            $step->forceDelete();
        }
        else{
            return response()->json(422);
        }
        return response()->json(200);
    }
    //Setting Status
    protected $fillable = ['id','name','type','user_created'];
    protected function getStatus(){
        $steps = Status::orderBy('type','asc')->get()->toArray();
        return response()->json($steps);
    }
    protected function createStatus(Request $request){
        $rules = [
            'name' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);
        $input = $request->toArray();
        $user = auth()->user();
        $input['user_created'] = $user->id;
        $s = Status::create($input);
        return response()->json($s);
    }
    protected function editStatus(Request $request){
        $rules = [
            'id' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);
        $request = $request->newData;
        $status = Status::find($request->id);
        if($status){
            $status->type = $request['type'];            
            $status->name = $request['name'];
            $status->save();
        }
        else{
            return response()->json(422);
        }
        return response()->json(200);
    }
    protected function deleteStatus(Request $request){
        $rules = [
            
            'id' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);

        $status = Status::find($request->id);
        if($status){
            $status->forceDelete();
        }
        else{
            return response()->json(422);
        }
        return response()->json(200);
    }
}
