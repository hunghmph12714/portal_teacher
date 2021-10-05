<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Syllabus;
use App\Chapter;
use App\Subject;
use App\Topic;
class SyllabusController extends Controller
{
    //
    protected function createSyllabus(Request $request){
        $rules = [
            // 'title' => 'required',
            // 'grade' => 'required',
            // 'subject' => 'required',
            // 'public' => 'required',
        ];
        $this->validate($request, $rules);
        $data = $request->toArray();
        $s = Syllabus::create($request->toArray());
        $data['id'] = $s->id;
        foreach($request['chapters'] as $key => $chapter){
            $c['title'] = ($chapter['title'] != '') ? $chapter['title']: 'Chưa có tên';
            $c['syllabus_id'] = $s->id;
            $new_chapter = Chapter::create($c);
            $data['chapters'][$key]['id'] = 'ct_'.$new_chapter->id;
            $data['chapters'][$key]['title'] =  $c['title'];

            foreach($chapter['subjects'] as $s_key => $subject){
                $sj['title'] = ($subject['title'] != '') ? $subject['title'] : 'Chưa có tên';
                $sj['chapter_id'] = $new_chapter->id;
                $new_subject = Subject::create($sj);
                $data['chapters'][$key]['subjects'][$s_key]['id'] = 'sj_'.$new_subject->id;
                $data['chapters'][$key]['subjects'][$s_key]['title'] = $sj['title'];
                
                foreach($subject['topics'] as $t_key => $topic){
                    $tp['title'] = ($topic['title'] != '') ? $topic['title'] : 'Chưa có tên';
                    $tp['content'] = ($topic['content'] != '')? $topic['content'] : '';
                    $tp['subject_id'] = $new_subject->id;
                    $new_topic = Topic::create($tp);
                    $data['chapters'][$key]['subjects'][$s_key]['topics'][$t_key]['id'] = 'tp_'.$new_topic->id;
                    $data['chapters'][$key]['subjects'][$s_key]['topics'][$t_key]['title'] = $tp['title'];
                    $data['chapters'][$key]['subjects'][$s_key]['topics'][$t_key]['content'] = $tp['content'];
                }
            }
        }

        
        return response()->json($data);
    }   
    protected function getSyllabus($id){
        return response()->json($id);
    }
}
