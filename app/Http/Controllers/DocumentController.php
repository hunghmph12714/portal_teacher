<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\MathDoc;
use Goutte\Client;
class DocumentController extends Controller
{
    //
    protected function create(Request $request){

        $dom = new \DOMDocument();
        libxml_use_internal_errors(true);

        $question = $request->state['question'];
        if($question != ""){
            $dom->loadHTML($request->state['question']);
            $imgs = $dom->getElementsByTagName('img');
            foreach ($imgs as $img) {
                $data = $img->getAttribute('src');
                if (strpos($data, 'base64') !== false) {
                    $old_data =  $img->getAttribute('src');
                    list($type, $data) = explode(';', $data);
                    list(, $data)      = explode(',', $data);
                    $d = base64_decode($data);       
                    $dir = 'public/images/documents/'.time().'.png' ;
                    file_put_contents($dir , $d);
                    // echo $old_data;
                    $question = str_replace($old_data, $dir, $question);
                }
                
            }
        }
        $answer = $request->state['answer'];
        if($answer != ""){
            $dom->loadHTML($answer);
            $imgs = $dom->getElementsByTagName('img');
            foreach ($imgs as $img) {
                $data = $img->getAttribute('src');
                if (strpos($data, 'base64') !== false) {
                    $old_data =  $img->getAttribute('src');
                    list($type, $data) = explode(';', $data);
                    list(, $data)      = explode(',', $data);
                    $d = base64_decode($data);       
                    $dir = 'public/images/documents/'.time().'.png' ;
                    file_put_contents($dir , $d);
                    // echo $old_data;
                    $answer = str_replace($old_data, $dir, $answer);
                }
                
            }
        }

        $input['major'] = $request->state['major'];
        $input['grade'] = $request->state['grade'];
        $input['topic'] = $request->state['topic']['label'];
        $input['tag'] = implode(';', array_column($request->state['related'], 'label'));
        $input['type'] = $request->state['type'];
        $input['level'] = $request->state['level'];
        $input['question'] = $question;
        $input['answer'] = $answer;
        if($request->state['edit']){
            MathDoc::where('id', $request->state['selected_id'])->update($input);
        }else{
            MathDoc::create($input);
        }

        
        // return response()->json($request->state['question']);
    }
    
    protected function edit(){

    }
    protected function delete(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        MathDoc::find($request->id)->forceDelete();
        return response()->json(200);
    }
    protected function get(){
        $allDoc = MathDoc::all();
        $topic = Mathdoc::select('topic')->distinct('topic')->get();
        $relateds = Mathdoc::select('tag')->get();

        $tags = implode(';' ,array_column($relateds->toArray(), 'tag'));
        $relateds = array_values(array_unique(explode(';', $tags)));
        return response()->json(['all' => $allDoc, 'topic' => array_column($topic->toArray(), 'topic'), 'relateds' => $relateds]);
    }

}
